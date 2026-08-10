import { notFound } from "next/navigation";
import { demoPlaces } from "@/lib/data/demo-places";

export default function PlaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <PlaceDetailContent params={params} />;
}

async function PlaceDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const place = demoPlaces.find((entry) => entry.id === id);

  if (!place) {
    notFound();
  }

  return (
    <main className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">{place.name}</h1>
      <p className="mt-3 text-sm text-zinc-600">{place.description}</p>
      <div className="mt-6 rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
        Die Place-Detail-Ansicht wird im nächsten Schritt mit Tabs für Übersicht, Vibe, Ausstattung, Umgebung, Besuche, Fotos und Notizen ausgebaut.
      </div>
    </main>
  );
}
