"use client";

import { useState, useEffect } from "react";
import { MoreVertical, Eye, Trash2, Plus } from "lucide-react";
import { useAssignmentStore } from "../store/useAssignmentStore";
import { toast } from "sonner";
import ConfirmationModal from "./ConfirmationModal";
import { Assignment } from "@workspace/shared";

interface AssignmentsListProps {
  assignments: Assignment[];
  onSelect: (assignment: Assignment) => void;
  onCreateClick: () => void;
}

export default function AssignmentsList({
  assignments,
  onSelect,
  onCreateClick,
}: AssignmentsListProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { deleteAssignment } = useAssignmentStore();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  useEffect(() => {
    const closeMenus = () => setOpenMenuId(null);
    window.addEventListener("click", closeMenus);
    return () => window.removeEventListener("click", closeMenus);
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteTargetId(id);
    setOpenMenuId(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr)
      .toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  };

  return (
    <div className="flex-1 flex flex-col relative w-full h-full min-h-0 overflow-hidden select-none">
      <div className="flex-1 overflow-y-auto px-1 pb-28 pt-2 custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[calc(100vh-220px)] md:max-h-[calc(100vh-200px)]">
        {assignments.map((assignment) => (
          <div
            key={assignment._id}
            onClick={() => onSelect(assignment)}
            className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 relative cursor-pointer flex flex-col justify-between min-h-[160px] group select-text"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <h3 className="font-sans text-lg font-black text-[#121212] tracking-tight leading-tight uppercase group-hover:text-[#FF4F17] transition-colors">
                  {assignment.title}
                </h3>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                    assignment.status === "completed"
                      ? "bg-emerald-55/10 text-emerald-700"
                      : assignment.status === "processing"
                        ? "bg-blue-55/10 text-blue-700"
                        : assignment.status === "failed"
                          ? "bg-red-55/10 text-red-700"
                          : "bg-amber-55/10 text-amber-700"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      assignment.status === "completed"
                        ? "bg-emerald-500"
                        : assignment.status === "processing"
                          ? "bg-blue-500"
                          : assignment.status === "failed"
                            ? "bg-red-500"
                            : "bg-amber-500"
                    }`}
                  />
                  {assignment.status.charAt(0).toUpperCase() +
                    assignment.status.slice(1)}
                </span>
              </div>

              <div className="relative shrink-0 select-none">
                <button
                  onClick={(e) => toggleMenu(e, assignment._id)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {openMenuId === assignment._id && (
                  <div className="absolute right-0 mt-1 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 p-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      onClick={() => onSelect(assignment)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-gray-400" />
                      View Assignment
                    </button>
                    <button
                      disabled={isDeleting === assignment._id}
                      onClick={(e) => handleDelete(e, assignment._id)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                      {isDeleting === assignment._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center text-xs font-bold text-gray-500 border-t border-gray-50 pt-4 mt-4 select-none">
              <div>
                Assigned on :{" "}
                <span className="text-gray-700 font-mono">
                  {formatDate(assignment.createdAt)}
                </span>
              </div>
              <div>
                Due :{" "}
                <span className="text-gray-700 font-mono">
                  {formatDate(assignment.dueDate)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white via-white/85 to-transparent pointer-events-none z-10 flex items-end justify-center pb-6">
        <button
          onClick={onCreateClick}
          className="bg-[#121212] hover:bg-black text-white text-sm font-semibold py-3 px-8 rounded-full shadow-lg border border-[#FF4F17]/10 hover:border-[#FF4F17]/30 hover:scale-105 active:scale-95 transition-all duration-300 pointer-events-auto flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5 text-white" />
          Create Assignment
        </button>
      </div>

      <ConfirmationModal
        isOpen={deleteTargetId !== null}
        title="Delete Assignment"
        message="Are you sure you want to delete this assignment? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={isDeleting !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={async () => {
          if (!deleteTargetId) return;
          setIsDeleting(deleteTargetId);
          const success = await deleteAssignment(deleteTargetId);
          setIsDeleting(null);
          setDeleteTargetId(null);
          if (success) {
            toast.success("Assignment deleted successfully!");
          } else {
            toast.error("Failed to delete assignment.");
          }
        }}
      />
    </div>
  );
}
