"use client";

import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { mapRegisterToPayload } from "@/application/mapper/mapper";
import publicApiClient from "@/application/repository/publicAxiosInstance";

type Inputs = {
  name: string;
  email: string;
  phoneNumber: string;
  dob: string;
  age: number;
  password: string;
  confirmPassword: string;
};

const RegisterPage = () => {
  const {
    control,
    register,
    handleSubmit,
    
    formState: { errors },
  } = useForm<Inputs>({
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

  const password = useWatch({
    control,
    name: "password",
  });

  const onSubmit: SubmitHandler<Inputs> = async(values: RegisterFormValues) => {
    const payload = mapRegisterToPayload(values);

      try {
        const res = await publicApiClient.post("/api/v1/register/", payload);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };


  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            Create account
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Register
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Fill in your details to create your account.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Name</span>
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="Jane Doe"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="jane@example.com"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Phone number
              </span>
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="+1 555 000 0000"
                type="tel"
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  minLength: {
                    value: 10,
                    message: "Phone number must be at least 10 digits",
                  },
                })}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-600">
                  {errors.phoneNumber.message}
                </p>
              )}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Date of birth
              </span>
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                type="date"
                {...register("dob", {
                  required: "Date of birth is required",
                })}
              />
              {errors.dob && (
                <p className="text-sm text-red-600">{errors.dob.message}</p>
              )}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Age</span>
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="21"
                type="number"
                {...register("age", {
                  required: "Age is required",
                  valueAsNumber: true,
                  min: {
                    value: 13,
                    message: "You must be at least 13 years old",
                  },
                })}
              />
              {errors.age && (
                <p className="text-sm text-red-600">{errors.age.message}</p>
              )}
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Password
              </span>
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="Enter your password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Confirm password
              </span>
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="Re-enter your password"
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </label>
          </div>
              
          <button
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            type="submit"
          >
            Create account
          </button>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;
