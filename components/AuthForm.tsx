"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import createUser from "./actions/CreateUserAction";
import LoginUser from "./actions/LoginUserAction";
import LoginWithGithubOAuth from "./actions/LoginWithGithubOAuth";
import LoginWithGoogleOAuth from "./actions/LoginWithGoogleOAuth";
import LoginWithFacebookOAuth from "./actions/LoginWithFacebookOAuth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type AuthFormData = {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const router = useRouter();

  const anyOAuthLoading = githubLoading || googleLoading || facebookLoading;

  const handleGithubLogin = async () => {
    setGithubLoading(true);
    try {
      const res = await LoginWithGithubOAuth();
      if (res.success && res.url) {
        window.location.href = res.url;
      } else {
        toast.error(res.error || "GitHub login failed", { position: "top-center" });
        setGithubLoading(false);
      }
    } catch {
      toast.error("An unexpected error occurred", { position: "top-center" });
      setGithubLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const res = await LoginWithGoogleOAuth();
      if (res.success && res.url) {
        window.location.href = res.url;
      } else {
        toast.error(res.error || "Google login failed", { position: "top-center" });
        setGoogleLoading(false);
      }
    } catch {
      toast.error("An unexpected error occurred", { position: "top-center" });
      setGoogleLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setFacebookLoading(true);
    try {
      const res = await LoginWithFacebookOAuth();
      if (res.success && res.url) {
        window.location.href = res.url;
      } else {
        toast.error(res.error || "Facebook login failed", { position: "top-center" });
        setFacebookLoading(false);
      }
    } catch {
      toast.error("An unexpected error occurred", { position: "top-center" });
      setFacebookLoading(false);
    }
  };

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
  });

  const onSubmit = async (data: AuthFormData) => {
    if (isLogin) {
      try {
        const { email, password } = data;
        const res = await LoginUser({ email, password });
        if (res?.success) {
          toast.success("Logged in successfully!", { position: "top-center" });
          router.push("/");
          router.refresh();
        } else {
          toast.error(res?.message || res?.error || "Login failed", { position: "top-center" });
        }
      } catch {
        toast.error("An unexpected error occurred", { position: "top-center" });
      }
    } else {
      try {
        const { email, password, name } = data;
        const user = await createUser({ email, password, name: name! });
        if (user?.success === true) {
          toast.success("Account created successfully!", { position: "top-center" });
          reset();
          router.push(`/auth/confirm-email?email=${encodeURIComponent(email)}`);
        } else {
          toast.error(user.message || user?.error || "Something went wrong", { position: "top-center" });
        }
      } catch {
        toast.error("Network error. Please try again.", { position: "top-center" });
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card text-card-foreground rounded-2xl shadow-xl border border-border/60 overflow-hidden">
          {/* Header Tabs */}
          <div className="flex border-b border-border">
            <button
              type="button"
              onClick={() => { setIsLogin(true); reset(); }}
              className={`flex-1 py-4 text-sm font-bold tracking-wide uppercase transition-all duration-300 ${
                isLogin
                  ? "text-red-600 border-b-[3px] border-red-600 bg-background"
                  : "text-muted-foreground hover:text-foreground bg-muted/30"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); reset(); }}
              className={`flex-1 py-4 text-sm font-bold tracking-wide uppercase transition-all duration-300 ${
                !isLogin
                  ? "text-red-600 border-b-[3px] border-red-600 bg-background"
                  : "text-muted-foreground hover:text-foreground bg-muted/30"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
            <div className="text-center mb-2">
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {isLogin ? "Enter your credentials to continue" : "Fill in the details to get started"}
              </p>
            </div>

            {/* Name — Sign Up only */}
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all duration-200 text-sm"
                />
                {errors.name && <span className="text-xs text-red-500 font-medium">{errors.name.message}</span>}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all duration-200 text-sm"
              />
              {errors.email && <p className="text-xs text-red-500 font-medium mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all duration-200 text-sm pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 font-medium mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password — Sign Up only */}
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all duration-200 text-sm pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 font-medium mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || anyOAuthLoading}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-red-600/20 hover:shadow-red-600/30 disabled:opacity-60 disabled:cursor-not-allowed text-sm uppercase tracking-wide"
            >
              {isSubmitting ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
            </button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-3 gap-3">
              {/* GitHub */}
              <button
                type="button"
                onClick={handleGithubLogin}
                disabled={anyOAuthLoading || isSubmitting}
                className="py-3 bg-background hover:bg-muted border border-border text-foreground font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>{githubLoading ? "..." : "GitHub"}</span>
              </button>

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={anyOAuthLoading || isSubmitting}
                className="py-3 bg-background hover:bg-muted border border-border text-foreground font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>{googleLoading ? "..." : "Google"}</span>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={handleFacebookLogin}
                disabled={anyOAuthLoading || isSubmitting}
                className="py-3 bg-background hover:bg-muted border border-border text-foreground font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4 shrink-0" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>{facebookLoading ? "..." : "Facebook"}</span>
              </button>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-muted-foreground pt-2">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); reset(); }}
                className="text-red-600 font-bold hover:underline"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
