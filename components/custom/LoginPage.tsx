"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Inputs = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    const result = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    console.log("signIn result", result);

    if (result?.error) {
      setError("root", { message: "Invalid username or password" });
      return;
    }

    const session = await getSession();
    console.log("session after login", session);

    router.push("/dashboard");
    reset();
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            Welcome back
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Login</h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in with your username and password.
          </p>
        </div>

        <form
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {errors.root && (
            <div className="rounded-xl bg-red-50 p-4 border border-red-200 text-center">
              <p className="text-sm font-medium text-red-600">{errors.root.message}</p>
            </div>
          )}
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Username</span>
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
              placeholder="jane@example.com"
              type="name"
              {...register("username", {
                required: "Username is required",
              })}
            />
            {errors.username && (
              <p className="text-sm text-red-600">{errors.username.message}</p>
            )}
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Password</span>
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
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </label>

          <button
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            type="submit"
          >
            Sign in
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
