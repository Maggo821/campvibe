import { notFound } from "next/navigation";
import Link from "next/link";
import { demoPlaces } from "@/lib/data/demo-places";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default function PlaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <PlaceDetailContent params={params} />;
}

async function PlaceDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let place = demoPlaces.find((entry) => entry.id === id);

  if (hasSupabaseEnv()) {
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      const { data } = await supabase
        .from("places")
        .select("id, name, description, place_type, city, country")
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
          latitude: 0,
          longitude: 0,
          tags: [data.place_type],
          status: "visited",
        };
      }
    }
  }

  if (!place) {
    notFound();
  }

  return (
    <main className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">{place.name}</h1>
      <p className="mt-3 text-sm text-zinc-600">{place.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
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
      <div className="mt-6 rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
        Die Place-Detail-Ansicht wird im nächsten Schritt mit Tabs für Übersicht, Vibe, Ausstattung, Umgebung, Besuche, Fotos und Notizen ausgebaut.
      </div>
    </main>
  );
}
