"use client";

import { User } from "../store/useAuthStore";

interface HomeDashboardProps {
  user: User | null;
  onCreateClick: () => void;
  onNavigate: (tab: string) => void;
}

export default function HomeDashboard({
  user,
  onCreateClick,
  onNavigate,
}: HomeDashboardProps) {
  const stats = [
    {
      title: "Active Assignments",
      value: "8",
      change: "+2 this week",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Student Groups",
      value: "4",
      change: "128 students",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Generated Papers",
      value: "32",
      change: "100% correct",
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      title: "AI Hours Saved",
      value: "14.5 hrs",
      change: "Top 5% teacher",
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
  ];

  const activities = [
    {
      text: "Physics Midterm Assignment successfully generated",
      time: "2 hours ago",
      type: "success",
    },
    {
      text: "Grade 10-B Mathematics group added",
      time: "1 day ago",
      type: "info",
    },
    {
      text: "Chemistry Quiz template saved to library",
      time: "2 days ago",
      type: "library",
    },
    {
      text: "New rubric created for English Essay",
      time: "3 days ago",
      type: "rubric",
    },
  ];

  return (
    <div className="flex-1 flex flex-col w-full py-2 overflow-y-auto px-1 max-h-[calc(100vh-220px)] md:max-h-[calc(100vh-200px)] custom-scrollbar select-none">
      <div className="bg-linear-to-r from-[#121212] via-[#1E1F22] to-[#2B2D31] rounded-[1.75rem] p-6 text-white mb-6 relative shadow-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF4F17] rounded-full blur-[100px] opacity-15 pointer-events-none" />
        <div className="max-w-xl z-10 relative">
          <h2 className="font-sans text-xl sm:text-2xl font-black tracking-tight text-white mb-1">
            Good day, {user?.name || "Teacher"}!
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm font-medium leading-relaxed">
            Welcome back to Veda AI. You have generated 32 high-quality question
            papers and saved approximately 14.5 hours of manual planning this
            term.
          </p>
          <div className="flex gap-3 mt-4">
            <button
              onClick={onCreateClick}
              className="bg-[#FF4F17] hover:bg-[#e03d09] text-white text-xs font-bold py-2 px-4 rounded-full transition-all shadow-sm cursor-pointer"
            >
              + Create Assignment
            </button>
            <button
              onClick={() => onNavigate("AI Teacher's Toolkit")}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 px-4 rounded-full transition-all cursor-pointer"
            >
              Explore Toolkit
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-2 hover:shadow-md transition-shadow"
          >
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
              {stat.title}
            </p>
            <h3 className="text-2xl font-black text-[#121212] font-mono leading-none">
              {stat.value}
            </h3>
            <span
              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${stat.color}`}
            >
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4">
          <div>
            <h3 className="font-sans text-base font-bold text-[#121212]">
              Recent Activities
            </h3>
            <p className="text-gray-400 text-xs mt-0.5">
              Logs and actions in your classes
            </p>
          </div>

          <div className="divide-y divide-gray-50">
            {activities.map((act, idx) => (
              <div
                key={idx}
                className="py-3 flex items-center justify-between gap-3 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#FF4F17]" />
                  <p className="text-gray-700 font-medium">{act.text}</p>
                </div>
                <span className="text-gray-400 text-xs shrink-0 font-mono">
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-linear-to-br from-[#FF4F17]/5 to-[#FF4F17]/10 rounded-3xl border border-[#FF4F17]/10 p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-wider text-[#FF4F17] uppercase bg-white px-2.5 py-1 rounded-full shadow-sm">
              AI Teaching Tip
            </span>
            <h4 className="font-bold text-[#121212] text-sm pt-2">
              Generate rubrics dynamically!
            </h4>
            <p className="text-gray-600 text-xs leading-relaxed">
              When creating a quiz or long assignment, use the Rubrics Generator
              inside the Toolkit to immediately outline marking schemes that you
              can print alongside your question paper.
            </p>
          </div>
          <button
            onClick={() => onNavigate("AI Teacher's Toolkit")}
            className="text-xs font-bold text-[#FF4F17] hover:underline text-left mt-4 cursor-pointer"
          >
            Go to Toolkit →
          </button>
        </div>
      </div>
    </div>
  );
}
