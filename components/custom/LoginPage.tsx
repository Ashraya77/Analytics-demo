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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Lock, User, Eye, EyeOff, ShieldCheck } from "lucide-react";
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
        setError("root", { message: "Invalid username or password" });
        return;
      }

      const session = await getSession();
      if (session) {
        router.push("/dashboard");
        reset();
      }
    } catch (error) {
      setError("root", { message: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-50/50 dark:bg-slate-950 px-4 py-12">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-950 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
      
      <Card className="w-full max-w-[400px] shadow-xl border-slate-200/60 dark:border-slate-800 backdrop-blur-sm bg-white/90 dark:bg-slate-900/90">
        <CardHeader className="space-y-1 pb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-2xl bg-slate-900 dark:bg-slate-100 p-2.5 shadow-lg">
              <ShieldCheck className="h-6 w-6 text-white dark:text-slate-900" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center tracking-tight">Welcome Back</CardTitle>
          <CardDescription className="text-center text-slate-500 dark:text-slate-400">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errors.root && (
              <div className="rounded-lg bg-destructive/10 p-3 border border-destructive/20 animate-in fade-in zoom-in duration-200">
                <p className="text-xs font-medium text-destructive text-center">
                  {errors.root.message}
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  className={cn(
                    "pl-10 h-11 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-slate-950/10 transition-all",
                    errors.username && "border-destructive focus:ring-destructive/10"
                  )}
                  placeholder="name@example.com"
                  {...register("username")}
                  disabled={isLoading}
                />
              </div>
              {errors.username && (
                <p className="text-[12px] font-medium text-destructive ml-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Password
                </label>
                <button 
                  type="button" 
                  className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  className={cn(
                    "pl-10 pr-10 h-11 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-slate-950/10 transition-all",
                    errors.password && "border-destructive focus:ring-destructive/10"
                  )}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[12px] font-medium text-destructive ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button 
              className="w-full h-11 mt-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 transition-all shadow-md" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t border-slate-100 dark:border-slate-800 mt-4 pt-6 text-center">
          <div className="text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <button 
              onClick={() => router.push("/register")}
              className="font-semibold text-slate-900 dark:text-slate-100 hover:underline underline-offset-4"
            >
              Sign up
            </button>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
};

export default LoginPage;

