"use client";

import { useState } from "react";
import { User } from "../store/useAuthStore";
import { toast } from "sonner";

interface SettingsViewProps {
  user: User | null;
}

export default function SettingsView({ user }: SettingsViewProps) {
  const [difficulty, setDifficulty] = useState("Medium");
  const [fastMode, setFastMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="flex-1 flex flex-col w-full py-2 overflow-y-auto px-1 max-h-[calc(100vh-220px)] md:max-h-[calc(100vh-200px)] custom-scrollbar select-none">
      <div className="mb-6">
        <h2 className="font-sans text-lg font-bold text-[#121212]">Settings</h2>
        <p className="text-gray-400 text-xs mt-0.5">
          Configure your school profile, grading preferences, and AI parameters
        </p>
      </div>

      <div className="space-y-6 max-w-2xl bg-gray-50/40 rounded-3xl border border-gray-100 p-5 md:p-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#121212] uppercase tracking-wider border-b border-gray-100/60 pb-2">
            School Profile Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-500">
                School Name
              </label>
              <input
                type="text"
                disabled
                value={user?.schoolName || "Delhi Public School"}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 text-xs focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-500">
                School Address
              </label>
              <input
                type="text"
                disabled
                value={user?.schoolAddress || "Bokaro Steel City"}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-[#121212] uppercase tracking-wider border-b border-gray-100/60 pb-2">
            AI Generation Defaults
          </h3>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-500">
              Default Assessment Difficulty
            </label>
            <div className="flex gap-2">
              {["Easy", "Medium", "Hard"].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setDifficulty(lvl)}
                  className={`text-xs font-bold py-2 px-4 rounded-xl border transition-all cursor-pointer ${
                    difficulty === lvl
                      ? "bg-[#FF4F17] text-white border-transparent"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between gap-4 text-xs font-semibold text-gray-700">
              <div>
                <p className="text-sm text-[#121212] font-bold">
                  Fast Generation Mode
                </p>
                <p className="text-gray-400 font-medium">
                  Prioritize completion speed over exhaustive detailed answers.
                </p>
              </div>
              <input
                type="checkbox"
                checked={fastMode}
                onChange={() => setFastMode(!fastMode)}
                className="w-4 h-4 text-[#FF4F17] border-gray-300 rounded focus:ring-[#FF4F17] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between gap-4 text-xs font-semibold text-gray-700 pt-2">
              <div>
                <p className="text-sm text-[#121212] font-bold">
                  Email Notifications
                </p>
                <p className="text-gray-400 font-medium">
                  Receive an email summary as soon as an AI paper completes
                  processing.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                className="w-4 h-4 text-[#FF4F17] border-gray-300 rounded focus:ring-[#FF4F17] cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100/50">
          <button
            type="button"
            onClick={handleSaveSettings}
            className="bg-[#121212] hover:bg-black text-white text-xs font-bold py-2.5 px-6 rounded-full transition-all cursor-pointer shadow-sm"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
