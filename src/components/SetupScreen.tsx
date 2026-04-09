import { useState } from 'react';
import { PLAYER_COLORS } from '@/lib/gameTypes';

interface SetupScreenProps {
  onStart: (playerNames: string[]) => void;
  onBack: () => void;
}

export function SetupScreen({ onStart, onBack }: SetupScreenProps) {
  const [playerCount, setPlayerCount] = useState(2);
  const [names, setNames] = useState(['', '', '', '']);

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handleStart = () => {
    const playerNames = names
      .slice(0, playerCount)
      .map((n, i) => n.trim() || `Player ${i + 1}`);
    onStart(playerNames);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full animate-slide-up">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-colors mb-6 font-bold text-sm flex items-center gap-2"
        >
          ← Back to Menu
        </button>

        <h1 className="tiki-title text-4xl mb-2 text-center">Game Setup</h1>
        <p className="text-muted-foreground text-center mb-8">Configure your game</p>

        {/* Player count */}
        <div className="tiki-card mb-6">
          <label className="block font-display text-lg text-foreground mb-4 text-center">
            How many players?
          </label>
          <div className="flex justify-center gap-3">
            {[2, 3, 4].map(n => (
              <button
                key={n}
                onClick={() => setPlayerCount(n)}
                className={`w-16 h-16 rounded-2xl font-display text-2xl transition-all duration-200 ${
                  playerCount === n
                    ? 'bg-primary text-primary-foreground scale-110 shadow-lg'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Player names */}
        <div className="tiki-card mb-8">
          <label className="block font-display text-lg text-foreground mb-4 text-center">
            Enter Player Names
          </label>
          <div className="space-y-3">
            {Array.from({ length: playerCount }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: PLAYER_COLORS[i], color: 'white' }}
                >
                  P{i + 1}
                </div>
                <input
                  type="text"
                  placeholder={`Player ${i + 1}`}
                  value={names[i]}
                  onChange={e => handleNameChange(i, e.target.value)}
                  maxLength={15}
                  className="flex-1 px-4 py-3 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground border-2 border-transparent focus:border-primary focus:outline-none transition-colors font-body font-semibold"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Start button */}
        <button onClick={handleStart} className="tiki-btn text-xl py-4 w-full">
          Start Game! 🚀
        </button>
      </div>
    </div>
  );
}
