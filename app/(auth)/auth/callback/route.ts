import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  // "next" lets you pass a post-login redirect destination, e.g. /dashboard
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Redirect to the intended destination (defaults to home)
      return NextResponse.redirect(`${origin}${next}`)
    }

    console.error("exchangeCodeForSession error:", error.message)
  }

  // Something went wrong — send the user to an error page or back to login
  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`)
}
