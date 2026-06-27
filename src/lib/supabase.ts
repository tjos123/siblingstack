// src/lib/supabase.ts
//
// Two clients:
//   supabase    — browser client, uses the anon key. Subject to RLS.
//                 Use this everywhere in React components and hooks.
//   serverSupabase() — server client, uses the service-role key.
//                 Bypasses RLS entirely. Only for API routes that need
//                 elevated access (Stripe webhook, caregiver invite).
//                 Never import this in client components.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser/client-side singleton
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side factory (new instance per request so sessions don't bleed)
export function serverSupabase() {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Cookie-based server client for auth callbacks (OAuth flows).
// Uses @supabase/ssr to read/write the auth session cookie on the server.
import type { CookieOptions } from "@supabase/ssr";
import { createServerClient } from "@supabase/ssr";

export function createServerSupabaseClient(cookieStore: {
  get(name: string): { value: string } | undefined;
  set(name: string, value: string, options: any): void;
}) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set(name, value, options);
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set(name, "", { ...options, maxAge: 0 });
      },
    },
  });
}
