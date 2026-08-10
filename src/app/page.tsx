import Link from "next/link";
import { PlaceCard } from "@/components/common/PlaceCard";
import { demoPlaces } from "@/lib/data/demo-places";

const quickActions = [
  { label: "Platz hinzufügen", href: "/places/new" },
  { label: "Besuch eintragen", href: "/places/new" },
  { label: "Entdecken", href: "/discover" },
  { label: "Merkliste", href: "/my-places/wishlist" },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col gap-8">
      <section className="rounded-[2rem] border border-black/10 bg-zinc-950 p-6 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">CampVibe</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
          Wo wollen wir als Nächstes hin?
        </h1>
        <div className="mt-6 flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Aktuelle Empfehlungen</h2>
            <Link href="/discover" className="text-sm text-zinc-600">Alle ansehen</Link>
          </div>
          <div className="grid gap-3">
            {demoPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white/80 p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Kartenvorschau</h3>
          <div className="mt-4 rounded-[1.5rem] border border-dashed border-zinc-300 bg-zinc-100 p-8 text-center text-sm text-zinc-600">
            Die echte MapLibre-Karte ist jetzt auf der Karten-Seite verfügbar.
          </div>
        </div>
      </section>
    </main>
  );
}
