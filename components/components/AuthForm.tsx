"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {useForm} from "react-hook-form"
import { toast } from "sonner";
import *  as  z  from  "zod"
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import createUser from "./actions/CreateUserAction";
import LoginUser from "./actions/LoginUserAction";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email dont be stupid "),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
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
  const router = useRouter();

  const { register, reset, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    resolver: zodResolver(isLogin ? loginSchema : signupSchema)
  });

  const onSubmit = async (data: AuthFormData) =>{
    
    if(isLogin){
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
      } catch (err) {
        toast.error("An unexpected error occurred", { position: "top-center" });
      }
    }
    else{

      try {

        const  {email,  password, name} =  data

        const  userData = {
          email:email,
          password:password,
          name:name!
        }

        const  user   =  await createUser(userData)
   
      if (user?.success === true) {
        toast.success(
          "Account created successfully!",
          { position: "top-center" }
        );
        reset();
        router.push(`/auth/confirm-email?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(user.message || user?.error || "Something went wrong", {
          position: "top-center",
        });
      }
    } catch (err) {
      toast.error("Network error. Please try again.", {
        position: "top-center",
      });
    } finally {
   
    }

    }
    
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card text-card-foreground rounded-2xl shadow-xl border border-border/60 overflow-hidden">
          {/* Header Tabs */}
          <div className="flex border-b border-border">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                reset();
              }}
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
              onClick={() => {
                setIsLogin(false);
                reset();
              }}
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
                {isLogin
                  ? "Enter your credentials to continue"
                  : "Fill in the details to get started"}
              </p>
            </div>

            {/* Name — only for Sign Up */}
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                 {...register("name")}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all duration-200 text-sm"
                />
              {errors.name && (
                <span className=""> {errors.name.message}</span>
              ) }
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all duration-200 text-sm"
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">
                Password
              </label>
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
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password — only for Sign Up */}
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">
                  Confirm Password
                </label>
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
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 font-medium mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-red-600/20 hover:shadow-red-600/30 disabled:opacity-60 disabled:cursor-not-allowed text-sm uppercase tracking-wide"
            >
              {isSubmitting
                ? "Processing..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </button>

            {/* Footer */}
            <p className="text-center text-xs text-muted-foreground pt-2">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  reset();
                }}
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
