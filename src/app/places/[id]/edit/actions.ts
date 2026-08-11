"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

const VIBE_FIELDS = [
  "overall",
  "vanlife",
  "nature",
  "nightlife",
  "beach_bar",
  "international",
  "modern",
  "open_space",
  "privacy",
  "gastronomy",
  "surroundings",
  "value_for_money",
  "atmosphere_score",
  "camping_style_score",
  "audience_vibe_score",
] as const;

const ENVIRONMENT_FIELDS = [
  "overall_environment",
  "evening_activity",
  "restaurants",
  "bars",
  "shopping",
  "nature",
  "excursions",
  "cycling",
  "hiking",
  "water_sports",
  "town_accessibility",
] as const;

export interface UpdatePlaceState {
  success: boolean;
  message: string;
}

export interface DeletePlaceState {
  success: boolean;
  message: string;
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

function parseOptionalRating(value: FormDataEntryValue | null) {
  const parsed = parseNumber(value);
  if (parsed === null) {
    return null;
  }

  if (Number.isNaN(parsed) || parsed < 1 || parsed > 10) {
    return Number.NaN;
  }

  return Math.round(parsed);
}

function parseEnum<T extends readonly string[]>(value: FormDataEntryValue | null, allowed: T, fallback: T[number]) {
  const text = nullableText(value);
  if (!text) {
    return fallback;
  }

  return allowed.includes(text) ? (text as T[number]) : fallback;
}

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export async function updatePlaceAction(
  _previousState: UpdatePlaceState,
  formData: FormData,
): Promise<UpdatePlaceState> {
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
      message: "Bitte zuerst anmelden, um einen Platz zu bearbeiten.",
    };
  }

  const placeId = nullableText(formData.get("place_id"));
  if (!placeId) {
    return { success: false, message: "Ungültige Platz-ID." };
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
    return { success: false, message: "Preis ab muss >= 0 sein." };
  }

  const placeType = parseEnum(formData.get("place_type"), PLACE_TYPES, "other");
  const permanentCamperLevel = parseEnum(
    formData.get("permanent_camper_level"),
    PERMANENT_CAMPER_LEVELS,
    "unknown",
  );
  const pitchStyle = parseEnum(formData.get("pitch_style"), PITCH_STYLES, "unknown");
  const eveningRules = parseEnum(formData.get("evening_rules"), EVENING_RULES, "unknown");

  const vibePayload = Object.fromEntries(
    VIBE_FIELDS.map((field) => [field, parseOptionalRating(formData.get(field))]),
  ) as Record<(typeof VIBE_FIELDS)[number], number | null>;

  const invalidVibeField = VIBE_FIELDS.find((field) => Number.isNaN(vibePayload[field] as number));
  if (invalidVibeField) {
    return {
      success: false,
      message: `Vibe-Wert für ${invalidVibeField} muss zwischen 1 und 10 liegen.`,
    };
  }

  const environmentPayload = Object.fromEntries(
    ENVIRONMENT_FIELDS.map((field) => [field, parseOptionalRating(formData.get(field))]),
  ) as Record<(typeof ENVIRONMENT_FIELDS)[number], number | null>;

  const invalidEnvironmentField = ENVIRONMENT_FIELDS.find((field) => Number.isNaN(environmentPayload[field] as number));
  if (invalidEnvironmentField) {
    return {
      success: false,
      message: `Umgebungswert für ${invalidEnvironmentField} muss zwischen 1 und 10 liegen.`,
    };
  }

  const { data: ownedPlace } = await supabase
    .from("places")
    .select("id")
    .eq("id", placeId)
    .eq("created_by", user.id)
    .maybeSingle();

  if (!ownedPlace) {
    return {
      success: false,
      message: "Du kannst nur Plätze bearbeiten, die du selbst angelegt hast.",
    };
  }

  const selectedFeatureIds = formData
    .getAll("feature_ids")
    .map((value) => value.toString())
    .filter(Boolean);
  const deletePhotoIds = formData
    .getAll("delete_photo_ids")
    .map((value) => value.toString())
    .filter(Boolean);
  const uploadedFiles = formData
    .getAll("photos")
    .filter((value): value is File => value instanceof File && value.size > 0);
  const photoCaption = nullableText(formData.get("photo_caption"));

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
  };

  const { error: updateError } = await supabase
    .from("places")
    .update(payload)
    .eq("id", placeId)
    .eq("created_by", user.id);

  if (updateError) {
    return {
      success: false,
      message: `Speichern fehlgeschlagen: ${updateError.message}`,
    };
  }

  const followUpErrors: string[] = [];

  const { error: deleteFeaturesError } = await supabase
    .from("place_features")
    .delete()
    .eq("place_id", placeId);

  if (deleteFeaturesError) {
    followUpErrors.push(`Ausstattung konnte nicht aktualisiert werden: ${deleteFeaturesError.message}`);
  } else if (selectedFeatureIds.length > 0) {
    const { error: insertFeaturesError } = await supabase.from("place_features").insert(
      selectedFeatureIds.map((featureId) => ({
        place_id: placeId,
        feature_id: featureId,
      })),
    );

    if (insertFeaturesError) {
      followUpErrors.push(`Ausstattung konnte nicht gespeichert werden: ${insertFeaturesError.message}`);
    }
  }

  const vibeNote = nullableText(formData.get("vibe_note"));
  const hasAnyVibeValue = VIBE_FIELDS.some((field) => vibePayload[field] !== null) || vibeNote;
  if (hasAnyVibeValue) {
    const { error: vibeError } = await supabase.from("place_vibe_ratings").upsert(
      {
        user_id: user.id,
        place_id: placeId,
        ...vibePayload,
        note: vibeNote,
      },
      { onConflict: "user_id,place_id" },
    );

    if (vibeError) {
      followUpErrors.push(`Vibe-Bewertung nicht gespeichert: ${vibeError.message}`);
    }
  } else {
    await supabase
      .from("place_vibe_ratings")
      .delete()
      .eq("user_id", user.id)
      .eq("place_id", placeId);
  }

  const environmentNote = nullableText(formData.get("environment_note"));
  const hasAnyEnvironmentValue = ENVIRONMENT_FIELDS.some((field) => environmentPayload[field] !== null) || environmentNote;
  if (hasAnyEnvironmentValue) {
    const { error: environmentError } = await supabase.from("place_environment_ratings").upsert(
      {
        user_id: user.id,
        place_id: placeId,
        ...environmentPayload,
        note: environmentNote,
      },
      { onConflict: "user_id,place_id" },
    );

    if (environmentError) {
      followUpErrors.push(`Umgebungsbewertung nicht gespeichert: ${environmentError.message}`);
    }
  } else {
    await supabase
      .from("place_environment_ratings")
      .delete()
      .eq("user_id", user.id)
      .eq("place_id", placeId);
  }

  if (deletePhotoIds.length > 0) {
    const { data: photosToDelete, error: selectPhotoError } = await supabase
      .from("place_photos")
      .select("id, storage_path")
      .eq("place_id", placeId)
      .eq("user_id", user.id)
      .in("id", deletePhotoIds);

    if (selectPhotoError) {
      followUpErrors.push(`Fotos konnten nicht geladen werden: ${selectPhotoError.message}`);
    } else {
      const storagePaths = (photosToDelete ?? []).map((photo) => photo.storage_path);
      if (storagePaths.length > 0) {
        const { error: removeStorageError } = await supabase.storage
          .from("place-photos")
          .remove(storagePaths);

        if (removeStorageError) {
          followUpErrors.push(`Fotos im Storage konnten nicht geloescht werden: ${removeStorageError.message}`);
        }
      }

      const { error: deletePhotoRowsError } = await supabase
        .from("place_photos")
        .delete()
        .eq("place_id", placeId)
        .eq("user_id", user.id)
        .in("id", deletePhotoIds);

      if (deletePhotoRowsError) {
        followUpErrors.push(`Foto-Metadaten konnten nicht geloescht werden: ${deletePhotoRowsError.message}`);
      }
    }
  }

  if (uploadedFiles.length > 0) {
    const { data: existingPhotos } = await supabase
      .from("place_photos")
      .select("id")
      .eq("place_id", placeId)
      .eq("user_id", user.id);

    const baseSortOrder = existingPhotos?.length ?? 0;

    for (const [index, file] of uploadedFiles.entries()) {
      const extension = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : "";
      const baseName = sanitizeFileName(file.name.replace(extension, ""));
      const storagePath = `${user.id}/${placeId}/${Date.now()}-${index}-${baseName}${extension.toLowerCase()}`;

      const { error: uploadError } = await supabase.storage
        .from("place-photos")
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || undefined,
        });

      if (uploadError) {
        followUpErrors.push(`Foto ${file.name} nicht hochgeladen: ${uploadError.message}`);
        continue;
      }

      const { error: photoError } = await supabase.from("place_photos").insert({
        place_id: placeId,
        user_id: user.id,
        storage_path: storagePath,
        caption: photoCaption ?? file.name,
        sort_order: baseSortOrder + index,
      });

      if (photoError) {
        followUpErrors.push(`Foto-Metadaten fuer ${file.name} nicht gespeichert: ${photoError.message}`);
      }
    }
  }

  revalidatePath(`/places/${placeId}`);
  revalidatePath(`/places/${placeId}?tab=overview`);
  revalidatePath(`/places/${placeId}/edit`);
  revalidatePath("/");
  revalidatePath("/my-places");
  revalidatePath("/my-places/visited");
  revalidatePath("/discover");
  revalidatePath("/map");

  return {
    success: true,
    message: followUpErrors.join(" | ") || "Platz erfolgreich aktualisiert.",
  };
}

