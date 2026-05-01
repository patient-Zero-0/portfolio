'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function HeroObject() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    mount.appendChild(renderer.domElement);

    // ── Scene / Camera ─────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.z = 9;

    // ── Lights ─────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const key = new THREE.DirectionalLight(0xffffff, 4);
    key.position.set(4, 6, 4);
    scene.add(key);

    // Colored point lights drive the iridescent color shifts
    const blueLight = new THREE.PointLight(0x4488ff, 5, 18);
    blueLight.position.set(-5, -3, 4);
    scene.add(blueLight);

    const orangeLight = new THREE.PointLight(0xff6020, 4, 14);
    orangeLight.position.set(5, -4, -2);
    scene.add(orangeLight);

    const topLight = new THREE.PointLight(0xffffff, 3, 14);
    topLight.position.set(0, 6, 2);
    scene.add(topLight);

    // Orbiting accent light — creates live iridescent shifts as it moves
    const orbitLight = new THREE.PointLight(0xc0c0ff, 3, 10);
    scene.add(orbitLight);

    // ── Geometry — equilateral triangular prism (like alche) ──
    const r = 1.7;
    const shape = new THREE.Shape();
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
    }
    shape.closePath();

    const extrudeSettings = {
      steps: 1,
      depth: 0.55,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 5,
    };

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    geo.computeVertexNormals();

    // ── Material — iridescent crystal glass ───────────────────
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.0,
      roughness: 0.0,
      transmission: 0.88,
      thickness: 1.8,
      ior: 2.1,
      iridescence: 1.0,
      iridescenceIOR: 1.5,
      iridescenceThicknessRange: [150, 1000],
      transparent: true,
      side: THREE.DoubleSide,
      envMapIntensity: 1.0,
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Subtle wireframe overlay — adds the "engineering grid" feel
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.05,
    });
    const wire = new THREE.Mesh(geo, wireMat);
    scene.add(wire);

    // ── Mouse tracking ─────────────────────────────────────────
    let mx = 0, my = 0, tx = 0, ty = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * Math.PI * 0.7;
      my = (e.clientY / window.innerHeight - 0.5) * Math.PI * 0.45;
    };
    window.addEventListener('mousemove', onMouse);

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Animation loop ─────────────────────────────────────────
    let raf: number;
    let t = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      t += 0.004;

      // Smooth mouse follow
      tx += (mx - tx) * 0.035;
      ty += (my - ty) * 0.035;

      // Rotation: auto-spin + mouse influence
      mesh.rotation.y = t * 0.55 + tx;
      mesh.rotation.x = Math.sin(t * 0.4) * 0.18 + ty;
      mesh.rotation.z = Math.cos(t * 0.28) * 0.1;
      wire.rotation.copy(mesh.rotation);

      // Orbit accent light for dynamic iridescent highlights
      orbitLight.position.set(
        Math.cos(t * 0.6) * 4,
        Math.sin(t * 0.8) * 3,
        Math.sin(t * 0.4) * 4 + 3
      );

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      geo.dispose();
      mat.dispose();
      wireMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
