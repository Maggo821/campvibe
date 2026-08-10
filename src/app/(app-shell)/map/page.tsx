import { EmptyState } from "@/components/common/EmptyState";

export default function MapPage() {
  return (
    <main className="flex flex-1 flex-col gap-4">
      <div className="rounded-[2rem] border border-black/10 bg-white/80 p-5 shadow-sm">
        <h1 className="text-2xl font-semibold">Karte</h1>
        <p className="mt-2 text-sm text-zinc-600">Die MapLibre-Ansicht wird hier als Vollbildkarte aufgebaut.</p>
      </div>
      <div className="flex-1 rounded-[2rem] border border-dashed border-zinc-300 bg-zinc-100 p-6">
        <EmptyState title="Map-Ansicht vorbereitet" description="Filter und Marker folgen im nächsten Schritt." />
      </div>
    </main>
  );
}
