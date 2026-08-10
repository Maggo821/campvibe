import Link from "next/link";
import { notFound } from "next/navigation";
import { NewVisitForm } from "@/components/places/NewVisitForm";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default function NewVisitPage({ params }: { params: Promise<{ id: string }> }) {
  return <NewVisitContent params={params} />;
}

async function NewVisitContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!hasSupabaseEnv()) {
    return (
      <main className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Besuch hinzufügen</h1>
        <p className="mt-2 text-sm text-zinc-600">Supabase ist noch nicht konfiguriert.</p>
      </main>
    );
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Besuch hinzufügen</h1>
        <p className="mt-2 text-sm text-zinc-600">Bitte zuerst einloggen.</p>
        <Link href="/profile" className="mt-4 inline-flex rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
          Zum Login
        </Link>
      </main>
    );
  }

  const { data: place } = await supabase.from("places").select("id, name, created_by").eq("id", id).maybeSingle();
  if (!place) {
    return notFound();
  }

  const editable = place.created_by === user.id;

  return (
    <main className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Besuch hinzufügen</h1>
      <p className="mt-2 text-sm text-zinc-600">Platz: {place.name}</p>
      {!editable ? (
        <p className="mt-4 rounded-2xl bg-amber-100 px-4 py-3 text-sm text-amber-900">
          Du kannst aktuell nur Besuche auf eigenen Plätzen anlegen.
        </p>
      ) : (
        <div className="mt-6">
          <NewVisitForm placeId={id} />
        </div>
      )}
    </main>
  );
}
