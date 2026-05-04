"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { registerSchema, RegisterFormValues } from "@/lib/validations/auth.schema";
import { mapRegisterToPayload } from "@/application/mapper/mapper";
import publicApiClient from "@/application/repository/publicAxiosInstance";
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
import { 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Hash, 
  Lock, 
  ShieldPlus,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const RegisterPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setInternalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      dob: "",
      age: undefined,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    setInternalError(null);
    const payload = mapRegisterToPayload(values);

    try {
      await publicApiClient.post("/api/v1/register/", payload);
      router.push("/login");
    } catch (error: any) {
      setInternalError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-50/50 dark:bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-950 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
      
      <Card className="w-full max-w-[650px] shadow-2xl border-slate-200/60 dark:border-slate-800 backdrop-blur-sm bg-white/90 dark:bg-slate-900/90">
        <CardHeader className="space-y-1 pb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-2xl bg-slate-900 dark:bg-slate-100 p-2.5 shadow-lg">
              <ShieldPlus className="h-6 w-6 text-white dark:text-slate-900" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center tracking-tight">Create an account</CardTitle>
          <CardDescription className="text-center text-slate-500 dark:text-slate-400">
            Join us today and start managing your analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 border border-destructive/20 animate-in fade-in zoom-in duration-200">
                <p className="text-xs font-medium text-destructive text-center">
                  {error}
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    className={cn(
                      "pl-10 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800",
                      errors.name && "border-destructive"
                    )}
                    placeholder="John Doe"
                    {...register("name")}
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="text-[12px] font-medium text-destructive ml-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    className={cn(
                      "pl-10 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800",
                      errors.email && "border-destructive"
                    )}
                    placeholder="john@example.com"
                    type="email"
                    {...register("email")}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-[12px] font-medium text-destructive ml-1">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    className={cn(
                      "pl-10 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800",
                      errors.phoneNumber && "border-destructive"
                    )}
                    placeholder="+1 (555) 000-0000"
                    {...register("phoneNumber")}
                    disabled={isLoading}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-[12px] font-medium text-destructive ml-1">{errors.phoneNumber.message}</p>
                )}
              </div>

              {/* DOB */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none ml-1">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    className={cn(
                      "pl-10 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800",
                      errors.dob && "border-destructive"
                    )}
                    type="date"
                    {...register("dob")}
                    disabled={isLoading}
                  />
                </div>
                {errors.dob && (
                  <p className="text-[12px] font-medium text-destructive ml-1">{errors.dob.message}</p>
                )}
              </div>

              {/* Age */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium leading-none ml-1">Age</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    className={cn(
                      "pl-10 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800",
                      errors.age && "border-destructive"
                    )}
                    placeholder="25"
                    type="number"
                    {...register("age", { valueAsNumber: true })}
                    disabled={isLoading}
                  />
                </div>
                {errors.age && (
                  <p className="text-[12px] font-medium text-destructive ml-1">{errors.age.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    className={cn(
                      "pl-10 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800",
                      errors.password && "border-destructive"
                    )}
                    placeholder="••••••••"
                    type="password"
                    {...register("password")}
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <p className="text-[12px] font-medium text-destructive ml-1">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    className={cn(
                      "pl-10 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800",
                      errors.confirmPassword && "border-destructive"
                    )}
                    placeholder="••••••••"
                    type="password"
                    {...register("confirmPassword")}
                    disabled={isLoading}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-[12px] font-medium text-destructive ml-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <Button 
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 transition-all shadow-md group" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t border-slate-100 dark:border-slate-800 mt-4 pt-6 text-center">
          <div className="text-sm text-slate-500">
            Already have an account?{" "}
            <button 
              onClick={() => router.push("/login")}
              className="font-semibold text-slate-900 dark:text-slate-100 hover:underline underline-offset-4"
            >
              Sign in
            </button>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
};

export default RegisterPage;

