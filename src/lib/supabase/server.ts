import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";
import { getSupabaseEnv } from "@/lib/supabase/env";

export async function getSupabaseServerClient() {
  const env = getSupabaseEnv();
  if (!env) {
    return null;
  }

  try {
    const cookieStore = await cookies();

    return createServerClient<Database>(env.url, env.anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const cookie of cookiesToSet) {
              cookieStore.set(cookie.name, cookie.value, cookie.options);
            }
          } catch {
            // Ignore cookie write errors during server component rendering.
          }
        },
      },
    });
  } catch {
    return null;
  }
}
