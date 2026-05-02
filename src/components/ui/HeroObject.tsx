'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { crystalState, crystalMatParams } from '@/lib/crystalState';

// ── Code-stream lines ──────────────────────────────────────────────────
const LINES = [
  '// AccEEden · 2026', 'Python Dev · AI Eng', 'Math & Applied Math',
  'open_to_hire: true',  'import scrapy, pandas', 'from parsel import Sel',
  'requests.get(url)',   'headers = CHROME_UA',   'df.dropna().to_csv()',
  'cursor.executemany()','conn.commit() ✓',       'class HupuSpider():',
  'plt.plot(trends)',    'DataFrame · ETL',        '2000+ records · SQL',
  'SELECT AVG(price)',   'GROUP BY district',      'anti_bot: enabled',
  'Next.js 16 · TS',    'Three.js + WebGL',       'GLSL frag shader',
  'metalness=1.0',       'iridescence=1.0',        'RAG pipeline [WIP]',
  'vector_db.search()', 'func_calling: on',        'LLM APIs · Flask',
  'Navier-Stokes ∇×u',  'git push origin main',   'vercel --prod ✓',
  'patient-Zero-0',     'pip install scrapy',      'npm run build ✓',
  '∑ attention(Q,K,V)', 'softmax(QKᵀ/√dₖ)',       '∂L/∂W = gradient',
  'embed_dim = 768',    'n_heads = 12',            '0x4A53 · 0x4F4E',
  'loss → 0.0001 ░▒▓',
];
const COL_RGB: [number, number, number][] = [
  [200, 210, 255], [240, 230, 255], [210, 195, 255],
];

