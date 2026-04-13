import { create } from "zustand";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { UserState } from "../types";

export const useAuthStore = create<UserState>((set) => ({
  user: null,
  isCheckingAuth: true,
  isLoading: false,

  checkAuth: async () => {
    try {
      const res = await api.get("/auth/profile");
      set({ user: res.data });
    } catch (error: any) {
      console.log("No active session:", error.response?.data?.message || "unauthorized");
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  register: async (userData) => {
    set({ isLoading: true });
    try {
      const res = await api.post("/auth/register", userData);
      set({ user: res.data });
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error creating account");
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (userData) => {
    set({ isLoading: true });
    try {
      const res = await api.post("/auth/login", userData);
      set({ user: res.data });
      toast.success("Logged in successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
      set({ user: null });
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error logging out");
    }
  },
}));
