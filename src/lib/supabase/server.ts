import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

/**
 * Server-side Supabase client bound to the request cookies. Create one per
 * request (server components, server actions, route handlers).
 * Returns null when Supabase is not configured (demo mode).
 */
export async function createClient() {
  if (!isSupabaseConfigured()) return null;
  const cookieStore = await cookies();
  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a server component: cookies are read-only there.
          // The middleware refreshes the session, so this is safe to ignore.
        }
      },
    },
  });
}

export type ServerClient = NonNullable<Awaited<ReturnType<typeof createClient>>>;

/** Current authenticated user, or null (also null in demo mode). */
export async function getCurrentUser() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

/** Current user's profile with teams, or null. */
export async function getCurrentProfile() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return null;
  const [{ data: profile }, { data: teams }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("team_members").select("team").eq("profile_id", user.id),
  ]);
  if (!profile) return null;
  return { ...profile, teams: (teams ?? []).map((t) => t.team) };
}

export type CurrentProfile = NonNullable<Awaited<ReturnType<typeof getCurrentProfile>>>;
