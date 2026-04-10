import { useState, useEffect } from 'react';

interface IntroAnimationProps {
  onComplete: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [phase, setPhase] = useState<'tokens' | 'title' | 'dice' | 'fadeout'>('tokens');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('title'), 1200),
      setTimeout(() => setPhase('dice'), 2400),
      setTimeout(() => setPhase('fadeout'), 3800),
      setTimeout(() => onComplete(), 4500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const tokens = ['🔥', '🌊', '🌿', '⭐', '🌺', '🔮'];
  const tokenColors = [
    'hsl(16, 80%, 50%)',
    'hsl(200, 70%, 50%)',
    'hsl(160, 60%, 40%)',
    'hsl(45, 90%, 55%)',
    'hsl(0, 75%, 55%)',
    'hsl(280, 60%, 55%)',
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ${
        phase === 'fadeout' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ background: 'radial-gradient(ellipse at center, hsl(25, 40%, 18%) 0%, hsl(25, 30%, 8%) 100%)' }}
    >
      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-intro-particle"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `hsl(45, 90%, ${55 + Math.random() * 30}%)`,
              opacity: 0.4,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Flying tokens */}
      <div className="relative w-80 h-80 mb-8">
        {tokens.map((emoji, i) => {
          const angle = (i / tokens.length) * Math.PI * 2 - Math.PI / 2;
          const radius = 110;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 animate-intro-token-fly"
              style={{
                '--tx': `${x}px`,
                '--ty': `${y}px`,
                animationDelay: `${i * 0.12}s`,
              } as React.CSSProperties}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl border-[3px] animate-intro-token-pulse"
                style={{
                  backgroundColor: tokenColors[i],
                  borderColor: 'hsla(0, 0%, 100%, 0.35)',
                  boxShadow: `0 0 20px 4px ${tokenColors[i]}80, 0 4px 12px rgba(0,0,0,0.4)`,
                  animationDelay: `${1.5 + i * 0.15}s`,
                }}
              >
                <span className="drop-shadow-lg">{emoji}</span>
              </div>
            </div>
          );
        })}

        {/* Center dice */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${
            phase === 'dice' || phase === 'fadeout' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        >
          <div className="animate-intro-dice-spin">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-display border-4"
              style={{
                background: 'linear-gradient(135deg, hsl(35, 50%, 95%) 0%, hsl(35, 40%, 85%) 100%)',
                borderColor: 'hsl(var(--tiki-wood-light))',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.5)',
              }}
            >
              🎲
            </div>
          </div>
        </div>
      </div>

      {/* Title reveal */}
      <div
        className={`text-center transition-all duration-700 ${
          phase !== 'tokens' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h1
          className="tiki-title text-6xl md:text-8xl mb-3"
          style={{
            filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.6))',
            animation: phase !== 'tokens' ? 'intro-title-glow 2s ease-in-out infinite' : 'none',
          }}
        >
          Tiki Topple
        </h1>
        <p
          className="font-display text-lg tracking-widest uppercase"
          style={{ color: 'hsl(45, 80%, 70%)' }}
        >
          The Strategic Stacking Game
        </p>
      </div>

      {/* Board track preview at bottom */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 transition-all duration-700 ${
          phase === 'dice' || phase === 'fadeout' ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="w-8 h-6 rounded-md border-2"
            style={{
              background: i === 8
                ? 'hsl(45, 90%, 55%)'
                : `hsl(25, ${30 + i * 3}%, ${22 + i * 2}%)`,
              borderColor: 'hsl(var(--tiki-wood-light))',
              animationDelay: `${2.4 + i * 0.08}s`,
              animation: 'intro-track-cell 0.4s ease-out both',
            }}
          >
            {i === 8 && (
              <span className="flex items-center justify-center text-xs h-full">🏁</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
