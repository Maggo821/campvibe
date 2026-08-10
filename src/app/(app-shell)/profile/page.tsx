import { AuthPanel } from "@/components/auth/AuthPanel";
import { getSupabaseEnvDiagnostics, hasSupabaseEnv } from "@/lib/supabase/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabaseReady = hasSupabaseEnv();
  const envDiagnostics = getSupabaseEnvDiagnostics();

  if (!supabaseReady) {
    return (
      <main className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Profil</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Supabase ist nicht vollständig konfiguriert.
        </p>
        <p className="mt-2 text-sm text-zinc-600">
          Fehlende Variablen: {envDiagnostics.missing.join(", ") || "unbekannt"}
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          Lokal über .env.local setzen, auf Vercel in den Environment Variables für Preview und Production.
        </p>
      </main>
    );
  }

  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase!.auth.getUser();

  const { count, error: connectionError } = await supabase!
    .from("places")
    .select("id", { count: "exact", head: true });

  return (
    <main className="space-y-4 rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Profil</h1>
      <div className={`rounded-2xl px-4 py-3 text-sm ${connectionError ? "bg-rose-100 text-rose-900" : "bg-emerald-100 text-emerald-900"}`}>
        {connectionError
          ? `Supabase-Verbindung fehlerhaft: ${connectionError.message}`
          : `Supabase verbunden. Places erreichbar (${count ?? 0} Einträge).`}
      </div>
      <p className="text-sm text-zinc-600">
        {user ? `Eingeloggt als ${user.email}` : "Noch nicht eingeloggt."}
      </p>
      <AuthPanel initialEmail={user?.email ?? ""} />
    </main>
  );
}
