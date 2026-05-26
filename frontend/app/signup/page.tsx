"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast, Toaster } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";

const signupFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

export default function Signup() {
  const router = useRouter();
  const { signup, isAuthenticated, isLoading, error, clearError, initialize } =
    useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    clearError();
    const success = await signup(values.name, values.email, values.password);
    if (success) {
      toast.success("Account created successfully!");
      router.push("/");
    } else {
      toast.error(error || "Registration failed. Please try again.");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-[#F0F1F3] flex items-center justify-center p-4 sm:p-6 font-sans">
      <Toaster position="bottom-right" richColors />

      <div className="max-w-5xl w-full bg-white rounded-4xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100/50">
        <div className="md:w-1/2 bg-[#121212] p-8 sm:p-12 flex flex-col justify-between relative text-white min-h-[350px] md:min-h-[600px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF4F17] rounded-full blur-[100px] opacity-20 pointer-events-none" />

          <div className="flex items-center gap-1 z-10">
            <div className="w-12 h-12 relative translate-y-[8px]">
              <Image
                src="/logo.svg"
                alt="Veda AI Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="font-mono text-2xl font-bold tracking-tight text-white select-none">
              VedaAI
            </span>
          </div>

          <div className="my-auto z-10 py-8">
            <h2 className="font-mono text-4xl sm:text-5xl font-bold leading-tight tracking-tight text-white mb-6">
              Empower your <span className="text-[#FF4F17]">Teaching</span>{" "}
              using AI.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              Sign up today to create bespoke curriculum questions, generate
              formatted assignment PDFs, and streamline assessment feedback.
            </p>
          </div>

          <div className="text-gray-500 text-sm z-10">&copy; 2026 VedaAI.</div>
        </div>

        <div className="md:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white">
          <div className="mb-4">
            <h3 className="font-mono text-3xl font-bold text-[#121212] tracking-tight mb-2">
              Create Account
            </h3>
            <p className="text-gray-500">
              Get started by creating your custom teacher portal profile.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-[#121212] mb-2"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Professor John Doe"
                {...register("name")}
                className={`w-full px-4 py-3 rounded-xl border bg-gray-50/50 text-[#121212] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4F17]/20 focus:border-[#FF4F17] transition-all ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                    : "border-gray-200"
                }`}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#121212] mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="teacher@school.edu"
                {...register("email")}
                className={`w-full px-4 py-3 rounded-xl border bg-gray-50/50 text-[#121212] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4F17]/20 focus:border-[#FF4F17] transition-all ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                    : "border-gray-200"
                }`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#121212] mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={`w-full px-4 py-3 rounded-xl border bg-gray-50/50 text-[#121212] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4F17]/20 focus:border-[#FF4F17] transition-all ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                    : "border-gray-200"
                }`}
              />
              {errors.password && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#121212] hover:bg-black text-white font-semibold py-3.5 px-6 rounded-full border-2 border-transparent hover:border-[#FF4F17] transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-semibold text-[#FF4F17] hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
