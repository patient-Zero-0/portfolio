'use client';

import { useState } from 'react';
import { crystalMatParams } from '@/lib/crystalState';

function toHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
}

function fromHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function commit(patch: { color?: string; roughness?: number; noiseScale?: number }) {
  if (patch.color      !== undefined) crystalMatParams.color      = patch.color;
  if (patch.roughness  !== undefined) crystalMatParams.roughness  = patch.roughness;
  if (patch.noiseScale !== undefined) crystalMatParams.noiseScale = patch.noiseScale;
  crystalMatParams.dirty = true;
}

const [initR, initG, initB] = fromHex(crystalMatParams.color);

export default function MaterialConsole() {
  const [open,       setOpen]       = useState(false);
  const [r,          setR]          = useState(initR);
  const [g,          setG]          = useState(initG);
  const [b,          setB]          = useState(initB);
  const [roughness,  setRoughness]  = useState(crystalMatParams.roughness);
  const [noiseScale, setNoiseScale] = useState(crystalMatParams.noiseScale);

  const onRGB = (channel: 'r' | 'g' | 'b', val: number) => {
    const nr = channel === 'r' ? val : r;
    const ng = channel === 'g' ? val : g;
    const nb = channel === 'b' ? val : b;
    if (channel === 'r') setR(val);
    if (channel === 'g') setG(val);
    if (channel === 'b') setB(val);
    commit({ color: toHex(nr, ng, nb) });
  };

  return (
    <div className="absolute bottom-6 left-6 z-20 font-mono select-none">

      {/* Toggle row — mirrors ALCHE "MainLogo Material =" style */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors duration-200 text-[10px] tracking-[0.16em]"
      >
        <span>MESH MATERIAL</span>
        <span className="text-white/20 w-3 text-center">{open ? '−' : '='}</span>
      </button>

      {/* Slide-down panel */}
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out"
        style={{ maxHeight: open ? '380px' : '0px', opacity: open ? 1 : 0 }}
      >
        <div className="mt-2 w-56 rounded-xl border border-white/[0.07] bg-black/45 backdrop-blur-md p-4 flex flex-col gap-5">

          {/* ── Color (RGB) — white = clear glass ── */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-baseline">
              <span className="text-[8.5px] text-white/25 tracking-[0.2em] uppercase">Color</span>
              <span className="text-[8.5px] text-white/20">
                {toHex(r, g, b).toUpperCase()}
              </span>
            </div>
            {/* Preview swatch */}
            <div
              className="w-full h-3 rounded-sm border border-white/[0.08]"
              style={{ background: toHex(r, g, b) }}
            />
            {/* RGB sliders */}
            {([
              { ch: 'r' as const, val: r, label: 'R', track: 'rgba(255,60,60,0.55)' },
              { ch: 'g' as const, val: g, label: 'G', track: 'rgba(60,220,100,0.55)' },
              { ch: 'b' as const, val: b, label: 'B', track: 'rgba(80,150,255,0.55)' },
            ]).map(({ ch, val, label, track }) => (
              <div key={ch} className="flex items-center gap-2">
                <span className="text-[8px] text-white/25 w-3">{label}</span>
                <div className="relative flex-1 flex items-center">
                  <div
                    className="absolute h-px w-full rounded-full"
                    style={{ background: track }}
                  />
                  <input
                    type="range" min={0} max={255} step={1} value={val}
                    onChange={e => onRGB(ch, +e.target.value)}
                    className={sliderCls}
                  />
                </div>
                <span className="text-[8px] text-white/25 w-6 text-right">{val}</span>
              </div>
            ))}
            <p className="text-[7.5px] text-white/15 tracking-wide">
              255,255,255 = clear glass
            </p>
          </div>

          {/* ── Roughness ── */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-baseline">
              <span className="text-[8.5px] text-white/25 tracking-[0.2em] uppercase">Roughness</span>
              <span className="text-[9px] text-white/35">{roughness.toFixed(2)}</span>
            </div>
            <input
              type="range" min={0} max={1} step={0.01}
              value={roughness}
              onChange={e => { const v = +e.target.value; setRoughness(v); commit({ roughness: v }); }}
              className={sliderCls}
            />
            <p className="text-[7.5px] text-white/15 tracking-wide">0 = clear · 1 = frosted</p>
          </div>

          {/* ── Noise Scale ── */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-baseline">
              <span className="text-[8.5px] text-white/25 tracking-[0.2em] uppercase">Noise Scale</span>
              <span className="text-[9px] text-white/35">{noiseScale.toFixed(1)}</span>
            </div>
            <input
              type="range" min={1} max={20} step={0.5}
              value={noiseScale}
              onChange={e => { const v = +e.target.value; setNoiseScale(v); commit({ noiseScale: v }); }}
              className={sliderCls}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

const sliderCls = [
  'w-full cursor-pointer appearance-none bg-transparent relative z-10',
  '[&::-webkit-slider-runnable-track]:h-px [&::-webkit-slider-runnable-track]:bg-white/15 [&::-webkit-slider-runnable-track]:rounded-full',
  '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:mt-[-4px]',
  '[&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full',
  '[&::-webkit-slider-thumb]:bg-white/70 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing',
  '[&::-moz-range-track]:h-px [&::-moz-range-track]:bg-white/15',
  '[&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:rounded-full',
  '[&::-moz-range-thumb]:bg-white/70 [&::-moz-range-thumb]:border-0',
].join(' ');
