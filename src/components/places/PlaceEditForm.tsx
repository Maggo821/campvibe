"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import {
  deletePlaceAction,
  updatePlaceAction,
  type DeletePlaceState,
  type UpdatePlaceState,
} from "@/app/places/[id]/edit/actions";
import { getFeatureLabel } from "@/lib/data/labels";

interface FeatureOption {
  id: string;
  name: string;
}

interface ExistingPhoto {
  id: string;
  caption: string;
  url: string;
}

interface InitialPlaceData {
  id: string;
  name: string;
  description: string;
  placeType: string;
  street: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
  website: string;
  phone: string;
  email: string;
  priceFrom: string;
  currency: string;
  checkinTime: string;
  checkoutTime: string;
  quietHoursFrom: string;
  quietHoursTo: string;
  permanentCamperLevel: string;
  pitchStyle: string;
  eveningRules: string;
  selectedFeatureIds: string[];
  vibeScores: Record<string, string>;
  vibeNote: string;
  environmentScores: Record<string, string>;
  environmentNote: string;
  existingPhotos: ExistingPhoto[];
}

interface PlaceEditFormProps {
  initialData: InitialPlaceData;
  features: FeatureOption[];
}

const initialUpdateState: UpdatePlaceState = {
  success: false,
  message: "",
};

const initialDeleteState: DeletePlaceState = {
  success: false,
  message: "",
};

const placeTypes = [
  { value: "camping", label: "Campingplatz" },
  { value: "motorhome_pitch", label: "Wohnmobilstellplatz" },
  { value: "vanlife_camp", label: "Vanlife-Camp" },
  { value: "nature_camp", label: "Naturcamp" },
  { value: "farm", label: "Hof" },
  { value: "winery", label: "Weingut" },
  { value: "glamping", label: "Glamping" },
  { value: "marina", label: "Marina" },
  { value: "beach_camp", label: "Beach Camp" },
  { value: "festival_camp", label: "Festival Camp" },
  { value: "other", label: "Sonstiges" },
] as const;

const permanentCamperLevels = [
  { value: "none", label: "Keine" },
  { value: "low", label: "Niedrig" },
  { value: "medium", label: "Mittel" },
  { value: "high", label: "Hoch" },
  { value: "very_high", label: "Sehr hoch" },
  { value: "unknown", label: "Unbekannt" },
] as const;

const pitchStyles = [
  { value: "open_field", label: "Offenes Feld" },
  { value: "natural", label: "Naturnah" },
  { value: "large_parcels", label: "Große Parzellen" },
  { value: "standard_parcels", label: "Standard-Parzellen" },
  { value: "hedges", label: "Parzellen mit Hecken" },
  { value: "tight_rows", label: "Enge Reihen" },
  { value: "permanent_camper_style", label: "Dauercamper-Stil" },
  { value: "unknown", label: "Unbekannt" },
] as const;

const eveningRules = [
  { value: "relaxed", label: "Entspannt" },
  { value: "normal", label: "Normal" },
  { value: "strict", label: "Strikt" },
  { value: "very_strict", label: "Sehr strikt" },
  { value: "unknown", label: "Unbekannt" },
] as const;

const vibeFields = [
  { key: "overall", label: "Gesamt-Vibe" },
  { key: "vanlife", label: "Vanlife-Vibe" },
  { key: "nature", label: "Natur" },
  { key: "nightlife", label: "Abendleben" },
  { key: "beach_bar", label: "Beach- & Bar-Vibe" },
  { key: "international", label: "Internationales Publikum" },
  { key: "modern", label: "Modern" },
  { key: "open_space", label: "Offenes Raumgefühl" },
  { key: "privacy", label: "Privatsphäre" },
  { key: "gastronomy", label: "Gastronomie" },
  { key: "surroundings", label: "Umgebung" },
  { key: "value_for_money", label: "Preis-Leistung" },
  { key: "atmosphere_score", label: "Atmosphäre" },
  { key: "camping_style_score", label: "Camping-Stil" },
  { key: "audience_vibe_score", label: "Publikumsgefühl" },
] as const;

