"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function MyGroups() {
  const [groups, setGroups] = useState([
    {
      id: "1",
      name: "Class 10-A Science",
      students: 32,
      subject: "Physics",
      avgMarks: "84%",
      color: "border-l-teal-500 bg-teal-50/20",
    },
    {
      id: "2",
      name: "Class 12-B Math",
      students: 28,
      subject: "Calculus",
      avgMarks: "79%",
      color: "border-l-indigo-500 bg-indigo-50/20",
    },
    {
      id: "3",
      name: "Class 9-C Chemistry",
      students: 34,
      subject: "Inorganic Chemistry",
      avgMarks: "88%",
      color: "border-l-rose-500 bg-rose-50/20",
    },
    {
      id: "4",
      name: "Grade 11 Special Physics",
      students: 18,
      subject: "Thermodynamics",
      avgMarks: "91%",
      color: "border-l-amber-500 bg-amber-50/20",
    },
  ]);

  const handleCreateGroup = () => {
    toast.success("New group creation modal coming soon!");
  };

  return (
    <div className="flex-1 flex flex-col w-full py-2 overflow-y-auto px-1 max-h-[calc(100vh-220px)] md:max-h-[calc(100vh-200px)] custom-scrollbar select-none">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-sans text-lg font-bold text-[#121212]">
            Student Groups
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">
            Manage classes, cohorts, and student performance metrics
          </p>
        </div>
        <button
          onClick={handleCreateGroup}
          className="bg-[#121212] hover:bg-black text-white text-xs font-bold py-2 px-4 rounded-full transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
        >
          <span className="text-sm font-black">+</span> Create Group
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group) => (
          <div
            key={group.id}
            className={`bg-white rounded-3xl border border-gray-100 p-5 shadow-sm border-l-4 ${group.color} flex flex-col justify-between hover:shadow-md transition-shadow gap-4`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-[#121212] text-base">
                  {group.name}
                </h3>
                <span className="inline-block text-[10px] font-mono font-bold text-gray-500 bg-white px-2 py-0.5 rounded-md border border-gray-100 mt-1">
                  Subject: {group.subject}
                </span>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Group #{group.id}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-gray-100/60 pt-4 text-center">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  Students
                </p>
                <p className="font-bold text-sm text-[#121212] font-mono mt-0.5">
                  {group.students}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  Average Score
                </p>
                <p className="font-bold text-sm text-[#FF4F17] font-mono mt-0.5">
                  {group.avgMarks}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  Status
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />{" "}
                  Active
                </span>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => toast.info(`Viewing roster for ${group.name}`)}
                className="text-xs font-bold text-gray-500 hover:text-[#121212] py-1.5 px-3 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
              >
                View Roster
              </button>
              <button
                onClick={() =>
                  toast.info(`Assignments history for ${group.name}`)
                }
                className="text-xs font-bold text-[#FF4F17] hover:bg-[#FF4F17]/5 py-1.5 px-3 rounded-full transition-all cursor-pointer border border-[#FF4F17]/10"
              >
                Assessments
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
