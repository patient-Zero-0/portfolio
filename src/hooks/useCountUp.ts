'use client';

import { useEffect, useState } from 'react';

export function useCountUp(to: number, active: boolean, ms = 1300) {
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
