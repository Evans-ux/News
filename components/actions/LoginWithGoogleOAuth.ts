"use server"
import { createClient } from "@/lib/supabase/server"

const LoginWithGoogleOAuth = async () => {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
    },
  })

  if (error) {
    console.error(error)
    return { error: error.message, success: false, url: null }
  }

  return { error: null, success: true, url: data.url }
}

export default LoginWithGoogleOAuth
