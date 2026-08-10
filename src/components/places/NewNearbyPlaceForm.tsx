"use client";

import { useActionState } from "react";
import { createNearbyPlaceAction, type CreateNearbyState } from "@/app/places/[id]/nearby/new/actions";

const categories = [
  "bar",
  "beach_bar",
  "restaurant",
  "cafe",
  "bakery",
  "supermarket",
  "beach",
  "lake",
  "spa",
  "sauna",
  "bike_rental",
  "sup_kayak",
  "boat_rental",
  "town",
  "nightlife",
  "winery",
  "hiking",
  "mountain_lift",
  "attraction",
  "sight",
  "other",
];

const initialState: CreateNearbyState = {
  success: false,
  message: "",
};

interface NewNearbyPlaceFormProps {
  placeId: string;
}

export function NewNearbyPlaceForm({ placeId }: NewNearbyPlaceFormProps) {
  const [state, action, pending] = useActionState(createNearbyPlaceAction, initialState);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="place_id" value={placeId} />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-sm font-medium">Name *</span>
          <input name="name" required className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Kategorie *</span>
          <select name="category" required defaultValue="restaurant" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2">
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Bewertung (1-10)</span>
          <input name="rating" type="number" min={1} max={10} step={1} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Distanz (Meter)</span>
          <input name="distance_meters" type="number" min={0} step={1} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Gehzeit (Min)</span>
          <input name="walking_minutes" type="number" min={0} step={1} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Fahrzeit (Min)</span>
          <input name="driving_minutes" type="number" min={0} step={1} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>

        <label className="flex items-center gap-2 pt-6 text-sm font-medium text-zinc-700">
          <input name="favorite" type="checkbox" className="size-4" />
          Favorit
        </label>

        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-sm font-medium">Beschreibung</span>
          <textarea name="description" rows={3} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Stadt</span>
          <input name="city" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Land</span>
          <input name="country" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Latitude</span>
          <input name="latitude" type="number" step="any" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Longitude</span>
          <input name="longitude" type="number" step="any" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-sm font-medium">Google/Maps URL</span>
          <input name="maps_url" type="url" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Website</span>
          <input name="website" type="url" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Telefon</span>
          <input name="phone" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-sm font-medium">Oeffnungszeiten</span>
          <input name="opening_hours_text" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-sm font-medium">Persoenliche Notiz</span>
          <textarea name="user_note" rows={2} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
        </label>
      </div>

      {state.message ? (
        <p className={`rounded-2xl px-4 py-3 text-sm ${state.success ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900"}`}>
          {state.message}
          {state.nearbyPlaceId ? ` (ID: ${state.nearbyPlaceId})` : ""}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Speichert..." : "Nearby Place speichern"}
      </button>
    </form>
  );
}
