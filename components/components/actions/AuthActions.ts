"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function verifyOtpAction(email: string, token: string) {
  const supabase = await createClient();

  console.log("Verifying OTP for:", email, "with token:", token);
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "signup",
  });

  if (error) {
    console.error("OTP Verification Error:", error);
    return { success: false, message: error.message };
  }

  return { success: true };
}

export async function resendOtpAction(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}
