import { notFound } from "next/navigation";
import Link from "next/link";
import { demoPlaces } from "@/lib/data/demo-places";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { PlaceSummary } from "@/types/database";

const tabs = [
  { key: "overview", label: "Übersicht" },
  { key: "vibe", label: "Vibe" },
  { key: "features", label: "Ausstattung" },
  { key: "environment", label: "Umgebung" },
  { key: "visits", label: "Besuche" },
  { key: "photos", label: "Fotos" },
  { key: "notes", label: "Notizen" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const placeTypeLabels: Record<PlaceSummary["placeType"], string> = {
  camping: "Campingplatz",
  motorhome_pitch: "Wohnmobilstellplatz",
  vanlife_camp: "Vanlife-Camp",
  nature_camp: "Naturcamp",
  farm: "Hof",
  winery: "Weingut",
  glamping: "Glamping",
  marina: "Marina",
  beach_camp: "Beach Camp",
  festival_camp: "Festival Camp",
  other: "Sonstiges",
};

const permanentCamperLabels = {
  none: "Keine",
  low: "Niedrig",
  medium: "Mittel",
  high: "Hoch",
  very_high: "Sehr hoch",
  unknown: "Unbekannt",
} as const;

const pitchStyleLabels = {
  open_field: "Offenes Feld",
  natural: "Naturnah",
  large_parcels: "Große Parzellen",
  standard_parcels: "Standard-Parzellen",
  hedges: "Parzellen mit Hecken",
  tight_rows: "Enge Reihen",
  permanent_camper_style: "Dauercamper-Stil",
  unknown: "Unbekannt",
} as const;

const eveningRulesLabels = {
  relaxed: "Entspannt",
  normal: "Normal",
  strict: "Strikt",
  very_strict: "Sehr strikt",
  unknown: "Unbekannt",
} as const;

const vibeFieldLabels = {
  overall: "Gesamt-Vibe",
  vanlife: "Vanlife-Vibe",
  nature: "Natur",
  nightlife: "Abendleben",
  beach_bar: "Beach- & Bar-Vibe",
  international: "Internationales Publikum",
  modern: "Modern",
  open_space: "Offenes Raumgefühl",
  privacy: "Privatsphäre",
  gastronomy: "Gastronomie",
  surroundings: "Umgebung",
  value_for_money: "Preis-Leistung",
  atmosphere_score: "Atmosphäre",
  camping_style_score: "Camping-Stil",
  audience_vibe_score: "Publikumsgefühl",
} as const;

const environmentFieldLabels = {
  overall_environment: "Umgebung gesamt",
  evening_activity: "Abendaktivität",
  restaurants: "Restaurants",
  bars: "Bars",
  shopping: "Shopping",
  nature: "Natur",
  excursions: "Ausflüge",
  cycling: "Radfahren",
  hiking: "Wandern",
  water_sports: "Wassersport",
  town_accessibility: "Erreichbarkeit Ort",
} as const;

function normalizeTab(value: string | undefined): TabKey {
  const tab = tabs.find((entry) => entry.key === value);
  return tab?.key ?? "overview";
}

function formatCurrency(value: number | null | undefined, currency: string | null | undefined) {
  if (value === null || value === undefined) {
    return "-";
  }
  return `${value.toFixed(2)} ${currency ?? "EUR"}`;
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("de-DE").format(new Date(value));
}

function formatLabelValue(label: string, value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return { label, value: String(value) };
}

export default function PlaceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  return <PlaceDetailContent params={params} searchParams={searchParams} />;
}

async function PlaceDetailContent({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const activeTab = normalizeTab(tab);
  let place = demoPlaces.find((entry) => entry.id === id);
  let featureNames: string[] = [];
  let visits: Array<{
    id: string;
    arrival_date: string;
    departure_date: string | null;
    price_per_night: number | null;
    total_price: number | null;
    currency: string | null;
    pitch_number: string | null;
    persons: number | null;
    vehicle: string | null;
    note: string | null;
  }> = [];
  let placeVibeRating: Record<string, number | string | null> | null = null;
  let placeEnvironmentRating: Record<string, number | string | null> | null = null;
  let placePhotos: Array<{ id: string; caption: string | null; storage_path: string }> = [];
  let userStatus: { personal_note: string | null } | null = null;

  if (hasSupabaseEnv()) {
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data } = await supabase
        .from("places")
        .select("id, name, description, place_type, city, country, street, postal_code, state, latitude, longitude, website, phone, email, price_from, currency, permanent_camper_level, pitch_style, evening_rules")
        .eq("id", id)
        .maybeSingle();

      if (data) {
        place = {
          id: data.id,
          name: data.name,
          description: data.description ?? "",
          placeType: data.place_type as (typeof demoPlaces)[number]["placeType"],
          city: data.city ?? "",
          country: data.country ?? "",
          latitude: data.latitude ?? 0,
          longitude: data.longitude ?? 0,
          priceFrom: data.price_from ?? undefined,
          currency: data.currency ?? undefined,
          permanentCamperLevel: (data.permanent_camper_level ?? "unknown") as PlaceSummary["permanentCamperLevel"],
          pitchStyle: (data.pitch_style ?? "unknown") as PlaceSummary["pitchStyle"],
          eveningRules: (data.evening_rules ?? "unknown") as PlaceSummary["eveningRules"],
          tags: [data.place_type],
          status: "visited",
        };

        const [placeFeatureRows, featuresRows] = await Promise.all([
          supabase.from("place_features").select("feature_id").eq("place_id", id),
          supabase.from("features").select("id, name"),
        ]);

        const featureMap = new Map((featuresRows.data ?? []).map((feature) => [feature.id, feature.name]));
        featureNames = (placeFeatureRows.data ?? [])
          .map((row) => featureMap.get(row.feature_id))
          .filter((value): value is string => Boolean(value));

        if (user) {
          const [visitsResult, vibeResult, environmentResult, photosResult, statusResult] = await Promise.all([
            supabase
              .from("visits")
              .select("id, arrival_date, departure_date, price_per_night, total_price, currency, pitch_number, persons, vehicle, note")
              .eq("place_id", id)
              .order("arrival_date", { ascending: false }),
            supabase
              .from("place_vibe_ratings")
              .select("overall, vanlife, nature, nightlife, beach_bar, international, modern, open_space, privacy, gastronomy, surroundings, value_for_money, atmosphere_score, camping_style_score, audience_vibe_score, note")
              .eq("place_id", id)
              .eq("user_id", user.id)
              .maybeSingle(),
            supabase
              .from("place_environment_ratings")
              .select("overall_environment, evening_activity, restaurants, bars, shopping, nature, excursions, cycling, hiking, water_sports, town_accessibility, note")
              .eq("place_id", id)
              .eq("user_id", user.id)
              .maybeSingle(),
            supabase
              .from("place_photos")
              .select("id, caption, storage_path")
              .eq("place_id", id)
              .order("sort_order", { ascending: true }),
            supabase
              .from("user_place_status")
              .select("personal_note")
              .eq("place_id", id)
              .eq("user_id", user.id)
              .maybeSingle(),
          ]);

          visits = visitsResult.data ?? [];
          placeVibeRating = vibeResult.data;
          placeEnvironmentRating = environmentResult.data;
          placePhotos = photosResult.data ?? [];
          userStatus = statusResult.data;
        }
      }
    }
  }

  if (!place) {
    notFound();
  }

  const overviewItems = [
    formatLabelValue("Platztyp", placeTypeLabels[place.placeType]),
    formatLabelValue("Ort", [place.city, place.country].filter(Boolean).join(", ")),
    formatLabelValue("Preis ab", formatCurrency(place.priceFrom, place.currency)),
    formatLabelValue("Dauercamper", place.permanentCamperLevel ? permanentCamperLabels[place.permanentCamperLevel] : null),
    formatLabelValue("Stellplatzgefühl", place.pitchStyle ? pitchStyleLabels[place.pitchStyle] : null),
    formatLabelValue("Abendregeln", place.eveningRules ? eveningRulesLabels[place.eveningRules] : null),
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <main className="space-y-4 rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold">{place.name}</h1>
        <p className="mt-2 text-sm text-zinc-600">{place.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={`/places/${place.id}/visit/new`}
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Besuch hinzufügen
        </Link>
        <Link
          href={`/places/${place.id}/nearby/new`}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700"
        >
          Ort in der Nähe hinzufügen
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((entry) => {
          const active = entry.key === activeTab;
          return (
            <Link
              key={entry.key}
              href={`/places/${place.id}?tab=${entry.key}`}
              className={`rounded-full px-4 py-2 text-sm ${active ? "bg-zinc-900 font-semibold text-white" : "border border-zinc-300 text-zinc-700"}`}
            >
              {entry.label}
            </Link>
          );
        })}
      </div>

      {activeTab === "overview" ? (
        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-4">
            <h2 className="text-lg font-semibold">Überblick</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {overviewItems.map((item) => (
                <div key={item.label} className="rounded-2xl bg-white p-3">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">{item.label}</p>
                  <p className="mt-1 text-sm font-medium text-zinc-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-4">
            <h2 className="text-lg font-semibold">Kontakt & Lage</h2>
            <div className="mt-4 space-y-3 text-sm text-zinc-700">
              <p>{[place.city, place.country].filter(Boolean).join(", ") || "Keine Ortsdaten"}</p>
              <p>{place.latitude && place.longitude ? `${place.latitude.toFixed(5)}, ${place.longitude.toFixed(5)}` : "Keine Koordinaten"}</p>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "vibe" ? (
        <section className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-4">
          <h2 className="text-lg font-semibold">Vibe</h2>
          {placeVibeRating ? (
            <>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(vibeFieldLabels).map(([key, label]) => {
                  const value = placeVibeRating?.[key];
                  if (value === null || value === undefined) {
                    return null;
                  }

                  return (
                    <div key={key} className="rounded-2xl bg-white p-3">
                      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
                      <p className="mt-1 text-lg font-semibold text-zinc-900">{value}/10</p>
                    </div>
                  );
                })}
              </div>
              {placeVibeRating.note ? <p className="mt-4 text-sm text-zinc-700">{placeVibeRating.note}</p> : null}
            </>
          ) : (
            <p className="mt-4 text-sm text-zinc-600">Noch keine persönliche Vibe-Bewertung vorhanden.</p>
          )}
        </section>
      ) : null}

      {activeTab === "features" ? (
        <section className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-4">
          <h2 className="text-lg font-semibold">Ausstattung</h2>
          {featureNames.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {featureNames.map((featureName) => (
                <span key={featureName} className="rounded-full bg-white px-4 py-2 text-sm text-zinc-700">
                  {featureName}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-600">Noch keine Ausstattung hinterlegt.</p>
          )}
        </section>
      ) : null}

      {activeTab === "environment" ? (
        <section className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-4">
          <h2 className="text-lg font-semibold">Umgebung</h2>
          {placeEnvironmentRating ? (
            <>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(environmentFieldLabels).map(([key, label]) => {
                  const value = placeEnvironmentRating?.[key];
                  if (value === null || value === undefined) {
                    return null;
                  }

                  return (
                    <div key={key} className="rounded-2xl bg-white p-3">
                      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
                      <p className="mt-1 text-lg font-semibold text-zinc-900">{value}/10</p>
                    </div>
                  );
                })}
              </div>
              {placeEnvironmentRating.note ? <p className="mt-4 text-sm text-zinc-700">{placeEnvironmentRating.note}</p> : null}
            </>
          ) : (
            <p className="mt-4 text-sm text-zinc-600">Noch keine persönliche Umgebungsbewertung vorhanden.</p>
          )}
        </section>
      ) : null}

      {activeTab === "visits" ? (
        <section className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-4">
          <h2 className="text-lg font-semibold">Besuche</h2>
          {visits.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {visits.map((visit) => (
                <div key={visit.id} className="rounded-2xl bg-white p-4 text-sm text-zinc-700">
                  <p className="font-semibold text-zinc-900">{formatDate(visit.arrival_date)} bis {formatDate(visit.departure_date)}</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <p>Preis/Nacht: {formatCurrency(visit.price_per_night, visit.currency)}</p>
                    <p>Gesamt: {formatCurrency(visit.total_price, visit.currency)}</p>
                    <p>Stellplatz: {visit.pitch_number ?? "-"}</p>
                    <p>Personen: {visit.persons ?? "-"}</p>
                    <p>Fahrzeug: {visit.vehicle ?? "-"}</p>
                  </div>
                  {visit.note ? <p className="mt-3">{visit.note}</p> : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-600">Noch keine Besuche vorhanden.</p>
          )}
        </section>
      ) : null}

      {activeTab === "photos" ? (
        <section className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-4">
          <h2 className="text-lg font-semibold">Fotos</h2>
          {placePhotos.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {placePhotos.map((photo) => (
                <div key={photo.id} className="rounded-2xl bg-white p-4 text-sm text-zinc-700">
                  <p className="font-medium text-zinc-900">{photo.caption ?? "Foto"}</p>
                  <p className="mt-2 break-all text-xs text-zinc-500">{photo.storage_path}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-600">Noch keine Fotos vorhanden oder nicht für diesen Nutzer sichtbar.</p>
          )}
        </section>
      ) : null}

      {activeTab === "notes" ? (
        <section className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-4">
          <h2 className="text-lg font-semibold">Notizen</h2>
          <div className="mt-4 space-y-3 text-sm text-zinc-700">
            {userStatus?.personal_note ? <p>{userStatus.personal_note}</p> : null}
            {placeVibeRating?.note ? <p>Vibe: {placeVibeRating.note}</p> : null}
            {placeEnvironmentRating?.note ? <p>Umgebung: {placeEnvironmentRating.note}</p> : null}
            {!userStatus?.personal_note && !placeVibeRating?.note && !placeEnvironmentRating?.note ? (
              <p className="text-zinc-600">Noch keine Notizen vorhanden.</p>
            ) : null}
          </div>
        </section>
      ) : null}
    </main>
  );
}
