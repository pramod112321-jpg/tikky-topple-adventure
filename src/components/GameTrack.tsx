import { GameState } from '@/lib/gameTypes';
import { TikiToken } from './TikiToken';

interface GameTrackProps {
  state: GameState;
}

export function GameTrack({ state }: GameTrackProps) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex gap-1.5 items-end min-w-fit px-2">
        {state.track.map((tokensAtPos, posIndex) => {
          const isFinish = posIndex === state.trackLength - 1;
          const hasTokens = tokensAtPos.length > 0;
          return (
            <div key={posIndex} className="flex flex-col items-center gap-1.5">
              {/* Stacked tokens at this position */}
              <div className="flex flex-col gap-1 min-h-[48px] justify-end">
                {[...tokensAtPos].reverse().map((tokenId, stackIdx) => (
                  <div key={tokenId} className="animate-token-move-up" style={{ animationDelay: `${stackIdx * 0.1}s` }}>
                    <TikiToken
                      token={state.tokens[tokenId]}
                      size="sm"
                      index={stackIdx}
                    />
                  </div>
                ))}
              </div>
              {/* Track cell - wooden board style */}
              <div
                className={`w-12 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200 border-2 relative ${
                  isFinish
                    ? 'border-secondary'
                    : hasTokens
                    ? 'border-primary/40'
                    : 'border-tiki-wood-light/60'
                }`}
                style={{
                  background: isFinish
                    ? 'linear-gradient(135deg, hsl(45, 90%, 55%) 0%, hsl(45, 80%, 45%) 100%)'
                    : hasTokens
                    ? 'linear-gradient(135deg, hsl(25, 40%, 30%) 0%, hsl(25, 35%, 22%) 100%)'
                    : 'linear-gradient(135deg, hsl(25, 30%, 25%) 0%, hsl(25, 25%, 18%) 100%)',
                  boxShadow: hasTokens
                    ? '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.1)'
                    : 'inset 0 1px 3px rgba(0,0,0,0.2)',
                }}
              >
                {/* Wood grain effect */}
                <div
                  className="absolute inset-0 rounded-md opacity-10 pointer-events-none"
                  style={{
                    background: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 4px)',
                  }}
                />
                <span className={`relative z-10 ${isFinish ? 'text-foreground' : hasTokens ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                  {isFinish ? '🏁' : posIndex}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
