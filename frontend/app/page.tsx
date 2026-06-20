"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  Atom,
  BookOpen,
  Brain,
  CircleDot,
  Eye,
  FlaskConical,
  Sparkles,
} from "lucide-react";

import { SiteNavbar } from "@/components/site/site-navbar";
import { discoveryService } from "@/services/discovery.service";
import type { DiscoveryHome, DiscoveryItem } from "@/services/discovery.service";
import api from "@/lib/api";
import { SiteFooter } from "@/components/site/site-footer";

const sidebarLinks = [
  ["Manifesto", "#manifesto"],
  ["Series", "#series"],
  ["Episodes", "#episodes"],
  ["Articles", "#articles"],
  ["Papers", "#papers"],
  ["Dogmas", "#dogmas"],
  ["Letter", "#letter"],
];


const filters = ["all", "science", "religion", "philosophy", "psychology"];



function getContentHref(item: DiscoveryItem) {
  const slug = item.slug || item._id;

  const routeMap: Record<string, string> = {
    series: "series",
    episode: "episodes",
    episodes: "episodes",
    article: "articles",
    articles: "articles",
    paper: "papers",
    papers: "papers",
    archive: "archive",
    dogma: "dogmas",
    dogmas: "dogmas",
  };

  const route = routeMap[item.type] || "archive";
  return `/${route}/${slug}`;
}

