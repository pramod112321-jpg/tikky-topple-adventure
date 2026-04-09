import { GameState } from '@/lib/gameTypes';
import { TikiToken } from './TikiToken';

interface PlayerPanelProps {
  state: GameState;
}

export function PlayerPanel({ state }: PlayerPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {state.players.map((player, idx) => {
        const isActive = state.currentPlayerIndex === idx && state.phase === 'playing';
        return (
          <div
            key={player.id}
            className={`rounded-xl p-3 transition-all duration-300 border-2 ${
              isActive
                ? 'animate-pulse-glow border-secondary bg-secondary/10'
                : 'border-border bg-muted/30'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: player.color }}
              />
              <span className="font-display text-sm text-foreground truncate">{player.name}</span>
              {isActive && (
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full font-bold ml-auto flex-shrink-0">
                  ▶
                </span>
              )}
            </div>
            <div className="flex gap-1">
              {player.tokenIds.map(tid => (
                <TikiToken key={tid} token={state.tokens[tid]} size="sm" />
              ))}
            </div>
            {state.phase === 'ended' && (
              <div className="mt-2 font-display text-lg text-primary">
                {player.score} pts
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
