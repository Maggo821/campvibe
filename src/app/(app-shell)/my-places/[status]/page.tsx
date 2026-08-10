import Link from "next/link";
import { notFound } from "next/navigation";

const allowedStatuses = ["visited", "favorites", "wishlist", "planned", "never-again"] as const;

const labels: Record<(typeof allowedStatuses)[number], string> = {
  visited: "Besucht",
  favorites: "Favoriten",
  wishlist: "Merkliste",
  planned: "Geplant",
  "never-again": "Nie wieder",
};

export default async function MyPlacesStatusPage({ params }: { params: Promise<{ status: string }> }) {
  const { status } = await params;

  if (!allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
    notFound();
  }

  const typedStatus = status as (typeof allowedStatuses)[number];

  return (
    <main className="space-y-4 rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Meine Plätze: {labels[typedStatus]}</h1>
      <p className="text-sm text-zinc-600">
        Die statusspezifische Filterlogik wird im nächsten Schritt auf user_place_status aufgebaut.
      </p>
      <Link href="/my-places" className="inline-flex rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
        Zurück zu Meine Plätze
      </Link>
    </main>
  );
}
