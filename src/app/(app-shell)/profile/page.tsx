import { AuthPanel } from "@/components/auth/AuthPanel";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabaseReady = hasSupabaseEnv();

  if (!supabaseReady) {
    return (
      <main className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Profil</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Für Auth bitte zuerst <code>.env.local</code> mit Supabase Werten anlegen.
        </p>
      </main>
    );
  }

  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase!.auth.getUser();

  return (
    <main className="space-y-4 rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Profil</h1>
      <p className="text-sm text-zinc-600">
        {user ? `Eingeloggt als ${user.email}` : "Noch nicht eingeloggt."}
      </p>
      <AuthPanel initialEmail={user?.email ?? ""} />
    </main>
  );
}
