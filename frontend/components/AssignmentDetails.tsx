"use client";

import Image from "next/image";
import { User } from "../store/useAuthStore";
import { toast } from "sonner";

interface Question {
  text: string;
  difficulty: string;
  marks: number;
  answer?: string;
  _id?: string;
}

interface Section {
  title: string;
  instruction: string;
  questions: Question[];
  _id?: string;
}

interface Assignment {
  _id: string;
  title: string;
  dueDate: string;
  questionTypes: string[];
  totalQuestions: number;
  totalMarks: number;
  instructions?: string;
  uploadedFile?: string;
  status: "queued" | "processing" | "completed" | "failed";
  generatedPaper?: Section[];
  error?: string;
  createdAt: string;
}

interface AssignmentDetailsProps {
  assignment: Assignment;
  user: User | null;
  onBack: () => void;
}

export default function AssignmentDetails({ assignment, user, onBack }: AssignmentProps | any) {
  const paper = assignment.generatedPaper || [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col w-full py-2 overflow-y-auto px-1 max-h-[calc(100vh-220px)] md:max-h-[calc(100vh-200px)] custom-scrollbar select-none">
      
      {/* Top Banner (Lakshya style header) */}
      <div className="bg-[#1E1F22] rounded-[1.75rem] p-6 text-white mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF4F17] rounded-full blur-[90px] opacity-15 pointer-events-none" />
        <div className="max-w-xl z-10">
          <p className="font-mono text-sm sm:text-base leading-relaxed text-gray-300">
            Certainly, <span className="text-[#FF4F17] font-bold">{user?.name?.split(" ")[0] || "Teacher"}</span>! Here is the customized Question Paper for your classes on:
          </p>
          <h2 className="font-sans text-lg sm:text-xl font-bold tracking-tight text-white mt-1">
            "{assignment.title}"
          </h2>
        </div>
        <button
          onClick={handlePrint}
          className="bg-white hover:bg-gray-100 text-[#1E1F22] font-bold py-2.5 px-6 rounded-full transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer text-sm shadow-sm z-10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download as PDF / Print
        </button>
      </div>

      {/* Main Question Paper Layout ( DELHI PUBLIC SCHOOL card ) */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-10 shadow-sm space-y-8 select-text print:border-none print:shadow-none">
        
        {/* School Header */}
        <div className="text-center space-y-1">
          <h1 className="font-sans text-xl md:text-2xl font-black text-[#121212] tracking-tight uppercase">
            {user?.schoolName || "Delhi Public School"}
          </h1>
          <p className="text-[#121212]/80 font-mono text-sm font-bold tracking-wide">
            Subject: {assignment.title}
          </p>
          <p className="text-gray-500 text-xs font-semibold">
            {user?.schoolAddress || "Bokaro Steel City"}
          </p>
        </div>

        {/* Info Rows */}
        <div className="flex flex-col sm:flex-row justify-between text-xs font-bold text-gray-600 gap-2 border-y border-gray-100 py-3 select-none">
          <div>Time Allowed: 45 minutes</div>
          <div>Maximum Marks: {assignment.totalMarks}</div>
        </div>

        <p className="text-xs font-semibold text-gray-500 italic select-none">
          All questions are compulsory unless stated otherwise.
        </p>

        {/* Student Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-gray-700 py-2 select-none">
          <div className="flex items-center gap-1.5">
            Name: <div className="flex-1 border-b border-gray-300 h-4" />
          </div>
          <div className="flex items-center gap-1.5">
            Roll Number: <div className="flex-1 border-b border-gray-300 h-4" />
          </div>
          <div className="flex items-center gap-1.5">
            Class: <span className="text-[#121212] font-extrabold mr-1">5th</span> Section: <div className="flex-1 border-b border-gray-300 h-4" />
          </div>
        </div>

        {/* Sections Listing */}
        {paper.length > 0 ? (
          <div className="space-y-8 pt-4">
            {paper.map((section: Section, sIdx: number) => (
              <div key={section._id || sIdx} className="space-y-4">
                <div className="text-center select-none">
                  <h3 className="font-mono text-base font-bold text-[#121212] underline tracking-wider uppercase">
                    {section.title}
                  </h3>
                  <p className="text-gray-400 text-xs italic mt-0.5">
                    {section.instruction}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {section.questions.map((question: Question, qIdx: number) => (
                    <div key={question._id || qIdx} className="text-sm text-[#121212] leading-relaxed flex items-start gap-1">
                      <span className="font-bold shrink-0">{qIdx + 1}.</span>
                      <div className="flex-1">
                        <span className="text-gray-400 font-mono text-xs font-semibold mr-1 select-none">
                          [{question.difficulty}]
                        </span>
                        {question.text}
                        <span className="text-[#FF4F17] font-semibold text-xs font-mono ml-1.5 select-none shrink-0">
                          [{question.marks} Marks]
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <p className="text-center font-mono text-xs font-extrabold text-gray-400 py-4 select-none">
              End of Question Paper
            </p>

            {/* Answer Key Segment */}
            <div className="border-t border-dashed border-gray-200 pt-8 mt-12 space-y-6">
              <h2 className="font-mono text-base font-extrabold text-[#121212] tracking-wider uppercase select-none">
                Answer Key:
              </h2>
              
              <div className="space-y-5">
                {paper.flatMap((s: Section) => s.questions).map((question: Question, idx: number) => (
                  <div key={question._id || idx} className="text-sm text-[#121212] leading-relaxed flex items-start gap-2">
                    <span className="font-mono font-bold text-gray-400 shrink-0 select-none">{idx + 1}.</span>
                    <div className="flex-1 space-y-1">
                      <p className="font-semibold text-xs text-gray-500 italic mb-0.5 select-none">
                        Answer guideline for: "{question.text.slice(0, 50)}..."
                      </p>
                      <p className="text-gray-600 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50 leading-relaxed font-sans text-sm">
                        {question.answer || "Answer key not generated for this question style."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 select-none">
            <p className="text-gray-400 font-semibold text-sm">
              No questions have been generated inside this paper yet.
            </p>
          </div>
        )}
      </div>

      {/* Back to list trigger footer */}
      <div className="flex items-center justify-start mt-6 pt-4 border-t border-gray-50 shrink-0">
        <button
          onClick={onBack}
          className="bg-white hover:bg-gray-50 text-gray-600 font-bold py-2.5 px-6 rounded-full border border-gray-200 transition-all shadow-sm cursor-pointer flex items-center gap-1.5 text-sm"
        >
          ← Back to List
        </button>
      </div>
    </div>
  );
}
