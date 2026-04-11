import React from 'react'
import Link from 'next/link'
import { CheckCircle2, Mail } from 'lucide-react'

const ConfirmEmailPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="bg-card text-card-foreground rounded-2xl shadow-xl border border-border/60 p-10 space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-white rounded-full p-6 shadow-sm border border-red-50">
                <Mail className="w-12 h-12 text-red-600" />
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-4 border-white">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="space-y-3">
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Verify your email
            </h1>
            <p className="text-muted-foreground">
              We've sent a confirmation link to your inbox. Please click the link to activate your account.
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-muted/30 rounded-xl p-5 border border-border/50 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Next steps
            </p>
            <ul className="text-sm space-y-2 text-foreground/80">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                Check your spam folder if you don't see it
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                The link expires in 24 hours
              </li>
            </ul>
          </div>

          {/* Action */}
          <div className="pt-4 space-y-4">
            <Link 
              href="/auth/login"
              className="block w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-red-600/20 hover:shadow-red-600/30 text-sm uppercase tracking-wide"
            >
              Back to Login
            </Link>
            <p className="text-xs text-muted-foreground">
              Didn't receive the email? <button className="text-red-600 font-bold hover:underline">Click to resend</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmEmailPage
