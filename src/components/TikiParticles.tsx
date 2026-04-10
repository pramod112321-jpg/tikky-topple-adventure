import { useState, useEffect } from 'react';

const TIKI_EMOJIS = ['🗿', '🌺', '🔥', '✨', '🌴', '🎯', '💫', '⭐'];

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  delay: number;
  size: number;
}

interface TikiParticlesProps {
  active: boolean;
  originX?: number;
  originY?: number;
  count?: number;
}

export function TikiParticles({ active, originX = 50, originY = 50, count = 6 }: TikiParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      emoji: TIKI_EMOJIS[Math.floor(Math.random() * TIKI_EMOJIS.length)],
      x: originX + (Math.random() - 0.5) * 80,
      y: originY + (Math.random() - 0.5) * 40,
      delay: Math.random() * 0.3,
      size: 16 + Math.random() * 20,
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => setParticles([]), 1500);
    return () => clearTimeout(timer);
  }, [active]);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute animate-tiki-float-up"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
