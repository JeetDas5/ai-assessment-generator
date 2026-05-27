"use client";

import Image from "next/image";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";

// Modular Components
import Sidebar from "../components/Sidebar";
import AssignmentWizard from "../components/AssignmentWizard";
import AssignmentsList from "../components/AssignmentsList";

export default function Home() {
  const router = useRouter();
  const { user, logout, isAuthenticated, initialize } = useAuthStore();
  const [activeTab, setActiveTab] = useState("Assignments");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Assignment List & Fetching States
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isFetchingAssignments, setIsFetchingAssignments] = useState(false);
  const [showCreateWizard, setShowCreateWizard] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchAssignments = async () => {
    setIsFetchingAssignments(true);
    try {
      const token = useAuthStore.getState().token || localStorage.getItem("veda_auth_token");
      if (!token) return;
      const response = await axios.get(`${API_URL}/assignments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data?.success) {
        setAssignments(response.data.assignments || []);
      }
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    } finally {
      setIsFetchingAssignments(false);
    }
  };

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const token = localStorage.getItem("veda_auth_token");
    if (!token && !isAuthenticated) {
      router.push("/signin");
      return;
    }

    if (isAuthenticated && user && !user.schoolName) {
      toast.error(
        "Please configure your school profile to access the dashboard!",
      );
      router.push("/school");
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAssignments();
    }
  }, [isAuthenticated]);

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

      {/* Sidebar Component */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCreateClick={() => setShowCreateWizard(true)}
        user={user}
      />

      {/* Mobile Top Navbar Header */}
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

          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 rounded-full bg-[#FF4F17]/10 flex items-center justify-center font-mono font-bold text-[#FF4F17] text-sm border-2 border-white shadow-sm overflow-hidden cursor-pointer"
          >
            {user?.name ? user.name[0]?.toUpperCase() : "T"}
          </button>
        </div>
      </header>

      {/* Main Content Workspace Card */}
      <main className="flex-1 bg-white rounded-4xl md:rounded-[2.5rem] shadow-sm flex flex-col overflow-hidden border border-gray-100/50 p-6 md:p-8 justify-between relative min-h-[calc(100vh-140px)] md:min-h-0">
        
        {/* Main Work Area Card Header */}
        <div className="flex items-center justify-between border-b border-gray-50 md:pb-5 md:mb-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => showCreateWizard ? setShowCreateWizard(false) : setActiveTab("Home")}
              className="w-10 h-10 rounded-full border border-gray-200/60 bg-white flex items-center justify-center text-gray-500 hover:text-[#121212] transition-colors cursor-pointer"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <h1 className="font-sans text-xl font-extrabold text-[#121212]">
              {showCreateWizard ? "Assignment" : activeTab}
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-4 relative">
            {!showCreateWizard && (
              <>
                <button 
                  onClick={fetchAssignments}
                  disabled={isFetchingAssignments}
                  title="Refresh Assignments"
                  className="relative w-11 h-11 rounded-full bg-[#F0F1F3] flex items-center justify-center text-gray-700 hover:text-black hover:bg-gray-200/50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <svg className={`w-5 h-5 ${isFetchingAssignments ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18" />
                  </svg>
                </button>

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
              </>
            )}

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

        {/* Main Conditional View Block */}
        {showCreateWizard ? (
          <AssignmentWizard
            onClose={() => setShowCreateWizard(false)}
            onSuccess={() => {
              setShowCreateWizard(false);
              fetchAssignments();
            }}
          />
        ) : assignments.length > 0 ? (
          <AssignmentsList assignments={assignments} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center md:max-w-xl mx-auto text-center py-6">
            <div className="relative mb-8 max-w-[280px] w-full flex justify-center">
              <Image
                src="/icons/illustration.svg"
                alt="No assignments illustration"
                width={220}
                height={220}
                className="object-contain animate-pulse duration-4000"
                priority
              />
            </div>

            <h2 className="font-mono text-3xl md:text-xl font-extrabold text-[#121212] tracking-tight">
              No assignments yet
            </h2>

            <p className="text-gray-500 text-sm md:text-md leading-normal md:leading-relaxed mb-4">
              Create your first assignment to start collecting and grading student
              submissions. You can set up rubrics, define marking criteria, and
              let AI assist with grading.
            </p>

            <button
              onClick={() => setShowCreateWizard(true)}
              className="bg-[#121212] hover:bg-black text-white font-light py-2 px-6 rounded-full border-2 border-transparent hover:border-[#FF4F17] transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
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
        )}
        
        {/* Mobile floating action button */}
        {!showCreateWizard && (
          <button
            onClick={() => setShowCreateWizard(true)}
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
        )}
      </main>

      {/* Mobile Footer Bottom Nav */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-[#121212] p-3 border-t border-white/5 flex items-center justify-around z-20 rounded-t-[1.75rem] shadow-xl select-none">
        {[
          {
            name: "Home",
            icon: "/icons/home.svg",
          },
          {
            name: "My Groups",
            icon: "/icons/grp.svg",
          },
          {
            name: "Assignments",
            icon: "/icons/file-text.svg",
          },
          {
            name: "AI Teacher's Toolkit",
            icon: "/icons/book.svg",
          },
          {
            name: "My Library",
            icon: "/icons/library.svg",
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
            <Image
              src={item.icon}
              width={22}
              height={22}
              alt={item.name}
              className={`w-5.5 h-5.5 transition-all ${
                activeTab.includes(item.name)
                  ? "brightness-0 invert-[41%] sepia-[87%] saturate-[2250%] hue-rotate-[345deg] brightness-[101%] contrast-[101%]"
                  : "opacity-40 invert brightness-0"
              }`}
            />
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
