"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast, Toaster } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";

const schoolFormSchema = z.object({
  schoolName: z
    .string()
    .min(2, "School name must be at least 2 characters long"),
  schoolAddress: z.string().optional(),
});

type SchoolFormValues = z.infer<typeof schoolFormSchema>;

export default function School() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    clearError,
    updateSchoolInfo,
    initialize,
  } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const token = localStorage.getItem("veda_auth_token");
    if (!token && !isAuthenticated) {
      router.push("/signin");
      return;
    }

    if (user && user.schoolName) {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      schoolName: "",
      schoolAddress: "",
    },
  });

  const onSubmit = async (values: SchoolFormValues) => {
    clearError();
    const success = await updateSchoolInfo(
      values.schoolName,
      values.schoolAddress || "",
    );
    if (success) {
      toast.success("School profile configured successfully!");
      router.push("/");
    } else {
      toast.error(error || "Failed to update profile. Please try again.");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  return (
    <div className="min-h-screen bg-[#F0F1F3] flex items-center justify-center p-4 sm:p-6 font-sans">
      <Toaster position="bottom-right" richColors duration={3000} />

      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-8 sm:p-10 border border-gray-100/50 flex flex-col justify-center">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 relative overflow-hidden mb-3">
            <Image
              src="/logo.svg"
              alt="Veda AI Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h2 className="font-mono text-3xl font-extrabold text-[#121212] tracking-tight">
            VedaAI
          </h2>
          <p className="text-gray-500 text-sm mt-1 text-center">
            Configure your institution profile to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="schoolName"
              className="block text-sm font-semibold text-[#121212] mb-2"
            >
              School / Institution Name
            </label>
            <input
              id="schoolName"
              type="text"
              placeholder="e.g. Delhi Public School"
              {...register("schoolName")}
              className={`w-full px-4 py-3 rounded-xl border bg-gray-50/50 text-[#121212] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4F17]/20 focus:border-[#FF4F17] transition-all ${
                errors.schoolName
                  ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                  : "border-gray-200"
              }`}
            />
            {errors.schoolName && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.schoolName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="schoolAddress"
              className="block text-sm font-semibold text-[#121212] mb-2"
            >
              Institution Address{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              id="schoolAddress"
              type="text"
              placeholder="e.g. Bokaro Steel City"
              {...register("schoolAddress")}
              className={`w-full px-4 py-3 rounded-xl border bg-gray-50/50 text-[#121212] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4F17]/20 focus:border-[#FF4F17] transition-all ${
                errors.schoolAddress
                  ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                  : "border-gray-200"
              }`}
            />
            {errors.schoolAddress && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.schoolAddress.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#121212] hover:bg-black text-white font-semibold py-4 px-6 rounded-full border-2 border-transparent hover:border-[#FF4F17] transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-6"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Complete Setup"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
