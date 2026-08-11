"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { createPlaceAction, type CreatePlaceState } from "@/app/places/new/actions";
import { getFeatureLabel } from "@/lib/data/labels";

interface FeatureOption {
  id: string;
  name: string;
}

interface PlaceCreateWizardProps {
  initialFeatures: FeatureOption[];
}

const initialState: CreatePlaceState = {
  success: false,
  message: "",
};

const steps = ["Grunddaten", "Standort", "Platzstil", "Ausstattung", "Vibe", "Umgebung", "Fotos"];

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
  { key: "atmosphere_score", label: "Atmosphäre: ruhig bis lebendig" },
  { key: "camping_style_score", label: "Camping-Stil: Dauercamper bis Travel-Vibe" },
  { key: "audience_vibe_score", label: "Publikumsgefühl: älter bis jünger" },
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

type VibeFieldKey = (typeof vibeFields)[number]["key"];
type EnvironmentFieldKey = (typeof environmentFields)[number]["key"];

type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  extratags?: Record<string, string | undefined>;
  address?: {
    road?: string;
    house_number?: string;
    postcode?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
};

function createInitialScaleState<T extends readonly { key: string }[]>(fields: T) {
  return Object.fromEntries(fields.map((field) => [field.key, ""])) as Record<T[number]["key"], string>;
}

function SliderField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2 rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-zinc-900">{label}</span>
        <span className="rounded-full bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-white">{value || "-"}</span>
      </div>
      <input type="range" min="1" max="10" step="1" value={value || "5"} onChange={(event) => onChange(event.target.value)} className="w-full accent-zinc-900" />
      <div className="flex justify-between text-xs text-zinc-500">
        <span>1</span>
        <span>10</span>
      </div>
    </label>
  );
}

