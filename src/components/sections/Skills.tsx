'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/* ── data ────────────────────────────────────────────────────────────── */
const SKILLS = [
  {
    id: '01', en: 'Languages', zh: '编程语言',
    desc: 'Core languages powering every project I ship',
    items: [
      { name: 'Python',       level: 90 },
      { name: 'TypeScript',   level: 75 },
      { name: 'JavaScript',   level: 72 },
      { name: 'SQL',          level: 80 },
      { name: 'HTML / CSS',   level: 78 },
    ],
  },
  {
    id: '02', en: 'Backend', zh: '后端开发',
    desc: 'Server-side frameworks and database tooling',
    items: [
      { name: 'Flask',        level: 85 },
      { name: 'FastAPI',      level: 65 },
      { name: 'MySQL',        level: 78 },
      { name: 'PyMySQL',      level: 82 },
      { name: 'REST APIs',    level: 80 },
    ],
  },
  {
    id: '03', en: 'Scraping', zh: '数据采集',
    desc: 'Web scraping, parsing, and anti-detection strategies',
    items: [
      { name: 'Scrapy',       level: 85 },
      { name: 'Requests',     level: 90 },
      { name: 'Parsel',       level: 80 },
      { name: 'lxml',         level: 75 },
      { name: 'Selenium',     level: 60 },
    ],
  },
  {
    id: '04', en: 'Data', zh: '数据处理',
    desc: 'ETL pipelines, analysis, and visualisation',
    items: [
      { name: 'Pandas',       level: 85 },
      { name: 'NumPy',        level: 75 },
      { name: 'Matplotlib',   level: 80 },
      { name: 'ETL / CSV',    level: 85 },
      { name: 'Regex',        level: 82 },
    ],
  },
  {
    id: '05', en: 'Frontend', zh: '前端开发',
    desc: 'React ecosystem, WebGL shaders, and 3D graphics',
    items: [
      { name: 'Next.js',       level: 70 },
      { name: 'React',         level: 72 },
      { name: 'Three.js',      level: 65 },
      { name: 'WebGL / GLSL',  level: 60 },
      { name: 'Tailwind CSS',  level: 75 },
    ],
  },
  {
    id: '06', en: 'AI / LLM', zh: 'AI 工具',
    desc: 'Language models, RAG pipelines, and agent loops',
    items: [
      { name: 'LLM APIs',      level: 75 },
      { name: 'RAG',           level: 65 },
      { name: 'Prompt Eng',    level: 78 },
      { name: 'Function Call', level: 65 },
      { name: 'Vector DB',     level: 60 },
    ],
  },
  {
    id: '07', en: 'Dev Tools', zh: '开发工具',
    desc: 'Workflow, version control, and environment setup',
    items: [
      { name: 'Git / GitHub',  level: 82 },
      { name: 'VS Code',       level: 90 },
      { name: 'PyCharm',       level: 85 },
      { name: 'Linux CLI',     level: 72 },
      { name: 'Docker',        level: 50 },
    ],
  },
  {
    id: '08', en: 'Mathematics', zh: '数学基础',
    desc: 'Applied mathematics as the engineering foundation',
    items: [
      { name: 'Calculus',        level: 88 },
      { name: 'Linear Algebra',  level: 85 },
      { name: 'Prob & Stats',    level: 82 },
      { name: 'Math Modeling',   level: 75 },
      { name: 'LaTeX',           level: 70 },
    ],
  },
];

