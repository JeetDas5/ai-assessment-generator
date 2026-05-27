"use client";

import Image from "next/image";
import { User } from "../store/useAuthStore";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onCreateClick: () => void;
  user: User | null;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onCreateClick,
  user
}: SidebarProps) {
  return (
    <aside className="hidden md:flex w-72 bg-white rounded-[2.5rem] shadow-sm p-6 flex-col justify-between border border-gray-100/50 select-none shrink-0">
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

        {/* Create Assignment Button */}
        <button
          onClick={onCreateClick}
          className="w-full bg-[#1A1A1A] hover:bg-black text-white font-semibold py-2 px-4 rounded-full border-[2.5px] border-[#FF4F17] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <Image
            src="/icons/sparkle.svg"
            width={20}
            height={20}
            alt="stars"
          />
          Create Assignment
        </button>

        {/* Main Navigation Links */}
        <nav className="space-y-1">
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
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-4 px-5 py-2.5 rounded-2xl font-semibold text-base transition-all duration-200 cursor-pointer ${
                activeTab === item.name
                  ? "bg-[#F0F1F3] text-[#121212]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-[#121212]"
              }`}
            >
              <Image
                src={item.icon}
                width={20}
                height={20}
                alt={item.name}
                className={`w-5 h-5 transition-all ${
                  activeTab === item.name ? "brightness-0 opacity-100" : "opacity-60"
                }`}
              />
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-4 pt-6 border-t border-gray-100">
        {/* Settings button */}
        <button
          onClick={() => alert("Settings interface coming soon!")}
          className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl font-semibold text-gray-500 hover:bg-gray-50 hover:text-[#121212] transition-all duration-200 cursor-pointer"
        >
          <Image
            src="/icons/setting.svg"
            width={20}
            height={20}
            alt="Settings"
            className="w-5 h-5 opacity-60 hover:opacity-100 transition-all"
          />
          Settings
        </button>

        {/* School Profile Details Card */}
        <div className="bg-[#F0F1F3] rounded-[1.75rem] p-4 flex items-center gap-3.5 border border-gray-200/20">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm overflow-hidden flex items-center justify-center border border-gray-100 shrink-0">
            <span className="font-mono text-sm font-extrabold text-[#121212]">
              {user?.schoolName
                ? user.schoolName
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 3)
                    .toUpperCase()
                : "SCH"}
            </span>
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-[#121212] text-sm truncate leading-tight">
              {user?.schoolName || "My School"}
            </p>
            <p className="text-gray-400 text-xs truncate mt-0.5 leading-none">
              {user?.schoolAddress || "Configure Profile"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
