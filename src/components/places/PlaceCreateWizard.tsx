"use client";

import { useActionState, useMemo, useState } from "react";
import { createPlaceAction, type CreatePlaceState } from "@/app/places/new/actions";

const initialState: CreatePlaceState = {
  success: false,
  message: "",
};

const steps = [
  "Grunddaten",
  "Standort",
  "Platztyp",
  "Ausstattung (vorbereitet)",
  "Vibe (optional)",
  "Umgebung (optional)",
  "Fotos (optional)",
];

const placeTypes = [
  "camping",
  "motorhome_pitch",
  "vanlife_camp",
  "nature_camp",
  "farm",
  "winery",
  "glamping",
  "marina",
  "beach_camp",
  "festival_camp",
  "other",
];

const permanentCamperLevels = ["none", "low", "medium", "high", "very_high", "unknown"];
const pitchStyles = [
  "open_field",
  "natural",
  "large_parcels",
  "standard_parcels",
  "hedges",
  "tight_rows",
  "permanent_camper_style",
  "unknown",
];
const eveningRules = ["relaxed", "normal", "strict", "very_strict", "unknown"];

export function PlaceCreateWizard() {
  const [step, setStep] = useState(0);
  const [state, action, pending] = useActionState(createPlaceAction, initialState);

  const canGoBack = step > 0;
  const canGoForward = step < steps.length - 1;

  const progress = useMemo(() => Math.round(((step + 1) / steps.length) * 100), [step]);

  return (
    <form action={action} className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-zinc-600">
          <span>Schritt {step + 1} von {steps.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
          <div className="h-full rounded-full bg-zinc-900" style={{ width: `${progress}%` }} />
        </div>
        <h2 className="text-xl font-semibold">{steps[step]}</h2>
      </div>

      {step === 0 ? (
        <section className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium">Name *</span>
            <input name="name" required className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>

          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium">Beschreibung</span>
            <textarea name="description" rows={4} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Stadt</span>
            <input name="city" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Land</span>
            <input name="country" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>

          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium">Place Type</span>
            <select name="place_type" defaultValue="other" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2">
              {placeTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
        </section>
      ) : null}

      {step === 1 ? (
        <section className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium">Straße</span>
            <input name="street" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">PLZ</span>
            <input name="postal_code" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Bundesland/Region</span>
            <input name="state" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Latitude (-90 bis 90)</span>
            <input name="latitude" type="number" step="any" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Longitude (-180 bis 180)</span>
            <input name="longitude" type="number" step="any" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Dauercamper-Anteil</span>
            <select name="permanent_camper_level" defaultValue="unknown" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2">
              {permanentCamperLevels.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Stellplatzgefühl</span>
            <select name="pitch_style" defaultValue="unknown" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2">
              {pitchStyles.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium">Abendregeln / Nachtruhe</span>
            <select name="evening_rules" defaultValue="unknown" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2">
              {eveningRules.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Preis ab</span>
            <input name="price_from" type="number" min={0} step="0.01" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Währung</span>
            <input name="currency" defaultValue="EUR" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
        </section>
      ) : null}

      {step >= 3 ? (
        <section className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">
          Diese Schritte sind vorbereitet und werden als Nächstes mit eigenen Komponenten ausgebaut.
          Du kannst bereits jetzt speichern, damit Grunddaten nicht verloren gehen.
        </section>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Website</span>
          <input name="website" type="url" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Telefon</span>
          <input name="phone" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-sm font-medium">E-Mail</span>
          <input name="email" type="email" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>
      </section>

      {state.message ? (
        <p className={`rounded-2xl px-4 py-3 text-sm ${state.success ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900"}`}>
          {state.message}
          {state.placeId ? ` (ID: ${state.placeId})` : ""}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
          disabled={!canGoBack || pending}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 disabled:opacity-50"
        >
          Zurück
        </button>

        <button
          type="button"
          onClick={() => setStep((prev) => Math.min(prev + 1, steps.length - 1))}
          disabled={!canGoForward || pending}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 disabled:opacity-50"
        >
          Weiter
        </button>

        <button
          type="submit"
          disabled={pending}
          className="ml-auto rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Speichert..." : "Jetzt speichern"}
        </button>
      </div>
    </form>
  );
}
