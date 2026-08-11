import Link from "next/link";
import { PlaceCard } from "@/components/common/PlaceCard";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { PlaceSummary } from "@/types/database";

const quickActions = [
  { label: "Platz hinzufügen", href: "/places/new" },
  { label: "Besuch eintragen", href: "/places/new" },
  { label: "Entdecken", href: "/discover" },
  { label: "Merkliste", href: "/my-places/wishlist" },
];

export default function HomePage() {
  return <HomeContent />;
}

async function HomeContent() {
  let places: PlaceSummary[] = [];

  if (hasSupabaseEnv()) {
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      const { data } = await supabase
        .from("places")
        .select("id, name, description, place_type, city, country, latitude, longitude, price_from, currency, permanent_camper_level, pitch_style, evening_rules")
        .order("created_at", { ascending: false })
        .limit(6);

      places = (data ?? []).map((place) => ({
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
      }));
    }
  }

  return (
    <main className="flex flex-1 flex-col gap-8">
      <section className="rounded-[2rem] border border-black/10 bg-zinc-950 p-6 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">CampVibe</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
          Wo wollen wir als Nächstes hin?
        </h1>
        <div className="mt-6 flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Aktuelle Empfehlungen</h2>
            <Link href="/discover" className="text-sm text-zinc-600">Alle ansehen</Link>
          </div>
          <div className="grid gap-3">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
            {places.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm text-zinc-600">
                Noch keine Plätze vorhanden. Lege deinen ersten Platz an.
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white/80 p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Kartenvorschau</h3>
          <div className="mt-4 rounded-[1.5rem] border border-dashed border-zinc-300 bg-zinc-100 p-8 text-center text-sm text-zinc-600">
            Die echte MapLibre-Karte ist jetzt auf der Karten-Seite verfügbar.
          </div>
        </div>
      </section>
    </main>
  );
}
