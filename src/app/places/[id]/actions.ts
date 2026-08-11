"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const STATUS_FIELDS = ["visited", "favorite", "wishlist", "planned", "never_again"] as const;

type StatusField = (typeof STATUS_FIELDS)[number];

function nullableText(value: FormDataEntryValue | null) {
  if (!value) {
    return null;
  }

  const text = value.toString().trim();
  return text.length > 0 ? text : null;
}

export async function updateUserPlaceStatusAction(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const placeId = nullableText(formData.get("place_id"));
  const statusField = nullableText(formData.get("status_field")) as StatusField | null;
  const nextValue = formData.get("next_value") === "true";

  if (!placeId || !statusField || !STATUS_FIELDS.includes(statusField)) {
    return;
  }

  const basePayload = {
    user_id: user.id,
    place_id: placeId,
  };

  const { data: current } = await supabase
    .from("user_place_status")
    .select("visited, favorite, wishlist, planned, never_again, personal_note")
    .eq("user_id", user.id)
    .eq("place_id", placeId)
    .maybeSingle();

  const payload = {
    ...basePayload,
    visited: current?.visited ?? false,
    favorite: current?.favorite ?? false,
    wishlist: current?.wishlist ?? false,
    planned: current?.planned ?? false,
    never_again: current?.never_again ?? false,
    personal_note: current?.personal_note ?? null,
    [statusField]: nextValue,
  };

  await supabase.from("user_place_status").upsert(payload, {
    onConflict: "user_id,place_id",
  });

  revalidatePath(`/places/${placeId}`);
  revalidatePath(`/places/${placeId}?tab=overview`);
  revalidatePath("/my-places");
  revalidatePath("/my-places/visited");
  revalidatePath("/my-places/favorites");
  revalidatePath("/my-places/wishlist");
  revalidatePath("/my-places/planned");
  revalidatePath("/my-places/never-again");
  revalidatePath("/map");
}
