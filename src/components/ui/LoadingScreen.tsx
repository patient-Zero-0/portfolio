'use client';

import { useEffect, useState } from 'react';

const LETTERS = ['A', 'C', 'C', 'E', 'E', 'D', 'E', 'N'];

export default function LoadingScreen() {
  const [phase, setPhase]     = useState<'enter' | 'hold' | 'exit' | 'done'>('enter');
  const [count, setCount]     = useState(0);   // how many letters are lit

  useEffect(() => {
    // Stagger letters in
    let i = 0;
    const letterTimer = setInterval(() => {
      i++;
      setCount(i);
      if (i >= LETTERS.length) {
        clearInterval(letterTimer);
        // Short hold, then exit
        setTimeout(() => setPhase('exit'), 480);
        setTimeout(() => setPhase('done'),  980);
      }
    }, 95);

    return () => clearInterval(letterTimer);
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[9000] flex flex-col items-center justify-center bg-[#080808] pointer-events-none select-none"
      style={{
        opacity:    phase === 'exit' ? 0 : 1,
        transition: phase === 'exit' ? 'opacity 0.5s cubic-bezier(0.4,0,0.2,1)' : 'none',
      }}
    >
      {/* Scanline sweep */}
      <div className="loader-scan" />

      {/* Grid backdrop */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Main wordmark */}
      <div className="relative flex items-center gap-[0.04em]">
        {LETTERS.map((ch, i) => (
          <span
            key={i}
            className="font-black uppercase leading-none text-white"
            style={{
              fontSize: 'clamp(3rem, 10vw, 7rem)',
              letterSpacing: '-0.02em',
              opacity:    i < count ? 1 : 0.05,
              transform:  i < count ? 'translateY(0)' : 'translateY(10px)',
              transition: `opacity 0.22s ease, transform 0.22s ease`,
              textShadow: i < count
                ? '0 0 40px rgba(180,210,255,0.7), 0 0 100px rgba(100,150,255,0.35)'
                : 'none',
            }}
          >
            {ch}
          </span>
        ))}
      </div>

      {/* Subtitle line */}
      <div
        className="mt-4 font-mono text-[10px] tracking-[0.35em] text-white/25 uppercase"
        style={{
          opacity:    count >= LETTERS.length ? 1 : 0,
          transition: 'opacity 0.4s ease 0.1s',
        }}
      >
        Python Dev · AI Eng · Math
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-32 h-px bg-white/[0.08]">
        <div
          className="h-full bg-white/40 origin-left"
          style={{
            transform:  `scaleX(${count / LETTERS.length})`,
            transition: 'transform 0.1s linear',
          }}
        />
      </div>

      {/* Corner marks */}
      {(['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'] as const).map((pos, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 16 16"
          className={`absolute ${pos} opacity-25`}>
          {i === 0 && <><path d="M0 8 L0 0 L8 0" fill="none" stroke="white" strokeWidth="1"/></>}
          {i === 1 && <><path d="M16 8 L16 0 L8 0" fill="none" stroke="white" strokeWidth="1"/></>}
          {i === 2 && <><path d="M0 8 L0 16 L8 16" fill="none" stroke="white" strokeWidth="1"/></>}
          {i === 3 && <><path d="M16 8 L16 16 L8 16" fill="none" stroke="white" strokeWidth="1"/></>}
        </svg>
      ))}
    </div>
  );
}
