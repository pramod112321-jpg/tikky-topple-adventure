import { GameState } from '@/lib/gameTypes';
import { TikiToken } from './TikiToken';

interface PlayerPanelProps {
  state: GameState;
}

export function PlayerPanel({ state }: PlayerPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {state.players.map((player, idx) => (
        <div
          key={player.id}
          className={`tiki-card p-4 transition-all duration-300 ${
            state.currentPlayerIndex === idx && state.phase === 'playing'
              ? 'animate-pulse-glow ring-2 ring-secondary'
              : ''
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="font-display text-sm text-foreground">{player.name}</span>
            {state.currentPlayerIndex === idx && state.phase === 'playing' && (
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full font-bold">
                Turn
              </span>
            )}
          </div>
          <div className="flex gap-1">
            {player.tokenIds.map((tid) => (
              <TikiToken key={tid} token={state.tokens[tid]} size="sm" />
            ))}
          </div>
          {state.phase === 'ended' && (
            <div className="mt-2 font-display text-lg text-primary">
              Score: {player.score}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
