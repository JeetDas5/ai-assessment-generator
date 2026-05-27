import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";

interface AssignmentStore {
  assignments: any[];
  isFetchingAssignments: boolean;
  showCreateWizard: boolean;
  selectedAssignment: any | null;
  
  // Actions
  fetchAssignments: () => Promise<void>;
  selectAssignment: (assignment: any | null) => void;
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
      const token = useAuthStore.getState().token || localStorage.getItem("veda_auth_token");
      if (!token) return;
      
      const response = await axios.get(`${API_URL}/assignments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data?.success) {
        const list = response.data.assignments || [];
        set({ assignments: list });
        
        // If there's an active selected assignment, update it from the freshly fetched list
        const currentSelected = get().selectedAssignment;
        if (currentSelected) {
          const updated = list.find((a: any) => a._id === currentSelected._id);
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
      set({ selectedAssignment: null }); // Deselect if starting form
    }
  },

  deleteAssignment: async (id: string) => {
    try {
      const token = useAuthStore.getState().token || localStorage.getItem("veda_auth_token");
      if (!token) return false;
      
      const response = await axios.delete(`${API_URL}/assignments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data?.success) {
        // Remove from list
        set({ assignments: get().assignments.filter((a: any) => a._id !== id) });
        // Deselect if active
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
      selectedAssignment: null
    });
  }
}));
