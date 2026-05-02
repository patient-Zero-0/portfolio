'use client';

import { useRef, useEffect } from 'react';
import { crystalState } from '@/lib/crystalState';

// Rotate vector v by quaternion q: v' = q v q^-1
function qRotate(
  q: { w: number; x: number; y: number; z: number },
  v: [number, number, number],
): [number, number, number] {
  const { w, x, y, z } = q;
  const [vx, vy, vz] = v;
  const cx = y * vz - z * vy;
  const cy = z * vx - x * vz;
  const cz = x * vy - y * vx;
  return [
    vx + 2 * w * cx + 2 * (y * cz - z * cy),
    vy + 2 * w * cy + 2 * (z * cx - x * cz),
    vz + 2 * w * cz + 2 * (x * cy - y * cx),
  ];
}

const AXES: { label: string; vec: [number, number, number]; color: string }[] = [
  { label: 'X', vec: [1, 0, 0], color: '#ff4466' },
  { label: 'Y', vec: [0, 1, 0], color: '#44ee88' },
  { label: 'Z', vec: [0, 0, 1], color: '#4499ff' },
];

const SZ = 88;

function fmt(n: number) {
  return (n >= 0 ? '+' : '') + n.toFixed(2);
}

export default function GizmoController() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const quatRef   = useRef<HTMLDivElement>(null);
  const dragRef   = useRef<{ sx: number; sy: number; ry0: number; rx0: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, SZ, SZ);

      const cx  = SZ * 0.5;
      const cy  = SZ * 0.5;
      const len = SZ * 0.33;
      const q   = { w: crystalState.qw, x: crystalState.qx, y: crystalState.qy, z: crystalState.qz };

      const projected = AXES.map(({ label, vec, color }) => {
        const [rx, ry, rz] = qRotate(q, vec);
        return { label, color, px: cx + rx * len, py: cy - ry * len, z: rz };
      });
      // Painter's algorithm: back axes first
      projected.sort((a, b) => a.z - b.z);

      // Origin dot
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.arc(cx, cy, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      for (const { label, color, px, py, z } of projected) {
        const alpha = Math.max(0.28, 0.42 + (z + 1) * 0.28);

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(px, py);
        ctx.strokeStyle = color;
        ctx.lineWidth   = z > 0 ? 1.8 : 1.0;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(px, py, z > 0 ? 3.5 : 2.0, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Axis label — offset outward from tip
        const ox = (px - cx) * 0.32;
        const oy = (py - cy) * 0.32;
        ctx.globalAlpha = Math.min(1, alpha + 0.18);
        ctx.fillStyle   = color;
        ctx.font        = 'bold 8px "Courier New", monospace';
        ctx.textAlign   = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, px + ox, py + oy);
      }

      ctx.globalAlpha = 1;

      // Update quaternion readout
      if (quatRef.current) {
        const { qw, qx, qy, qz } = crystalState;
        quatRef.current.textContent =
          `w${fmt(qw)}  x${fmt(qx)}\ny${fmt(qy)}  z${fmt(qz)}`;
      }
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      sx:  e.clientX,
      sy:  e.clientY,
      ry0: crystalState.gizmoTargetRy,
      rx0: crystalState.gizmoTargetRx,
    };
    crystalState.gizmoActive = true;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current) return;
    const { sx, sy, ry0, rx0 } = dragRef.current;
    crystalState.gizmoTargetRy = ry0 + (e.clientX - sx) * 0.013;
    crystalState.gizmoTargetRx = rx0 + (e.clientY - sy) * 0.013;
  };

  const onPointerUp = () => {
    dragRef.current        = null;
    crystalState.gizmoActive = false;
  };

  const onReset = () => {
    crystalState.gizmoTargetRy = 0;
    crystalState.gizmoTargetRx = 0;
    crystalState.gizmoActive   = true;
    setTimeout(() => { crystalState.gizmoActive = false; }, 1400);
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="font-mono text-[8px] text-white/20 tracking-[0.22em] uppercase">
        Orientation
      </span>
      <canvas
        ref={canvasRef}
        width={SZ}
        height={SZ}
        className="cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      />
      <div
        ref={quatRef}
        className="font-mono text-[7.5px] text-white/18 text-center whitespace-pre leading-[1.75]"
      />
      <button
        onClick={onReset}
        className="w-full font-mono text-[7.5px] text-white/20 tracking-[0.16em] uppercase border border-white/[0.06] rounded px-2 py-0.5 hover:text-white/45 hover:border-white/[0.12] transition-colors duration-200"
      >
        Reset
      </button>
    </div>
  );
}
