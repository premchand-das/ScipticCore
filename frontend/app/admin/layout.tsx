import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SkepticCore Admin",
  description: "SkepticCore editorial control room",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}