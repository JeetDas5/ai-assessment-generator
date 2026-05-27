import axios from "axios";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { Assignment } from "@workspace/shared";

interface AssignmentStore {
  assignments: Assignment[];
  isFetchingAssignments: boolean;
  showCreateWizard: boolean;
  selectedAssignment: Assignment | null;

  fetchAssignments: () => Promise<void>;
  selectAssignment: (assignment: Assignment | null) => void;
  setShowCreateWizard: (show: boolean) => void;
  deleteAssignment: (id: string) => Promise<boolean>;
  reset: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
  assignments: [],
  isFetchingAssignments: false,
  showCreateWizard: false,
  selectedAssignment: null,

  fetchAssignments: async () => {
    set({ isFetchingAssignments: true });
    try {
      const token =
        useAuthStore.getState().token ||
        localStorage.getItem("veda_auth_token");
      if (!token) return;

      const response = await axios.get(`${API_URL}/assignments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data?.success) {
        const list = response.data.assignments || [];
        set({ assignments: list });

        const currentSelected = get().selectedAssignment;
        if (currentSelected) {
          const updated = list.find(
            (a: Assignment) => a._id === currentSelected._id,
          );
          if (updated) {
            set({ selectedAssignment: updated });
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch assignments inside store:", error);
    } finally {
      set({ isFetchingAssignments: false });
    }
  },

  selectAssignment: (assignment) => {
    set({ selectedAssignment: assignment });
  },

  setShowCreateWizard: (show) => {
    set({ showCreateWizard: show });
    if (show) {
      set({ selectedAssignment: null });
    }
  },

  deleteAssignment: async (id: string) => {
    try {
      const token =
        useAuthStore.getState().token ||
        localStorage.getItem("veda_auth_token");
      if (!token) return false;

      const response = await axios.delete(`${API_URL}/assignments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data?.success) {
        set({
          assignments: get().assignments.filter(
            (a: Assignment) => a._id !== id,
          ),
        });

        if (get().selectedAssignment?._id === id) {
          set({ selectedAssignment: null });
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to delete assignment inside store:", error);
      return false;
    }
  },

  reset: () => {
    set({
      assignments: [],
      isFetchingAssignments: false,
      showCreateWizard: false,
      selectedAssignment: null,
    });
  },
}));
