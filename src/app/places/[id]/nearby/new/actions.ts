"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface CreateNearbyState {
  success: boolean;
  message: string;
  nearbyPlaceId?: string;
}

const ALLOWED_CATEGORIES = [
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
] as const;

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

function parseIntValue(value: FormDataEntryValue | null) {
  const parsed = parseNumber(value);
  if (parsed === null || Number.isNaN(parsed)) {
    return parsed;
  }

  return Math.trunc(parsed);
}

export async function createNearbyPlaceAction(
  _prevState: CreateNearbyState,
  formData: FormData,
): Promise<CreateNearbyState> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return {
      success: false,
      message: "Supabase ist nicht konfiguriert.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Bitte zuerst einloggen.",
    };
  }

  const placeId = nullableText(formData.get("place_id"));
  const name = nullableText(formData.get("name"));
  const category = nullableText(formData.get("category"));

  if (!placeId) {
    return { success: false, message: "Place-ID fehlt." };
  }

  if (!name) {
    return { success: false, message: "Name ist erforderlich." };
  }

  if (!category || !ALLOWED_CATEGORIES.includes(category as (typeof ALLOWED_CATEGORIES)[number])) {
    return { success: false, message: "Ungültige Kategorie." };
  }

  const latitude = parseNumber(formData.get("latitude"));
  if (latitude !== null && (Number.isNaN(latitude) || latitude < -90 || latitude > 90)) {
    return { success: false, message: "Latitude muss zwischen -90 und 90 liegen." };
  }

  const longitude = parseNumber(formData.get("longitude"));
  if (longitude !== null && (Number.isNaN(longitude) || longitude < -180 || longitude > 180)) {
    return { success: false, message: "Longitude muss zwischen -180 und 180 liegen." };
  }

  const distanceMeters = parseIntValue(formData.get("distance_meters"));
  if (distanceMeters !== null && (Number.isNaN(distanceMeters) || distanceMeters < 0)) {
    return { success: false, message: "Distanz muss >= 0 sein." };
  }

  const walkingMinutes = parseIntValue(formData.get("walking_minutes"));
  if (walkingMinutes !== null && (Number.isNaN(walkingMinutes) || walkingMinutes < 0)) {
    return { success: false, message: "Gehzeit muss >= 0 sein." };
  }

  const drivingMinutes = parseIntValue(formData.get("driving_minutes"));
  if (drivingMinutes !== null && (Number.isNaN(drivingMinutes) || drivingMinutes < 0)) {
    return { success: false, message: "Fahrzeit muss >= 0 sein." };
  }

  const rating = parseIntValue(formData.get("rating"));
  if (rating !== null && (Number.isNaN(rating) || rating < 1 || rating > 10)) {
    return { success: false, message: "Bewertung muss zwischen 1 und 10 liegen." };
  }

  const { data: nearbyData, error: nearbyError } = await supabase
    .from("nearby_places")
    .insert({
      name,
      category,
      description: nullableText(formData.get("description")),
      city: nullableText(formData.get("city")),
      country: nullableText(formData.get("country")),
      latitude,
      longitude,
      website: nullableText(formData.get("website")),
      maps_url: nullableText(formData.get("maps_url")),
      phone: nullableText(formData.get("phone")),
      opening_hours_text: nullableText(formData.get("opening_hours_text")),
      created_by: user.id,
    })
    .select("id")
    .single();

  if (nearbyError) {
    return {
      success: false,
      message: `Nearby Place konnte nicht erstellt werden: ${nearbyError.message}`,
    };
  }

  const { error: linkError } = await supabase.from("place_nearby_places").insert({
    place_id: placeId,
    nearby_place_id: nearbyData.id,
    distance_meters: distanceMeters,
    walking_minutes: walkingMinutes,
    driving_minutes: drivingMinutes,
    user_note: nullableText(formData.get("user_note")),
    rating,
    favorite: formData.get("favorite") === "on",
  });

  if (linkError) {
    return {
      success: false,
      message: `Verknüpfung zum Place fehlgeschlagen: ${linkError.message}`,
    };
  }

  revalidatePath(`/places/${placeId}`);

  return {
    success: true,
    message: "Nearby Place erstellt und verknüpft.",
    nearbyPlaceId: nearbyData.id,
  };
}
