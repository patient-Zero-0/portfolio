'use client';

import { useEffect, useRef } from 'react';

const MAX = 40;

/* ── GLSL ───────────────────────────────────────────────────────────── */
const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// Template-expanded so GLSL sees literal constants (required for loop bounds)
const FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec3  u_rip[${MAX}]; /* xy = pixel pos (y-flipped), z = spawn_time */

/* Iridescent palette — same phase offsets as CursorGlow / HeroObject */
vec3 iri(float t) {
  return vec3(
    0.52 + 0.38 * sin(t * 6.28318 + 0.00),
    0.52 + 0.32 * sin(t * 6.28318 + 2.094),
    0.78 + 0.18 * sin(t * 6.28318 + 4.189)
  );
}

void main() {
  vec2  px = gl_FragCoord.xy;
  float h  = u_res.y;

  float height  = 0.0;
  float hue_acc = 0.0;

  for (int i = 0; i < ${MAX}; i++) {
    vec3  r   = u_rip[i];
    float age = u_time - r.z;
    if (age < 0.0 || age > 2.4) continue;

    float dist   = length(px - r.xy);
    float wave_r = age * 360.0;          /* px / s  — speed of ring front */
    float dr     = dist - wave_r;

    /* narrow Gaussian ridge riding the wave front */
    float ring  = exp(-dr * dr * 8.5e-4); /* sigma ≈ 34 px */
    float decay = exp(-age * 1.9);         /* ~2 s lifetime   */
    float c     = ring * decay;

    height  += c;
    hue_acc += c * (age * 2.8 + r.z * 0.35);
  }

  vec3  col   = iri(hue_acc + u_time * 0.05);
  float alpha = clamp(height * 0.42, 0.0, 0.80);

  gl_FragColor = vec4(col, alpha);
}
`;

/* ── helpers ────────────────────────────────────────────────────────── */
function mkShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

export default function WaterRipple() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false });
    if (!gl) return;

    /* program */
    const prog = gl.createProgram()!;
    gl.attachShader(prog, mkShader(gl, gl.VERTEX_SHADER,   VERT));
    gl.attachShader(prog, mkShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    /* fullscreen quad */
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    /* uniforms */
    const uRes  = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRip  = gl.getUniformLocation(prog, 'u_rip[0]');

    /* circular ripple buffer — layout: [x, y_flipped, spawn_time] × MAX */
    const ripBuf = new Float32Array(MAX * 3).fill(-9999);
    let   head = 0;
    let   lastT = -1;
    let   raf: number;
    const t0 = performance.now();

    const now = () => (performance.now() - t0) / 1000;

    const push = (x: number, yf: number, t: number) => {
      const i = (head % MAX) * 3;
      ripBuf[i] = x; ripBuf[i + 1] = yf; ripBuf[i + 2] = t;
      head++;
    };

    const onMove = (e: MouseEvent) => {
      const t = now();
      if (t - lastT < 0.036) return;     /* ~28 ripples/s — dense fluid feel */
      lastT = t;
      push(e.clientX, canvas.height - e.clientY, t);
    };

    /* click → concentric splash burst */
    const onDown = (e: MouseEvent) => {
      const t = now();
      const yf = canvas.height - e.clientY;
      for (let k = 0; k < 4; k++) push(e.clientX, yf, t - k * 0.07);
    };

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const loop = () => {
      const t = now();
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform3fv(uRip, ripBuf);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener('resize',    resize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize',    resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      cancelAnimationFrame(raf);
      gl.deleteProgram(prog);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        9991,
        pointerEvents: 'none',
        mixBlendMode:  'screen',
        opacity:       0.48,
      }}
    />
  );
}
