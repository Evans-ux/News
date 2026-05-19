"use server"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"


const LoginWithFacebookOAuth = async () => {
  const supabase = await createClient()

  const headerList = await headers()
  const origin = headerList.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })


  if (error) {
    console.error(error)
    return { error: error.message, success: false, url: null }
  }

  return { error: null, success: true, url: data.url }
}

export default LoginWithFacebookOAuth
