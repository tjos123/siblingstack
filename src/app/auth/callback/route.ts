import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerSupabaseClient, serverSupabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerSupabaseClient(cookieStore);
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const admin = serverSupabase();
      const { error: insertErr } = await admin
        .from("users")
        .upsert(
          { id: data.user.id, email: data.user.email ?? "", premium_status: "free" },
          { onConflict: "id", ignoreDuplicates: true }
        );
      if (insertErr) {
        console.error("Failed to ensure user profile:", insertErr.message);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/sign-in?error=auth_failed`);
}
