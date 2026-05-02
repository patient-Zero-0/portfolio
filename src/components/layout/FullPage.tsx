'use client';

import {
  Children, createContext, useCallback, useContext,
  useEffect, useRef, useState, type ReactNode,
} from 'react';

/* ── context ────────────────────────────────────────────────────────── */
interface Ctx {
  current: number;
  total:   number;
  goTo:    (i: number) => void;
}
const FullPageCtx = createContext<Ctx>({ current: 0, total: 0, goTo: () => {} });
export const useFullPage = () => useContext(FullPageCtx);

/* ── provider ───────────────────────────────────────────────────────── */
export function FullPageProvider({
  children,
  total,
}: {
  children: ReactNode;
  total: number;
}) {
  const [current, setCurrent] = useState(0);
  const lockedRef = useRef(false);
  const currentRef = useRef(0);

  const goTo = useCallback((i: number) => {
    if (lockedRef.current || i < 0 || i >= total || i === currentRef.current) return;
    lockedRef.current = true;
    currentRef.current = i;
    setCurrent(i);
    setTimeout(() => { lockedRef.current = false; }, 950);
  }, [total]);

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <FullPageCtx.Provider value={{ current, total, goTo }}>
      {children}
    </FullPageCtx.Provider>
  );
}

/* ── slides ─────────────────────────────────────────────────────────── */
export function FullPageSlides({ children }: { children: ReactNode }) {
  const { current, total, goTo } = useFullPage();
  const sections = Children.toArray(children);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* wheel: navigate between sections, but only at scroll boundaries */
  useEffect(() => {
    const COOLDOWN = 950;
    let lastNav = 0;

    const onWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastNav < COOLDOWN) return;

      const slide = slideRefs.current[current];
      if (slide) {
        const atBottom = slide.scrollTop + slide.clientHeight >= slide.scrollHeight - 4;
        const atTop    = slide.scrollTop <= 0;
        if (e.deltaY > 0 && !atBottom) return;
        if (e.deltaY < 0 && !atTop)    return;
      }

      e.preventDefault();
      if      (e.deltaY > 20) { goTo(current + 1); lastNav = now; }
      else if (e.deltaY < -20){ goTo(current - 1); lastNav = now; }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [current, goTo]);

  /* keyboard: arrow up/down and PageUp/PageDown/Home/End */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case 'ArrowDown': case 'PageDown': e.preventDefault(); goTo(current + 1); break;
        case 'ArrowUp':   case 'PageUp':   e.preventDefault(); goTo(current - 1); break;
        case 'Home': e.preventDefault(); goTo(0); break;
        case 'End':  e.preventDefault(); goTo(total - 1); break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, total, goTo]);

  /* touch: swipe up/down to navigate */
  useEffect(() => {
    let startY = 0;
    let startTime = 0;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };

    const onTouchEnd = (e: TouchEvent) => {
      const dy      = startY - e.changedTouches[0].clientY;
      const elapsed = Date.now() - startTime;
      if (Math.abs(dy) < 40 || elapsed > 600) return;

      const slide = slideRefs.current[current];
      if (slide) {
        const atBottom = slide.scrollTop + slide.clientHeight >= slide.scrollHeight - 4;
        const atTop    = slide.scrollTop <= 0;
        if (dy > 0 && !atBottom) return;
        if (dy < 0 && !atTop)    return;
      }

      if (dy > 0) goTo(current + 1);
      else        goTo(current - 1);
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend',   onTouchEnd,   { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend',   onTouchEnd);
    };
  }, [current, goTo]);

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
      {sections.map((child, i) => {
        const active = i === current;
        const above  = i < current;

        const transform = active
          ? 'translateY(0) scale(1)'
          : above
            ? 'translateY(-4%) scale(0.97)'
            : 'translateY(4%)';

        return (
          <div
            key={i}
            ref={(el) => { slideRefs.current[i] = el; }}
            style={{
              position:      'absolute',
              inset:          0,
              overflowY:     'auto',
              opacity:        active ? 1 : 0,
              transform,
              pointerEvents:  active ? 'auto' : 'none',
              transition:    'transform 0.88s cubic-bezier(0.76,0,0.24,1), opacity 0.72s ease',
              willChange:    'transform, opacity',
              zIndex:         active ? 2 : 1,
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}

/* ── dot navigation ─────────────────────────────────────────────────── */
export function FullPageDots({ labels }: { labels?: string[] }) {
  const { current, total, goTo } = useFullPage();
  return (
    <div
      style={{
        position:      'fixed',
        right:          28,
        top:           '50%',
        transform:     'translateY(-50%)',
        zIndex:         300,
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:            12,
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          title={labels?.[i]}
          aria-label={labels?.[i] ?? `Go to section ${i + 1}`}
          onClick={() => goTo(i)}
          style={{
            width:        i === current ? 6 : 4,
            height:       i === current ? 18 : 4,
            borderRadius:  4,
            background:   i === current ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.18)',
            border:       'none',
            cursor:       'pointer',
            padding:       0,
            transition:   'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
            display:      'block',
          }}
        />
      ))}
    </div>
  );
}
