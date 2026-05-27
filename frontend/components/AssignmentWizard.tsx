"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { UploadCloud, X, Mic, MicOff } from "lucide-react";

interface AssignmentWizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssignmentWizard({
  onClose,
  onSuccess,
}: AssignmentWizardProps) {

  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [instructions, setInstructions] = useState("");
  const [questionRows, setQuestionRows] = useState([
    { type: "Multiple Choice Questions", count: 4, marks: 1 },
    { type: "Short Questions", count: 3, marks: 2 },
    { type: "Diagram/Graph-Based Questions", count: 5, marks: 5 },
    { type: "Numerical Problems", count: 5, marks: 5 },
  ]);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [baseInstructions, setBaseInstructions] = useState("");

  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setMinDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (listening) {
      setInstructions(
        baseInstructions + (baseInstructions ? " " : "") + transcript,
      );
    }
  }, [transcript, listening, baseInstructions]);

  const toggleListening = () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Browser doesn't support speech recognition.");
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
      setBaseInstructions(instructions);
      resetTranscript();
      toast.success("Voice input stopped.");
    } else {
      setBaseInstructions(instructions);
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
      toast.success("Listening... Speak now!");
    }
  };

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const handleCountChange = (index: number, delta: number) => {
    setQuestionRows((prev) =>
      prev.map((row, idx) => {
        if (idx !== index) return row;
        const newCount = Math.max(1, row.count + delta);
        return { ...row, count: newCount };
      }),
    );
  };

  const handleMarksChange = (index: number, delta: number) => {
    setQuestionRows((prev) =>
      prev.map((row, idx) => {
        if (idx !== index) return row;
        const newMarks = Math.max(1, row.marks + delta);
        return { ...row, marks: newMarks };
      }),
    );
  };

  const handleTypeChange = (index: number, newType: string) => {
    setQuestionRows((prev) =>
      prev.map((row, idx) => {
        if (idx !== index) return row;
        return { ...row, type: newType };
      }),
    );
  };

  const handleDeleteRow = (index: number) => {
    if (questionRows.length <= 1) {
      toast.error("You must have at least one question type!");
      return;
    }
    setQuestionRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddRow = () => {
    setQuestionRows((prev) => [
      ...prev,
      { type: "Multiple Choice Questions", count: 1, marks: 1 },
    ]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB limit!");
        return;
      }
      setSelectedFile(file);
    }
  };

  const totalQuestions = questionRows.reduce((sum, row) => sum + row.count, 0);
  const totalMarks = questionRows.reduce(
    (sum, row) => sum + row.count * row.marks,
    0,
  );

  const handleCreateAssignment = async () => {
    if (!assignmentTitle.trim()) {
      toast.error("Please enter an assignment title!");
      return;
    }
    if (!dueDate) {
      toast.error("Please select a due date!");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [year, month, day] = dueDate.split("-").map(Number);
    const selectedDueDate = new Date(year, month - 1, day);

    if (selectedDueDate < today) {
      toast.error("Due date cannot be before today!");
      return;
    }
    if (!selectedFile && !instructions.trim()) {
      toast.error("Please upload a file or write instructions for the AI!");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", assignmentTitle.trim());
      formData.append("dueDate", new Date(dueDate).toISOString());
      formData.append("totalQuestions", totalQuestions.toString());
      formData.append("totalMarks", totalMarks.toString());
      formData.append("instructions", instructions.trim());
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      formData.append(
        "questionTypes",
        JSON.stringify(questionRows.map((r) => r.type)),
      );

      const token =
        useAuthStore.getState().token ||
        localStorage.getItem("veda_auth_token");
      const response = await axios.post(
        `${API_URL}/assignments/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data?.success) {
        toast.success("Assignment queued for creation successfully!");
        onSuccess();
      }
    } catch (error: any) {
      console.error("Failed to create assignment:", error);
      toast.error(
        error.response?.data?.message || "Failed to create assignment",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full py-2 overflow-y-auto px-1 max-h-[calc(100vh-220px)] md:max-h-[calc(100vh-200px)] custom-scrollbar">
      <div className="w-full flex items-center gap-3 mb-6 select-none">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 shrink-0" />
        <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="w-1/2 h-full bg-[#FF4F17] rounded-full" />
        </div>
      </div>

      <div className="bg-gray-50/40 rounded-3xl border border-gray-100 p-5 md:p-6 space-y-6">
        <div>
          <h2 className="font-sans text-lg font-bold text-[#121212] tracking-tight">
            Assignment Details
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">
            Basic information about your assignment
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#121212]">
            Assignment Title
          </label>
          <input
            type="text"
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
            placeholder="e.g. Midterm Physics Exam"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-[#121212] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4F17]/20 focus:border-[#FF4F17] transition-all text-sm shadow-sm"
          />
        </div>

        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all duration-300 relative ${
            dragActive
              ? "border-[#FF4F17] bg-[#FF4F17]/5"
              : selectedFile
                ? "border-emerald-500 bg-emerald-500/5"
                : "border-gray-200 bg-white hover:bg-gray-50/50"
          }`}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/jpeg,image/png,application/pdf"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                if (file.size > 10 * 1024 * 1024) {
                  toast.error("File size exceeds 10MB limit!");
                  return;
                }
                setSelectedFile(file);
              }
            }}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center justify-center gap-2"
          >
            <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mb-1">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="font-bold text-sm text-[#121212]">
              {selectedFile
                ? selectedFile.name
                : "Choose a file or drag & drop it here"}
            </p>
            <p className="text-xs text-gray-400">
              {selectedFile
                ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                : "JPEG, PNG, PDF up to 10MB"}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("file-upload")?.click();
              }}
              className="mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-1.5 px-4 rounded-full text-xs transition-colors cursor-pointer"
            >
              Browse Files
            </button>
            <p className="text-[10px] text-gray-400 mt-1">
              Upload images of your preferred document/image
            </p>
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#121212]">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            min={minDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FF4F17]/20 focus:border-[#FF4F17] transition-all text-sm shadow-sm"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 px-1 select-none">
            <span className="w-1/2">Question Type</span>
            <span className="w-1/4 text-center">No. of Questions</span>
            <span className="w-1/4 text-center">Marks</span>
          </div>

          <div className="space-y-2">
            {questionRows.map((row, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="flex-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteRow(idx)}
                    className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-gray-100 shrink-0 cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <select
                    value={row.type}
                    onChange={(e) => handleTypeChange(idx, e.target.value)}
                    className="flex-1 bg-transparent border-none rounded-xl px-2 py-1.5 text-sm text-[#121212] focus:outline-none font-medium cursor-pointer"
                  >
                    <option value="Multiple Choice Questions">
                      Multiple Choice Questions
                    </option>
                    <option value="Short Questions">Short Questions</option>
                    <option value="Diagram/Graph-Based Questions">
                      Diagram/Graph-Based Questions
                    </option>
                    <option value="Numerical Problems">
                      Numerical Problems
                    </option>
                    <option value="True/False Questions">
                      True/False Questions
                    </option>
                    <option value="Essay/Long Questions">
                      Essay/Long Questions
                    </option>
                  </select>
                </div>

                <div className="flex items-center bg-gray-50 border border-gray-100 rounded-full px-1.5 py-0.5 select-none shrink-0 shadow-sm">
                  <button
                    type="button"
                    onClick={() => handleCountChange(idx, -1)}
                    className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-[#121212] rounded-full hover:bg-white cursor-pointer font-bold text-sm transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-[#121212]">
                    {row.count}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCountChange(idx, 1)}
                    className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-[#121212] rounded-full hover:bg-white cursor-pointer font-bold text-sm transition-colors"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center bg-gray-50 border border-gray-100 rounded-full px-1.5 py-0.5 select-none shrink-0 shadow-sm mr-1">
                  <button
                    type="button"
                    onClick={() => handleMarksChange(idx, -1)}
                    className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-[#121212] rounded-full hover:bg-white cursor-pointer font-bold text-sm transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-[#121212]">
                    {row.marks}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleMarksChange(idx, 1)}
                    className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-[#121212] rounded-full hover:bg-white cursor-pointer font-bold text-sm transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddRow}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#121212] px-3 py-2 hover:bg-gray-100 rounded-xl shrink-0 cursor-pointer transition-colors"
          >
            <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
              +
            </span>
            Add Question Type
          </button>
        </div>

        <div className="flex flex-col items-end gap-1 text-right text-xs font-bold text-gray-400 px-1 border-t border-gray-100/50 pt-4 select-none">
          <div>
            Total Questions :{" "}
            <span className="text-[#121212] text-sm font-extrabold ml-1">
              {totalQuestions}
            </span>
          </div>
          <div>
            Total Marks :{" "}
            <span className="text-[#121212] text-sm font-extrabold ml-1">
              {totalMarks}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#121212]">
            Additional Information (For better output)
          </label>
          <div className="relative">
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
              className="w-full px-4 py-3.5 pr-12 rounded-2xl border border-gray-200 bg-white text-[#121212] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4F17]/20 focus:border-[#FF4F17] transition-all text-sm min-h-[90px] resize-none shadow-sm"
            />
            <button
              type="button"
              onClick={toggleListening}
              className={`absolute right-3.5 bottom-3.5 p-1.5 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center ${
                listening
                  ? "text-red-500 bg-red-50 ring-4 ring-red-500/10 animate-pulse"
                  : "text-gray-400 hover:text-[#121212] hover:bg-gray-100"
              }`}
              title={listening ? "Stop Voice Input" : "Start Voice Input"}
            >
              {listening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="bg-white hover:bg-gray-50 text-gray-600 font-bold py-2.5 px-6 rounded-full border border-gray-200 transition-all shadow-sm cursor-pointer flex items-center gap-1.5 text-sm"
        >
          ← Previous
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleCreateAssignment}
          className="bg-[#121212] hover:bg-black text-white font-semibold py-2.5 px-6 rounded-full transition-all shadow-md cursor-pointer flex items-center gap-1.5 text-sm disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>Next →</>
          )}
        </button>
      </div>
    </div>
  );
}
