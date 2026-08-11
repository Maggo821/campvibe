import Link from "next/link";
import { notFound } from "next/navigation";
import { PlaceEditForm } from "@/components/places/PlaceEditForm";
import { getSupabaseEnvDiagnostics, hasSupabaseEnv } from "@/lib/supabase/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const vibeFields = [
  "overall",
  "vanlife",
  "nature",
  "nightlife",
  "beach_bar",
  "international",
  "modern",
  "open_space",
  "privacy",
  "gastronomy",
  "surroundings",
  "value_for_money",
  "atmosphere_score",
  "camping_style_score",
  "audience_vibe_score",
] as const;

const environmentFields = [
  "overall_environment",
  "evening_activity",
  "restaurants",
  "bars",
  "shopping",
  "nature",
  "excursions",
  "cycling",
  "hiking",
  "water_sports",
  "town_accessibility",
] as const;

function valueToString(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
}

export default async function EditPlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabaseReady = hasSupabaseEnv();
  const envDiagnostics = getSupabaseEnvDiagnostics();

  if (!supabaseReady) {
    return (
      <main className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Platz bearbeiten</h1>
        <p className="mt-2 text-sm text-zinc-600">Supabase ist noch nicht vollständig konfiguriert.</p>
        <p className="mt-2 text-sm text-zinc-600">Fehlende Variablen: {envDiagnostics.missing.join(", ") || "unbekannt"}</p>
      </main>
    );
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return (
      <main className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Platz bearbeiten</h1>
        <p className="mt-2 text-sm text-zinc-600">Supabase-Client konnte nicht initialisiert werden.</p>
      </main>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Platz bearbeiten</h1>
        <p className="mt-2 text-sm text-zinc-600">Für das Bearbeiten musst du eingeloggt sein.</p>
        <Link href="/profile" className="mt-4 inline-flex rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
          Zum Login
        </Link>
      </main>
    );
  }

  const [{ data: place }, { data: features }, { data: placeFeatures }, { data: vibe }, { data: environment }, { data: photos }] = await Promise.all([
    supabase
      .from("places")
      .select("id, name, description, place_type, street, postal_code, city, state, country, latitude, longitude, website, phone, email, price_from, currency, checkin_time, checkout_time, quiet_hours_from, quiet_hours_to, permanent_camper_level, pitch_style, evening_rules, created_by")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("features").select("id, name").order("name", { ascending: true }),
    supabase.from("place_features").select("feature_id").eq("place_id", id),
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
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true }),
  ]);

  if (!place) {
    notFound();
  }

  if (place.created_by !== user.id) {
    return (
      <main className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Platz bearbeiten</h1>
        <p className="mt-2 text-sm text-zinc-600">Du kannst nur Plätze bearbeiten, die du selbst angelegt hast.</p>
        <Link href={`/places/${id}`} className="mt-4 inline-flex rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700">
          Zurück zur Detailseite
        </Link>
      </main>
    );
  }

  const selectedFeatureIds = (placeFeatures ?? []).map((entry) => entry.feature_id);
  const vibeScores = Object.fromEntries(vibeFields.map((field) => [field, valueToString(vibe?.[field])]));
  const environmentScores = Object.fromEntries(environmentFields.map((field) => [field, valueToString(environment?.[field])]));
  const existingPhotos = (photos ?? []).map((photo) => ({
    id: photo.id,
    caption: photo.caption ?? "",
    storagePath: photo.storage_path,
  }));

  const signedUrls = new Map<string, string>();
  if (existingPhotos.length > 0) {
    const signedUrlResult = await supabase.storage
      .from("place-photos")
      .createSignedUrls(existingPhotos.map((photo) => photo.storagePath), 60 * 60);

    (signedUrlResult.data ?? []).forEach((entry, index) => {
      const photo = existingPhotos[index];
      if (photo && entry?.signedUrl) {
        signedUrls.set(photo.id, entry.signedUrl);
      }
    });
  }

  return (
    <main className="space-y-4 rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold">Platz bearbeiten</h1>
        <p className="mt-2 text-sm text-zinc-600">Du kannst deinen angelegten Platz jederzeit anpassen. Alle Änderungen sind sofort in Karte, Discover und Detailansicht sichtbar.</p>
      </div>

      <PlaceEditForm
        features={features ?? []}
        initialData={{
          id: place.id,
          name: place.name,
          description: place.description ?? "",
          placeType: place.place_type,
          street: place.street ?? "",
          postalCode: place.postal_code ?? "",
          city: place.city ?? "",
          state: place.state ?? "",
          country: place.country ?? "",
          latitude: valueToString(place.latitude),
          longitude: valueToString(place.longitude),
          website: place.website ?? "",
          phone: place.phone ?? "",
          email: place.email ?? "",
          priceFrom: valueToString(place.price_from),
          currency: place.currency ?? "EUR",
          checkinTime: place.checkin_time ?? "",
          checkoutTime: place.checkout_time ?? "",
          quietHoursFrom: place.quiet_hours_from ?? "",
          quietHoursTo: place.quiet_hours_to ?? "",
          permanentCamperLevel: place.permanent_camper_level ?? "unknown",
          pitchStyle: place.pitch_style ?? "unknown",
          eveningRules: place.evening_rules ?? "unknown",
          selectedFeatureIds,
          vibeScores,
          vibeNote: vibe?.note ?? "",
          environmentScores,
          environmentNote: environment?.note ?? "",
          existingPhotos: existingPhotos
            .map((photo) => ({
              id: photo.id,
              caption: photo.caption,
              url: signedUrls.get(photo.id),
            }))
            .filter((photo): photo is { id: string; caption: string; url: string } => Boolean(photo.url)),
        }}
      />
    </main>
  );
}
