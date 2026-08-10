import { EmptyState } from "@/components/common/EmptyState";

export default function DiscoverPage() {
  return (
    <main className="flex flex-1 flex-col gap-4">
      <div className="rounded-[2rem] border border-black/10 bg-white/80 p-5 shadow-sm">
        <h1 className="text-2xl font-semibold">Entdecken</h1>
        <p className="mt-2 text-sm text-zinc-600">Filter-UI, Radius und Vibe-Parameter werden hier vorbereitet.</p>
      </div>
      <div className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
        <EmptyState title="Discover-Filter vorbereitet" description="Später werden Radius, Umgebung und Vibe-Filter hier sichtbar." />
      </div>
    </main>
  );
}
