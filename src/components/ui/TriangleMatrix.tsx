'use client';

import { useEffect, useRef } from 'react';
import { crystalState } from '@/lib/crystalState';

/* ── content — code + math + identity ─────────────────────────────── */
const LINES = [
  '// AccEEden · 2026',
  'Python Dev · AI Eng',
  'Math & Applied Math',
  'open_to_hire: true',
  'import scrapy, pandas',
  'from parsel import Sel',
  'requests.get(url)',
  'headers = CHROME_UA',
  'df.dropna().to_csv()',
  'cursor.executemany()',
  'conn.commit() ✓',
  'class HupuSpider():',
  'plt.plot(trends)',
  'DataFrame · ETL',
  '2000+ records · SQL',
  'SELECT AVG(price)',
  'GROUP BY district',
  'anti_bot: enabled',
  'Next.js 16 · TS',
  'Three.js + WebGL',
  'GLSL frag shader',
  'transmission=0.92',
  'iridescence=0.85',
  'RAG pipeline [WIP]',
  'vector_db.search()',
  'func_calling: on',
  'LLM APIs · Flask',
  'Navier-Stokes ∇×u',
  'git push origin main',
  'vercel --prod ✓',
  'patient-Zero-0',
  'pip install scrapy',
  'npm run build ✓',
  '∑ attention(Q,K,V)',
  'softmax(QKᵀ/√dₖ)',
  '∂L/∂W = gradient',
  'embed_dim = 768',
  'n_heads = 12',
  '0x4A53 · 0x4F4E',
  'loss → 0.0001 ░▒▓',
];

const N_COLS  = 3;
const FONT_H  = 9;
const LINE_H  = 14;
const PAD     = 14;
const SPEEDS  = [0.28, 0.40, 0.33];
const OFFSETS = [0, 14, 28];

/* Column color accents — blue / white-blue / violet, matching HeroObject lights */
const COL_RGB: [number, number, number][] = [
  [140, 175, 255],   // blue
  [200, 215, 255],   // white-blue
  [180, 155, 255],   // violet
];

export default function TriangleMatrix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const scrollY = [0, 28, 14];
    let raf: number;
    let frame = 0;
    let scanY  = 0;   // sweeping highlight band

    const draw = () => {
      raf = requestAnimationFrame(draw);
      frame++;

      const W = canvas.width;
      const H = canvas.height;

      /* ── Base triangle geometry ──────────────────────────── */
      const baseCx   = W * 0.50;
      const topY     = H * 0.255;
      const botY     = H * 0.748;
      const triH     = botY - topY;
      const baseHalf = triH * 0.548;

      /* ── Apply crystal rotation ───────────────────────────
         Y-rotation: the visible face width narrows like cos(θ).
         A perspective factor (0.28) shifts the center laterally
         so the text slides with the 3D object's apparent motion.
         X-rotation: a subtle vertical nudge.
      ────────────────────────────────────────────────────── */
      const ry = crystalState.ry;
      const rx = crystalState.rx;

      const cosY       = Math.cos(ry);
      const halfW      = baseHalf * Math.max(0.06, Math.abs(cosY));
      const cx         = baseCx + Math.sin(ry) * baseHalf * 0.28;
      const yShift     = Math.sin(rx) * triH * 0.04;

      /* Opacity fades toward 0 when crystal is near edge-on */
      const facingAlpha = Math.max(0.15, Math.abs(cosY));

      ctx.clearRect(0, 0, W, H);
      ctx.save();

      /* Clip to the (rotation-adjusted) triangle */
      ctx.beginPath();
      ctx.moveTo(cx - halfW, topY  + yShift);
      ctx.lineTo(cx + halfW, topY  + yShift);
      ctx.lineTo(cx,         botY  + yShift);
      ctx.closePath();
      ctx.clip();

      const totalW = halfW * 2 - PAD * 2;
      const colW   = Math.max(1, totalW / N_COLS);

      ctx.font = `${FONT_H}px "Courier New", Courier, monospace`;

      /* Advance scanline sweep (top → tip, then reset) */
      scanY += 0.5;
      if (scanY > triH + LINE_H * 4) scanY = -LINE_H * 2;
      const scanAbsY = topY + yShift + scanY;

      for (let c = 0; c < N_COLS; c++) {
        scrollY[c] += SPEEDS[c];

        const colX = cx - halfW + PAD + c * colW;
        const [r, g, b] = COL_RGB[c];

        for (let row = 0; row <= Math.ceil(triH / LINE_H) + 1; row++) {
          const ly = topY + yShift + FONT_H + row * LINE_H - (scrollY[c] % LINE_H);
          if (ly < topY + yShift || ly > botY + yShift + LINE_H) continue;

          const progress   = Math.max(0, Math.min(1, (ly - topY - yShift) / triH));
          const availHalf  = halfW * (1 - progress);
          const colMidX    = colX + colW * 0.5;

          /* Horizontal margin from nearest triangle edge */
          const edgeDist = availHalf - Math.abs(colMidX - cx);
          if (edgeDist < PAD * 0.4) continue;
          const edgeFade = Math.min(1, edgeDist / (PAD * 2.0));

          /* Vertical fades: top entrance, bottom tip exit */
          const topFade = Math.min(1, (ly - topY - yShift) / (LINE_H * 3));
          const botFade = Math.min(1, (botY + yShift - ly)  / (LINE_H * 5));

          /* Depth dimming toward tip */
          const depthFade = 1 - progress * 0.50;

          /* Gentle flicker */
          const flicker = 0.82 + Math.sin(frame * 0.033 + row * 1.9 + c * 3.1) * 0.18;

          /* Scanline proximity boost */
          const scanDist  = Math.abs(ly - scanAbsY);
          const scanBoost = scanDist < LINE_H * 1.5
            ? (1 - scanDist / (LINE_H * 1.5)) * 0.60
            : 0;

          const alpha =
            depthFade * flicker * topFade * botFade * edgeFade * facingAlpha * 0.34
            + scanBoost * facingAlpha;

          const lineIdx = (
            Math.floor((ly - topY - yShift + scrollY[c]) / LINE_H) + OFFSETS[c]
          ) % LINES.length;
          const text = LINES[(lineIdx + LINES.length) % LINES.length];

          ctx.fillStyle = scanBoost > 0.18
            ? `rgba(235, 245, 255, ${Math.min(alpha, 0.88)})`
            : `rgba(${r}, ${g}, ${b}, ${Math.min(alpha, 0.75)})`;

          const maxPx = Math.min(colW - 4, availHalf - Math.abs(colX - cx) - PAD);
          let display = text;
          while (display.length > 2 && ctx.measureText(display).width > maxPx) {
            display = display.slice(0, -1);
          }

          ctx.fillText(display, colX, ly);
        }
      }

      ctx.restore();
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 5, mixBlendMode: 'screen' }}
    />
  );
}