// ── Flow / marble normal-map generator ────────────────────────────────
// Produces the wavy-streaks texture seen on the ALCHE logo material.
function makeFlowNormalMap(scale: number): THREE.CanvasTexture {
  const SZ = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SZ;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(SZ, SZ);
  const d   = img.data;

  // Tileable value noise on a G×G grid
  const G = 32;
  const grid = new Float32Array((G + 1) * (G + 1));
  for (let i = 0; i < grid.length; i++) grid[i] = Math.random();

  function vnoise(x: number, y: number): number {
    const ix = ((Math.floor(x) % G) + G) % G;
    const iy = ((Math.floor(y) % G) + G) % G;
    const fx = x - Math.floor(x), fy = y - Math.floor(y);
    const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    const ix1 = (ix + 1) % G, iy1 = (iy + 1) % G;
    return (
      grid[iy  * (G+1) + ix ] * (1-sx) * (1-sy) +
      grid[iy  * (G+1) + ix1] *    sx  * (1-sy) +
      grid[iy1 * (G+1) + ix ] * (1-sx) *    sy  +
      grid[iy1 * (G+1) + ix1] *    sx  *    sy
    );
  }

  // Fractal Brownian Motion — 5 octaves
  function fbm(x: number, y: number): number {
    let v = 0, amp = 0.5, f = 1.0;
    for (let o = 0; o < 5; o++) {
      v += vnoise(x * f, y * f) * amp;
      amp *= 0.5; f *= 2.13;
    }
    return v;
  }

  // Height field: marble/flow noise
  // sin(diagonal_wave + turbulence) gives the streaming streaks
  const heights = new Float32Array(SZ * SZ);
  for (let py = 0; py < SZ; py++) {
    for (let px = 0; px < SZ; px++) {
      const nx = (px / SZ) * scale;
      const ny = (py / SZ) * scale * 0.38;  // elongate horizontally
      const turb = fbm(nx * 0.5, ny * 0.5) * 5.5;
      // Two wave layers at different angles → cross-hatch flow
      const h1 = Math.sin((nx + ny * 0.4) * 3.5 + turb);
      const h2 = Math.sin((nx * 0.5 - ny)  * 5.0 + turb * 0.6) * 0.45;
      heights[py * SZ + px] = (h1 + h2 + 1.9) / 3.8;  // → [0,1]
    }
  }

  // Convert heights → tangent-space normal map
  // Normal convention: R=+X, G=+Y, B=+Z; flat = (128,128,255)
  const str = 6.0 + scale * 0.4;
  for (let py = 0; py < SZ; py++) {
    for (let px = 0; px < SZ; px++) {
      const px0 = (px - 1 + SZ) % SZ, px1 = (px + 1) % SZ;
      const py0 = (py - 1 + SZ) % SZ, py1 = (py + 1) % SZ;
      const dx = (heights[py  * SZ + px1] - heights[py  * SZ + px0]) * str;
      const dy = (heights[py1 * SZ + px ] - heights[py0 * SZ + px ]) * str;
      const len = Math.sqrt(dx * dx + dy * dy + 1);
      const Nx = -dx / len, Ny = -dy / len, Nz = 1 / len;
      const i4 = (py * SZ + px) * 4;
      d[i4]   = ((Nx * 0.5 + 0.5) * 255) | 0;
      d[i4+1] = ((Ny * 0.5 + 0.5) * 255) | 0;
      d[i4+2] = ((Nz * 0.5 + 0.5) * 255) | 0;
      d[i4+3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

export default function HeroObject() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace   = THREE.SRGBColorSpace;
    renderer.toneMapping        = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    mount.appendChild(renderer.domElement);

    // ── Scene / Camera ─────────────────────────────────────────
    const scene  = new THREE.Scene();
    scene.fog    = new THREE.FogExp2(0x050810, 0.018);

    const camera = new THREE.PerspectiveCamera(38, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 9;

    // ── Lights — subtle so glass stays transparent ─────────────
    scene.add(new THREE.AmbientLight(0xd0e4ff, 0.30));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const blueLight = new THREE.PointLight(0x4488ff, 2.5, 18);
    blueLight.position.set(-5, -2, 3);
    scene.add(blueLight);

    const violetLight = new THREE.PointLight(0xaa88ff, 2.0, 14);
    violetLight.position.set(5, -4, -2);
    scene.add(violetLight);

    // Orbiting rim — drives iridescence color shifts
    const orbitLight = new THREE.PointLight(0xffffff, 2.5, 12);
    scene.add(orbitLight);

    // ── Triangular frame geometry ──────────────────────────────
    const R      = 1.7;
    const stroke = 0.40;
    const Ri     = R - 2 * stroke;   // inner circumradius = 0.90

    const aShape = new THREE.Shape();
    aShape.moveTo(-R * 0.866, -R * 0.5);
    aShape.lineTo(0,            R);
    aShape.lineTo(R * 0.866,  -R * 0.5);
    aShape.closePath();

    const hole = new THREE.Path();
    hole.moveTo(0,             Ri);
    hole.lineTo(Ri * 0.866,  -Ri * 0.5);
    hole.lineTo(-Ri * 0.866, -Ri * 0.5);
    hole.closePath();
    aShape.holes.push(hole);

    const geo = new THREE.ExtrudeGeometry(aShape, {
      steps: 1, depth: 0.60,
      bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 8,
    });
    geo.center();
    geo.computeVertexNormals();

    // ── Glass / transparent material ───────────────────────────
    let normalTex      = makeFlowNormalMap(crystalMatParams.noiseScale);
    let lastNoiseScale = crystalMatParams.noiseScale;

    const normalIntensity = () => crystalMatParams.roughness * 0.60;

    const mat = new THREE.MeshPhysicalMaterial({
      color:                     crystalMatParams.color,
      metalness:                 0.0,
      roughness:                 crystalMatParams.roughness,
      transmission:              1.0,
      thickness:                 1.8,
      ior:                       1.65,
      normalMap:                 normalTex,
      normalScale:               new THREE.Vector2(normalIntensity(), normalIntensity()),
      iridescence:               0.25,
      iridescenceIOR:            1.4,
      iridescenceThicknessRange: [80, 400],
      transparent:               true,
      opacity:                   0.50,
      depthWrite:                false,
      side:                      THREE.DoubleSide,
      envMapIntensity:           0.8,
    });

    const mesh = new THREE.Mesh(geo, mat);

    // Wireframe edge overlay — faint structural detail
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff, wireframe: true, transparent: true, opacity: 0.018,
    });
    const wire = new THREE.Mesh(geo, wireMat);

    // ── Code-stream plane (visible when viewed edge-on) ────────
    const CODE_W = 512;
    const CODE_H = Math.round(CODE_W * (Ri * 1.5) / (Ri * Math.sqrt(3)));

    const codeCanvas = document.createElement('canvas');
    codeCanvas.width  = CODE_W;
    codeCanvas.height = CODE_H;
    const codeCtx     = codeCanvas.getContext('2d')!;
    const codeTex     = new THREE.CanvasTexture(codeCanvas);
    const codeScroll  = [0, 28, 14];
    let   codeScan    = 0, codeFrame = 0;

    const drawCode = () => {
      codeCtx.clearRect(0, 0, CODE_W, CODE_H);
      codeCtx.save();
      codeCtx.beginPath();
      codeCtx.moveTo(CODE_W * 0.5, 0);
      codeCtx.lineTo(CODE_W, CODE_H);
      codeCtx.lineTo(0, CODE_H);
      codeCtx.closePath();
      codeCtx.clip();

      codeFrame++; codeScan += 0.45;
      if (codeScan > CODE_H) codeScan = -30;

      const N_COLS = 3, FONT_H = 11, LINE_H = 16;
      codeCtx.font = `${FONT_H}px "Courier New", monospace`;

      for (let c = 0; c < N_COLS; c++) {
        codeScroll[c] += [0.28, 0.40, 0.33][c];
        const colW = CODE_W / N_COLS;
        const colX = c * colW + 6;
        const [r, g, b] = COL_RGB[c];

        for (let row = 0; row <= Math.ceil(CODE_H / LINE_H) + 2; row++) {
          const ly        = FONT_H + row * LINE_H - (codeScroll[c] % LINE_H);
          if (ly < -LINE_H || ly > CODE_H + LINE_H) continue;
          const flicker   = 0.72 + Math.sin(codeFrame * 0.033 + row * 1.9 + c * 3.1) * 0.28;
          const scanDist  = Math.abs(ly - codeScan);
          const scanBoost = scanDist < LINE_H * 2 ? (1 - scanDist / (LINE_H * 2)) * 0.72 : 0;
          const topFade   = Math.min(1, ly / (LINE_H * 2));
          const botFade   = Math.min(1, (CODE_H - ly) / (LINE_H * 3));
          const alpha     = flicker * topFade * botFade * 0.65 + scanBoost;
          const lineIdx   = (Math.floor((ly + codeScroll[c]) / LINE_H) + c * 14 + LINES.length * 100) % LINES.length;
          const text      = LINES[lineIdx];

          codeCtx.fillStyle = scanBoost > 0.14
            ? `rgba(255,250,245,${Math.min(alpha, 0.93)})`
            : `rgba(${r},${g},${b},${Math.min(alpha, 0.76)})`;

          let display = text;
          while (display.length > 1 && codeCtx.measureText(display).width > colW - 12) {
            display = display.slice(0, -1);
          }
          codeCtx.fillText(display, colX, ly);
        }
      }
      codeCtx.restore();
      codeTex.needsUpdate = true;
    };

    const codePlaneGeo = new THREE.PlaneGeometry(Ri * Math.sqrt(3), Ri * 1.5);
    const codePlaneMat = new THREE.MeshBasicMaterial({
      map: codeTex, transparent: true, opacity: 0.55, side: THREE.FrontSide, depthWrite: false,
    });
    const codePlane = new THREE.Mesh(codePlaneGeo, codePlaneMat);
    codePlane.position.y = Ri * 0.25;
    codePlane.position.z = 0.32;   // front face of the frame

    // ── Group: all parts rotate together ──────────────────────
    const group = new THREE.Group();
    group.add(mesh, wire, codePlane);
    scene.add(group);

    // ── Mouse tracking ─────────────────────────────────────────
    let mx = 0, my = 0, tx = 0, ty = 0;
    const onMouse = (e: MouseEvent) => {
      if (crystalState.gizmoActive) return;
      mx = (e.clientX / window.innerWidth  - 0.5) * Math.PI * 0.65;
      my = (e.clientY / window.innerHeight - 0.5) * Math.PI * 0.40;
    };
    window.addEventListener('mousemove', onMouse);

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Animation loop ─────────────────────────────────────────
    let raf: number, t = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      t += 0.004;
      tx += (mx - tx) * 0.038;
      ty += (my - ty) * 0.038;

      if (crystalState.gizmoActive) {
        group.rotation.y += (crystalState.gizmoTargetRy - group.rotation.y) * 0.12;
        group.rotation.x += (crystalState.gizmoTargetRx - group.rotation.x) * 0.12;
        group.rotation.z *= 0.96;
      } else {
        const autoRy = t * 0.45 + tx;
        const autoRx = Math.sin(t * 0.38) * 0.14 + ty;
        const autoRz = Math.cos(t * 0.24) * 0.07;
        group.rotation.y += (autoRy - group.rotation.y) * 0.04;
        group.rotation.x += (autoRx - group.rotation.x) * 0.04;
        group.rotation.z += (autoRz - group.rotation.z) * 0.04;
        crystalState.gizmoTargetRy = group.rotation.y;
        crystalState.gizmoTargetRx = group.rotation.x;
      }

      // Warm↔cool orbit drives iridescence color cycling
      orbitLight.position.set(
        Math.cos(t * 0.50) * 5,
        Math.sin(t * 0.70) * 3.5,
        Math.sin(t * 0.33) * 5 + 3,
      );

      // Material console live updates
      if (crystalMatParams.dirty) {
        crystalMatParams.dirty = false;
        mat.color.set(crystalMatParams.color);
        mat.roughness = crystalMatParams.roughness;
        // roughness=0 → clear smooth glass; roughness=1 → frosted (strong normals)
        const ni = normalIntensity();
        mat.normalScale.set(ni, ni);
        // White (#fff) = clearest glass; tinted = slightly more visible
        const lum = mat.color.r * 0.299 + mat.color.g * 0.587 + mat.color.b * 0.114;
        mat.opacity = 0.30 + (1 - lum) * 0.40;
        if (crystalMatParams.noiseScale !== lastNoiseScale) {
          lastNoiseScale = crystalMatParams.noiseScale;
          normalTex.dispose();
          normalTex     = makeFlowNormalMap(crystalMatParams.noiseScale);
          mat.normalMap = normalTex;
        }
        mat.needsUpdate = true;
      }

      // Export state for GizmoController
      crystalState.ry = group.rotation.y;
      crystalState.rx = group.rotation.x;
      crystalState.qw = group.quaternion.w;
      crystalState.qx = group.quaternion.x;
      crystalState.qy = group.quaternion.y;
      crystalState.qz = group.quaternion.z;

      drawCode();
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      geo.dispose(); mat.dispose(); wireMat.dispose(); normalTex.dispose();
      codePlaneGeo.dispose(); codePlaneMat.dispose(); codeTex.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
