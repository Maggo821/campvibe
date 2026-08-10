export type PlaceType =
  | "camping"
  | "motorhome_pitch"
  | "vanlife_camp"
  | "nature_camp"
  | "farm"
  | "winery"
  | "glamping"
  | "marina"
  | "beach_camp"
  | "festival_camp"
  | "other";

export type PermanentCamperLevel =
  | "none"
  | "low"
  | "medium"
  | "high"
  | "very_high"
  | "unknown";

export type PitchStyle =
  | "open_field"
  | "natural"
  | "large_parcels"
  | "standard_parcels"
  | "hedges"
  | "tight_rows"
  | "permanent_camper_style"
  | "unknown";

export type EveningRules = "relaxed" | "normal" | "strict" | "very_strict" | "unknown";

export interface PlaceSummary {
  id: string;
  name: string;
  description: string;
  placeType: PlaceType;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  priceFrom?: number;
  currency?: string;
  permanentCamperLevel?: PermanentCamperLevel;
  pitchStyle?: PitchStyle;
  eveningRules?: EveningRules;
  tags: string[];
  status?: "favorite" | "visited" | "wishlist" | "planned" | "never_again";
}
