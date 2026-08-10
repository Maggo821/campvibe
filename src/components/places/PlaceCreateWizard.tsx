"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { createPlaceAction, type CreatePlaceState } from "@/app/places/new/actions";

const initialState: CreatePlaceState = {
  success: false,
  message: "",
};

const steps = [
  "Grunddaten",
  "Standort",
  "Platzstil",
  "Ausstattung (vorbereitet)",
  "Vibe (optional)",
  "Umgebung (optional)",
  "Fotos (optional)",
];

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
  { value: "large_parcels", label: "Grosse Parzellen" },
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

export function PlaceCreateWizard() {
  const [step, setStep] = useState(0);
  const [state, action, pending] = useActionState(createPlaceAction, initialState);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [placeType, setPlaceType] = useState<(typeof placeTypes)[number]["value"]>("other");

  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [permanentCamperLevel, setPermanentCamperLevel] = useState<(typeof permanentCamperLevels)[number]["value"]>("unknown");
  const [pitchStyle, setPitchStyle] = useState<(typeof pitchStyles)[number]["value"]>("unknown");
  const [eveningRule, setEveningRule] = useState<(typeof eveningRules)[number]["value"]>("unknown");
  const [priceFrom, setPriceFrom] = useState("");
  const [currency, setCurrency] = useState("EUR");

  const [addressQuery, setAddressQuery] = useState("");
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [addressResults, setAddressResults] = useState<NominatimResult[]>([]);
  const [showCoordinates, setShowCoordinates] = useState(false);

  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

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
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

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
    const streetValue = [road, houseNumber].filter(Boolean).join(" ").trim();

    setStreet(streetValue);
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
    const detectedWebsite = tags.website || tags["contact:website"] || tags.url;
    const detectedPhone = tags.phone || tags["contact:phone"];
    const detectedEmail = tags.email || tags["contact:email"];

    if (!website.trim() && detectedWebsite) {
      setWebsite(detectedWebsite);
    }
    if (!phone.trim() && detectedPhone) {
      setPhone(detectedPhone);
    }
    if (!email.trim() && detectedEmail) {
      setEmail(detectedEmail);
    }

    setAddressResults([]);
    setAddressError(null);
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
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium">Beschreibung</span>
            <textarea
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Stadt</span>
            <input
              name="city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Land</span>
            <input
              name="country"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium">Platztyp</span>
            <select
              value={placeType}
              onChange={(event) => setPlaceType(event.target.value as (typeof placeTypes)[number]["value"])}
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2"
            >
              {placeTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Website</span>
            <input
              type="url"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Telefon</span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium">E-Mail</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2"
            />
          </label>
        </section>
      ) : null}

      {step === 1 ? (
        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-sm font-medium text-zinc-900">Adresse suchen</p>
            <p className="mt-1 text-xs text-zinc-600">
              Gib einen Ortsnamen oder eine Adresse ein. Die Felder werden automatisch befuellt.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                value={addressQuery}
                onChange={(event) => setAddressQuery(event.target.value)}
                placeholder="z. B. Campingpark Muenchen oder Hauptstrasse 12, Hamburg"
                className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2"
              />
              <button
                type="button"
                onClick={searchAddress}
                disabled={addressLoading}
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {addressLoading ? "Suche..." : "Adresse finden"}
              </button>
            </div>

            {addressError ? <p className="mt-2 text-xs text-rose-700">{addressError}</p> : null}

            {addressResults.length > 0 ? (
              <div className="mt-3 grid gap-2">
                {addressResults.map((result) => (
                  <button
                    key={`${result.lat}-${result.lon}-${result.display_name}`}
                    type="button"
                    onClick={() => applyAddress(result)}
                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
                  >
                    {result.display_name}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <section className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium">Straße</span>
            <input
              value={street}
              onChange={(event) => setStreet(event.target.value)}
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">PLZ</span>
            <input
              value={postalCode}
              onChange={(event) => setPostalCode(event.target.value)}
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Bundesland/Region</span>
            <input
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Stadt</span>
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Land</span>
            <input
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2"
            />
          </label>

            <div className="sm:col-span-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-zinc-900">Koordinaten</p>
                <button
                  type="button"
                  onClick={() => setShowCoordinates((previous) => !previous)}
                  className="text-xs font-medium text-zinc-700 underline"
                >
                  {showCoordinates ? "Koordinaten ausblenden" : "Koordinaten manuell bearbeiten"}
                </button>
              </div>
              <p className="mt-1 text-xs text-zinc-600">
                Bei einer Adressauswahl werden Latitude/Longitude automatisch gesetzt.
              </p>

              {showCoordinates ? (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Latitude (-90 bis 90)</span>
                    <input
                      type="number"
                      step="any"
                      value={latitude}
                      onChange={(event) => setLatitude(event.target.value)}
                      className="rounded-2xl border border-zinc-200 bg-white px-3 py-2"
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Longitude (-180 bis 180)</span>
                    <input
                      type="number"
                      step="any"
                      value={longitude}
                      onChange={(event) => setLongitude(event.target.value)}
                      className="rounded-2xl border border-zinc-200 bg-white px-3 py-2"
                    />
                  </label>
                </div>
              ) : (
                <p className="mt-2 text-xs text-zinc-600">
                    {latitude && longitude
                      ? `Aktuell: ${Number(latitude).toFixed(5)}, ${Number(longitude).toFixed(5)}`
                      : "Noch keine Koordinaten gesetzt."}
                  </p>
              )}
            </div>
          </section>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Dauercamper-Anteil</span>
            <select
              value={permanentCamperLevel}
              onChange={(event) => setPermanentCamperLevel(event.target.value as (typeof permanentCamperLevels)[number]["value"])}
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2"
            >
              {permanentCamperLevels.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Stellplatzgefühl</span>
            <select
              value={pitchStyle}
              onChange={(event) => setPitchStyle(event.target.value as (typeof pitchStyles)[number]["value"])}
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2"
            >
              {pitchStyles.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium">Abendregeln / Nachtruhe</span>
            <select
              value={eveningRule}
              onChange={(event) => setEveningRule(event.target.value as (typeof eveningRules)[number]["value"])}
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2"
            >
              {eveningRules.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Preis ab</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={priceFrom}
              onChange={(event) => setPriceFrom(event.target.value)}
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Währung</span>
            <input
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2"
            />
          </label>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">
          Ausstattung folgt als eigener, gefuehrter Schritt mit Feature-Chips (Restaurant, Pool, Strand, WLAN usw.).
          Du kannst jetzt schon speichern, damit die Grunddaten gesichert sind.
        </section>
      ) : null}

      {step === 4 ? (
        <section className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">
          Hier folgen im naechsten Schritt die persoenlichen Vibe-Bewertungen (1-10) inklusive Atmosphaere,
          Vanlife-Vibe und Publikumsgefuehl.
        </section>
      ) : null}

      {step === 5 ? (
        <section className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">
          Hier folgen Umgebungs-Bewertungen und Nearby-Orte. Die Distanz-Logik (auf dem Platz, fusslaeufig,
          Umgebung) wird in diesem Schritt abgebildet.
        </section>
      ) : null}

      {step === 6 ? (
        <section className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">
          Fotos folgen als eigener Schritt mit Supabase Storage Upload fuer Platz- und Besuchsfotos.
        </section>
      ) : null}

      {state.message ? (
        <p className={`rounded-2xl px-4 py-3 text-sm ${state.success ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900"}`}>
          {state.message}
          {state.placeId ? ` (ID: ${state.placeId})` : ""}
        </p>
      ) : null}

      {state.success && state.placeId ? (
        <div className="flex flex-wrap gap-2">
          <Link href={`/places/${state.placeId}`} className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
            Zum neuen Platz
          </Link>
          <Link href="/my-places" className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700">
            Zu Meine Plaetze
          </Link>
        </div>
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
          disabled={saveDisabled}
          className="ml-auto rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Speichert..." : "Jetzt speichern"}
        </button>
      </div>
    </form>
  );
}
