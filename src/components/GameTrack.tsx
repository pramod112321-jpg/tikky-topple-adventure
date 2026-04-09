import { GameState } from '@/lib/gameTypes';
import { TikiToken } from './TikiToken';

interface GameTrackProps {
  state: GameState;
}

export function GameTrack({ state }: GameTrackProps) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-2 items-end min-w-fit p-4">
        {state.track.map((tokensAtPos, posIndex) => (
          <div key={posIndex} className="flex flex-col items-center gap-1">
            {/* Stacked tokens */}
            <div className="flex flex-col-reverse gap-1 min-h-[60px]">
              {tokensAtPos.map((tokenId, stackIdx) => (
                <TikiToken
                  key={tokenId}
                  token={state.tokens[tokenId]}
                  size="sm"
                  index={stackIdx}
                />
              ))}
            </div>
            {/* Track cell */}
            <div
              className={`tiki-track-cell w-12 h-8 flex items-center justify-center text-xs font-bold text-muted-foreground ${
                tokensAtPos.length > 0 ? 'tiki-track-cell-active' : ''
              } ${posIndex === state.trackLength - 1 ? 'bg-secondary/30 border-secondary' : ''}`}
            >
              {posIndex === state.trackLength - 1 ? '🏁' : posIndex}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
