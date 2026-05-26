"use client";

import Image from "next/image";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";

export default function Home() {
  const router = useRouter();
  const { user, logout, isAuthenticated, initialize } = useAuthStore();
  const [activeTab, setActiveTab] = useState("Assignments");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const token = localStorage.getItem("veda_auth_token");
    if (!token && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out!");
    router.push("/signin");
  };

  if (
    !isAuthenticated &&
    typeof window !== "undefined" &&
    !localStorage.getItem("veda_auth_token")
  ) {
    return (
      <div className="min-h-screen bg-[#F0F1F3] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#FF4F17] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-semibold text-sm">
            Loading Veda AI...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F1F3] flex flex-col md:flex-row p-0 md:p-6 gap-6 font-sans relative overflow-x-hidden">
      <Toaster position="bottom-right" richColors />

      <aside className="hidden md:flex w-72 bg-white rounded-[2.5rem] shadow-sm p-8 flex-col justify-between border border-gray-100/50 select-none">
        <div className="space-y-8">
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
            <span className="font-mono text-2xl font-bold tracking-tight text-black select-none">
              VedaAI
            </span>
          </div>

          <button
            onClick={() =>
              toast.info(
                "Create Assignment creation form implementation coming soon!",
              )
            }
            className="w-full bg-[#1A1A1A] hover:bg-black text-white font-semibold py-2 px-6 rounded-full border-[2.5px] border-[#FF4F17] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Assignment
          </button>

          <nav className="space-y-2">
            {[
              {
                name: "Home",
                icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
              },
              {
                name: "My Groups",
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
              },
              {
                name: "Assignments",
                icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
              },
              {
                name: "AI Teacher's Toolkit",
                icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
              },
              {
                name: "My Library",
                icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
              },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold text-base transition-all duration-200 cursor-pointer ${
                  activeTab === item.name
                    ? "bg-[#F0F1F3] text-[#121212]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-[#121212]"
                }`}
              >
                <svg
                  className={`w-5 h-5 ${activeTab === item.name ? "text-[#121212]" : "text-gray-400"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={item.icon}
                  />
                </svg>
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-4 pt-6 border-t border-gray-100">
          {/* Settings Nav Item */}
          <button
            onClick={() => toast.info("Settings interface coming soon!")}
            className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl font-semibold text-gray-500 hover:bg-gray-50 hover:text-[#121212] transition-all duration-200 cursor-pointer"
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Settings
          </button>

          {/* Profile Card */}
          <div className="bg-[#F0F1F3] rounded-[1.75rem] p-4 flex items-center gap-3.5 border border-gray-200/20">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm overflow-hidden flex items-center justify-center border border-gray-100 flex-shrink-0">
              <span className="font-mono font-extrabold text-[#FF4F17] text-lg">
                DPS
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-[#121212] text-sm truncate leading-snug">
                Delhi Public School
              </p>
              <p className="text-gray-500 text-xs font-semibold truncate">
                Bokaro Steel City
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MOBILE HEADER (Floating Logo Bar) */}
      {/* ========================================================================= */}
      <header className="md:hidden bg-white p-4 flex items-center justify-between border-b border-gray-100/50 shadow-sm rounded-b-[1.75rem] select-none z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 relative overflow-hidden">
            <Image
              src="/logo.svg"
              alt="Veda AI Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-mono text-xl font-bold tracking-tight text-[#121212]">
            VedaAI
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Notification bell */}
          <button className="relative w-10 h-10 rounded-full bg-[#F0F1F3] flex items-center justify-center text-gray-700 cursor-pointer">
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#FF4F17] rounded-full border border-white" />
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>

          {/* User Profile Bubble */}
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 rounded-full bg-[#FF4F17]/10 flex items-center justify-center font-mono font-bold text-[#FF4F17] text-sm border-2 border-white shadow-sm overflow-hidden cursor-pointer"
          >
            {user?.name ? user.name[0]?.toUpperCase() : "T"}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN MAIN CONTENT CONTAINER */}
      {/* ========================================================================= */}
      <main className="flex-1 bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm flex flex-col overflow-hidden border border-gray-100/50 p-6 md:p-8 justify-between relative min-h-[calc(100vh-140px)] md:min-h-0">
        {/* Top Actions Row */}
        <div className="flex items-center justify-between border-b border-gray-50 pb-5 mb-6">
          <div className="flex items-center gap-3">
            {/* Back button */}
            <button className="w-10 h-10 rounded-full border border-gray-200/60 bg-white flex items-center justify-center text-gray-500 hover:text-[#121212] transition-colors cursor-pointer">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <h1 className="font-sans text-xl font-extrabold text-[#121212]">
              {activeTab}
            </h1>
          </div>

          {/* Top-Right Notification & Profile Area (Desktop Only) */}
          <div className="hidden md:flex items-center gap-4 relative">
            <button className="relative w-11 h-11 rounded-full bg-[#F0F1F3] flex items-center justify-center text-gray-700 hover:text-black hover:bg-gray-200/50 transition-colors cursor-pointer">
              <span className="absolute top-2.5 right-3.5 w-2 h-2 bg-[#FF4F17] rounded-full border border-white" />
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            {/* Profile Dropdown Header Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 bg-[#F0F1F3] hover:bg-gray-200/60 p-2.5 rounded-full shadow-sm select-none transition-colors duration-200 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#FF4F17] text-white flex items-center justify-center font-mono font-bold text-sm">
                  {user?.name ? user.name[0]?.toUpperCase() : "T"}
                </div>
                <span className="font-bold text-sm text-[#121212] pr-1 truncate max-w-[120px]">
                  {user?.name || "Teacher"}
                </span>
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Profile Dropdown Menu Card */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-xl border border-gray-100 p-3 z-30 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="px-4 py-3 border-b border-gray-50 mb-2">
                    <p className="font-bold text-sm text-[#121212] truncate">
                      {user?.name || "Teacher Profile"}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {user?.email || "teacher@vedaai.com"}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-2xl transition-colors cursor-pointer"
                  >
                    <svg
                      className="w-4.5 h-4.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Profile Dropdown Overlay */}
          {showProfileMenu && (
            <div className="md:hidden absolute right-6 top-16 w-52 bg-white rounded-2xl shadow-lg border border-gray-100 p-2 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3.5 py-2.5 border-b border-gray-50 mb-1.5">
                <p className="font-bold text-xs text-[#121212] truncate">
                  {user?.name}
                </p>
                <p className="text-[10px] text-gray-400 truncate mt-0.5">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Empty State Contents (Centered Canvas) */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto text-center py-6">
          <div className="relative mb-8 max-w-[280px] w-full flex justify-center">
            <Image
              src="/illustration.svg"
              alt="No assignments illustration"
              width={220}
              height={220}
              className="object-contain animate-pulse duration-[4000ms]"
              priority
            />
          </div>

          <h2 className="font-mono text-3xl md:text-4xl font-extrabold text-[#121212] tracking-tight mb-4">
            No assignments yet
          </h2>

          <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-8">
            Create your first assignment to start collecting and grading student
            submissions. You can set up rubrics, define marking criteria, and
            let AI assist with grading.
          </p>

          <button
            onClick={() =>
              toast.info(
                "Assignment Creation Wizard coming in the next release!",
              )
            }
            className="bg-[#121212] hover:bg-black text-white font-semibold py-4 px-8 rounded-full border-2 border-transparent hover:border-[#FF4F17] transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Your First Assignment
          </button>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE FLOATING ACTION BUTTON */}
        {/* ========================================================================= */}
        <button
          onClick={() => toast.info("Add button pressed!")}
          className="md:hidden absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#121212] hover:bg-black text-white flex items-center justify-center shadow-lg border-2 border-[#FF4F17] cursor-pointer active:scale-95 transition-transform"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </main>

      {/* ========================================================================= */}
      {/* MOBILE BOTTOM NAVIGATION BAR */}
      {/* ========================================================================= */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-[#121212] p-3 border-t border-white/5 flex items-center justify-around z-20 rounded-t-[1.75rem] shadow-xl select-none">
        {[
          {
            name: "Home",
            icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
          },
          {
            name: "Assignments",
            icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
          },
          {
            name: "Library",
            icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
          },
          {
            name: "AI Toolkit",
            icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
          },
        ].map((item) => (
          <button
            key={item.name}
            onClick={() => {
              setActiveTab(
                item.name === "AI Toolkit"
                  ? "AI Teacher's Toolkit"
                  : item.name === "Library"
                    ? "My Library"
                    : item.name,
              );
            }}
            className="flex flex-col items-center gap-1.5 py-1 px-3 cursor-pointer"
          >
            <svg
              className={`w-5.5 h-5.5 ${activeTab.includes(item.name) ? "text-[#FF4F17]" : "text-gray-400"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={item.icon}
              />
            </svg>
            <span
              className={`text-[10px] font-bold tracking-wide ${activeTab.includes(item.name) ? "text-[#FF4F17]" : "text-gray-500"}`}
            >
              {item.name}
            </span>
          </button>
        ))}
      </footer>
    </div>
  );
}
