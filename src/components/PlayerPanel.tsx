import { GameState } from '@/lib/gameTypes';

interface PlayerPanelProps {
  state: GameState;
}

export function PlayerPanel({ state }: PlayerPanelProps) {
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {state.players.map((player, idx) => {
        const isActive = state.currentPlayerIndex === idx && state.phase === 'playing';
        return (
          <div key={player.id} className="flex flex-col items-center gap-1">
            {/* Player pawn */}
            <div className="relative">
              <div
                className={`w-8 h-10 rounded-full transition-all duration-300 ${isActive ? 'scale-125 animate-pulse-glow' : ''}`}
                style={{
                  background: `radial-gradient(circle at 40% 30%, ${player.color}ee 0%, ${player.color} 60%, ${player.color}88 100%)`,
                  boxShadow: isActive
                    ? `0 4px 12px ${player.color}80, 0 2px 4px rgba(0,0,0,0.3)`
                    : '0 2px 4px rgba(0,0,0,0.3)',
                  borderBottom: '3px solid rgba(0,0,0,0.25)',
                  borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
                }}
              >
                {/* Pawn highlight */}
                <div
                  className="absolute w-3 h-3 rounded-full opacity-50"
                  style={{
                    top: '15%', left: '25%',
                    background: 'radial-gradient(circle, white, transparent)',
                  }}
                />
              </div>
              {isActive && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs">▼</span>
              )}
            </div>
            <span className={`font-display text-xs text-center max-w-[60px] truncate ${isActive ? 'text-secondary' : 'text-muted-foreground'}`}>
              {player.name}
            </span>
            {state.phase === 'ended' && (
              <span className="font-display text-sm text-primary">{player.score}pts</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
