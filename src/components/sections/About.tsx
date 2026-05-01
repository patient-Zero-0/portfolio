'use client';

import { useEffect, useRef, useState } from 'react';

/* ── spec rows ───────────────────────────────────────────────────────── */
const SPEC = [
  { key: 'SCHOOL', val: 'Jiaying University'          },
  { key: 'MAJOR',  val: 'Math & Applied Mathematics'  },
  { key: 'STAGE',  val: '1st Year Undergraduate'      },
  { key: 'STACK',  val: 'Python · Flask · Scrapy'     },
  { key: 'FOCUS',  val: 'LLM / AI Engineering'        },
  { key: 'STATUS', val: 'Open to Internships'         },
];

/* ── marquee items ───────────────────────────────────────────────────── */
const MARQUEE = [
  'PYTHON', 'FLASK', 'NEXT.JS', 'LLM', 'RAG',
  'PROMPT ENG', 'AI DEV', 'MATH', 'DATA SCIENCE',
  '二次元', 'GAMING', 'FRONTIER AI',
];

/* ── count-up hook ───────────────────────────────────────────────────── */
function useCountUp(to: number, active: boolean, ms = 1300) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const ease = 1 - Math.pow(1 - Math.min((ts - start) / ms, 1), 3);
      setN(Math.round(ease * to));
      if (ease < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, to, ms]);
  return n;
}

/* ── component ───────────────────────────────────────────────────────── */
export default function About() {
  const secRef = useRef<HTMLElement>(null);
  const [fired, setFired] = useState(false);
  const yr  = useCountUp(1, fired, 1000);
  const prj = useCountUp(5, fired, 1200);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setFired(true); obs.disconnect(); } },
      { threshold: 0.1 },
    );
    if (secRef.current) obs.observe(secRef.current);
    return () => obs.disconnect();
  }, []);

  const fadeIn = (delay = 0): React.CSSProperties => ({
    opacity:    fired ? 1 : 0,
    transform:  fired ? 'none' : 'translateY(22px)',
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  return (
    <section ref={secRef} id="about" className="relative w-full py-28 md:py-36 overflow-hidden">

      {/* ── section label ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center gap-4 mb-16">
          <span className="font-mono text-xs text-white/25 tracking-[0.2em]">§ 01</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="font-mono text-xs text-white/20 tracking-[0.15em]">ABOUT</span>
        </div>

        {/* ── main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">

          {/* ══ LEFT: bio ══ */}
          <div className="lg:col-span-3 flex flex-col gap-8" style={fadeIn(0)}>

            {/* name + status */}
            <div className="flex flex-col gap-3">
              <h2 className="text-6xl md:text-7xl font-bold tracking-tighter text-white leading-none">
                AccEEden
              </h2>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="font-mono text-[11px] text-emerald-400/80 tracking-[0.18em]">
                  OPEN TO INTERNSHIPS &amp; COLLABORATIONS
                </span>
              </div>
            </div>

            {/* bio paragraphs */}
            <div className="space-y-4 text-[15px] leading-[1.85] text-white/50 max-w-lg">
              <p>
                A Math & Applied Mathematics student at Jiaying University who fell
                into Python and never looked back. In one year: shipped scraping
                pipelines processing 1,000+ records daily, built data-analysis
                dashboards with Pandas & Matplotlib, and wrote this site from raw
                GLSL shaders up.
              </p>
              <p>
                Currently descending into the LLM rabbit hole — reading transformer
                papers with the same obsessive energy I bring to games and anime.
                I learn fast, ship things I care about, and bring the rigor of
                applied math to every engineering problem I touch.
              </p>
            </div>

            {/* currently block */}
            <div style={fadeIn(0.15)}>
              <div className="border-l border-white/20 pl-5 flex flex-col gap-3">
                <span className="font-mono text-[10px] text-white/25 tracking-[0.2em]">
                  CURRENTLY
                </span>
                <ul className="space-y-2 text-[13px] text-white/55">
                  {[
                    'Exploring LLM architectures — RAG pipelines, function calling, agent loops',
                    'Building AI-native tools with Python & Flask as the backbone',
                    'Learning transformer internals from the math up',
                  ].map((item) => (
                    <li key={item} className="flex gap-3 items-start">
                      <span className="text-white/20 mt-0.5 shrink-0 font-mono">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* interests row */}
            <div style={fadeIn(0.22)} className="flex flex-col gap-2 pt-1">
              <span className="font-mono text-[10px] text-white/20 tracking-[0.2em]">INTERESTS</span>
              <div className="flex gap-6 text-[13px] text-white/40 font-mono">
                <span className="hover:text-white/70 transition-colors duration-200">🌸 二次元</span>
                <span className="hover:text-white/70 transition-colors duration-200">🎮 Gaming</span>
                <span className="hover:text-white/70 transition-colors duration-200">📡 Frontier AI</span>
                <span className="hover:text-white/70 transition-colors duration-200">∫ Math</span>
              </div>
            </div>
          </div>

          {/* ══ RIGHT: spec + stats ══ */}
          <div className="lg:col-span-2 flex flex-col gap-4" style={fadeIn(0.1)}>

            {/* terminal spec panel */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 font-mono">
              {/* panel title bar */}
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/[0.06]">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                </div>
                <span className="text-[10px] text-white/20 tracking-widest ml-2">
                  profile.config
                </span>
              </div>

              {/* spec rows */}
              <div className="space-y-3">
                {SPEC.map(({ key, val }, i) => (
                  <div
                    key={key}
                    className="flex gap-4 items-start text-[12px]"
                    style={{
                      opacity:    fired ? 1 : 0,
                      transition: `opacity 0.4s ease ${0.2 + i * 0.07}s`,
                    }}
                  >
                    <span className="text-white/20 shrink-0 select-none">›</span>
                    <span className="text-white/30 w-16 shrink-0 uppercase tracking-wider">
                      {key}
                    </span>
                    <span className={`text-white/70 ${key === 'STATUS' ? 'text-emerald-400/80' : ''}`}>
                      {val}
                    </span>
                  </div>
                ))}
                {/* blinking cursor */}
                <div className="flex gap-4 items-center text-[12px] pt-1">
                  <span className="text-white/20 select-none">›</span>
                  <span
                    className="text-white/40 inline-block w-2 h-4 bg-white/40 animate-pulse"
                    style={{ animationDuration: '1s' }}
                  />
                </div>
              </div>
            </div>

            {/* mini stat cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { n: yr,  suffix: ' yr',  label: 'Experience',    delay: 0.25 },
                { n: prj, suffix: '+',    label: 'Projects Built', delay: 0.33 },
              ].map(({ n, suffix, label, delay }) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.02]
                             hover:bg-white/[0.05] hover:border-white/[0.14]
                             transition-all duration-300 p-5 flex flex-col gap-3"
                  style={fadeIn(delay)}
                >
                  <span className="text-4xl font-bold text-white leading-none tracking-tight">
                    {n}{suffix}
                  </span>
                  <span className="font-mono text-[10px] text-white/25 tracking-[0.15em] uppercase">
                    {label}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ── infinite marquee ── */}
      <div className="mt-20 border-y border-white/[0.05] py-4 overflow-hidden select-none">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: 'marquee-scroll 30s linear infinite' }}
        >
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-4">
              <span className="font-mono text-[11px] tracking-[0.2em] text-white/25 hover:text-white/50 transition-colors duration-200">
                {item}
              </span>
              <span className="text-white/[0.08] font-mono">──</span>
            </span>
          ))}
        </div>
      </div>

      {/* bottom rule */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
      </div>
    </section>
  );
}
