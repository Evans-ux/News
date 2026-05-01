

"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { verifyOtpAction, resendOtpAction } from '@/components/components/actions/AuthActions';

const OTPInput = ({ value, onChange, length = 8 }: { value: string, onChange: (val: string) => void, length?: number }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isNaN(Number(val))) return;

    const newValue = value.split('');
    newValue[index] = val.substring(val.length - 1);
    const updatedValue = newValue.join('');
    onChange(updatedValue);

    // Filter next sibling
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;
    onChange(pastedData);
  };

  return (
    <div className="flex gap-1.5 justify-center" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className=" w-10 h-14 text-center text-xl font-bold bg-background border-7 border-muted rounded-xl focus:border-red-600 focus:outline-none transition-all duration-200"
        />
      ))}
    </div>
  );
};

const ConfirmEmailContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || "";
  
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length !== 8) {
      toast.error("Please enter the full 8-digit code");
      return;
    }

    setIsVerifying(true);
    try {
      const result = await verifyOtpAction(email, otp);
      if (result.success) {
        toast.success("Email verified successfully!");
        router.push("/");
        router.refresh();
      } else {
        toast.error(result.message || "Invalid or expired code");
      }
    } catch (error) {
      toast.error("Failed to verify code. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setIsResending(true);
    try {
      const result = await resendOtpAction(email);
      if (result.success) {
        toast.success("A new code has been sent to your email");
        setCountdown(60);
      } else {
        toast.error(result.message || "Failed to resend code");
      }
    } catch (error) {
      toast.error("Error resending code");
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
      return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
              <h1 className="text-2xl font-bold mb-4 text-red-600">No Email Provided</h1>
              <p className="max-w-xs text-muted-foreground mb-8">We couldn't find the email associated with this verification.</p>
              <Link href="/auth/login" className="flex items-center gap-2 text-red-600 font-semibold hover:underline">
                  <ArrowLeft className="h-4 w-4" /> Go back to login
              </Link>
          </div>
      )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card text-card-foreground rounded-2xl shadow-xl border border-border/60 p-8 space-y-8 text-center">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex justify-center mb-4">
              <div className="bg-red-50 p-4 rounded-full">
                <Mail className="h-10 w-10 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Check your inbox
            </h1>
            <p className="text-muted-foreground text-sm">
              We've sent an 8-digit verification code to <br />
              <span className="font-bold text-foreground">{email}</span>
            </p>
          </div>

          {/* OTP Input Section */}
          <div className="space-y-6">
            <OTPInput value={otp} onChange={setOtp} />
            
            <button
              onClick={handleVerify}
              disabled={isVerifying || otp.length !== 8}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-red-600/20 hover:shadow-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wide flex items-center justify-center"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                </>
              ) : "Verify Email"}
            </button>
          </div>

          {/* Footer Info */}
          <div className="pt-4 space-y-4">
            <p className="text-xs text-muted-foreground">
              Didn't receive the email?{" "}
              <button 
                onClick={handleResend}
                disabled={isResending || countdown > 0}
                className="text-red-600 font-bold hover:underline disabled:opacity-50 disabled:no-underline"
              >
                {isResending ? "Resending..." : countdown > 0 ? `Resend in ${countdown}s` : "Click to resend"}
              </button>
            </p>
            <div className="pt-4 border-t">
              <Link href="/auth/login" className="text-xs flex items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-3 w-3" /> Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-red-600" /></div>}>
      <ConfirmEmailContent />
    </Suspense>
  );
}
