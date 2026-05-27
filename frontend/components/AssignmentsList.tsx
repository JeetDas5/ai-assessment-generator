"use client";

import Image from "next/image";

interface AssignmentsListProps {
  assignments: any[];
  onSelect: (assignment: any) => void;
}

export default function AssignmentsList({ assignments, onSelect }: AssignmentsListProps) {
  return (
    <div className="flex-1 flex flex-col w-full py-2 overflow-y-auto px-1 max-h-[calc(100vh-220px)] md:max-h-[calc(100vh-200px)] custom-scrollbar">
      <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm">
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead className="bg-gray-50/70 text-xs font-bold text-gray-400 uppercase tracking-wider select-none">
            <tr>
              <th scope="col" className="px-6 py-4">Title</th>
              <th scope="col" className="px-6 py-4">Due Date</th>
              <th scope="col" className="px-6 py-4 text-center">Questions</th>
              <th scope="col" className="px-6 py-4 text-center">Marks</th>
              <th scope="col" className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {assignments.map((assignment: any) => (
              <tr 
                key={assignment._id} 
                onClick={() => onSelect(assignment)}
                className="hover:bg-gray-50/40 transition-colors cursor-pointer"
              >
                <th className="flex gap-3 px-6 py-4 font-bold text-[#121212]">
                  <div className="flex flex-col">
                    <span className="text-sm">{assignment.title}</span>
                    {assignment.uploadedFile && (
                      <span className="text-xs text-gray-400 font-normal truncate max-w-[200px] mt-0.5">
                        📄 {assignment.uploadedFile.split(/[/\\]/).pop()}
                      </span>
                    )}
                  </div>
                </th>
                <td className="px-6 py-4 text-xs font-medium">
                  {new Date(assignment.dueDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 text-center font-bold text-sm text-[#121212]">
                  {assignment.totalQuestions}
                </td>
                <td className="px-6 py-4 text-center font-bold text-sm text-[#121212]">
                  {assignment.totalMarks}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                    assignment.status === 'completed' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : assignment.status === 'processing'
                        ? 'bg-blue-50 text-blue-700'
                        : assignment.status === 'failed'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      assignment.status === 'completed'
                        ? 'bg-emerald-500'
                        : assignment.status === 'processing'
                          ? 'bg-blue-500'
                          : assignment.status === 'failed'
                            ? 'bg-red-500'
                            : 'bg-amber-500'
                    }`} />
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
