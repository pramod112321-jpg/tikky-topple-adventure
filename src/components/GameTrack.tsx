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
                  <TikiToken
                    key={tokenId}
                    token={state.tokens[tokenId]}
                    size="sm"
                    index={stackIdx}
                  />
                ))}
              </div>
              {/* Track cell label */}
              <div
                className={`w-12 h-7 rounded-md flex items-center justify-center text-xs font-bold transition-all duration-200 border-2 ${
                  isFinish
                    ? 'bg-secondary/40 border-secondary text-secondary-foreground'
                    : hasTokens
                    ? 'bg-primary/10 border-primary/30 text-foreground'
                    : 'bg-muted/60 border-border text-muted-foreground'
                }`}
              >
                {isFinish ? '🏁' : posIndex}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
