import Link from "next/link";
import { notFound } from "next/navigation";
import { PlaceCard } from "@/components/common/PlaceCard";
import { demoPlaces } from "@/lib/data/demo-places";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { PlaceSummary } from "@/types/database";

const allowedStatuses = ["visited", "favorites", "wishlist", "planned", "never-again"] as const;

const labels: Record<(typeof allowedStatuses)[number], string> = {
  visited: "Besucht",
  favorites: "Favoriten",
  wishlist: "Merkliste",
  planned: "Geplant",
  "never-again": "Nie wieder",
};

const statusColumnMap: Record<(typeof allowedStatuses)[number], "visited" | "favorite" | "wishlist" | "planned" | "never_again"> = {
  visited: "visited",
  favorites: "favorite",
  wishlist: "wishlist",
  planned: "planned",
  "never-again": "never_again",
};

export default async function MyPlacesStatusPage({ params }: { params: Promise<{ status: string }> }) {
  const { status } = await params;

  if (!allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
    notFound();
  }

  const typedStatus = status as (typeof allowedStatuses)[number];
  let places: PlaceSummary[] = demoPlaces.filter((place) => {
    if (typedStatus === "favorites") {
      return place.status === "favorite";
    }
    if (typedStatus === "never-again") {
      return place.status === "never_again";
    }
    return place.status === typedStatus;
  });

  if (hasSupabaseEnv()) {
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const filterColumn = statusColumnMap[typedStatus];

        const { data: statusRows } = await supabase
          .from("user_place_status")
          .select("place_id")
          .eq("user_id", user.id)
          .eq(filterColumn, true);

        const placeIds = (statusRows ?? []).map((row) => row.place_id);

        if (placeIds.length > 0) {
          const { data: placeRows } = await supabase
            .from("places")
            .select("id, name, description, place_type, city, country, latitude, longitude, price_from, currency, permanent_camper_level, pitch_style, evening_rules")
            .in("id", placeIds)
            .limit(40);

          places = (placeRows ?? []).map((place) => ({
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
            status: typedStatus === "favorites" ? "favorite" : typedStatus === "never-again" ? "never_again" : typedStatus,
          }));
        } else {
          places = [];
        }
      }
    }
  }

  return (
    <main className="space-y-4">
      <section className="space-y-3 rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Meine Plätze: {labels[typedStatus]}</h1>
      <p className="text-sm text-zinc-600">
        Gefiltert nach deinem persönlichen Status.
      </p>
      <Link href="/my-places" className="inline-flex rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
        Zurück zu Meine Plätze
      </Link>
      </section>

      <section className="grid gap-3">
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
        {places.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm text-zinc-600">
            Keine Plätze für diesen Status gefunden.
          </div>
        ) : null}
      </section>
    </main>
  );
}
