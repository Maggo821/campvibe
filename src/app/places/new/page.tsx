import Link from "next/link";
import { PlaceCreateWizard } from "@/components/places/PlaceCreateWizard";
import { getSupabaseEnvDiagnostics, hasSupabaseEnv } from "@/lib/supabase/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const fallbackFeatures = [
  "Restaurant",
  "Bar",
  "Beachbar",
  "Cafe",
  "Bakery",
  "Supermarket",
  "Pool",
  "Indoor Pool",
  "Sauna",
  "Wellness",
  "Fitness",
  "Lake",
  "Sea",
  "River",
  "Beach",
  "Dog Beach",
  "SUP",
  "Kayak",
  "Boat Rental",
  "Bike Rental",
  "E-Bike Rental",
  "Playground",
  "Animation",
  "Live Music",
  "Events",
  "WiFi",
  "Washing Machine",
  "Dryer",
  "Electricity",
  "Fresh Water",
  "Waste Water",
  "Chemical Toilet Disposal",
  "Motorhome Service",
].map((name) => ({ id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name }));

export default async function NewPlacePage() {
  const supabaseReady = hasSupabaseEnv();
  const envDiagnostics = getSupabaseEnvDiagnostics();

  if (!supabaseReady) {
    return (
      <main className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Neuen Platz anlegen</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Supabase ist noch nicht vollständig konfiguriert.
        </p>
        <p className="mt-2 text-sm text-zinc-600">
          Fehlende Variablen: {envDiagnostics.missing.join(", ") || "unbekannt"}
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          Auf Vercel bitte für Preview und Production setzen und danach neu deployen.
        </p>
      </main>
    );
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return (
      <main className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Neuen Platz anlegen</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Supabase-Client konnte nicht initialisiert werden. Bitte URL/Key auf Vercel prüfen und neu deployen.
        </p>
      </main>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: features } = await supabase
    .from("features")
    .select("id, name")
    .order("name", { ascending: true });

  if (!user) {
    return (
      <main className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Neuen Platz anlegen</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Für das Speichern musst du eingeloggt sein.
        </p>
        <Link href="/profile" className="mt-4 inline-flex rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
          Zum Login
        </Link>
      </main>
    );
  }

  return (
    <main className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Neuen Platz anlegen</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Der Flow bleibt mobil und leichtgewichtig: speichern ist bereits nach den Grunddaten möglich.
      </p>
      <div className="mt-6">
        <PlaceCreateWizard initialFeatures={features?.length ? features : fallbackFeatures} />
      </div>
    </main>
  );
}