const environmentFields = [
  { key: "overall_environment", label: "Umgebung gesamt" },
  { key: "evening_activity", label: "Abendaktivität" },
  { key: "restaurants", label: "Restaurants" },
  { key: "bars", label: "Bars" },
  { key: "shopping", label: "Shopping" },
  { key: "nature", label: "Natur" },
  { key: "excursions", label: "Ausflüge" },
  { key: "cycling", label: "Radfahren" },
  { key: "hiking", label: "Wandern" },
  { key: "water_sports", label: "Wassersport" },
  { key: "town_accessibility", label: "Erreichbarkeit Ort" },
] as const;

export function PlaceEditForm({ initialData, features }: PlaceEditFormProps) {
  const [updateState, updateAction, updatePending] = useActionState(updatePlaceAction, initialUpdateState);
  const [deleteState, deleteAction, deletePending] = useActionState(deletePlaceAction, initialDeleteState);

  const [name, setName] = useState(initialData.name);
  const [description, setDescription] = useState(initialData.description);
  const [placeType, setPlaceType] = useState(initialData.placeType);
  const [street, setStreet] = useState(initialData.street);
  const [postalCode, setPostalCode] = useState(initialData.postalCode);
  const [city, setCity] = useState(initialData.city);
  const [region, setRegion] = useState(initialData.state);
  const [country, setCountry] = useState(initialData.country);
  const [latitude, setLatitude] = useState(initialData.latitude);
  const [longitude, setLongitude] = useState(initialData.longitude);
  const [website, setWebsite] = useState(initialData.website);
  const [phone, setPhone] = useState(initialData.phone);
  const [email, setEmail] = useState(initialData.email);
  const [priceFrom, setPriceFrom] = useState(initialData.priceFrom);
  const [currency, setCurrency] = useState(initialData.currency);
  const [checkinTime, setCheckinTime] = useState(initialData.checkinTime);
  const [checkoutTime, setCheckoutTime] = useState(initialData.checkoutTime);
  const [quietHoursFrom, setQuietHoursFrom] = useState(initialData.quietHoursFrom);
  const [quietHoursTo, setQuietHoursTo] = useState(initialData.quietHoursTo);
  const [permanentCamperLevel, setPermanentCamperLevel] = useState(initialData.permanentCamperLevel);
  const [pitchStyle, setPitchStyle] = useState(initialData.pitchStyle);
  const [eveningRule, setEveningRule] = useState(initialData.eveningRules);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>(initialData.selectedFeatureIds);
  const [vibeScores, setVibeScores] = useState<Record<string, string>>(initialData.vibeScores);
  const [vibeNote, setVibeNote] = useState(initialData.vibeNote);
  const [environmentScores, setEnvironmentScores] = useState<Record<string, string>>(initialData.environmentScores);
  const [environmentNote, setEnvironmentNote] = useState(initialData.environmentNote);
  const [photoCaption, setPhotoCaption] = useState("");
  const [selectedPhotoNames, setSelectedPhotoNames] = useState<string[]>([]);
  const [deletePhotoIds, setDeletePhotoIds] = useState<string[]>([]);

  const saveDisabled = updatePending || name.trim().length === 0;
  const selectedFeatureCount = useMemo(() => selectedFeatureIds.length, [selectedFeatureIds.length]);

  function toggleFeature(featureId: string) {
    setSelectedFeatureIds((current) =>
      current.includes(featureId) ? current.filter((id) => id !== featureId) : [...current, featureId],
    );
  }

  function toggleDeletePhoto(photoId: string) {
    setDeletePhotoIds((current) =>
      current.includes(photoId) ? current.filter((id) => id !== photoId) : [...current, photoId],
    );
  }

  return (
    <>
      <form action={updateAction} className="space-y-6">
        <input type="hidden" name="place_id" value={initialData.id} />
        <input type="hidden" name="name" value={name} />
        <input type="hidden" name="description" value={description} />
        <input type="hidden" name="place_type" value={placeType} />
        <input type="hidden" name="street" value={street} />
        <input type="hidden" name="postal_code" value={postalCode} />
        <input type="hidden" name="city" value={city} />
        <input type="hidden" name="state" value={region} />
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="latitude" value={latitude} />
        <input type="hidden" name="longitude" value={longitude} />
        <input type="hidden" name="website" value={website} />
        <input type="hidden" name="phone" value={phone} />
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="price_from" value={priceFrom} />
        <input type="hidden" name="currency" value={currency} />
        <input type="hidden" name="checkin_time" value={checkinTime} />
        <input type="hidden" name="checkout_time" value={checkoutTime} />
        <input type="hidden" name="quiet_hours_from" value={quietHoursFrom} />
        <input type="hidden" name="quiet_hours_to" value={quietHoursTo} />
        <input type="hidden" name="permanent_camper_level" value={permanentCamperLevel} />
        <input type="hidden" name="pitch_style" value={pitchStyle} />
        <input type="hidden" name="evening_rules" value={eveningRule} />
        <input type="hidden" name="vibe_note" value={vibeNote} />
        <input type="hidden" name="environment_note" value={environmentNote} />
        <input type="hidden" name="photo_caption" value={photoCaption} />

        {selectedFeatureIds.map((featureId) => (
          <input key={featureId} type="hidden" name="feature_ids" value={featureId} />
        ))}

        {deletePhotoIds.map((photoId) => (
          <input key={photoId} type="hidden" name="delete_photo_ids" value={photoId} />
        ))}

        {Object.entries(vibeScores).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}

        {Object.entries(environmentScores).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}

        <section className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium">Name *</span>
            <input value={name} onChange={(event) => setName(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium">Beschreibung</span>
            <textarea rows={4} value={description} onChange={(event) => setDescription(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Stadt</span>
            <input value={city} onChange={(event) => setCity(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Land</span>
            <input value={country} onChange={(event) => setCountry(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium">Platztyp</span>
            <select value={placeType} onChange={(event) => setPlaceType(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2">
              {placeTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </label>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium">Straße</span>
            <input value={street} onChange={(event) => setStreet(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">PLZ</span>
            <input value={postalCode} onChange={(event) => setPostalCode(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Bundesland/Region</span>
            <input value={region} onChange={(event) => setRegion(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Latitude</span>
            <input type="number" step="any" value={latitude} onChange={(event) => setLatitude(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Longitude</span>
            <input type="number" step="any" value={longitude} onChange={(event) => setLongitude(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Website</span>
            <input type="url" value={website} onChange={(event) => setWebsite(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Telefon</span>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium">E-Mail</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Preis ab</span>
            <input type="number" min="0" step="0.01" value={priceFrom} onChange={(event) => setPriceFrom(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Währung</span>
            <input value={currency} onChange={(event) => setCurrency(event.target.value.toUpperCase())} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Check-in</span>
            <input type="time" value={checkinTime} onChange={(event) => setCheckinTime(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Check-out</span>
            <input type="time" value={checkoutTime} onChange={(event) => setCheckoutTime(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Ruhezeit von</span>
            <input type="time" value={quietHoursFrom} onChange={(event) => setQuietHoursFrom(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Ruhezeit bis</span>
            <input type="time" value={quietHoursTo} onChange={(event) => setQuietHoursTo(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Dauercamper-Anteil</span>
            <select value={permanentCamperLevel} onChange={(event) => setPermanentCamperLevel(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2">
              {permanentCamperLevels.map((entry) => (
                <option key={entry.value} value={entry.value}>{entry.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Stellplatzgefühl</span>
            <select value={pitchStyle} onChange={(event) => setPitchStyle(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2">
              {pitchStyles.map((entry) => (
                <option key={entry.value} value={entry.value}>{entry.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Abendregeln</span>
            <select value={eveningRule} onChange={(event) => setEveningRule(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2">
              {eveningRules.map((entry) => (
                <option key={entry.value} value={entry.value}>{entry.label}</option>
              ))}
            </select>
          </label>
        </section>

        <section className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold">Ausstattung</h2>
            <span className="text-xs text-zinc-600">{selectedFeatureCount} ausgewählt</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const active = selectedFeatureIds.includes(feature.id);
              return (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => toggleFeature(feature.id)}
                  className={`rounded-xl border px-3 py-2 text-left text-sm ${active ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700"}`}
                >
                  {getFeatureLabel(feature.name)}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <h2 className="text-base font-semibold">Vibe (1 bis 10)</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {vibeFields.map((field) => (
              <label key={field.key} className="flex flex-col gap-1">
                <span className="text-sm font-medium">{field.label}</span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="1"
                  value={vibeScores[field.key] ?? ""}
                  onChange={(event) => setVibeScores((current) => ({ ...current, [field.key]: event.target.value }))}
                  className="rounded-2xl border border-zinc-200 bg-white px-3 py-2"
                />
              </label>
            ))}
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Vibe-Notiz</span>
            <textarea rows={3} value={vibeNote} onChange={(event) => setVibeNote(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
        </section>

        <section className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <h2 className="text-base font-semibold">Umgebung (1 bis 10)</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {environmentFields.map((field) => (
              <label key={field.key} className="flex flex-col gap-1">
                <span className="text-sm font-medium">{field.label}</span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="1"
                  value={environmentScores[field.key] ?? ""}
                  onChange={(event) => setEnvironmentScores((current) => ({ ...current, [field.key]: event.target.value }))}
                  className="rounded-2xl border border-zinc-200 bg-white px-3 py-2"
                />
              </label>
            ))}
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Umgebungs-Notiz</span>
            <textarea rows={3} value={environmentNote} onChange={(event) => setEnvironmentNote(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
        </section>

        <section className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <h2 className="text-base font-semibold">Fotos verwalten</h2>
          <p className="text-sm text-zinc-600">Hier kannst du bestehende Bilder entfernen und neue Bilder nachtraeglich hochladen.</p>

          {initialData.existingPhotos.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {initialData.existingPhotos.map((photo) => {
                const markedForDelete = deletePhotoIds.includes(photo.id);
                return (
                  <article key={photo.id} className={`rounded-2xl border p-3 ${markedForDelete ? "border-rose-300 bg-rose-50" : "border-zinc-200 bg-white"}`}>
                    <img src={photo.url} alt={photo.caption || "Platzfoto"} className="h-40 w-full rounded-xl object-cover" />
                    <p className="mt-2 text-sm font-medium text-zinc-900">{photo.caption || "Foto"}</p>
                    <button
                      type="button"
                      onClick={() => toggleDeletePhoto(photo.id)}
                      className={`mt-2 rounded-full px-3 py-1.5 text-xs font-medium ${markedForDelete ? "bg-rose-700 text-white" : "border border-zinc-300 text-zinc-700"}`}
                    >
                      {markedForDelete ? "Zum Loeschen markiert" : "Zum Loeschen markieren"}
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-zinc-600">Noch keine Fotos vorhanden.</p>
          )}

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Neue Fotos hochladen</span>
            <input
              name="photos"
              type="file"
              multiple
              accept="image/*"
              onChange={(event) => setSelectedPhotoNames(Array.from(event.target.files ?? []).map((file) => file.name))}
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 file:mr-3 file:rounded-full file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Bildunterschrift fuer neue Fotos (optional)</span>
            <input value={photoCaption} onChange={(event) => setPhotoCaption(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>

          {selectedPhotoNames.length > 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-3 text-xs text-zinc-700">
              {selectedPhotoNames.join(", ")}
            </div>
          ) : null}
        </section>

        {updateState.message ? (
          <p className={`rounded-xl px-3 py-2 text-sm ${updateState.success ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900"}`}>
            {updateState.message}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={saveDisabled} className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
            {updatePending ? "Speichere..." : "Aenderungen speichern"}
          </button>
          <Link href={`/places/${initialData.id}`} className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700">
            Zurueck zum Platz
          </Link>
        </div>
      </form>

      <form
        action={deleteAction}
        className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4"
        onSubmit={(event) => {
          const confirmed = window.confirm("Willst du diesen Platz wirklich dauerhaft loeschen?");
          if (!confirmed) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="place_id" value={initialData.id} />
        <p className="text-sm text-rose-900">Platz loeschen: Diese Aktion ist dauerhaft und entfernt den Platz inklusive verknuepfter Daten.</p>
        {deleteState.message ? <p className="mt-2 text-sm text-rose-800">{deleteState.message}</p> : null}
        <button type="submit" disabled={deletePending} className="mt-3 rounded-full bg-rose-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {deletePending ? "Loesche..." : "Platz loeschen"}
        </button>
      </form>
    </>
  );
}
