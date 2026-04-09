import { GameState } from '@/lib/gameTypes';

interface ScoreBoardProps {
  state: GameState;
  onPlayAgain: () => void;
}

export function ScoreBoard({ state, onPlayAgain }: ScoreBoardProps) {
  const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);
  const medals = ['🥇', '🥈', '🥉', '4️⃣'];

  return (
    <div className="tiki-card animate-bounce-in text-center">
      <h2 className="tiki-title text-4xl mb-6">Game Over!</h2>
      <div className="space-y-3 mb-6">
        {sortedPlayers.map((player, idx) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-3 rounded-xl ${
              idx === 0 ? 'bg-secondary/30 ring-2 ring-secondary' : 'bg-muted/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{medals[idx]}</span>
              <span className="font-display text-lg text-foreground">{player.name}</span>
            </div>
            <span className="font-display text-2xl text-primary">{player.score}</span>
          </div>
        ))}
      </div>
      <button onClick={onPlayAgain} className="tiki-btn text-lg">
        Play Again 🔄
      </button>
    </div>
  );
}
