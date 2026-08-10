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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
