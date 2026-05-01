'use client';

import dynamic from 'next/dynamic';
import Grid from '@/components/ui/Grid';
import BlurText from '@/components/ui/BlurText';

const HeroObject = dynamic(() => import('@/components/ui/HeroObject'), { ssr: false });

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden bg-[#080808]">

      {/* ── Layer 1: Grid ──────────────────────────────────── */}
      <Grid />

      {/* ── Layer 2: Viewport-spanning background text ────── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span className="text-[21vw] font-black uppercase tracking-tighter leading-none text-white/[0.04] whitespace-nowrap">
          DEVELOPER
        </span>
      </div>

      {/* ── Layer 3: 3D crystal object — fills full canvas ── */}
      <div className="absolute inset-0">
        <HeroObject />
      </div>

      {/* ── Layer 4: Left ruler (alche-style) ─────────────── */}
      <div className="absolute left-7 top-1/2 -translate-y-1/2 flex flex-col items-center gap-[6px] pointer-events-none">
        <span
          className="font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase mb-2"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          TOP
        </span>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="w-3 h-px bg-white/10" />
        ))}
      </div>

      {/* ── Layer 5: Top-right data readout ───────────────── */}
      <div className="absolute top-24 right-8 font-mono text-[10px] text-right pointer-events-none select-none">
        <div className="text-white/20 mb-1 tracking-wider">MESH_ROTATION ■</div>
        <div className="text-white/25 space-x-3">
          <span><span className="text-white/15">x</span> 0.00</span>
          <span><span className="text-white/15">y</span> 0.00</span>
          <span><span className="text-white/15">z</span> 1.00</span>
        </div>
      </div>

      {/* ── Layer 6: Text content — left-aligned, z-10 ────── */}
      <div className="absolute left-0 top-0 bottom-0 w-full md:w-[50%] flex flex-col justify-center px-10 md:px-16 z-10 pointer-events-none">

        {/* Status pill */}
        <div className="flex items-center gap-2 mb-8" style={{ opacity: 0, animation: 'fadeUp 0.5s ease 0.2s forwards' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px] text-white/30 tracking-[0.22em] uppercase">
            available for opportunities
          </span>
        </div>

        {/* Main title */}
        <BlurText
          text="I build things that live on the internet."
          delay={100}
          animateBy="words"
          direction="top"
          stepDuration={0.38}
          className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.1] tracking-tight mb-7 justify-start"
        />

        {/* Monospace subtitle */}
        <p
          className="font-mono text-xs text-white/25 tracking-[0.22em] uppercase mb-10"
          style={{ opacity: 0, animation: 'fadeUp 0.5s ease 1.2s forwards' }}
        >
          Developer · Student · Full Stack
        </p>

        {/* CTAs — pointer-events back on */}
        <div
          className="flex items-center gap-4 pointer-events-auto"
          style={{ opacity: 0, animation: 'fadeUp 0.5s ease 1.5s forwards' }}
        >
          <a
            href="#projects"
            className="px-6 py-2.5 bg-white text-black text-xs font-bold rounded-full
                       hover:bg-white/90 transition-all duration-200 hover:scale-105 active:scale-95 tracking-wide uppercase"
          >
            View My Work
          </a>
          <a
            href="https://github.com/patient-Zero-0"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 border border-white/15 text-white/60 text-xs font-mono rounded-full
                       hover:border-white/35 hover:text-white/90 transition-all duration-200 tracking-wider"
          >
            GitHub ↗
          </a>
        </div>
      </div>

      {/* ── Layer 7: Bottom scroll indicator ──────────────── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
        style={{ opacity: 0, animation: 'fadeUp 0.5s ease 2s forwards' }}
      >
        <span className="font-mono text-[9px] text-white/20 tracking-[0.35em] uppercase">
          scroll to explore →
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}
