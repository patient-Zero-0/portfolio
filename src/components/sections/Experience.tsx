'use client';

import { useEffect, useRef, useState } from 'react';

/* ── status config ───────────────────────────────────────────────────── */
const STATUS = {
  live:      { label: 'LIVE',         color: 'text-emerald-400/80', border: 'border-emerald-400/20' },
  completed: { label: 'COMPLETED',    color: 'text-sky-400/80',     border: 'border-sky-400/20'     },
  wip:       { label: 'IN PROGRESS',  color: 'text-amber-400/70',   border: 'border-amber-400/20'   },
  milestone: { label: 'MILESTONE',    color: 'text-violet-400/80',  border: 'border-violet-400/20'  },
  education: { label: 'EDUCATION',    color: 'text-white/45',       border: 'border-white/12'       },
} as const;

type StatusKey = keyof typeof STATUS;

const NODE: Record<StatusKey, string> = {
  live:      'bg-emerald-400/75 shadow-[0_0_10px_rgba(52,211,153,0.55)]',
  completed: 'bg-sky-400/70',
  wip:       'bg-amber-400/75 shadow-[0_0_10px_rgba(251,191,36,0.45)]',
  milestone: 'bg-violet-400/75',
  education: 'bg-white/22',
};

/* ── data ────────────────────────────────────────────────────────────── */
const TIMELINE = [
  {
    id:       '06',
    date:     '2026 — NOW',
    title:    'LLM Agent Development',
    subtitle: 'AI Engineering',
    desc:     'Descending into RAG architectures, function-calling patterns, and autonomous agent loops. Building a personal AI assistant with persistent memory and tool use, grounded in transformer math.',
    tags:     ['Python', 'Flask', 'LLM APIs', 'Vector DB'],
    status:   'wip' as StatusKey,
  },
  {
    id:       '05',
    date:     '2026.05',
    title:    'Portfolio Website — This Site',
    subtitle: 'Full-Stack & Creative Development',
    desc:     'Designed and built from raw GLSL up. Navier-Stokes fluid cursor, iridescent WebGL glow shader, Three.js iridescent prism, and fullpage section transitions. Developed in collaboration with Claude Code.',
    tags:     ['Next.js', 'TypeScript', 'Three.js', 'WebGL / GLSL', 'Tailwind'],
    status:   'live' as StatusKey,
  },
  {
    id:       '04',
    date:     '2025.12',
    title:    'Hupu Sports Analytics',
    subtitle: 'Data Engineering & Visualisation',
    desc:     'Scraped 2,000+ records from Hupu, cleaned via a Pandas ETL pipeline, rendered interactive trend charts with Matplotlib. Bypassed dynamic anti-scraping mechanisms with custom request fingerprinting.',
    tags:     ['Scrapy', 'Pandas', 'Matplotlib', 'MySQL'],
    status:   'completed' as StatusKey,
  },
  {
    id:       '03',
    date:     '2025.11',
    title:    'Anjuke Rental Scraper',
    subtitle: 'Data Engineering',
    desc:     'First production scraper: Beijing rentals on Anjuke, 10 structured fields per listing. Anti-detection via real Chrome headers; demonstrates three parsing strategies — regex, XPath, and CSS selectors.',
    tags:     ['Python', 'Requests', 'Parsel', 'MySQL', 'CSV'],
    status:   'completed' as StatusKey,
  },
  {
    id:       '02',
    date:     '2025.10',
    title:    'Python Journey Begins',
    subtitle: 'Self-Directed Learning',
    desc:     'Started from absolute zero — syntax, OOP, data structures, file I/O. Within weeks moved into web scraping, then databases, then data analysis. One year of obsessive self-teaching later, here we are.',
    tags:     ['Python', 'Self-taught', 'Fundamentals'],
    status:   'milestone' as StatusKey,
  },
  {
    id:       '01',
    date:     '2025.09',
    title:    'Math & Applied Mathematics',
    subtitle: 'B.Sc. — 2025 — Present',
    desc:     'Enrolled as a first-year undergraduate. Calculus, linear algebra, probability & statistics, mathematical modelling — the analytical rigor that now underpins every engineering decision I make.',
    tags:     ['B.Sc.', 'Mathematics', '2025 — Present'],
    status:   'education' as StatusKey,
  },
] as const;

/* ── component ───────────────────────────────────────────────────────── */
export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const [fired, setFired] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setFired(true); obs.disconnect(); } },
      { threshold: 0.05 },
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative w-full min-h-screen flex flex-col py-24 md:py-28"
    >
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 flex flex-col flex-1 gap-8">

        {/* ── header ── */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-white/25 tracking-[0.2em]">§ 04</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="font-mono text-xs text-white/20 tracking-[0.15em]">TIMELINE</span>
        </div>

        {/* ── title ── */}
        <div
          style={{
            opacity:    fired ? 1 : 0,
            transform:  fired ? 'none' : 'translateY(20px)',
            transition: 'opacity 0.6s ease 0.05s, transform 0.6s ease 0.05s',
          }}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tighter leading-none">
            Journey
          </h2>
          <p className="font-mono text-[11px] text-white/22 mt-2 tracking-[0.2em]">
            ONE YEAR · ZERO TO SHIPPING
          </p>
        </div>

        {/* ── timeline ── */}
        <div className="flex flex-col flex-1">
          {TIMELINE.map((item, i) => {
            const st    = STATUS[item.status];
            const node  = NODE[item.status];
            const delay = 0.12 + i * 0.08;

            return (
              <div
                key={item.id}
                className="flex"
                style={{
                  opacity:    fired ? 1 : 0,
                  transform:  fired ? 'none' : 'translateY(22px)',
                  transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
                }}
              >
                {/* date — hidden on mobile */}
                <div className="hidden md:flex w-32 shrink-0 justify-end pr-7 pt-[14px]">
                  <span className="font-mono text-[10px] text-white/22 tracking-wider text-right leading-tight whitespace-nowrap">
                    {item.date}
                  </span>
                </div>

                {/* spine: node + connector */}
                <div className="flex flex-col items-center shrink-0 w-5">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-[14px] ${node}`} />
                  {i < TIMELINE.length - 1 && (
                    <div
                      className="flex-1 w-px bg-white/[0.08]"
                      style={{ minHeight: 28, marginTop: 6 }}
                    />
                  )}
                </div>

                {/* card */}
                <div className="flex-1 pl-6 pb-5 last:pb-0">
                  {/* mobile date */}
                  <span className="font-mono text-[10px] text-white/20 tracking-wider md:hidden block mb-1.5">
                    {item.date}
                  </span>

                  <div
                    className="border border-white/[0.07] rounded-xl p-5 bg-white/[0.02] hover:bg-white/[0.035] hover:border-white/[0.13] transition-all duration-300"
                  >
                    {/* row: title + badge */}
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-bold text-white leading-tight tracking-tight">
                          {item.title}
                        </h3>
                        <p className="font-mono text-[10px] text-white/28 mt-0.5 tracking-wider truncate">
                          {item.subtitle}
                        </p>
                      </div>
                      <span
                        className={`font-mono text-[9px] tracking-wider border rounded-full px-2 py-0.5 shrink-0 ${st.color} ${st.border}`}
                      >
                        {st.label}
                      </span>
                    </div>

                    {/* description */}
                    <p className="text-[12px] leading-[1.8] text-white/38 mb-3">
                      {item.desc}
                    </p>

                    {/* tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[9px] text-white/26 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* bottom rule */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
      </div>
    </section>
  );
}