/* ── card ────────────────────────────────────────────────────────────── */
function SkillCard({
  cat,
  active,
}: {
  cat: typeof SKILLS[number];
  active: boolean;
}) {
  const [barsOn, setBarsOn] = useState(false);

  useEffect(() => {
    if (active) {
      const t = setTimeout(() => setBarsOn(true), 80);
      return () => clearTimeout(t);
    }
    setBarsOn(false);
  }, [active]);

  const total = SKILLS.length.toString().padStart(2, '0');

  return (
    <div className="skill-card-outer h-full">
      <div className="skill-card-inner h-full">

        <div className="h-full p-7 md:p-10 flex flex-col lg:flex-row gap-6 lg:gap-10">

          {/* ── left: meta ── */}
          <div className="lg:w-52 shrink-0 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] text-white/20 tracking-[0.3em]">
                {cat.id} / {total}
              </span>
              <h3 className="text-4xl md:text-5xl font-bold text-white mt-3 leading-none tracking-tighter">
                {cat.en}
              </h3>
              <p className="font-mono text-[11px] text-white/30 mt-2 tracking-wider">
                {cat.zh}
              </p>
              <p className="text-[12px] text-white/35 mt-4 leading-relaxed">
                {cat.desc}
              </p>
            </div>

            {/* decorative ghost number */}
            <span className="font-mono text-[88px] font-bold text-white/[0.035] leading-none select-none hidden lg:block mt-4">
              {cat.id}
            </span>
          </div>

          {/* ── divider ── */}
          <div className="hidden lg:block w-px bg-white/[0.06] self-stretch" />

          {/* ── right: skill bars ── */}
          <div className="flex-1 flex flex-col justify-center gap-[18px] lg:pl-4">
            {cat.items.map((item, i) => (
              <div key={item.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-[12px] text-white/55">
                    {item.name}
                  </span>
                  <span className="font-mono text-[10px] text-white/22 tabular-nums">
                    {item.level}%
                  </span>
                </div>
                <div className="h-[2px] w-full bg-white/[0.07] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width:      barsOn ? `${item.level}%` : '0%',
                      background: 'linear-gradient(90deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 100%)',
                      transition: `width 0.85s cubic-bezier(0.34,1.2,0.64,1) ${i * 75}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── section ─────────────────────────────────────────────────────────── */
export default function Skills() {
  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);
  const lockedRef  = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [fired, setFired] = useState(false);

  const goTo = useCallback((next: number) => {
    if (lockedRef.current || next < 0 || next >= SKILLS.length || next === currentRef.current) return;
    lockedRef.current  = true;
    currentRef.current = next;
    setCurrent(next);
    setTimeout(() => { lockedRef.current = false; }, 750);
  }, []);

  /* wheel: intercept internally; pass through at carousel edges */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const c = currentRef.current;
      if (e.deltaY > 0 && c === SKILLS.length - 1) return;
      if (e.deltaY < 0 && c === 0)                  return;
      e.stopPropagation();
      e.preventDefault();
      if (e.deltaY > 15)  goTo(c + 1);
      if (e.deltaY < -15) goTo(c - 1);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [goTo]);

  /* fire-once animation on enter */
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
      id="skills"
      className="relative w-full min-h-screen flex flex-col py-20 md:py-24"
    >
      {/* ── section header ── */}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12">
        <div
          className="flex items-center gap-4 mb-10"
          style={{
            opacity:    fired ? 1 : 0,
            transform:  fired ? 'none' : 'translateY(16px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <span className="font-mono text-xs text-white/25 tracking-[0.2em]">§ 03</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="font-mono text-xs text-white/20 tracking-[0.15em]">SKILLS</span>
        </div>
      </div>

      {/* ── carousel ── */}
      <div
        className="flex-1 w-full max-w-5xl mx-auto px-6 md:px-12 flex flex-col min-h-0"
        style={{
          opacity:    fired ? 1 : 0,
          transition: 'opacity 0.7s ease 0.12s',
        }}
      >
        {/* cards track */}
        <div className="relative flex-1 min-h-0 overflow-hidden">
          {SKILLS.map((cat, i) => (
            <div
              key={cat.id}
              style={{
                position:      'absolute',
                inset:          0,
                transform:     `translateX(${(i - current) * 108}%)`,
                transition:    'transform 0.65s cubic-bezier(0.76,0,0.24,1)',
                pointerEvents:  i === current ? 'auto' : 'none',
              }}
            >
              <SkillCard cat={cat} active={i === current} />
            </div>
          ))}
        </div>

        {/* dot navigation */}
        <div className="flex items-center justify-center gap-1.5 pt-5 pb-1">
          {SKILLS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to skill ${i + 1}`}
              style={{
                width:        i === current ? 22 : 5,
                height:        5,
                borderRadius:  3,
                background:   i === current ? 'rgba(255,255,255,0.60)' : 'rgba(255,255,255,0.14)',
                border:       'none',
                padding:       0,
                cursor:       'pointer',
                transition:   'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                display:      'block',
              }}
            />
          ))}
        </div>

        {/* prev / next labels */}
        <div className="flex justify-between pt-3">
          <button
            onClick={() => goTo(current - 1)}
            className={`font-mono text-[10px] tracking-[0.2em] transition-all duration-300
              ${current === 0
                ? 'text-white/10 pointer-events-none'
                : 'text-white/28 hover:text-white/55'}`}
          >
            ← PREV
          </button>
          <button
            onClick={() => goTo(current + 1)}
            className={`font-mono text-[10px] tracking-[0.2em] transition-all duration-300
              ${current === SKILLS.length - 1
                ? 'text-white/10 pointer-events-none'
                : 'text-white/28 hover:text-white/55'}`}
          >
            NEXT →
          </button>
        </div>
      </div>

      {/* bottom rule */}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 mt-8">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
      </div>
    </section>
  );
}