export async function deletePlaceAction(
  _previousState: DeletePlaceState,
  formData: FormData,
): Promise<DeletePlaceState> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return {
      success: false,
      message: "Supabase ist noch nicht konfiguriert (.env.local fehlt oder unvollstaendig).",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Bitte zuerst anmelden, um einen Platz zu loeschen.",
    };
  }

  const placeId = nullableText(formData.get("place_id"));
  if (!placeId) {
    return { success: false, message: "Ungueltige Platz-ID." };
  }

  const { data: ownedPlace } = await supabase
    .from("places")
    .select("id")
    .eq("id", placeId)
    .eq("created_by", user.id)
    .maybeSingle();

  if (!ownedPlace) {
    return {
      success: false,
      message: "Du kannst nur Plaetze loeschen, die du selbst angelegt hast.",
    };
  }

  const { data: ownPhotos } = await supabase
    .from("place_photos")
    .select("storage_path")
    .eq("place_id", placeId)
    .eq("user_id", user.id);

  const ownStoragePaths = (ownPhotos ?? []).map((photo) => photo.storage_path);
  if (ownStoragePaths.length > 0) {
    await supabase.storage.from("place-photos").remove(ownStoragePaths);
  }

  const { error: deleteError } = await supabase
    .from("places")
    .delete()
    .eq("id", placeId)
    .eq("created_by", user.id);

  if (deleteError) {
    return {
      success: false,
      message: `Loeschen fehlgeschlagen: ${deleteError.message}`,
    };
  }

  revalidatePath("/");
  revalidatePath("/my-places");
  revalidatePath("/my-places/visited");
  revalidatePath("/discover");
  revalidatePath("/map");

  redirect("/my-places");
}
