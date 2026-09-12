import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Landing point of every Supabase auth link (email confirmation, password
 * recovery, magic link). Exchanges the code for a session cookie, then sends
 * the member to `next` (same-site paths only).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/boutique/compte";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/boutique/compte";

  const supabase = await createClient();
  if (!supabase) return NextResponse.redirect(`${origin}/boutique`);

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "signup" | "recovery" | "email" | "magiclink" | "email_change",
    });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/boutique/connexion?erreur=lien`);
}