function FadeUp({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({
  eyebrow,
  title,
  muted,
}: {
  eyebrow: string;
  title: string;
  muted?: string;
}) {
  return (
    <div>
      <p className="mb-5 text-[10px] uppercase tracking-[0.28em] text-[#C7A15A] sm:text-xs sm:tracking-[0.35em]">
        {eyebrow}
      </p>

      <h2 className="serif max-w-5xl text-[2.8rem] leading-[0.92] tracking-[-0.045em] text-[#F4EAD8] sm:text-5xl md:text-7xl">
        {muted && <span className="italic text-[#C9BFAE]/45">{muted}</span>}{" "}
        {title}
      </h2>
    </div>
  );
}

export default function HomePage() {
  return <ArchiveExperience />;
}

export function ArchiveExperience() {
  const [data, setData] = useState<DiscoveryHome | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    discoveryService
      .home()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const seriesItems = data?.series || [];
  const episodes = data?.latest?.filter((item) => item.type === "episode") || [];
  const articles = data?.articles || [];
  const papers = data?.papers || [];
  const dogmas = data?.dogmas || [];
  const featured = data?.featured?.[0];

  const visibleEpisodes = useMemo(() => {
    if (activeFilter === "all") return episodes;
    return episodes.filter(
      (episode) => episode.category?.toLowerCase() === activeFilter
    );
  }, [activeFilter, episodes]);

  async function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.includes("@") || !email.includes(".")) {
      setMessage("Enter a valid email address.");
      return;
    }

    try {
      await api.post("/newsletter/subscribe", { email });
      setMessage("You are now inside the archive.");
      setEmail("");
    } catch {
      setMessage("Something went wrong. Try again.");
    }
  }

  const { scrollYProgress } = useScroll();

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const imageX = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const circleRotate = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const circleScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

  const starY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const dustY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const deepScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  const dustParticles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    size: (i % 4) + 1,
    left: `${(i * 17) % 100}%`,
    top: `${(i * 29) % 100}%`,
    opacity: 0.12 + (i % 5) * 0.04,
  }));

  return (
  <>
  <SiteNavbar/>
    <main className="relative overflow-hidden bg-[#050505] text-[#F4EAD8]">
 <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#050505]"
    >
      {/* universe image */}
      <motion.img
        src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop"
        alt=""
        className="absolute right-0 top-0 h-full w-[74%] object-cover grayscale contrast-125 opacity-45 mix-blend-luminosity"
        style={{
          scale: imageScale,
          x: imageX,
          y: imageY,
        }}
      />

      {/* deep space illusion */}
      <motion.div
        className="absolute inset-0"
        style={{
          scale: deepScale,
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(199,161,90,0.08), transparent 25%),
            radial-gradient(circle at 80% 20%, rgba(244,234,216,0.05), transparent 30%),
            radial-gradient(circle at 70% 70%, rgba(199,161,90,0.06), transparent 35%),
            radial-gradient(circle at 40% 80%, rgba(255,255,255,0.04), transparent 25%)
          `,
        }}
      />

      {/* nebula clouds */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="absolute right-[8%] top-[10%] h-[500px] w-[500px] rounded-full bg-[#C7A15A]/10 blur-[160px]" />
        <div className="absolute right-[25%] top-[35%] h-[400px] w-[400px] rounded-full bg-[#F4EAD8]/5 blur-[140px]" />
        <div className="absolute bottom-[10%] right-[15%] h-[450px] w-[450px] rounded-full bg-[#C7A15A]/10 blur-[170px]" />
      </motion.div>

      {/* galaxy rings */}
      <motion.div
        className="absolute right-[15%] top-[15%] h-[800px] w-[800px] rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 240,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="absolute inset-0 rounded-full border border-[#C7A15A]/5" />
        <div className="absolute inset-16 rounded-full border border-[#F4EAD8]/5" />
        <div className="absolute inset-32 rounded-full border border-[#C7A15A]/5" />
      </motion.div>

      {/* central universe illusion circle */}
      <motion.div
        className="absolute right-[10%] top-[12%] h-[680px] w-[680px] rounded-full border border-[#C7A15A]/10"
        style={{
          rotate: circleRotate,
          scale: circleScale,
        }}
      >
        <motion.div
          className="absolute inset-10 rounded-full border border-[#F4EAD8]/5"
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute inset-24 rounded-full border border-[#C7A15A]/10"
          animate={{ rotate: -360 }}
          transition={{ duration: 65, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute inset-40 rounded-full border border-[#F4EAD8]/5"
          animate={{ rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute left-1/2 top-0 h-2 w-2 rounded-full bg-[#C7A15A] shadow-[0_0_30px_rgba(199,161,90,0.9)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "0 340px" }}
        />

        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(199,161,90,0.18),transparent_55%)] blur-[2px]" />
      </motion.div>

      {/* slow star field */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(rgba(244,234,216,0.18) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          y: starY,
        }}
      />

      {/* parallax cosmic dust */}
      <motion.div className="absolute inset-0" style={{ y: dustY }}>
        {dustParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-[#F4EAD8]"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: particle.left,
              top: particle.top,
              opacity: particle.opacity,
            }}
          />
        ))}
      </motion.div>

      {/* shooting stars */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px w-40 bg-gradient-to-r from-[#F4EAD8] to-transparent"
          style={{
            top: `${10 + i * 15}%`,
            left: `${68 + i * 3}%`,
          }}
          animate={{
            x: [-220, 220],
            y: [-60, 60],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 3,
            ease: "easeOut",
          }}
        />
      ))}

      {/* soft cosmic glow */}
      <motion.div
        className="absolute right-[18%] top-[20%] h-[420px] w-[420px] rounded-full bg-[#C7A15A]/10 blur-[130px]"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* final cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/88 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
    </motion.div>
  
<aside className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
  <div className="flex flex-col items-center gap-1 rounded-[22px] border border-[#F4EAD8]/10 bg-[#050505]/80 px-2 py-3 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
    {sidebarLinks.map(([label, href]) => (
      <a
        key={label}
        href={href}
        className="group flex items-center justify-center py-2"
      >
        <span
          style={{ writingMode: "vertical-rl" }}
          className="rotate-180 text-[9px] uppercase tracking-[0.18em] text-[#C9BFAE]/45 transition-all duration-300 group-hover:text-[#C7A15A]"
        >
          {label}
        </span>
      </a>
    ))}
  </div>
</aside>

      <div className="relative z-10 md:pl-20">
        <section className="relative min-h-screen px-5 pb-20 pt-24 md:px-16 md:pb-24 md:pt-28 lg:px-24">
          <div className="grid max-w-7xl gap-14 xl:grid-cols-[1fr_360px] xl:items-end">
            <div>
              <FadeUp>
                <div className="mb-7 flex flex-wrap items-center gap-3">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-[#C7A15A] sm:text-xs sm:tracking-[0.35em]">
                    Rational Inquiry
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.28em] text-[#C7A15A] sm:text-xs sm:tracking-[0.35em]">
                    Human Meaning
                  </span>
                </div>
              </FadeUp>

              <FadeUp delay={0.08}>
                <h1 className="serif max-w-5xl text-[3.4rem] leading-[0.86] tracking-[-0.055em] text-[#F4EAD8] sm:text-6xl md:text-8xl lg:text-9xl">
                  Question
                  <br />
                  inherited
                  <br />
                  <span className="italic text-[#C9BFAE]/45">illusions.</span>
                </h1>
              </FadeUp>

              <FadeUp delay={0.2}>
                <p className="mt-8 max-w-xl text-sm leading-7 text-[#C9BFAE] sm:text-base sm:leading-8">
                  SkepticCore examines science, religion, philosophy,
                  psychology, and civilization through evidence, skepticism, and
                  intellectual honesty.
                </p>
              </FadeUp>

              <FadeUp delay={0.28}>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-5">
                  <a
                    href="#series"
                    className="group inline-flex items-center justify-center gap-3 rounded border border-[#C7A15A]/40 bg-[#080808] px-5 py-4 text-[10px] uppercase tracking-[0.24em] text-[#F4EAD8] shadow-[0_0_40px_rgba(199,161,90,0.12)] transition hover:border-[#C7A15A] sm:px-6 sm:text-xs sm:tracking-[0.28em]"
                  >
                    Enter Archive
                    <ArrowUpRight size={17} className="text-[#C7A15A]" />
                  </a>

                  <a
                    href="#episodes"
                    className="group inline-flex items-center justify-center gap-3 px-2 py-4 text-[10px] uppercase tracking-[0.24em] text-[#C9BFAE]/60 transition hover:text-[#F4EAD8] sm:text-xs sm:tracking-[0.28em]"
                  >
                    Explore Inquiries
                    <ArrowUpRight size={17} />
                  </a>
                </div>
              </FadeUp>

              <FadeUp delay={0.34}>
                <div className="mt-14 grid max-w-2xl grid-cols-1 gap-5 border-t border-[#F4EAD8]/10 pt-8 sm:grid-cols-3 sm:gap-6">
                  {[
                    [seriesItems.length || 0, "Series"],
                    [articles.length || 0, "Articles"],
                    [papers.length || 0, "Papers"],
                  ].map(([value, label]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-[#F4EAD8]/10 bg-[#F4EAD8]/[0.025] p-5 sm:border-0 sm:bg-transparent sm:p-0"
                    >
                      <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-[#C9BFAE]/40 sm:tracking-[0.28em]">
                        {label}
                      </p>
                      <p className="serif text-4xl text-[#F4EAD8] sm:text-5xl">
                        {value}
                      </p>
                      <div className="mt-4 h-px w-6 bg-[#F4EAD8]/15" />
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        <section id="manifesto" className="px-5 py-20 md:px-16 md:py-24 lg:px-24">
          <FadeUp>
            <div className="max-w-7xl rounded-[2rem] bg-[#F4EAD8] p-6 text-[#050505] sm:p-8 md:p-16">
              <p className="mb-5 text-[10px] uppercase tracking-[0.28em] text-black/45 sm:text-xs sm:tracking-[0.35em]">
                Manifesto
              </p>

              <h2 className="serif max-w-5xl text-[2.8rem] leading-[0.95] tracking-[-0.045em] md:text-7xl">
                We are not here to comfort belief. We are here to examine
                reality.
              </h2>

              <div className="mt-10 grid gap-7 md:grid-cols-3 md:gap-8">
                {[
                  ["01", "Question Belief", "No idea is sacred enough to escape examination."],
                  ["02", "Follow Evidence", "Reality is not negotiated by tradition, comfort, or authority."],
                  ["03", "Build Meaning", "Meaning becomes stronger when it survives illusion."],
                ].map(([num, title, text]) => (
                  <div key={title}>
                    <p className="mb-3 text-xs uppercase tracking-[0.28em] text-black/40">
                      {num}
                    </p>
                    <h3 className="serif text-3xl">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-black/60">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </section>

        <ContentSection
          id="series"
          eyebrow="Intellectual Projects"
          muted="Cinematic"
          title="seasons for serious questions."
          items={seriesItems}
          loading={loading}
        />

        {featured && (
          <section className="px-5 py-20 md:px-16 md:py-28 lg:px-24">
            <FadeUp>
              <div className="relative max-w-7xl overflow-hidden rounded-[2rem] border border-[#F4EAD8]/10 bg-[#080808]/80 p-6 sm:p-8 md:rounded-[2.2rem] md:p-14">
                <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                  <div>
                    <p className="mb-5 text-[10px] uppercase tracking-[0.28em] text-[#C7A15A] sm:text-xs sm:tracking-[0.35em]">
                      Featured Investigation
                    </p>

                    <h2 className="serif max-w-4xl text-[2.9rem] leading-[0.9] tracking-[-0.055em] text-[#F4EAD8] sm:text-5xl md:text-8xl">
                      {featured.title}
                    </h2>

                    <p className="mt-7 max-w-xl text-sm leading-7 text-[#C9BFAE]/70 sm:text-base sm:leading-8">
                      {featured.hook || featured.summary}
                    </p>
                  </div>

                  <Link
                    href={getContentHref(featured)}
                    className="archive-card rounded-2xl p-5 sm:p-6"
                  >
                    <div className="mb-6 flex items-center gap-3 text-[#C7A15A]">
                      <FlaskConical size={20} />
                      <span className="text-[10px] uppercase tracking-[0.24em] sm:text-xs sm:tracking-[0.28em]">
                        Featured Archive
                      </span>
                    </div>

                    <blockquote className="serif text-2xl leading-tight text-[#F4EAD8] sm:text-3xl">
                      “Open the investigation.”
                    </blockquote>

                    <span className="mt-8 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-[#C7A15A] sm:text-xs sm:tracking-[0.24em]">
                      Read Now <ArrowUpRight size={16} />
                    </span>
                  </Link>
                </div>
              </div>
            </FadeUp>
          </section>
        )}

        <section id="episodes" className="px-5 py-20 md:px-16 md:py-28 lg:px-24">
          <div className="max-w-7xl border-t border-[#F4EAD8]/10 pt-14 md:pt-16">
            <FadeUp>
              <SectionLabel
                eyebrow="Latest Inquiries"
                muted="Short"
                title="enough for the feed. Deep enough to stay."
              />
            </FadeUp>

            <FadeUp>
              <div className="mt-9 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`whitespace-nowrap rounded-full border px-5 py-2 text-[10px] uppercase tracking-[0.18em] transition sm:text-xs sm:tracking-[0.2em] ${
                      activeFilter === filter
                        ? "border-[#F4EAD8] bg-[#F4EAD8] text-black"
                        : "border-[#F4EAD8]/10 text-[#C9BFAE] hover:border-[#C7A15A]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </FadeUp>

            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {visibleEpisodes.map((episode, index) => (
                <FadeUp key={episode._id} delay={index * 0.04}>
                  <ContentCard item={episode} />
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <ContentGrid id="articles" title="Articles" items={articles} />
        <ContentGrid id="papers" title="Papers" items={papers} />
        <ContentGrid id="dogmas" title="Dogmas" items={dogmas} />

        <section id="letter" className="px-5 py-20 pb-28 md:px-16 md:py-28 lg:px-24">
          <FadeUp>
            <div className="archive-card mx-auto max-w-5xl rounded-[2rem] p-6 text-center sm:p-8 md:p-16">
              <p className="mb-5 text-[10px] uppercase tracking-[0.28em] text-[#C7A15A] sm:text-xs sm:tracking-[0.35em]">
                The SkepticCore Letter
              </p>

              <h2 className="serif text-[2.8rem] leading-[0.95] tracking-[-0.045em] text-[#F4EAD8] sm:text-5xl md:text-7xl">
                One deep idea.
                <br />
                <span className="italic text-[#C9BFAE]/45">No noise.</span>
              </h2>

              <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#C9BFAE]/70 sm:text-base sm:leading-8">
                A weekly dispatch on science, belief, reason, and meaning.
              </p>

              <form
                onSubmit={handleSubscribe}
                className="mx-auto mt-9 flex w-full max-w-xl flex-col gap-3 rounded-3xl border border-[#F4EAD8]/10 bg-[#050505]/80 p-2 sm:rounded-full sm:flex-row"
              >
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  className="min-h-12 flex-1 bg-transparent px-5 text-sm text-[#F4EAD8] outline-none placeholder:text-[#C9BFAE]/40"
                  placeholder="Enter your email"
                />

                <button
                  type="submit"
                  className="rounded-full bg-[#F4EAD8] px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-black"
                >
                  Subscribe
                </button>
              </form>

              {message && (
                <p className="mt-4 text-sm text-[#C7A15A]">{message}</p>
              )}
            </div>
          </FadeUp>
        </section>
      </div>
    </main>
    <SiteFooter/>
    </>
  );
}

function ContentSection({
  id,
  eyebrow,
  muted,
  title,
  items,
  loading,
}: {
  id: string;
  eyebrow: string;
  muted?: string;
  title: string;
  items: DiscoveryItem[];
  loading: boolean;
}) {
  return (
    <section id={id} className="px-5 py-20 md:px-16 md:py-28 lg:px-24">
      <div className="max-w-7xl border-t border-[#F4EAD8]/10 pt-14 md:pt-16">
        <FadeUp>
          <SectionLabel eyebrow={eyebrow} muted={muted} title={title} />
        </FadeUp>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {loading ? (
            <p className="text-sm text-[#C9BFAE]/60">Loading from backend...</p>
          ) : (
            items.map((item, index) => (
              <FadeUp key={item._id} delay={index * 0.04}>
                <ContentCard item={item} />
              </FadeUp>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function ContentGrid({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: DiscoveryItem[];
}) {
  return (
    <section id={id} className="px-5 py-20 md:px-16 md:py-28 lg:px-24">
      <div className="max-w-7xl border-t border-[#F4EAD8]/10 pt-14 md:pt-16">
        <FadeUp>
          <SectionLabel
            eyebrow={title}
            muted="Collected"
            title={`${title.toLowerCase()} from the archive.`}
          />
        </FadeUp>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((item, index) => (
            <FadeUp key={item._id} delay={index * 0.04}>
              <ContentCard item={item} />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContentCard({ item }: { item: DiscoveryItem }) {
  return (
    <Link
      href={getContentHref(item)}
      className="archive-card group block min-h-[220px] rounded-3xl p-5 sm:p-6 md:min-h-[270px]"
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#C7A15A] sm:text-xs sm:tracking-[0.25em]">
          {item.category || item.type}
        </p>
        <CircleDot size={15} className="text-[#C7A15A]/60" />
      </div>

      <h3 className="serif mt-9 text-3xl leading-none text-[#F4EAD8] md:mt-12 md:text-4xl">
        {item.title}
      </h3>

      <p className="mt-5 text-sm leading-7 text-[#C9BFAE]/65">
        {item.summary || item.hook}
      </p>

      <div className="mt-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-[#C9BFAE]/45 group-hover:text-[#C7A15A] sm:text-xs sm:tracking-[0.22em]">
        Open Inquiry <ArrowUpRight size={15} />
      </div>
    </Link>
  );
}