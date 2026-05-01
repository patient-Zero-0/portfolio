'use client';

import { useEffect, useRef } from 'react';

/* ── GLSL ───────────────────────────────────────────────────────────── */
const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform vec2  u_mouse;   /* exact cursor, pixels, y-flipped */
uniform vec2  u_lag;     /* spring-lagged cursor */
uniform float u_time;
uniform float u_speed;   /* 0..1, normalised cursor velocity */

/* Iridescent palette — mirrors HeroObject's MeshPhysicalMaterial hues */
vec3 iridescent(float t) {
  return vec3(
    0.52 + 0.38 * sin(t * 6.28318 + 0.00),
    0.52 + 0.32 * sin(t * 6.28318 + 2.094),
    0.78 + 0.18 * sin(t * 6.28318 + 4.189)
  );
}

void main() {
  vec2 uv  = gl_FragCoord.xy / u_res;
  float asp = u_res.x / u_res.y;

  /* aspect-corrected offsets */
  vec2 pc = vec2((uv.x - u_mouse.x / u_res.x) * asp,
                  uv.y - u_mouse.y / u_res.y);
  vec2 pl = vec2((uv.x - u_lag.x   / u_res.x) * asp,
                  uv.y - u_lag.y   / u_res.y);

  float dc = length(pc);
  float dl = length(pl);

  /* tight core at exact cursor, brightens proportionally to speed */
  float core = exp(-dc * dc * 260.0) * (0.28 + u_speed * 0.52);

  /* wide atmospheric aura at spring-lagged position */
  float aura = exp(-dl * dl * 9.0) * 0.18;

  /* secondary shimmer ring — expands with speed */
  float ring = exp(-pow(dl - 0.08 - u_speed * 0.04, 2.0) * 180.0) * u_speed * 0.22;

  /* colour: angle from lagged pos + slow time drift + distance modulation */
  float ang = atan(pl.y, pl.x) / 6.28318;
  float hue = ang * 1.8 + u_time * 0.10 + dc * 4.0;
  vec3  col = iridescent(hue);

  float glow = core + aura + ring;
  gl_FragColor = vec4(col, glow);
}
`;

/* ── WebGL helpers ──────────────────────────────────────────────────── */
function makeShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

export default function CursorGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    });
    if (!gl) return;

    /* program */
    const prog = gl.createProgram()!;
    gl.attachShader(prog, makeShader(gl, gl.VERTEX_SHADER,   VERT));
    gl.attachShader(prog, makeShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    /* fullscreen quad */
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1, -1,  1, -1,  -1, 1,  1, 1]),
      gl.STATIC_DRAW,
    );
    const posLoc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    /* uniform locations */
    const uRes   = gl.getUniformLocation(prog, 'u_res');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uLag   = gl.getUniformLocation(prog, 'u_lag');
    const uTime  = gl.getUniformLocation(prog, 'u_time');
    const uSpeed = gl.getUniformLocation(prog, 'u_speed');

    /* state */
    let mx = -600, my = -600;            /* exact cursor (y-flipped) */
    let rx = -600, ry = -600;            /* spring-lagged cursor      */
    let vx = 0,    vy = 0;
    let pmx = -600, pmy = -600;          /* previous frame position   */
    let speed = 0;
    let raf: number;
    const t0 = performance.now();

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const onMove = (e: MouseEvent) => {
      const h = canvas.height;
      mx = e.clientX;
      my = h - e.clientY;                /* flip Y for WebGL */
      /* normalised speed from raw pixel delta */
      const dx = mx - pmx, dy = my - pmy;
      speed = Math.min(Math.sqrt(dx * dx + dy * dy) / 28, 1);
      pmx = mx; pmy = my;
    };

    const loop = () => {
      const t = (performance.now() - t0) / 1000;

      /* spring physics for atmospheric aura */
      vx += (mx - rx) * 0.11;
      vy += (my - ry) * 0.11;
      vx *= 0.79;
      vy *= 0.79;
      rx += vx;
      ry += vy;

      /* speed exponential decay */
      speed *= 0.88;

      /* render */
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.uniform2f(uRes,   canvas.width, canvas.height);
      gl.uniform2f(uMouse, mx, my);
      gl.uniform2f(uLag,   rx, ry);
      gl.uniform1f(uTime,  t);
      gl.uniform1f(uSpeed, speed);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener('resize',    resize);
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize',    resize);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      gl.deleteProgram(prog);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        9990,
        pointerEvents: 'none',
        mixBlendMode:  'screen',
        opacity:       0.55,
      }}
    />
  );
}
