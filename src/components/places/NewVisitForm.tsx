"use client";

import { useActionState } from "react";
import { createVisitAction, type CreateVisitState } from "@/app/places/[id]/visit/new/actions";

const initialState: CreateVisitState = {
  success: false,
  message: "",
};

interface NewVisitFormProps {
  placeId: string;
}

export function NewVisitForm({ placeId }: NewVisitFormProps) {
  const [state, action, pending] = useActionState(createVisitAction, initialState);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="place_id" value={placeId} />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Anreise *</span>
          <input name="arrival_date" type="date" required className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Abreise</span>
          <input name="departure_date" type="date" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Platznummer</span>
          <input name="pitch_number" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Fahrzeug</span>
          <input name="vehicle" placeholder="Van, Wohnmobil, Zelt..." className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Preis/Nacht</span>
          <input name="price_per_night" type="number" min={0} step="0.01" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Gesamtpreis</span>
          <input name="total_price" type="number" min={0} step="0.01" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Währung</span>
          <input name="currency" defaultValue="EUR" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Personen</span>
          <input name="persons" type="number" min={1} step="1" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-sm font-medium">Notiz</span>
          <textarea name="note" rows={3} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>
      </div>

      {state.message ? (
        <p className={`rounded-2xl px-4 py-3 text-sm ${state.success ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900"}`}>
          {state.message}
          {state.visitId ? ` (ID: ${state.visitId})` : ""}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Speichert..." : "Besuch speichern"}
      </button>
    </form>
  );
}
