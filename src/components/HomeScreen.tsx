import tikiHero from '@/assets/tiki-hero.png';

interface HomeScreenProps {
  onPlay: () => void;
  onRules: () => void;
}

export function HomeScreen({ onPlay, onRules }: HomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl opacity-20 animate-wobble">🌴</div>
        <div className="absolute top-20 right-16 text-5xl opacity-15 animate-wobble" style={{ animationDelay: '0.3s' }}>🌺</div>
        <div className="absolute bottom-20 left-20 text-4xl opacity-15 animate-wobble" style={{ animationDelay: '0.6s' }}>🍃</div>
        <div className="absolute bottom-32 right-10 text-5xl opacity-20 animate-wobble" style={{ animationDelay: '0.9s' }}>🌊</div>
      </div>

      <div className="animate-bounce-in flex flex-col items-center relative z-10 max-w-lg w-full">
        {/* Hero Image */}
        <img 
          src={tikiHero} 
          alt="Tiki Topple" 
          width={512} 
          height={512}
          className="w-48 h-48 md:w-56 md:h-56 object-contain mb-4 drop-shadow-2xl"
        />

        {/* Title */}
        <h1 className="tiki-title text-6xl md:text-7xl mb-2 text-center" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}>Tiki Topple</h1>
        <p className="text-lg md:text-xl mb-10 text-center font-body font-semibold" style={{ color: 'hsl(40, 60%, 90%)' }}>
          The Strategic Stacking Game 🏝️
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button onClick={onPlay} className="tiki-btn text-xl py-4 w-full">
            🎮 Play Game
          </button>
          <button onClick={onRules} className="tiki-btn tiki-btn-secondary text-lg py-3 w-full">
            📖 How to Play
          </button>
        </div>

        {/* Credits */}
        <p className="text-xs mt-10 text-center" style={{ color: 'hsl(40, 40%, 80%)' }}>
          NPC Board2Code Hackathon 2026 • LPU
        </p>
      </div>
    </div>
  );
}
