export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      features: {
        Row: {
          id: string;
          name: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      places: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          place_type: string;
          street: string | null;
          postal_code: string | null;
          city: string | null;
          state: string | null;
          country: string | null;
          latitude: number | null;
          longitude: number | null;
          website: string | null;
          phone: string | null;
          email: string | null;
          price_from: number | null;
          currency: string | null;
          checkin_time: string | null;
          checkout_time: string | null;
          quiet_hours_from: string | null;
          quiet_hours_to: string | null;
          permanent_camper_level: string | null;
          pitch_style: string | null;
          evening_rules: string | null;
          created_by: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          place_type: string;
          street?: string | null;
          postal_code?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          website?: string | null;
          phone?: string | null;
          email?: string | null;
          price_from?: number | null;
          currency?: string | null;
          checkin_time?: string | null;
          checkout_time?: string | null;
          quiet_hours_from?: string | null;
          quiet_hours_to?: string | null;
          permanent_camper_level?: string | null;
          pitch_style?: string | null;
          evening_rules?: string | null;
          created_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          place_type?: string;
          street?: string | null;
          postal_code?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          website?: string | null;
          phone?: string | null;
          email?: string | null;
          price_from?: number | null;
          currency?: string | null;
          checkin_time?: string | null;
          checkout_time?: string | null;
          quiet_hours_from?: string | null;
          quiet_hours_to?: string | null;
          permanent_camper_level?: string | null;
          pitch_style?: string | null;
          evening_rules?: string | null;
          created_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      place_environment_ratings: {
        Row: {
          id: string;
          user_id: string;
          place_id: string;
          overall_environment: number | null;
          evening_activity: number | null;
          restaurants: number | null;
          bars: number | null;
          shopping: number | null;
          nature: number | null;
          excursions: number | null;
          cycling: number | null;
          hiking: number | null;
          water_sports: number | null;
          town_accessibility: number | null;
          note: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          place_id: string;
          overall_environment?: number | null;
          evening_activity?: number | null;
          restaurants?: number | null;
          bars?: number | null;
          shopping?: number | null;
          nature?: number | null;
          excursions?: number | null;
          cycling?: number | null;
          hiking?: number | null;
          water_sports?: number | null;
          town_accessibility?: number | null;
          note?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          place_id?: string;
          overall_environment?: number | null;
          evening_activity?: number | null;
          restaurants?: number | null;
          bars?: number | null;
          shopping?: number | null;
          nature?: number | null;
          excursions?: number | null;
          cycling?: number | null;
          hiking?: number | null;
          water_sports?: number | null;
          town_accessibility?: number | null;
          note?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      place_features: {
        Row: {
          id: string;
          place_id: string;
          feature_id: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          place_id: string;
          feature_id: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          place_id?: string;
          feature_id?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      place_photos: {
        Row: {
          id: string;
          place_id: string;
          user_id: string;
          storage_path: string;
          caption: string | null;
          sort_order: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          place_id: string;
          user_id: string;
          storage_path: string;
          caption?: string | null;
          sort_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          place_id?: string;
          user_id?: string;
          storage_path?: string;
          caption?: string | null;
          sort_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      place_vibe_ratings: {
        Row: {
          id: string;
          user_id: string;
          place_id: string;
          overall: number | null;
          vanlife: number | null;
          nature: number | null;
          nightlife: number | null;
          beach_bar: number | null;
          international: number | null;
          modern: number | null;
          open_space: number | null;
          privacy: number | null;
          gastronomy: number | null;
          surroundings: number | null;
          value_for_money: number | null;
          atmosphere_score: number | null;
          camping_style_score: number | null;
          audience_vibe_score: number | null;
          note: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          place_id: string;
          overall?: number | null;
          vanlife?: number | null;
          nature?: number | null;
          nightlife?: number | null;
          beach_bar?: number | null;
          international?: number | null;
          modern?: number | null;
          open_space?: number | null;
          privacy?: number | null;
          gastronomy?: number | null;
          surroundings?: number | null;
          value_for_money?: number | null;
          atmosphere_score?: number | null;
          camping_style_score?: number | null;
          audience_vibe_score?: number | null;
          note?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          place_id?: string;
          overall?: number | null;
          vanlife?: number | null;
          nature?: number | null;
          nightlife?: number | null;
          beach_bar?: number | null;
          international?: number | null;
          modern?: number | null;
          open_space?: number | null;
          privacy?: number | null;
          gastronomy?: number | null;
          surroundings?: number | null;
          value_for_money?: number | null;
          atmosphere_score?: number | null;
          camping_style_score?: number | null;
          audience_vibe_score?: number | null;
          note?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      nearby_places: {
        Row: {
          id: string;
          name: string;
          category: string;
          description: string | null;
          street: string | null;
          postal_code: string | null;
          city: string | null;
          country: string | null;
          latitude: number | null;
          longitude: number | null;
          website: string | null;
          maps_url: string | null;
          phone: string | null;
          opening_hours_text: string | null;
          created_by: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          description?: string | null;
          street?: string | null;
          postal_code?: string | null;
          city?: string | null;
          country?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          website?: string | null;
          maps_url?: string | null;
          phone?: string | null;
          opening_hours_text?: string | null;
          created_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          description?: string | null;
          street?: string | null;
          postal_code?: string | null;
          city?: string | null;
          country?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          website?: string | null;
          maps_url?: string | null;
          phone?: string | null;
          opening_hours_text?: string | null;
          created_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      place_nearby_places: {
        Row: {
          id: string;
          place_id: string;
          nearby_place_id: string;
          distance_meters: number | null;
          walking_minutes: number | null;
          driving_minutes: number | null;
          user_note: string | null;
          rating: number | null;
          favorite: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          place_id: string;
          nearby_place_id: string;
          distance_meters?: number | null;
          walking_minutes?: number | null;
          driving_minutes?: number | null;
          user_note?: string | null;
          rating?: number | null;
          favorite?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          place_id?: string;
          nearby_place_id?: string;
          distance_meters?: number | null;
          walking_minutes?: number | null;
          driving_minutes?: number | null;
          user_note?: string | null;
          rating?: number | null;
          favorite?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          username: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      visits: {
        Row: {
          id: string;
          user_id: string;
          place_id: string;
          group_id: string | null;
          arrival_date: string;
          departure_date: string | null;
          pitch_number: string | null;
          price_per_night: number | null;
          total_price: number | null;
          currency: string | null;
          persons: number | null;
          vehicle: string | null;
          note: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          place_id: string;
          group_id?: string | null;
          arrival_date: string;
          departure_date?: string | null;
          pitch_number?: string | null;
          price_per_night?: number | null;
          total_price?: number | null;
          currency?: string | null;
          persons?: number | null;
          vehicle?: string | null;
          note?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          place_id?: string;
          group_id?: string | null;
          arrival_date?: string;
          departure_date?: string | null;
          pitch_number?: string | null;
          price_per_night?: number | null;
          total_price?: number | null;
          currency?: string | null;
          persons?: number | null;
          vehicle?: string | null;
          note?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      user_place_status: {
        Row: {
          id: string;
          user_id: string;
          place_id: string;
          visited: boolean | null;
          favorite: boolean | null;
          wishlist: boolean | null;
          planned: boolean | null;
          never_again: boolean | null;
          personal_note: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          place_id: string;
          visited?: boolean | null;
          favorite?: boolean | null;
          wishlist?: boolean | null;
          planned?: boolean | null;
          never_again?: boolean | null;
          personal_note?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          place_id?: string;
          visited?: boolean | null;
          favorite?: boolean | null;
          wishlist?: boolean | null;
          planned?: boolean | null;
          never_again?: boolean | null;
          personal_note?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
