export default function Grid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">

      {/* Fine grid lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Crosshair marks at every intersection */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="ch" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <line x1="0" y1="-5" x2="0" y2="5" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6"/>
            <line x1="-5" y1="0" x2="5" y2="0" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ch)"/>
      </svg>

      {/* Corner plus markers — larger, like alche */}
      {(['5% auto auto 5%', '5% 5% auto auto', 'auto auto 5% 5%', 'auto 5% 5% auto'] as const).map((inset, i) => (
        <svg
          key={i}
          width="24" height="24" viewBox="-12 -12 24 24"
          className="absolute"
          style={{ inset, margin: 'auto' }}
        >
          <line x1="-9" y1="0" x2="9" y2="0" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
          <line x1="0" y1="-9" x2="0" y2="9" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
        </svg>
      ))}
    </div>
  );
}
