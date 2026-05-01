'use client';

import { useFullPage } from '@/components/layout/FullPage';

/* maps nav label → slide index (grows as sections are added) */
const SECTION_IDX: Record<string, number> = {
  About:      1,
  Projects:   2,
  Skills:     3,
  Experience: 4,
  Contact:    5,
};

export default function Navbar() {
  const { current, goTo } = useFullPage();

  return (
    <nav className="fixed top-0 left-0 right-0 z-[500] flex items-center justify-between px-8 py-6">
      {/* logo — always returns to Hero */}
      <button
        onClick={() => goTo(0)}
        className="font-bold text-white text-sm tracking-[0.15em] uppercase select-none
                   hover:opacity-70 transition-opacity duration-200"
      >
        AccEEden
      </button>

      {/* section links */}
      <div className="hidden md:flex items-center gap-10">
        {(Object.keys(SECTION_IDX) as string[]).map((label) => {
          const idx     = SECTION_IDX[label];
          const active  = current === idx;
          return (
            <button
              key={label}
              onClick={() => goTo(idx)}
              className={`text-sm tracking-wide transition-colors duration-300 ${
                active ? 'text-white' : 'text-white/40 hover:text-white/80'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* contact CTA */}
      <a
        href="mailto:1701734251@qq.com"
        className="text-white/70 text-xs font-mono border border-white/15 rounded-full px-5 py-2
                   hover:border-white/40 hover:text-white transition-all duration-300 tracking-wider"
      >
        Contact / Hire
      </a>
    </nav>
  );
}
