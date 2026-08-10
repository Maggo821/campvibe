"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

interface AuthPanelProps {
  initialEmail?: string;
}

export function AuthPanel({ initialEmail }: AuthPanelProps) {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [email, setEmail] = useState(initialEmail ?? "");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setMessage("Supabase ist noch nicht konfiguriert. Bitte .env.local prüfen.");
      return;
    }

    setBusy(true);
    setMessage(null);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Erfolgreich angemeldet.");
      router.refresh();
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });
    setBusy(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Account erstellt. Bitte E-Mail-Bestätigung prüfen (je nach Supabase-Config).");
    router.refresh();
  }

  async function onSignOut() {
    if (!supabase) {
      setMessage("Supabase ist noch nicht konfiguriert. Bitte .env.local prüfen.");
      return;
    }

    setBusy(true);
    const { error } = await supabase.auth.signOut();
    setBusy(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Abgemeldet.");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex rounded-full border border-zinc-200 p-1 text-sm">
        <button
          type="button"
          className={`flex-1 rounded-full px-3 py-2 ${mode === "signin" ? "bg-zinc-900 text-white" : "text-zinc-600"}`}
          onClick={() => setMode("signin")}
        >
          Anmelden
        </button>
        <button
          type="button"
          className={`flex-1 rounded-full px-3 py-2 ${mode === "signup" ? "bg-zinc-900 text-white" : "text-zinc-600"}`}
          onClick={() => setMode("signup")}
        >
          Registrieren
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <label className="flex flex-col gap-1 text-sm">
          E-Mail
          <input
            className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 outline-none ring-amber-300 focus:ring"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Passwort
          <input
            className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 outline-none ring-amber-300 focus:ring"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white"
          disabled={busy}
        >
          {busy ? "Bitte warten..." : mode === "signin" ? "Anmelden" : "Account erstellen"}
        </button>
      </form>

      <button
        type="button"
        className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-700"
        onClick={onSignOut}
        disabled={busy}
      >
        Abmelden
      </button>

      {message ? <p className="text-sm text-zinc-600">{message}</p> : null}
    </div>
  );
}
