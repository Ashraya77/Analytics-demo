"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { loginSchema, LoginFormValues } from "@/lib/validations/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("root", { message: "Invalid credentials. Please try again." });
        return;
      }

      const session = await getSession();
      if (session) {
        router.push("/dashboard/overview");
        reset();
      }
    } catch (error) {
      setError("root", { message: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-zinc-950 text-zinc-200 overflow-hidden">
      {/* Column: Image with Cool Color Effects */}
      <div className="relative hidden w-1/2 lg:flex items-center justify-center overflow-hidden border-r border-white/5 bg-zinc-900">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/loginimage.jpg" 
            alt="Dashboard Preview" 
            className="h-full w-full object-cover opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-zinc-950/40" />
        </div>
        
        {/* Cool Color Effects (Vibrant Glows) */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[150px]" />
          <div className="absolute -bottom-24 -right-24 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px] animate-pulse delay-700" />
        </div>

        {/* Top Left Logo */}
        <div className="absolute top-12 left-12 z-20 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-950 shadow-xl shadow-white/5">
            <BarChart3 className="h-6 w-6" />
          </div>
          <span className="text-lg font-black tracking-tighter text-white uppercase">Acme Analytics</span>
        </div>

        {/* Bottom Left Typography */}
        <div className="absolute bottom-12 left-12 z-20 max-w-lg">
          <h2 className="text-5xl font-black tracking-tighter text-white leading-none mb-4 uppercase">
            Analytics  <br /> 
            <span className="text-indigo-400">Dashboard.</span>
          </h2>
          <p className="text-zinc-400 font-bold uppercase tracking-[0.3em] text-[10px]">
            Dashbaord • Secure Platform • v2.0
          </p>
        </div>
      </div>

      {/* Column: Sign-in Form (Centered) */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 lg:px-12 xl:px-24">
        <div className="w-full max-w-sm pt-40">
          <div className="space-y-2 mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-white">Welcome back</h1>
            <p className="text-zinc-500 text-sm font-medium">
              Enter your credentials to access your workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errors.root && (
              <div className="rounded-xl bg-red-500/10 p-4 border border-red-500/20 animate-in fade-in slide-in-from-top-1 duration-300">
                <p className="text-xs font-bold text-red-400 text-center uppercase tracking-wider">
                  {errors.root.message}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 block w-full ">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                <Input
                  className={cn(
                    "pl-12 h-14 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 transition-all rounded-2xl font-medium",
                    errors.username && "border-red-900 focus:ring-red-900"
                  )}
                  placeholder="name@example.com"
                  {...register("username")}
                  disabled={isLoading}
                />
              </div>
              {errors.username && (
                <p className="text-[11px] font-bold text-red-500/80 text-center uppercase tracking-wide mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 block w-full ">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                <Input
                  className={cn(
                    "pl-12 pr-12 h-14 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 transition-all rounded-2xl font-medium",
                    errors.password && "border-red-900 focus:ring-red-900"
                  )}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] font-bold text-red-500/80 text-center uppercase tracking-wide mt-1">
                  {errors.password.message}
                </p>
              )}
              <div className="flex justify-center pt-1">
                <button 
                  type="button" 
                  className="text-[11px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <Button 
              className="w-full h-14 mt-4 bg-white text-zinc-950 hover:bg-zinc-100 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-white/5 active:scale-[0.98]" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating
                </>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </Button>
          </form>

          <p className="mt-10 text-center text-xs font-bold text-zinc-500 uppercase tracking-widest">
            Don&apos;t have an account?{" "}
            <button 
              onClick={() => router.push("/register")}
              className="text-white hover:underline underline-offset-4"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-12 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-800">
            © 2026 Acme Corp • Secure Terminal
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
