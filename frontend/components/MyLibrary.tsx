"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download, Share2 } from "lucide-react";

export default function MyLibrary() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = [
    "All",
    "Question Banks",
    "Rubrics",
    "Lesson Plans",
    "Templates",
  ];

  const files = [
    {
      title: "Grade 10 Physics Question Bank",
      size: "2.4 MB",
      type: "Question Banks",
      date: "May 24, 2026",
      format: "PDF",
    },
    {
      title: "Chemistry Lab Rubric Template",
      size: "1.1 MB",
      type: "Rubrics",
      date: "May 18, 2026",
      format: "DOCX",
    },
    {
      title: "Algebra Chapter 3 Lesson Plan",
      size: "840 KB",
      type: "Lesson Plans",
      date: "May 12, 2026",
      format: "PDF",
    },
    {
      title: "General Science Assessment Scheme",
      size: "1.7 MB",
      type: "Templates",
      date: "Apr 28, 2026",
      format: "PDF",
    },
  ];

  const filteredFiles =
    activeFilter === "All"
      ? files
      : files.filter((f) => f.type === activeFilter);

  return (
    <div className="flex-1 flex flex-col w-full py-2 overflow-y-auto px-1 max-h-[calc(100vh-220px)] md:max-h-[calc(100vh-200px)] custom-scrollbar select-none">
      <div className="mb-6">
        <h2 className="font-sans text-lg font-bold text-[#121212]">
          My Library
        </h2>
        <p className="text-gray-400 text-xs mt-0.5">
          Access your saved templates, question pools, and exported materials
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar-horizontal shrink-0">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`text-xs font-bold py-2 px-4 rounded-full transition-all cursor-pointer border ${
              activeFilter === filter
                ? "bg-[#121212] text-white border-transparent"
                : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mt-2">
        {filteredFiles.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredFiles.map((file, idx) => (
              <div
                key={idx}
                className="p-4 flex items-center justify-between hover:bg-gray-50/40 transition-colors gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FF4F17]/10 rounded-xl flex items-center justify-center font-mono font-black text-[#FF4F17] text-xs shrink-0">
                    {file.format}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#121212] text-sm truncate max-w-[200px] sm:max-w-[400px]">
                      {file.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mt-0.5">
                      <span>{file.type}</span>
                      <span>•</span>
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>{file.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      toast.success(`Downloading ${file.title}...`)
                    }
                    className="p-2 rounded-full border border-gray-100 hover:bg-gray-50 text-gray-500 cursor-pointer flex items-center justify-center transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      toast.success(`Sharing link copied for ${file.title}`)
                    }
                    className="p-2 rounded-full border border-gray-100 hover:bg-gray-50 text-gray-500 cursor-pointer flex items-center justify-center transition-colors"
                    title="Share Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-400 text-sm">
            No resources stored under this filter yet.
          </div>
        )}
      </div>
    </div>
  );
}
