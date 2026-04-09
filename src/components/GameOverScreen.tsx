import { GameState } from '@/lib/gameTypes';

interface GameOverScreenProps {
  state: GameState;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function GameOverScreen({ state, onPlayAgain, onHome }: GameOverScreenProps) {
  const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);
  const medals = ['🥇', '🥈', '🥉', '4️⃣'];
  const winner = sortedPlayers[0];

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full animate-bounce-in">
        {/* Winner banner */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">🏆</div>
          <h1 className="tiki-title text-4xl mb-2">Game Over!</h1>
          <p className="text-lg text-muted-foreground">
            <span className="font-display text-foreground">{winner.name}</span> wins with{' '}
            <span className="font-display text-primary">{winner.score}</span> points!
          </p>
        </div>

        {/* Scoreboard */}
        <div className="tiki-card mb-6">
          <h3 className="font-display text-sm text-muted-foreground mb-4 text-center uppercase tracking-wider">
            Final Rankings
          </h3>
          <div className="space-y-2">
            {sortedPlayers.map((player, idx) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                  idx === 0
                    ? 'bg-secondary/20 ring-2 ring-secondary'
                    : 'bg-muted/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl w-8 text-center">{medals[idx]}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: player.color }} />
                    <span className="font-display text-base text-foreground">{player.name}</span>
                  </div>
                </div>
                <span className="font-display text-2xl text-primary">{player.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Game stats */}
        <div className="tiki-card mb-6">
          <h3 className="font-display text-sm text-muted-foreground mb-3 text-center uppercase tracking-wider">
            Game Stats
          </h3>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-muted/40 rounded-xl p-3">
              <div className="font-display text-2xl text-foreground">{state.turnNumber - 1}</div>
              <div className="text-xs text-muted-foreground">Turns Played</div>
            </div>
            <div className="bg-muted/40 rounded-xl p-3">
              <div className="font-display text-2xl text-foreground">{state.players.length}</div>
              <div className="text-xs text-muted-foreground">Players</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button onClick={onPlayAgain} className="tiki-btn text-lg py-3 w-full">
            🔄 Play Again
          </button>
          <button
            onClick={onHome}
            className="tiki-btn tiki-btn-secondary text-lg py-3 w-full"
          >
            🏠 Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
