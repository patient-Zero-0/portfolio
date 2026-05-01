'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = -200, my = -200;
    let rx = -200, ry = -200;
    let vx = 0, vy = 0;
    let ringScale = 1;
    let clickScale = 1;
    let dotOpacity = 0;
    let ringOpacity = 0;
    let hovering = false;
    let visible = false;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      if (!visible) {
        rx = e.clientX;
        ry = e.clientY;
        visible = true;
      }
      mx = e.clientX;
      my = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      hovering = !!(e.target as Element).closest('a, button, [role="button"], input, label, select');
    };

    const onDown = () => { clickScale = 0.7; };
    const onUp   = () => { clickScale = 1;   };
    const onLeave = () => { visible = false; };
    const onEnter = () => { visible = true;  };

    const loop = () => {
      // spring physics for ring position
      vx += (mx - rx) * 0.13;
      vy += (my - ry) * 0.13;
      vx *= 0.8;
      vy *= 0.8;
      rx += vx;
      ry += vy;

      // lerp ring scale — expands smoothly on hover
      const targetRing = hovering ? 2.0 : 1.0;
      ringScale += (targetRing - ringScale) * 0.12;

      // lerp click pulse back to 1
      clickScale += (1 - clickScale) * 0.18;

      // fade in/out
      const targetOpacity = visible ? 1 : 0;
      dotOpacity  += (targetOpacity - dotOpacity)  * 0.15;
      ringOpacity += (targetOpacity - ringOpacity) * 0.15;

      const combined = ringScale * clickScale;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
        dotRef.current.style.opacity   = dotOpacity.toFixed(3);
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx - 20}px, ${ry - 20}px) scale(${combined.toFixed(4)})`;
        ringRef.current.style.opacity   = (ringOpacity * (hovering ? 0.75 : 0.38)).toFixed(3);
      }

      raf = requestAnimationFrame(loop);
    };

    document.addEventListener('mousemove',  onMove);
    document.addEventListener('mouseover',  onOver);
    document.addEventListener('mousedown',  onDown);
    document.addEventListener('mouseup',    onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    raf = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mouseover',  onOver);
      document.removeEventListener('mousedown',  onDown);
      document.removeEventListener('mouseup',    onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* precision dot — mix-blend-mode:difference inverts whatever sits beneath */}
      <div
        ref={dotRef}
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          width:         6,
          height:        6,
          borderRadius:  '50%',
          background:    '#fff',
          mixBlendMode:  'difference',
          zIndex:        9999,
          pointerEvents: 'none',
          willChange:    'transform, opacity',
          opacity:       0,
        }}
      />
      {/* lagging ring — spring physics, morphs on hover */}
      <div
        ref={ringRef}
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          width:         40,
          height:        40,
          borderRadius:  '50%',
          border:        '1px solid rgba(255,255,255,0.9)',
          zIndex:        9998,
          pointerEvents: 'none',
          willChange:    'transform, opacity',
          opacity:       0,
        }}
      />
    </>
  );
}
