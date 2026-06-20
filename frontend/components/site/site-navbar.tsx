"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";

const links = [
  { label: "Series", href: "/series" },
  { label: "Episodes", href: "/episodes" },
  { label: "Articles", href: "/articles" },
  { label: "Papers", href: "/papers" },
  { label: "Archive", href: "/archive" },
  { label: "Dogmas", href: "/dogmas" },
];

export function SiteNavbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  return (
    <motion.header className="fixed left-0 top-0 z-50 w-full px-3 pt-3 sm:px-4">
      <nav
        className={cn(
          "mx-auto flex h-12 max-w-5xl items-center justify-between rounded-full border px-3 transition-all duration-300",
          scrolled
            ? "border-[#C7A15A]/10 bg-[#050505]/90 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-3xl"
            : "border-[#F4EAD8]/5 bg-[#050505]/45 backdrop-blur-xl"
        )}
      >
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <span className="truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F4EAD8]">
            SkepticCore
          </span>
        </Link>

        <div className="hidden items-center gap-0.5 lg:flex">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-2.5 py-1.5 text-[9px] font-medium uppercase tracking-[0.2em] transition",
                  active
                    ? "bg-[#F4EAD8]/10 text-[#F4EAD8]"
                    : "text-[#C9BFAE]/80 hover:bg-[#F4EAD8]/5 hover:text-[#F4EAD8]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href="/search"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border border-[#F4EAD8]/10 text-[#F4EAD8]/80 transition hover:border-[#C7A15A]/50 hover:text-[#C7A15A]",
              pathname.startsWith("/search") &&
                "border-[#C7A15A]/50 text-[#C7A15A]"
            )}
            aria-label="Search"
          >
            <Search size={14} />
          </Link>

          <button
            onClick={() => setOpen((value) => !value)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#F4EAD8]/10 text-[#F4EAD8]/80 transition hover:border-[#C7A15A]/50 hover:text-[#C7A15A] lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {open ? <X size={14} /> : <Menu size={14} />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mx-auto mt-2 max-w-5xl rounded-[1.6rem] border border-[#F4EAD8]/10 bg-[#050505]/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-3xl lg:hidden"
        >
          <div className="grid gap-1">
            {[...links, { label: "Search", href: "/search" }].map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-xs font-medium uppercase tracking-[0.18em] transition",
                    active
                      ? "bg-[#F4EAD8]/10 text-[#F4EAD8]"
                      : "text-[#C9BFAE]/80 hover:bg-[#F4EAD8]/5 hover:text-[#F4EAD8]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}