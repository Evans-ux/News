/**import { type EmailOtpType } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  console.log("Confirm Route Hit:", { token_hash, type, next })

  if (token_hash && type) {
    const supabase = await createClient()

    // Verify the OTP via a secure server request
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    if (!error) {
      console.log("Verification successful, redirecting to:", next)
      // Successfully authenticated!
      // Redirect back to the homepage (or whatever `next` is)
      return NextResponse.redirect(new URL(next, request.url))
    } else {
      console.error("Verification error:", error)
    }
  }

  console.warn("Verification failed, redirecting to login")
  // Token expired or invalid. Let's redirect them back to the login page safely.
  return NextResponse.redirect(new URL('/auth/login?error=Invalid_Token', request.url))
}*/
