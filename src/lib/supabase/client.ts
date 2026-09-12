"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

/** Browser Supabase client (singleton). Null in demo mode. */
export function getBrowserClient() {
  if (!isSupabaseConfigured()) return null;
  if (!client) client = createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  return client;
}
