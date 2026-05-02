'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import LoadingScreen from '@/components/ui/LoadingScreen';

const SplashCursor = dynamic(() => import('@/components/ui/SplashCursor'), { ssr: false });
const CursorGlow   = dynamic(() => import('@/components/ui/CursorGlow'),   { ssr: false });
const WaterRipple  = dynamic(() => import('@/components/ui/WaterRipple'),  { ssr: false });
const CustomCursor = dynamic(() => import('@/components/ui/CustomCursor'), { ssr: false });

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [enableEffects, setEnableEffects] = useState(false);

  useEffect(() => {
    const pointer = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnableEffects(pointer && !reduced);
  }, []);

  return (
    <>
      {/* Cinematic intro — always shown, self-removes after ~1.2 s */}
      <LoadingScreen />

      {enableEffects && (
        <>
          {/* z:auto  — Navier-Stokes fluid trails, mix-blended via #fluid in CSS */}
          <SplashCursor
            SPLAT_RADIUS={0.10}
            SPLAT_FORCE={1000}
            DENSITY_DISSIPATION={4.5}
            VELOCITY_DISSIPATION={3.8}
            CURL={4}
            PRESSURE={0.05}
            RAINBOW_MODE={false}
            COLOR="#6677aa"
            TRANSPARENT={true}
            SHADING={false}
          />
          {/* z:9990 — iridescent glow core + spring-lag aura */}
          <CursorGlow />
          {/* z:9991 — expanding ripple rings from mouse movement + click splash */}
          <WaterRipple />
          {/* z:9998/9999 — precision dot (difference blend) + morphing ring */}
          <CustomCursor />
        </>
      )}
      {children}
    </>
  );
}
