"use client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/** Lazy-constructed browser client. Calling at module-load time would crash
 *  the prerender pass when NEXT_PUBLIC_SUPABASE_URL/_ANON_KEY aren't inlined
 *  yet (e.g. PR previews missing env vars); deferring to first use lets the
 *  build succeed and surfaces a clear error only when a user actually tries
 *  to upload. */
export function supabaseBrowser(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Supabase browser env vars missing — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }
  cached = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
