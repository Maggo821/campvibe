import Link from "next/link";
import { PlaceCard } from "@/components/common/PlaceCard";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { PlaceSummary } from "@/types/database";

const placeTypeOptions = [
  "all",
  "camping",
  "motorhome_pitch",
  "vanlife_camp",
  "nature_camp",
  "farm",
  "winery",
  "glamping",
  "marina",
  "beach_camp",
  "festival_camp",
  "other",
] as const;

const permanentCamperOptions = ["all", "none", "low", "medium", "high", "very_high", "unknown"] as const;
const eveningRuleOptions = ["all", "relaxed", "normal", "strict", "very_strict", "unknown"] as const;

const placeTypeLabels: Record<(typeof placeTypeOptions)[number], string> = {
  all: "Alle",
  camping: "Campingplatz",
  motorhome_pitch: "Wohnmobilstellplatz",
  vanlife_camp: "Vanlife-Camp",
  nature_camp: "Naturcamp",
  farm: "Hof",
  winery: "Weingut",
  glamping: "Glamping",
  marina: "Marina",
  beach_camp: "Strand-Camp",
  festival_camp: "Festival-Camp",
  other: "Sonstiges",
};

const permanentCamperLabels: Record<(typeof permanentCamperOptions)[number], string> = {
  all: "Alle",
  none: "Keine",
  low: "Niedrig",
  medium: "Mittel",
  high: "Hoch",
  very_high: "Sehr hoch",
  unknown: "Unbekannt",
};

const eveningRuleLabels: Record<(typeof eveningRuleOptions)[number], string> = {
  all: "Alle",
  relaxed: "Entspannt",
  normal: "Normal",
  strict: "Strikt",
  very_strict: "Sehr strikt",
  unknown: "Unbekannt",
};

type DiscoverSearchParams = {
  placeType?: string;
  permanent?: string;
  evening?: string;
  q?: string;
};

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

export default function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<DiscoverSearchParams>;
}) {
  return <DiscoverContent searchParams={searchParams} />;
}

async function DiscoverContent({
  searchParams,
}: {
  searchParams: Promise<DiscoverSearchParams>;
}) {
  const params = await searchParams;
  const placeType = placeTypeOptions.includes((params.placeType as (typeof placeTypeOptions)[number]) ?? "all")
    ? ((params.placeType as (typeof placeTypeOptions)[number]) ?? "all")
    : "all";
  const permanent = permanentCamperOptions.includes((params.permanent as (typeof permanentCamperOptions)[number]) ?? "all")
    ? ((params.permanent as (typeof permanentCamperOptions)[number]) ?? "all")
    : "all";
  const evening = eveningRuleOptions.includes((params.evening as (typeof eveningRuleOptions)[number]) ?? "all")
    ? ((params.evening as (typeof eveningRuleOptions)[number]) ?? "all")
    : "all";
  const q = (params.q ?? "").trim();

  let places: PlaceSummary[] = [];

  if (hasSupabaseEnv()) {
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      let query = supabase
        .from("places")
        .select("id, name, description, place_type, city, country, latitude, longitude, price_from, currency, permanent_camper_level, pitch_style, evening_rules")
        .order("created_at", { ascending: false })
        .limit(60);

      if (placeType !== "all") {
        query = query.eq("place_type", placeType);
      }
      if (permanent !== "all") {
        query = query.eq("permanent_camper_level", permanent);
      }
      if (evening !== "all") {
        query = query.eq("evening_rules", evening);
      }
      if (q.length > 0) {
        query = query.or(`name.ilike.%${q}%,city.ilike.%${q}%,country.ilike.%${q}%`);
      }

      const { data } = await query;
      places = (data ?? []).map(mapPlaceToSummary);
    }
  }

  return (
    <main className="flex flex-1 flex-col gap-4">
      <div className="rounded-[2rem] border border-black/10 bg-white/80 p-5 shadow-sm">
        <h1 className="text-2xl font-semibold">Entdecken</h1>
        <p className="mt-2 text-sm text-zinc-600">Filtere nach Platztyp, Dauercamper-Level und Abendregeln.</p>
      </div>

      <section className="rounded-[2rem] border border-black/10 bg-white/80 p-5 shadow-sm">
        <form className="grid gap-3 md:grid-cols-4" method="get">
          <label className="flex flex-col gap-1 text-sm">
            Suchtext
            <input name="q" defaultValue={q} className="rounded-xl border border-zinc-200 bg-white px-3 py-2" placeholder="Name, Stadt, Land" />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Platztyp
            <select name="placeType" defaultValue={placeType} className="rounded-xl border border-zinc-200 bg-white px-3 py-2">
              {placeTypeOptions.map((option) => (
                <option key={option} value={option}>{placeTypeLabels[option]}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Dauercamper
            <select name="permanent" defaultValue={permanent} className="rounded-xl border border-zinc-200 bg-white px-3 py-2">
              {permanentCamperOptions.map((option) => (
                <option key={option} value={option}>{permanentCamperLabels[option]}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Abendregeln
            <select name="evening" defaultValue={evening} className="rounded-xl border border-zinc-200 bg-white px-3 py-2">
              {eveningRuleOptions.map((option) => (
                <option key={option} value={option}>{eveningRuleLabels[option]}</option>
              ))}
            </select>
          </label>

          <div className="md:col-span-4 flex flex-wrap gap-2 pt-1">
            <button type="submit" className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
              Filter anwenden
            </button>
            <Link href="/discover" className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700">
              Zurücksetzen
            </Link>
          </div>
        </form>
      </section>

      <section className="grid gap-3">
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
        {places.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm text-zinc-600">
            Keine Treffer mit den gewählten Filtern.
          </div>
        ) : null}
      </section>
    </main>
  );
}
