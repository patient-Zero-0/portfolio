import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const alt = 'AccEEden — Python Developer & AI Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#080808',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px 90px',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* grid lines decoration */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          display: 'flex',
        }} />

        {/* status dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#34d399' }} />
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, letterSpacing: '0.2em', fontFamily: 'monospace' }}>
            AVAILABLE FOR OPPORTUNITIES
          </span>
        </div>

        {/* name */}
        <div style={{ fontSize: 80, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 20, display: 'flex' }}>
          AccEEden
        </div>

        {/* tagline */}
        <div style={{ fontSize: 26, color: 'rgba(255,255,255,0.45)', marginBottom: 56, display: 'flex' }}>
          Python Developer · AI Engineer · Data Engineering
        </div>

        {/* stack chips */}
        <div style={{ display: 'flex', gap: 12 }}>
          {['Python', 'Next.js', 'Three.js', 'LLM / RAG', 'Web Scraping'].map((t) => (
            <div
              key={t}
              style={{
                color: 'rgba(255,255,255,0.4)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 6,
                padding: '6px 16px',
                fontSize: 14,
                fontFamily: 'monospace',
                display: 'flex',
              }}
            >
              {t}
            </div>
          ))}
        </div>

        {/* url */}
        <div style={{
          position: 'absolute', bottom: 60, right: 90,
          color: 'rgba(255,255,255,0.18)', fontSize: 14, fontFamily: 'monospace',
          display: 'flex',
        }}>
          portfolio-ddw.pages.dev
        </div>
      </div>
    ),
    { ...size },
  );
}
