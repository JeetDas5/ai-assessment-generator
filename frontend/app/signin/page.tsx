"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast, Toaster } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";
import { EyeOff, Eye } from "lucide-react";

const signinFormSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SigninFormValues = z.infer<typeof signinFormSchema>;

export default function Signin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const { signin, isAuthenticated, isLoading, error, clearError, initialize } =
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
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SigninFormValues) => {
    clearError();
    const success = await signin(values.email, values.password);
    if (success) {
      toast.success("Successfully signed in!");
      router.push("/");
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
      <Toaster position="bottom-right" richColors duration={3000} />

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
              Create <span className="text-[#FF4F17]">Assignments</span> with AI
              in seconds.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              Harness the power of tailored LLMs to auto-generate question
              papers, rubrics, and structured grading keys effortlessly.
            </p>
          </div>

          <div className="text-gray-500 text-sm z-10">&copy; 2026 VedaAI.</div>
        </div>

        <div className="md:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h3 className="font-mono text-3xl font-bold text-[#121212] tracking-tight mb-2">
              Welcome Back
            </h3>
            <p className="text-gray-500">
              Sign in to your teacher account to manage assessments.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                className={`w-full px-4 py-3.5 rounded-xl border bg-gray-50/50 text-[#121212] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4F17]/20 focus:border-[#FF4F17] transition-all ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                    : "border-gray-200"
                }`}
              />
              {errors.email && (
                <p className="mt-2 text-xs font-medium text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[#121212]"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full pl-4 pr-12 py-3.5 rounded-xl border bg-gray-50/50 text-[#121212] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4F17]/20 focus:border-[#FF4F17] transition-all ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                      : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#121212] focus:outline-none cursor-pointer flex items-center justify-center"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-xs font-medium text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#121212] hover:bg-black text-white font-semibold py-4 px-6 rounded-full border-2 border-transparent hover:border-[#FF4F17] transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#FF4F17] hover:underline"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
