import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkepticCore",
  description: "Science, philosophy, skepticism, and rational thinking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}