export function PlaceCreateWizard({ initialFeatures }: PlaceCreateWizardProps) {
  const [step, setStep] = useState(0);
  const [state, action, pending] = useActionState(createPlaceAction, initialState);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [placeType, setPlaceType] = useState<(typeof placeTypes)[number]["value"]>("other");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [permanentCamperLevel, setPermanentCamperLevel] = useState<(typeof permanentCamperLevels)[number]["value"]>("unknown");
  const [pitchStyle, setPitchStyle] = useState<(typeof pitchStyles)[number]["value"]>("unknown");
  const [eveningRule, setEveningRule] = useState<(typeof eveningRules)[number]["value"]>("unknown");
  const [priceFrom, setPriceFrom] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);
  const [vibeScores, setVibeScores] = useState<Record<VibeFieldKey, string>>(() => createInitialScaleState(vibeFields));
  const [vibeNote, setVibeNote] = useState("");
  const [environmentScores, setEnvironmentScores] = useState<Record<EnvironmentFieldKey, string>>(() => createInitialScaleState(environmentFields));
  const [environmentNote, setEnvironmentNote] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");
  const [selectedPhotoNames, setSelectedPhotoNames] = useState<string[]>([]);
  const [addressQuery, setAddressQuery] = useState("");
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [addressResults, setAddressResults] = useState<NominatimResult[]>([]);

  const canGoBack = step > 0;
  const canGoForward = step < steps.length - 1;
  const progress = useMemo(() => Math.round(((step + 1) / steps.length) * 100), [step]);
  const saveDisabled = pending || name.trim().length === 0;

  function parseNameFromDisplayName(displayName: string) {
    return displayName.split(",")[0]?.trim() ?? "";
  }

  async function searchAddress() {
    const query = addressQuery.trim();
    if (!query) {
      setAddressError("Bitte gib zuerst eine Adresse oder einen Ort ein.");
      setAddressResults([]);
      return;
    }

    setAddressLoading(true);
    setAddressError(null);

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&namedetails=1&extratags=1&limit=6&q=${encodeURIComponent(query)}`;
      const response = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });

      if (!response.ok) {
        throw new Error(`Geocoding fehlgeschlagen (${response.status}).`);
      }

      const data = (await response.json()) as NominatimResult[];
      if (!Array.isArray(data) || data.length === 0) {
        setAddressResults([]);
        setAddressError("Keine passenden Adressen gefunden.");
        return;
      }

      setAddressResults(data);
    } catch (error) {
      setAddressResults([]);
      setAddressError(error instanceof Error ? error.message : "Adresssuche fehlgeschlagen.");
    } finally {
      setAddressLoading(false);
    }
  }

  function applyAddress(result: NominatimResult) {
    const road = result.address?.road ?? "";
    const houseNumber = result.address?.house_number ?? "";
    setStreet([road, houseNumber].filter(Boolean).join(" ").trim());
    setPostalCode(result.address?.postcode ?? "");
    setCity(result.address?.city ?? result.address?.town ?? result.address?.village ?? "");
    setRegion(result.address?.state ?? "");
    setCountry(result.address?.country ?? "");
    setLatitude(result.lat);
    setLongitude(result.lon);
    setAddressQuery(result.display_name);

    const detectedName = result.name?.trim() || parseNameFromDisplayName(result.display_name);
    if (!name.trim() && detectedName) {
      setName(detectedName);
    }

    const tags = result.extratags ?? {};
    if (!website.trim() && (tags.website || tags["contact:website"] || tags.url)) {
      setWebsite(tags.website || tags["contact:website"] || tags.url || "");
    }
    if (!phone.trim() && (tags.phone || tags["contact:phone"])) {
      setPhone(tags.phone || tags["contact:phone"] || "");
    }
    if (!email.trim() && (tags.email || tags["contact:email"])) {
      setEmail(tags.email || tags["contact:email"] || "");
    }

    setAddressResults([]);
    setAddressError(null);
  }

  function toggleFeature(featureId: string) {
    setSelectedFeatureIds((current) =>
      current.includes(featureId) ? current.filter((id) => id !== featureId) : [...current, featureId],
    );
  }

  return (
    <form action={action} className="space-y-6">
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
      <input type="hidden" name="permanent_camper_level" value={permanentCamperLevel} />
      <input type="hidden" name="pitch_style" value={pitchStyle} />
      <input type="hidden" name="evening_rules" value={eveningRule} />
      <input type="hidden" name="price_from" value={priceFrom} />
      <input type="hidden" name="currency" value={currency} />
      <input type="hidden" name="vibe_note" value={vibeNote} />
      <input type="hidden" name="environment_note" value={environmentNote} />
      <input type="hidden" name="photo_caption" value={photoCaption} />

      {selectedFeatureIds.map((featureId) => (
        <input key={featureId} type="hidden" name="feature_ids" value={featureId} />
      ))}

      {Object.entries(vibeScores).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}

      {Object.entries(environmentScores).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}

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
        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-sm font-medium text-zinc-900">Adresse suchen</p>
            <p className="mt-1 text-xs text-zinc-600">Suche direkt hier zu Beginn. Name, Kontakt, Ort und Koordinaten werden soweit möglich automatisch vorausgefüllt.</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input value={addressQuery} onChange={(event) => setAddressQuery(event.target.value)} placeholder="z. B. Campingpark München oder Hauptstraße 12, Hamburg" className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
              <button type="button" onClick={searchAddress} disabled={addressLoading} className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                {addressLoading ? "Suche..." : "Adresse finden"}
              </button>
            </div>
            {addressError ? <p className="mt-2 text-xs text-rose-700">{addressError}</p> : null}
            {addressResults.length > 0 ? (
              <div className="mt-3 grid gap-2">
                {addressResults.map((result) => (
                  <button key={`${result.lat}-${result.lon}-${result.display_name}`} type="button" onClick={() => applyAddress(result)} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50">
                    {result.display_name}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

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
              <select value={placeType} onChange={(event) => setPlaceType(event.target.value as (typeof placeTypes)[number]["value"])} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2">
                {placeTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </label>
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
        </section>
      ) : null}

      {step === 1 ? (
        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
            Hier kannst du die Standortdetails nach der Vorbefüllung noch feinjustieren.
          </div>

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
              <span className="text-sm font-medium">Stadt</span>
              <input value={city} onChange={(event) => setCity(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Land</span>
              <input value={country} onChange={(event) => setCountry(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
            </label>
            <div className="sm:col-span-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-zinc-900">Koordinaten</p>
                <button type="button" onClick={() => setShowCoordinates((previous) => !previous)} className="text-xs font-medium text-zinc-700 underline">
                  {showCoordinates ? "Koordinaten ausblenden" : "Koordinaten manuell bearbeiten"}
                </button>
              </div>
              <p className="mt-1 text-xs text-zinc-600">Bei Adressauswahl werden Latitude und Longitude automatisch gesetzt.</p>
              {showCoordinates ? (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Latitude</span>
                    <input type="number" step="any" value={latitude} onChange={(event) => setLatitude(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Longitude</span>
                    <input type="number" step="any" value={longitude} onChange={(event) => setLongitude(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
                  </label>
                </div>
              ) : (
                <p className="mt-2 text-xs text-zinc-600">{latitude && longitude ? `Aktuell: ${Number(latitude).toFixed(5)}, ${Number(longitude).toFixed(5)}` : "Noch keine Koordinaten gesetzt."}</p>
              )}
            </div>
          </section>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Dauercamper-Anteil</span>
            <select value={permanentCamperLevel} onChange={(event) => setPermanentCamperLevel(event.target.value as (typeof permanentCamperLevels)[number]["value"])} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2">
              {permanentCamperLevels.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Stellplatzgefühl</span>
            <select value={pitchStyle} onChange={(event) => setPitchStyle(event.target.value as (typeof pitchStyles)[number]["value"])} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2">
              {pitchStyles.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium">Abendregeln / Nachtruhe</span>
            <select value={eveningRule} onChange={(event) => setEveningRule(event.target.value as (typeof eveningRules)[number]["value"])} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2">
              {eveningRules.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Preis ab</span>
            <input type="number" min={0} step="0.01" value={priceFrom} onChange={(event) => setPriceFrom(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Währung</span>
            <input value={currency} onChange={(event) => setCurrency(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">Wähle die Ausstattung aus, die den Platz am besten beschreibt. Mehrfachauswahl ist möglich.</div>
          <div className="flex flex-wrap gap-2">
            {initialFeatures.map((feature) => {
              const active = selectedFeatureIds.includes(feature.id);
              return (
                <button key={feature.id} type="button" onClick={() => toggleFeature(feature.id)} className={`rounded-full px-4 py-2 text-sm ${active ? "bg-zinc-900 text-white" : "border border-zinc-300 bg-white text-zinc-700"}`}>
                  {getFeatureLabel(feature.name)}
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      {step === 4 ? (
        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">Subjektive Einschätzung für deinen persönlichen Eindruck. Optional, aber direkt speicherbar.</div>
          <div className="grid gap-3 lg:grid-cols-2">
            {vibeFields.map((field) => (
              <SliderField key={field.key} label={field.label} value={vibeScores[field.key]} onChange={(value) => setVibeScores((current) => ({ ...current, [field.key]: value }))} />
            ))}
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Vibe-Notiz</span>
            <textarea rows={3} value={vibeNote} onChange={(event) => setVibeNote(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
        </section>
      ) : null}

      {step === 5 ? (
        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">Wie gut ist die Umgebung rund um den Platz? Diese Bewertung ist ebenfalls optional.</div>
          <div className="grid gap-3 lg:grid-cols-2">
            {environmentFields.map((field) => (
              <SliderField key={field.key} label={field.label} value={environmentScores[field.key]} onChange={(value) => setEnvironmentScores((current) => ({ ...current, [field.key]: value }))} />
            ))}
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Umgebungs-Notiz</span>
            <textarea rows={3} value={environmentNote} onChange={(event) => setEnvironmentNote(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
        </section>
      ) : null}

      {step === 6 ? (
        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">Lade optional schon erste Platzfotos hoch. Falls du noch keine Fotos hast, kannst du den Platz trotzdem sofort speichern.</div>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Fotos auswählen</span>
            <input name="photos" type="file" multiple accept="image/*" onChange={(event) => setSelectedPhotoNames(Array.from(event.target.files ?? []).map((file) => file.name))} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 file:mr-3 file:rounded-full file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Bildunterschrift (optional, für die ausgewählten Fotos)</span>
            <input value={photoCaption} onChange={(event) => setPhotoCaption(event.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2" />
          </label>
          {selectedPhotoNames.length > 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
              <p className="font-medium text-zinc-900">Ausgewählte Dateien</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedPhotoNames.map((fileName) => (
                  <span key={fileName} className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">{fileName}</span>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {state.message ? <p className={`rounded-2xl px-4 py-3 text-sm ${state.success ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900"}`}>{state.message}{state.placeId ? ` (ID: ${state.placeId})` : ""}</p> : null}

      {state.success && state.placeId ? (
        <div className="flex flex-wrap gap-2">
          <Link href={`/places/${state.placeId}`} className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">Zum neuen Platz</Link>
          <Link href="/my-places" className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700">Zu Meine Plätze</Link>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setStep((prev) => Math.max(prev - 1, 0))} disabled={!canGoBack || pending} className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 disabled:opacity-50">Zurück</button>
        <button type="button" onClick={() => setStep((prev) => Math.min(prev + 1, steps.length - 1))} disabled={!canGoForward || pending} className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 disabled:opacity-50">Weiter</button>
        <button type="submit" disabled={saveDisabled} className="ml-auto rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Speichert..." : "Jetzt speichern"}</button>
      </div>
    </form>
  );
}
