'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Grid from '@/components/ui/Grid';
import BlurText from '@/components/ui/BlurText';
import { useFullPage } from '@/components/layout/FullPage';

const HeroObject       = dynamic(() => import('@/components/ui/HeroObject'),       { ssr: false });
const GizmoController  = dynamic(() => import('@/components/ui/GizmoController'),  { ssr: false });
const MaterialConsole  = dynamic(() => import('@/components/ui/MaterialConsole'),  { ssr: false });

export default function Hero() {
  const { goTo }  = useFullPage();
  const gridRef   = useRef<HTMLDivElement>(null);
  const glowRef   = useRef<HTMLDivElement>(null);

  // Smooth mouse-parallax for grid + radial glow
  useEffect(() => {
    const mouse = { x: 0, y: 0 };
    let tx = 0, ty = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth  - 0.5;
      mouse.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', onMove);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      tx += (mouse.x - tx) * 0.05;
      ty += (mouse.y - ty) * 0.05;
      if (gridRef.current) {
        gridRef.current.style.transform = `translate(${tx * 16}px, ${ty * 16}px)`;
      }
      if (glowRef.current) {
        const gx = (mouse.x + 0.5) * 100;
        const gy = (mouse.y + 0.5) * 100;
        glowRef.current.style.background =
          `radial-gradient(700px at ${gx}% ${gy}%, rgba(40,80,200,0.07), transparent 70%)`;
      }
    };
    tick();

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative h-screen overflow-hidden bg-[#080808]">

      {/* ── Layer 1: Grid with parallax ─────────────────────────── */}
      <div ref={gridRef} className="absolute inset-0 will-change-transform">
        <Grid />
      </div>

      {/* ── Layer 1.5: Mouse-following radial glow ──────────────── */}
      <div ref={glowRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />

      {/* ── Layer 2: Viewport-spanning ACCEEDEN — full white with glow ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="text-[23vw] font-black uppercase tracking-tighter leading-none text-white whitespace-nowrap"
          style={{
            opacity: 0.13,
            textShadow:
              '0 0 80px rgba(180,210,255,0.55), 0 0 200px rgba(100,150,255,0.30), 0 0 400px rgba(60,100,220,0.15)',
          }}
        >
          ACCEEDEN
        </span>
      </div>

      {/* ── Layer 3: 3D crystal A-shape — fills full canvas ───────── */}
      <div className="absolute inset-0">
        <HeroObject />
      </div>

      {/* ── Layer 4: Left ruler ───────────────────────────────────── */}
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

      {/* ── Layer 5: Gizmo controller — top-right ─────────────────── */}
      <div className="absolute top-20 right-6 z-20">
        <div className="rounded-xl border border-white/[0.07] bg-black/25 backdrop-blur-md p-3">
          <GizmoController />
        </div>
      </div>

      {/* ── Layer 6: Text content — left half, z-10 ───────────────── */}
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
          as="h1"
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
          <button
            onClick={() => goTo(2)}
            className="px-6 py-2.5 bg-white text-black text-xs font-bold rounded-full hover:bg-white/90 transition-all duration-200 hover:scale-105 active:scale-95 tracking-wide uppercase"
          >
            View My Work
          </button>
          <a
            href="https://github.com/patient-Zero-0"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 border border-white/15 text-white/60 text-xs font-mono rounded-full hover:border-white/35 hover:text-white/90 transition-all duration-200 tracking-wider"
          >
            GitHub ↗
          </a>
        </div>
      </div>

      {/* ── Layer 6.5: Material console — bottom-left ────────────── */}
      <MaterialConsole />

      {/* ── Layer 7: Bottom scroll indicator ─────────────────────── */}
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
