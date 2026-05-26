import { create } from "zustand";
import axios from "axios";

export interface User {
  id: string;
  name?: string;
  email: string;
  schoolName?: string;
  schoolAddress?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signin: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  updateSchoolInfo: (schoolName: string, schoolAddress?: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  initialize: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  initialize: () => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("veda_auth_token");
      const storedUser = localStorage.getItem("veda_auth_user");
      if (storedToken && storedUser) {
        set({
          token: storedToken,
          user: JSON.parse(storedUser),
          isAuthenticated: true,
        });
      }
    }
  },

  signin: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/signin`, {
        email,
        password,
      });
      const { token, user } = response.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("veda_auth_token", token);
        localStorage.setItem("veda_auth_user", JSON.stringify(user));
      }

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.errors ||
        err.response?.data?.message ||
        "Failed to sign in";
      set({
        isLoading: false,
        error:
          typeof errorMessage === "string"
            ? errorMessage
            : (Object.values(errorMessage)[0] as string),
      });
      return false;
    }
  },

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        name,
        email,
        password,
      });
      const { token, user } = response.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("veda_auth_token", token);
        localStorage.setItem("veda_auth_user", JSON.stringify(user));
      }

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.errors ||
        err.response?.data?.message ||
        "Failed to register";
      set({
        isLoading: false,
        error:
          typeof errorMessage === "string"
            ? errorMessage
            : (Object.values(errorMessage)[0] as string),
      });
      return false;
    }
  },

  updateSchoolInfo: async (schoolName, schoolAddress) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.put(
        `${API_URL}/auth/school`,
        { schoolName, schoolAddress },
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("veda_auth_token")}`,
          },
        }
      );
      const { user } = response.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("veda_auth_user", JSON.stringify(user));
      }

      set({
        user,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update school profile";
      set({
        isLoading: false,
        error: errorMessage,
      });
      return false;
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("veda_auth_token");
      localStorage.removeItem("veda_auth_user");
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
