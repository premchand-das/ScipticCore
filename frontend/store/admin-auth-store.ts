"use client";

import { create } from "zustand";
import api from "@/lib/api";
import type { AdminUser, ApiResponse } from "@/types/api";

type LoginPayload = {
  email: string;
  password: string;
};

type AdminAuthState = {
  admin: AdminUser | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => void;
};

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  admin: null,
  token: null,
  loading: false,
  initialized: false,

  login: async (payload) => {
    set({ loading: true });

    try {
      const res = await api.post<ApiResponse<any>>("/auth/login", payload);

      const token =
        res.data.data?.accessToken ||
        res.data.data?.token ||
        res.data.data?.adminAccessToken;

      const admin = res.data.data?.admin || res.data.data?.user;

      if (!token) {
        throw new Error("Access token missing from login response");
      }

      localStorage.setItem("sck_admin_token", token);

      set({
        token,
        admin: admin || null,
        loading: false,
        initialized: true,
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchMe: async () => {
    set({ loading: true });

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("sck_admin_token")
          : null;

      if (!token) {
        set({
          admin: null,
          token: null,
          loading: false,
          initialized: true,
        });
        return;
      }

      const res = await api.get<ApiResponse<AdminUser>>("/admin/me");

      set({
        admin: res.data.data,
        token,
        loading: false,
        initialized: true,
      });
    } catch {
      localStorage.removeItem("sck_admin_token");

      set({
        admin: null,
        token: null,
        loading: false,
        initialized: true,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("sck_admin_token");

    set({
      admin: null,
      token: null,
      initialized: true,
    });
  },
}));