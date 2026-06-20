import Link from "next/link";
import { Atom, Camera } from "lucide-react";

const footerLinks = [
  { label: "Series", href: "/series" },
  { label: "Episodes", href: "/episodes" },
  { label: "Articles", href: "/articles" },
  { label: "Papers", href: "/papers" },
  { label: "Archive", href: "/archive" },
  { label: "Dogmas", href: "/dogmas" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-[#F4EAD8]/10 bg-[#050505] px-5 py-12 text-[#C9BFAE] sm:px-8 lg:px-12">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C7A15A]/40 to-transparent" />
      <div className="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[#C7A15A]/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <Link href="/" className="mb-5 flex items-center gap-3">


              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#F4EAD8]">
                SkepticCore
              </span>
            </Link>

            <p className="text-sm leading-7 text-[#C9BFAE]/60">
              Think deeper than the feed. A public archive for science,
              philosophy, skepticism, and meaning.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-3">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] uppercase tracking-[0.22em] text-[#C9BFAE]/55 transition hover:text-[#C7A15A]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-[#F4EAD8]/10 pt-6 text-xs text-[#C9BFAE]/45 md:flex-row md:items-center md:justify-between">
          <p>SkepticCore © 2026</p>

          <div className="flex flex-wrap items-center gap-3">
            <span>Science</span>
            <span className="text-[#C7A15A]/50">•</span>
            <span>Philosophy</span>
            <span className="text-[#C7A15A]/50">•</span>
            <span>Skepticism</span>
            <span className="text-[#C7A15A]/50">•</span>
            <span>Meaning</span>
          </div>

          <a
            href="https://instagram.com/skepticcore"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[#C9BFAE]/55 transition hover:text-[#C7A15A]"
          >
            <Camera size={14} />
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}