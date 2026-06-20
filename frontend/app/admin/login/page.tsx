"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Atom } from "lucide-react";
import { useAdminAuthStore } from "@/store/admin-auth-store";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, loading } = useAdminAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login({ email, password });
      router.replace("/admin");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Admin login failed"
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f2ea] px-6 text-neutral-950">
      <section className="w-full max-w-md rounded-[36px] border border-black/10 bg-white/75 p-8 shadow-[0_30px_100px_rgba(0,0,0,0.08)] backdrop-blur">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-neutral-950 text-white">
            <Atom size={22} />
          </div>

          <div>
            <h1 className="text-xl font-semibold">SkepticCore</h1>
            <p className="text-sm text-neutral-500">Admin Control Room</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-black"
              placeholder="admin@skepticcore.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-black"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Enter Admin"}
          </button>
        </form>
      </section>
    </main>
  );
}