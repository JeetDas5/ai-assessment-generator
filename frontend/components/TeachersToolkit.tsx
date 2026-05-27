"use client";

import { toast } from "sonner";
import Image from "next/image";

export default function TeachersToolkit() {
  const tools = [
    {
      title: "AI Rubric Generator",
      desc: "Autogenerate comprehensive, structural grading criteria and marks tables for your homework or final exams.",
      tag: "Grading Assistance",
      color: "from-orange-500/10 to-amber-500/10 border-orange-100/50",
      action: "Create Rubric",
    },
    {
      title: "Lesson Plan Creator",
      desc: "Draft highly structured weekly or unit lesson plans matching state educational boards and subject goals.",
      tag: "Planning",
      color: "from-blue-500/10 to-teal-500/10 border-blue-100/50",
      action: "Generate Plan",
    },
    {
      title: "Quiz Master",
      desc: "Instant quick-response multiple choice and short question sets built for classroom exit tickets.",
      tag: "Class Activities",
      color: "from-emerald-500/10 to-teal-500/10 border-emerald-100/50",
      action: "Draft Quiz",
    },
    {
      title: "Report Card Comments Assistant",
      desc: "Transform simple bullet notes about student marks into professional, constructive report card evaluations.",
      tag: "Administration",
      color: "from-purple-500/10 to-indigo-500/10 border-purple-100/50",
      action: "Write Comments",
    },
  ];

  const handleLaunchTool = (toolName: string) => {
    toast.success(`Launching ${toolName} interface...`);
  };

  return (
    <div className="flex-1 flex flex-col w-full py-2 overflow-y-auto px-1 max-h-[calc(100vh-220px)] md:max-h-[calc(100vh-200px)] custom-scrollbar select-none">
      
      {/* Header Description */}
      <div className="mb-6">
        <h2 className="font-sans text-lg font-bold text-[#121212]">AI Teacher's Toolkit</h2>
        <p className="text-gray-400 text-xs mt-0.5">Harness generative AI templates to simplify daily classroom preparation and administrative loads</p>
      </div>

      {/* Grid of Interactive Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tools.map((tool, idx) => (
          <div 
            key={idx} 
            className={`bg-white rounded-3xl border border-gray-100 p-5 shadow-sm bg-gradient-to-br ${tool.color} flex flex-col justify-between hover:shadow-md transition-shadow gap-4`}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold tracking-wider text-[#FF4F17] uppercase bg-white px-2 py-0.5 rounded-full shadow-xs border border-gray-100/50">
                  {tool.tag}
                </span>
              </div>
              <h3 className="font-bold text-[#121212] text-base leading-tight">{tool.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{tool.desc}</p>
            </div>

            <button
              onClick={() => handleLaunchTool(tool.title)}
              className="w-full bg-[#121212] hover:bg-black text-white text-xs font-bold py-2 px-4 rounded-full transition-all text-center cursor-pointer mt-2"
            >
              {tool.action}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
