"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const PLACE_TYPES = [
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
] as const;

const PERMANENT_CAMPER_LEVELS = ["none", "low", "medium", "high", "very_high", "unknown"] as const;
const PITCH_STYLES = [
  "open_field",
  "natural",
  "large_parcels",
  "standard_parcels",
  "hedges",
  "tight_rows",
  "permanent_camper_style",
  "unknown",
] as const;
const EVENING_RULES = ["relaxed", "normal", "strict", "very_strict", "unknown"] as const;

export interface CreatePlaceState {
  success: boolean;
  message: string;
  placeId?: string;
}

function nullableText(value: FormDataEntryValue | null) {
  if (!value) {
    return null;
  }

  const text = value.toString().trim();
  return text.length > 0 ? text : null;
}

function parseNumber(value: FormDataEntryValue | null) {
  const text = nullableText(value);
  if (!text) {
    return null;
  }

  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function parseEnum<T extends readonly string[]>(value: FormDataEntryValue | null, allowed: T, fallback: T[number]) {
  const text = nullableText(value);
  if (!text) {
    return fallback;
  }

  return allowed.includes(text) ? (text as T[number]) : fallback;
}

export async function createPlaceAction(
  _previousState: CreatePlaceState,
  formData: FormData,
): Promise<CreatePlaceState> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return {
      success: false,
      message: "Supabase ist noch nicht konfiguriert (.env.local fehlt oder unvollständig).",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Bitte zuerst anmelden, um einen Platz zu speichern.",
    };
  }

  const name = nullableText(formData.get("name"));
  if (!name) {
    return { success: false, message: "Name ist erforderlich." };
  }

  const latitude = parseNumber(formData.get("latitude"));
  if (latitude !== null && (Number.isNaN(latitude) || latitude < -90 || latitude > 90)) {
    return { success: false, message: "Latitude muss zwischen -90 und 90 liegen." };
  }

  const longitude = parseNumber(formData.get("longitude"));
  if (longitude !== null && (Number.isNaN(longitude) || longitude < -180 || longitude > 180)) {
    return { success: false, message: "Longitude muss zwischen -180 und 180 liegen." };
  }

  const priceFrom = parseNumber(formData.get("price_from"));
  if (priceFrom !== null && (Number.isNaN(priceFrom) || priceFrom < 0)) {
    return { success: false, message: "price_from muss >= 0 sein." };
  }

  const placeType = parseEnum(formData.get("place_type"), PLACE_TYPES, "other");
  const permanentCamperLevel = parseEnum(
    formData.get("permanent_camper_level"),
    PERMANENT_CAMPER_LEVELS,
    "unknown",
  );
  const pitchStyle = parseEnum(formData.get("pitch_style"), PITCH_STYLES, "unknown");
  const eveningRules = parseEnum(formData.get("evening_rules"), EVENING_RULES, "unknown");

  const payload = {
    name,
    description: nullableText(formData.get("description")),
    place_type: placeType,
    street: nullableText(formData.get("street")),
    postal_code: nullableText(formData.get("postal_code")),
    city: nullableText(formData.get("city")),
    state: nullableText(formData.get("state")),
    country: nullableText(formData.get("country")),
    latitude,
    longitude,
    website: nullableText(formData.get("website")),
    phone: nullableText(formData.get("phone")),
    email: nullableText(formData.get("email")),
    price_from: priceFrom,
    currency: nullableText(formData.get("currency")) ?? "EUR",
    checkin_time: nullableText(formData.get("checkin_time")),
    checkout_time: nullableText(formData.get("checkout_time")),
    quiet_hours_from: nullableText(formData.get("quiet_hours_from")),
    quiet_hours_to: nullableText(formData.get("quiet_hours_to")),
    permanent_camper_level: permanentCamperLevel,
    pitch_style: pitchStyle,
    evening_rules: eveningRules,
    created_by: user.id,
  };

  const { data, error } = await supabase
    .from("places")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return {
      success: false,
      message: `Speichern fehlgeschlagen: ${error.message}`,
    };
  }

  revalidatePath("/");
  revalidatePath("/my-places");

  return {
    success: true,
    message: "Platz erfolgreich gespeichert.",
    placeId: data.id,
  };
}
