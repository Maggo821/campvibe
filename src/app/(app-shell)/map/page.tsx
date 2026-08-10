import Link from "next/link";
import { PlaceCard } from "@/components/common/PlaceCard";
import { demoPlaces } from "@/lib/data/demo-places";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { PlaceSummary } from "@/types/database";

const statusOptions = ["all", "visited", "favorites", "wishlist", "planned", "never-again"] as const;

const statusLabels: Record<(typeof statusOptions)[number], string> = {
  all: "Alle",
  visited: "Besucht",
  favorites: "Favoriten",
  wishlist: "Merkliste",
  planned: "Geplant",
  "never-again": "Nie wieder",
};

type MapSearchParams = {
  status?: string;
};

function normalizeStatus(status: string | undefined) {
  if (!status) {
    return "all" as const;
  }
  return statusOptions.includes(status as (typeof statusOptions)[number])
    ? (status as (typeof statusOptions)[number])
    : "all";
}

function mapPlaceToSummary(place: {
  id: string;
  name: string;
  description: string | null;
  place_type: string;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  price_from: number | null;
  currency: string | null;
  permanent_camper_level: string | null;
  pitch_style: string | null;
  evening_rules: string | null;
}): PlaceSummary {
  return {
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
    status: "visited",
  };
}

export default function MapPage({
  searchParams,
}: {
  searchParams: Promise<MapSearchParams>;
}) {
  return <MapContent searchParams={searchParams} />;
}

async function MapContent({
  searchParams,
}: {
  searchParams: Promise<MapSearchParams>;
}) {
  const params = await searchParams;
  const status = normalizeStatus(params.status);
  let places: PlaceSummary[] = demoPlaces;

  if (hasSupabaseEnv()) {
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: rows } = await supabase
        .from("places")
        .select("id, name, description, place_type, city, country, latitude, longitude, price_from, currency, permanent_camper_level, pitch_style, evening_rules")
        .order("created_at", { ascending: false })
        .limit(80);

      places = (rows ?? []).map(mapPlaceToSummary);

      if (user) {
        const { data: statuses } = await supabase
          .from("user_place_status")
          .select("place_id, visited, favorite, wishlist, planned, never_again")
          .eq("user_id", user.id);

        const statusMap = new Map((statuses ?? []).map((row) => {
          let mapped: PlaceSummary["status"] = "visited";
          if (row.never_again) {
            mapped = "never_again";
          } else if (row.favorite) {
            mapped = "favorite";
          } else if (row.wishlist) {
            mapped = "wishlist";
          } else if (row.planned) {
            mapped = "planned";
          } else if (row.visited) {
            mapped = "visited";
          }
          return [row.place_id, mapped] as const;
        }));

        places = places.map((place) => ({
          ...place,
          status: statusMap.get(place.id) ?? place.status,
        }));
      }
    }
  }

  if (status !== "all") {
    places = places.filter((place) => {
      if (status === "favorites") {
        return place.status === "favorite";
      }
      if (status === "never-again") {
        return place.status === "never_again";
      }
      return place.status === status;
    });
  }

  return (
    <main className="flex flex-1 flex-col gap-4">
      <div className="rounded-[2rem] border border-black/10 bg-white/80 p-5 shadow-sm">
        <h1 className="text-2xl font-semibold">Karte</h1>
        <p className="mt-2 text-sm text-zinc-600">Marker-Daten werden bereits aus Places geladen. Vollbild-MapLibre folgt als nächster UI-Schritt.</p>
      </div>

      <section className="rounded-[2rem] border border-black/10 bg-white/80 p-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => {
            const active = option === status;
            const href = option === "all" ? "/map" : `/map?status=${option}`;
            return (
              <Link
                key={option}
                href={href}
                className={`rounded-full px-4 py-2 text-sm ${active ? "bg-zinc-900 font-semibold text-white" : "border border-zinc-300 text-zinc-700"}`}
              >
                {statusLabels[option]}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-[2rem] border border-dashed border-zinc-300 bg-zinc-50 p-5">
        <h2 className="text-lg font-semibold">Marker-Vorschau ({places.length})</h2>
        <p className="mt-1 text-sm text-zinc-600">Jeder Eintrag mit Koordinaten kann in der nächsten Iteration als Marker auf der Karte gerendert werden.</p>
        <div className="mt-4 grid gap-2 text-sm text-zinc-700">
          {places.slice(0, 10).map((place) => (
            <div key={`coords-${place.id}`} className="rounded-xl border border-zinc-200 bg-white px-3 py-2">
              {place.name}: {place.latitude.toFixed(5)}, {place.longitude.toFixed(5)}
            </div>
          ))}
          {places.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-500">Keine Plätze für den gewählten Status.</div>
          ) : null}
        </div>
      </section>

      <section className="grid gap-3">
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </section>
    </main>
  );
}
