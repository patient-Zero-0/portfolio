'use client';

import { useEffect, useRef, useState } from 'react';

type ProjectStatus = 'completed' | 'live' | 'wip';
interface Project {
  id: string; name: string; nameZh: string; role: string; date: string;
  status: ProjectStatus; github?: string; desc: string;
  metrics: readonly string[]; stack: readonly string[];
}

const PROJECTS: Project[] = [
  {
    id:      '01',
    name:    'Anjuke Rental Scraper',
    nameZh:  '安居客北京租房数据采集',
    role:    'Data Engineering',
    date:    '2025.11',
    status:  'completed',
    github:  'https://github.com/patient-Zero-0/Crawler-item-storage',
    desc:    'Scrapes Beijing rental listings from Anjuke (bj.zu.anjuke.com), extracting 10 structured fields per property — price, floor, house type, area, community, district, subway tags and more. Implements anti-detection via real Chrome headers and cookies; code deliberately demonstrates three parsing strategies (regex, XPath, CSS selectors) for comparison, with Parsel CSS selectors as the production path.',
    metrics: ['100 + verified listings', '10 fields per record', 'CSV + MySQL dual output', 'Regex data normalisation'],
    stack:   ['Python', 'Requests', 'Parsel', 'lxml', 'PyMySQL', 'CSV'],
  },
  {
    id:      '02',
    name:    'Hupu Sports Analytics',
    nameZh:  '虎扑体育数据分析平台',
    role:    'Data Engineering & Visualisation',
    date:    '2025.12',
    status:  'completed',
    github:  'https://github.com/patient-Zero-0/Crawler-item-storage',
    desc:    'End-to-end data system targeting Hupu — one of China\'s largest sports communities. Scrapes news and match records, cleans them through a Pandas pipeline, and renders interactive trend charts via Matplotlib.',
    metrics: ['2,000+ records scraped', 'Bypass dynamic anti-scraping', 'Multi-chart dashboard', 'Pandas ETL pipeline'],
    stack:   ['Python', 'Scrapy', 'Pandas', 'Matplotlib', 'MySQL'],
  },
  {
    id:      '03',
    name:    'Portfolio — This Site',
    nameZh:  '个人作品集网站',
    role:    'Full-Stack & Creative Dev',
    date:    '2026.05',
    status:  'live',
    github:  'https://github.com/patient-Zero-0/portfolio',
    desc:    'Built from scratch with Next.js + raw GLSL. Features a custom Navier-Stokes fluid cursor, iridescent WebGL glow shader, water-ripple ring simulation, Three.js iridescent prism, and fullpage section transitions.',
    metrics: ['Raw GLSL shaders', 'Navier-Stokes fluid', 'Spring-physics cursor', 'Fullpage transitions'],
    stack:   ['Next.js', 'TypeScript', 'Three.js', 'WebGL / GLSL', 'Tailwind'],
  },
  {
    id:      '04',
    name:    'LLM Agent — WIP',
    nameZh:  'AI 大模型应用',
    role:    'AI Engineering',
    date:    '2026 — In progress',
    status:  'wip',
    desc:    'Exploring RAG architectures, function-calling patterns, and autonomous agent loops. Building a personal AI assistant with persistent memory and tool use, grounded in the math of transformer attention.',
    metrics: ['RAG pipeline', 'Function calling', 'Agent loops', 'Vector retrieval'],
    stack:   ['Python', 'Flask', 'LLM APIs', 'Vector DB'],
  },
];

const STATUS_STYLE = {
  completed: { label: 'COMPLETED',   color: 'text-sky-400/80',     border: 'border-sky-400/20' },
  live:      { label: 'LIVE',        color: 'text-emerald-400/80', border: 'border-emerald-400/20' },
  wip:       { label: 'IN PROGRESS', color: 'text-amber-400/70',   border: 'border-amber-400/20' },
};

export default function Projects() {
  const secRef = useRef<HTMLElement>(null);
  const [fired, setFired] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setFired(true); obs.disconnect(); } },
      { threshold: 0.05 },
    );
    if (secRef.current) obs.observe(secRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={secRef}
      id="projects"
      className="relative w-full min-h-screen flex flex-col py-24 md:py-28"
    >
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 flex flex-col flex-1 gap-10">

        {/* header */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-white/25 tracking-[0.2em]">§ 02</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="font-mono text-xs text-white/20 tracking-[0.15em]">PROJECTS</span>
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {PROJECTS.map((p, i) => {
            const st = STATUS_STYLE[p.status];
            return (
              <div
                key={p.id}
                className="group relative flex flex-col border border-white/[0.07] rounded-2xl p-6 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.15] transition-all duration-400"
                style={{
                  opacity:    fired ? 1 : 0,
                  transform:  fired ? 'none' : 'translateY(28px)',
                  transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s, background 0.3s, border-color 0.3s`,
                }}
              >
                {/* top row */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <span className="font-mono text-[11px] text-white/20 tracking-widest pt-0.5">
                    {p.id}
                  </span>
                  <span className={`font-mono text-[10px] tracking-wider border rounded-full px-2.5 py-0.5 ${st.color} ${st.border}`}>
                    {st.label}
                  </span>
                </div>

                {/* name block */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white leading-tight tracking-tight">
                    {p.name}
                  </h3>
                  <p className="font-mono text-[11px] text-white/25 mt-1 tracking-wide">
                    {p.nameZh} · {p.date}
                  </p>
                </div>

                {/* description */}
                <p className="text-[13px] leading-relaxed text-white/45 mb-5 flex-1">
                  {p.desc}
                </p>

                {/* metrics */}
                <div className="grid grid-cols-2 gap-1.5 mb-5">
                  {p.metrics.map((m) => (
                    <div key={m} className="flex items-center gap-2 text-[11px] text-white/40 font-mono">
                      <span className="text-white/15 shrink-0">›</span>
                      {m}
                    </div>
                  ))}
                </div>

                {/* stack tags */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06]">
                  {p.stack.map((t) => (
                    <span key={t} className="font-mono text-[10px] text-white/30 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>

                {/* bottom row: role + github */}
                <div className="flex items-center justify-between mt-3">
                  <span className="font-mono text-[9px] text-white/15 tracking-widest uppercase">
                    {p.role}
                  </span>
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 font-mono text-[10px] text-white/30 hover:text-white/70 transition-colors duration-200 pointer-events-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      GitHub ↗
                    </a>
                  )}
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
