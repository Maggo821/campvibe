import Link from "next/link";
import type { PlaceSummary } from "@/types/database";

interface PlaceCardProps {
  place: PlaceSummary;
}

const statusLabelMap: Record<NonNullable<PlaceSummary["status"]>, string> = {
  favorite: "Favorit",
  visited: "Besucht",
  wishlist: "Merkliste",
  planned: "Geplant",
  never_again: "Nie wieder",
};

export function PlaceCard({ place }: PlaceCardProps) {
  const statusLabel = place.status ? statusLabelMap[place.status] : "Neu";

  return (
    <Link
      href={`/places/${place.id}`}
      className="flex flex-col gap-3 rounded-3xl border border-black/10 bg-white/80 p-4 shadow-sm shadow-black/5 backdrop-blur"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-zinc-900">{place.name}</p>
          <p className="text-sm text-zinc-600">{place.city}, {place.country}</p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
          {statusLabel}
        </span>
      </div>
      <p className="text-sm text-zinc-600">{place.description}</p>
      <div className="flex flex-wrap gap-2">
        {place.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
