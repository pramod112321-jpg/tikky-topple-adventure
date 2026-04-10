import { useState } from 'react';
import { TikiParticles } from './TikiParticles';

interface DiceRollerProps {
  onRoll: (value: 1 | 2 | 3) => void;
  disabled?: boolean;
}

const diceFaces: Record<number, string> = {
  1: '⚀',
  2: '⚁',
  3: '⚂',
};

const TIKI_FACES = ['🗿', '🌺', '🔥', '🌴', '✨', '💎'];

export function DiceRoller({ onRoll, disabled }: DiceRollerProps) {
  const [rolling, setRolling] = useState(false);
  const [currentFace, setCurrentFace] = useState(1);
  const [finalValue, setFinalValue] = useState<number | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const [showTikiFace, setShowTikiFace] = useState<string | null>(null);

  const roll = () => {
    if (rolling || disabled) return;
    setRolling(true);
    setFinalValue(null);
    setShowParticles(true);

    // Show random tiki faces during roll
    let count = 0;
    const interval = setInterval(() => {
      setCurrentFace(Math.floor(Math.random() * 3) + 1);
      setShowTikiFace(TIKI_FACES[Math.floor(Math.random() * TIKI_FACES.length)]);
      count++;
      if (count >= 10) {
        clearInterval(interval);
        const result = (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3;
        setCurrentFace(result);
        setFinalValue(result);
        setRolling(false);
        setShowTikiFace(null);
        setTimeout(() => {
          setShowParticles(false);
          onRoll(result);
        }, 400);
      }
    }, 80);
  };

  return (
    <div className="relative">
      <button
        onClick={roll}
        disabled={disabled || rolling}
        className={`relative group ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title="Roll the dice!"
      >
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-display border-4 transition-all duration-200 ${
            rolling ? 'animate-tiki-shake' : finalValue ? 'animate-tiki-pop' : 'hover:scale-110'
          } ${rolling ? 'animate-tiki-glow' : ''}`}
          style={{
            background: 'linear-gradient(145deg, hsl(35, 50%, 95%) 0%, hsl(35, 40%, 82%) 100%)',
            borderColor: 'hsl(var(--tiki-wood-light))',
            boxShadow: rolling
              ? '0 2px 8px rgba(0,0,0,0.3), 0 0 20px hsl(45, 90%, 55%, 0.4)'
              : '0 6px 16px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.5)',
          }}
        >
          <span className={rolling ? 'animate-spin-fast' : ''}>
            {rolling && showTikiFace ? showTikiFace : diceFaces[currentFace]}
          </span>
        </div>
        {!rolling && !disabled && (
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Roll!
          </span>
        )}
        {finalValue && !rolling && (
          <span
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold animate-tiki-pop"
            style={{
              background: 'hsl(var(--secondary))',
              color: 'hsl(var(--secondary-foreground))',
            }}
          >
            {finalValue}
          </span>
        )}
      </button>

      {/* Tiki particle effects */}
      <TikiParticles active={showParticles} originX={50} originY={50} count={8} />
    </div>
  );
}
