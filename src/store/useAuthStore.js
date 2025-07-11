import { create } from "zustand";
import axios from "../services/axiosInstance";

 export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  login: ({ token, user }) => {
    localStorage.setItem("token", token);
    set({ token, user });
  },

  fetchUser: async () => {
    const token = get().token;
    if (!token) return;

    set({ loading: true });
    try {
      const res = await axios.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: res.data, loading: false });
    } catch (err) {
      console.error("Fetch user failed:", err);
      localStorage.removeItem("token");
      set({ user: null, token: null, loading: false });
    }
  },
}));

