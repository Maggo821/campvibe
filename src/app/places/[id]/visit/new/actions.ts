"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface CreateVisitState {
  success: boolean;
  message: string;
  visitId?: string;
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

function parseIntValue(value: FormDataEntryValue | null) {
  const parsed = parseNumber(value);
  if (parsed === null || Number.isNaN(parsed)) {
    return parsed;
  }

  return Math.trunc(parsed);
}

export async function createVisitAction(
  _prevState: CreateVisitState,
  formData: FormData,
): Promise<CreateVisitState> {
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
  const arrivalDate = nullableText(formData.get("arrival_date"));
  const departureDate = nullableText(formData.get("departure_date"));

  if (!placeId) {
    return { success: false, message: "Place-ID fehlt." };
  }

  if (!arrivalDate) {
    return { success: false, message: "Anreise ist erforderlich." };
  }

  if (departureDate && departureDate < arrivalDate) {
    return { success: false, message: "Abreise darf nicht vor Anreise liegen." };
  }

  const pricePerNight = parseNumber(formData.get("price_per_night"));
  if (pricePerNight !== null && (Number.isNaN(pricePerNight) || pricePerNight < 0)) {
    return { success: false, message: "Preis pro Nacht muss >= 0 sein." };
  }

  const totalPrice = parseNumber(formData.get("total_price"));
  if (totalPrice !== null && (Number.isNaN(totalPrice) || totalPrice < 0)) {
    return { success: false, message: "Gesamtpreis muss >= 0 sein." };
  }

  const persons = parseIntValue(formData.get("persons"));
  if (persons !== null && (Number.isNaN(persons) || persons < 1)) {
    return { success: false, message: "Personen muss mindestens 1 sein." };
  }

  const { data, error } = await supabase
    .from("visits")
    .insert({
      user_id: user.id,
      place_id: placeId,
      arrival_date: arrivalDate,
      departure_date: departureDate,
      pitch_number: nullableText(formData.get("pitch_number")),
      price_per_night: pricePerNight,
      total_price: totalPrice,
      currency: nullableText(formData.get("currency")) ?? "EUR",
      persons,
      vehicle: nullableText(formData.get("vehicle")),
      note: nullableText(formData.get("note")),
    })
    .select("id")
    .single();

  if (error) {
    return {
      success: false,
      message: `Speichern fehlgeschlagen: ${error.message}`,
    };
  }

  revalidatePath(`/places/${placeId}`);

  return {
    success: true,
    message: "Besuch gespeichert.",
    visitId: data.id,
  };
}
