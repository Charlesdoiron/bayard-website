"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export interface SessionState {
  /** True while the first check runs. */
  loading: boolean;
  /** Supabase is configured (otherwise the boutique runs in demo mode). */
  configured: boolean;
  user: User | null;
}

/** Browser-side session state for components that need to know whether to ask for a login. */
export function useSession(): SessionState {
  const configured = isSupabaseConfigured();
  const [state, setState] = useState<SessionState>({ loading: configured, configured, user: null });

  useEffect(() => {
    const supabase = getBrowserClient();
    if (!supabase) return;
    let cancelled = false;
    supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) setState({ loading: false, configured: true, user: data.user ?? null });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) setState({ loading: false, configured: true, user: session?.user ?? null });
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
