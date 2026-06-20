"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/admin-auth-store";

export function AdminProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { admin, initialized, fetchMe } = useAdminAuthStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (initialized && !admin) {
      router.replace("/admin/login");
    }
  }, [initialized, admin, router]);

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f2ea] text-sm text-neutral-600">
        Loading SkepticCore admin...
      </div>
    );
  }

  if (!admin) return null;

  return <>{children}</>;
}