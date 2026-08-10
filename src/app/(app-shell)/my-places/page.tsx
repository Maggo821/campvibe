import Link from "next/link";
import { demoPlaces } from "@/lib/data/demo-places";
import { PlaceCard } from "@/components/common/PlaceCard";

const tabs = [
  { label: "Besucht", href: "/my-places/visited" },
  { label: "Favoriten", href: "/my-places/favorites" },
  { label: "Merkliste", href: "/my-places/wishlist" },
  { label: "Geplant", href: "/my-places/planned" },
  { label: "Nie wieder", href: "/my-places/never-again" },
];

export default function MyPlacesPage() {
  return (
    <main className="flex flex-1 flex-col gap-4">
      <div className="rounded-[2rem] border border-black/10 bg-white/80 p-5 shadow-sm">
        <h1 className="text-2xl font-semibold">Meine Plätze</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Link key={tab.href} href={tab.href} className="rounded-full border border-zinc-200 px-3 py-2 text-sm text-zinc-700">
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="grid gap-3">
        {demoPlaces.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>
    </main>
  );
}
