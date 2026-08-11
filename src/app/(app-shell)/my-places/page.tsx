import Link from "next/link";
import { PlaceCard } from "@/components/common/PlaceCard";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { PlaceSummary } from "@/types/database";

const tabs = [
  { label: "Besucht", href: "/my-places/visited" },
  { label: "Favoriten", href: "/my-places/favorites" },
  { label: "Merkliste", href: "/my-places/wishlist" },
  { label: "Geplant", href: "/my-places/planned" },
  { label: "Nie wieder", href: "/my-places/never-again" },
];

type StatusRow = {
  place_id: string;
  visited: boolean | null;
  favorite: boolean | null;
  wishlist: boolean | null;
  planned: boolean | null;
  never_again: boolean | null;
};

function mapStatus(row: StatusRow) {
  if (row.never_again) {
    return "never_again" as const;
  }
  if (row.favorite) {
    return "favorite" as const;
  }
  if (row.wishlist) {
    return "wishlist" as const;
  }
  if (row.planned) {
    return "planned" as const;
  }
  if (row.visited) {
    return "visited" as const;
  }

  return undefined;
}

export default function MyPlacesPage() {
  return <MyPlacesContent />;
}

async function MyPlacesContent() {
  const supabaseReady = hasSupabaseEnv();
  let places: PlaceSummary[] = [];

  if (supabaseReady) {
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const [statusResult, ownPlacesResult] = await Promise.all([
          supabase
            .from("user_place_status")
            .select("place_id, visited, favorite, wishlist, planned, never_again")
            .eq("user_id", user.id),
          supabase
            .from("places")
            .select("id, name, description, place_type, city, country, latitude, longitude, price_from, currency, permanent_camper_level, pitch_style, evening_rules")
            .eq("created_by", user.id)
            .order("created_at", { ascending: false })
            .limit(40),
        ]);

        const statusRows = (statusResult.data ?? []) as StatusRow[];
        const statusByPlaceId = new Map(statusRows.map((row) => [row.place_id, row]));

        const ownPlaceIds = new Set((ownPlacesResult.data ?? []).map((row) => row.id));
        const statusOnlyPlaceIds = statusRows
          .map((row) => row.place_id)
          .filter((placeId) => !ownPlaceIds.has(placeId));

        let statusOnlyPlaces: typeof ownPlacesResult.data = [];
        if (statusOnlyPlaceIds.length > 0) {
          const { data } = await supabase
            .from("places")
            .select("id, name, description, place_type, city, country, latitude, longitude, price_from, currency, permanent_camper_level, pitch_style, evening_rules")
            .in("id", statusOnlyPlaceIds)
            .limit(40);
          statusOnlyPlaces = data ?? [];
        }

        const combined = [...(ownPlacesResult.data ?? []), ...statusOnlyPlaces];

        if (combined.length > 0) {
          places = combined.map((place) => ({
            id: place.id,
            name: place.name,
            description: place.description ?? "",
            placeType: place.place_type as PlaceSummary["placeType"],
            city: place.city ?? "",
            country: place.country ?? "",
            latitude: place.latitude ?? 0,
            longitude: place.longitude ?? 0,
            priceFrom: place.price_from ?? undefined,
            currency: place.currency ?? undefined,
            permanentCamperLevel: (place.permanent_camper_level ?? "unknown") as PlaceSummary["permanentCamperLevel"],
            pitchStyle: (place.pitch_style ?? "unknown") as PlaceSummary["pitchStyle"],
            eveningRules: (place.evening_rules ?? "unknown") as PlaceSummary["eveningRules"],
            tags: [place.place_type],
            status: statusByPlaceId.get(place.id) ? mapStatus(statusByPlaceId.get(place.id)!) : "visited",
          }));
        } else {
          places = [];
        }
      }
    }
  }

  return (
    <main className="flex flex-1 flex-col gap-4">
      <div className="rounded-[2rem] border border-black/10 bg-white/80 p-5 shadow-sm">
        <h1 className="text-2xl font-semibold">Meine Plätze</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Link key={tab.href} href={tab.href} className="rounded-full border border-zinc-200 px-3 py-2 text-sm text-zinc-700">
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="grid gap-3">
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
        {places.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm text-zinc-600">
            Noch keine gespeicherten Plätze vorhanden.
          </div>
        ) : null}
      </div>
    </main>
  );
}
