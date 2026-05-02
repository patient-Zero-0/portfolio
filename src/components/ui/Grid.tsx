export default function Grid() {
  // Scattered + markers at key positions (like the ALCHE reference grid)
  const PLUS_MARKS = [
    { top: '7%',  left: '50%'  },
    { top: '7%',  left: '78%'  },
    { top: '7%',  left: '22%'  },
    { top: '50%', left: '5%'   },
    { top: '50%', left: '95%'  },
    { top: '88%', left: '25%'  },
    { top: '88%', left: '75%'  },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">

      {/* Primary grid — 120 px cells, subtle but clear */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px',
        }}
      />

      {/* Finer subdivision grid (30 px) — very faint */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
        }}
      />

      {/* Crosshair ticks at every 120 px intersection */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="ch" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <line x1="0" y1="-6" x2="0" y2="6" stroke="rgba(255,255,255,0.22)" strokeWidth="0.7"/>
            <line x1="-6" y1="0" x2="6" y2="0" stroke="rgba(255,255,255,0.22)" strokeWidth="0.7"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ch)"/>
      </svg>

      {/* Scattered accent + markers (larger, brighter) */}
      {PLUS_MARKS.map(({ top, left }, i) => (
        <svg
          key={i}
          width="20" height="20" viewBox="-10 -10 20 20"
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ top, left }}
        >
          <line x1="-8" y1="0" x2="8" y2="0" stroke="rgba(255,255,255,0.40)" strokeWidth="1"/>
          <line x1="0" y1="-8" x2="0" y2="8" stroke="rgba(255,255,255,0.40)" strokeWidth="1"/>
        </svg>
      ))}

      {/* Corner plus markers */}
      {(['5% auto auto 5%', '5% 5% auto auto', 'auto auto 5% 5%', 'auto 5% 5% auto'] as const).map((inset, i) => (
        <svg
          key={`c${i}`}
          width="24" height="24" viewBox="-12 -12 24 24"
          className="absolute"
          style={{ inset, margin: 'auto' }}
        >
          <line x1="-9" y1="0" x2="9" y2="0" stroke="rgba(255,255,255,0.38)" strokeWidth="1"/>
          <line x1="0" y1="-9" x2="0" y2="9" stroke="rgba(255,255,255,0.38)" strokeWidth="1"/>
        </svg>
      ))}
    </div>
  );
}
