import { GameState } from '@/lib/gameTypes';
import { TikiToken } from './TikiToken';
import { getMainStack, getOccupiedPositions } from '@/lib/gameEngine';

interface GameBoardProps {
  state: GameState;
}

export function GameBoard({ state }: GameBoardProps) {
  const halfTrack = Math.ceil(state.trackLength / 2);
  const leftSide = Array.from({ length: halfTrack }, (_, i) => i); // 0 to half going up
  const rightSide = Array.from({ length: state.trackLength - halfTrack }, (_, i) => halfTrack + i); // half+ going down

  const mainStack = getMainStack(state);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Board background */}
      <div
        className="relative rounded-3xl overflow-hidden border-4"
        style={{
          background: 'linear-gradient(180deg, hsl(35, 50%, 75%) 0%, hsl(40, 55%, 82%) 30%, hsl(38, 50%, 78%) 70%, hsl(35, 45%, 70%) 100%)',
          borderColor: 'hsl(25, 40%, 30%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 2px 8px rgba(255,255,255,0.2)',
          minHeight: '500px',
        }}
      >
        {/* Sandy texture overlay */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: 'repeating-conic-gradient(rgba(139,119,80,0.1) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px',
          }}
        />

        {/* Tiki text watermark in center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <span className="font-display text-6xl tracking-[0.3em] text-tiki-wood" style={{ writingMode: 'vertical-lr' }}>
            TIKI TOPPLE
          </span>
        </div>

        {/* Palm decorations */}
        <div className="absolute top-4 left-4 text-2xl opacity-30">🌴</div>
        <div className="absolute bottom-4 right-4 text-2xl opacity-30">🌴</div>
        <div className="absolute top-1/3 right-6 text-lg opacity-20">🌿</div>
        <div className="absolute bottom-1/3 left-6 text-lg opacity-20">🌿</div>

        <div className="relative z-10 flex p-4 gap-2">
          {/* Left column - positions going UP (0 at bottom) */}
          <div className="flex flex-col-reverse gap-1.5 flex-1 items-center">
            {leftSide.map((posIndex) => (
              <StoneCell
                key={posIndex}
                posIndex={posIndex}
                tokens={state.track[posIndex]}
                state={state}
                isFinish={posIndex === state.trackLength - 1}
              />
            ))}
          </div>

          {/* Center - Tiki Totem Stack */}
          <div className="flex flex-col items-center justify-center px-2" style={{ minWidth: '80px' }}>
            <TikiTotemStack state={state} />
          </div>

          {/* Right column - positions going DOWN (continuing from left) */}
          <div className="flex flex-col gap-1.5 flex-1 items-center">
            {rightSide.map((posIndex) => (
              <StoneCell
                key={posIndex}
                posIndex={posIndex}
                tokens={state.track[posIndex]}
                state={state}
                isFinish={posIndex === state.trackLength - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Stone stepping cell */
function StoneCell({
  posIndex,
  tokens,
  state,
  isFinish,
}: {
  posIndex: number;
  tokens: string[];
  state: GameState;
  isFinish: boolean;
}) {
  const hasTokens = tokens.length > 0;

  return (
    <div className="flex items-center gap-1.5 w-full">
      {/* Stone with number */}
      <div
        className={`relative w-10 h-10 rounded-full flex items-center justify-center font-display text-sm shrink-0 ${
          isFinish ? 'text-foreground' : hasTokens ? 'text-primary-foreground' : 'text-primary-foreground/70'
        }`}
        style={{
          background: isFinish
            ? 'radial-gradient(circle, hsl(45, 90%, 55%) 30%, hsl(45, 70%, 40%) 100%)'
            : hasTokens
            ? 'radial-gradient(circle at 35% 35%, hsl(30, 35%, 50%) 0%, hsl(25, 30%, 30%) 100%)'
            : 'radial-gradient(circle at 35% 35%, hsl(30, 25%, 45%) 0%, hsl(25, 20%, 28%) 100%)',
          boxShadow: hasTokens
            ? '0 3px 8px rgba(0,0,0,0.4), inset 0 1px 3px rgba(255,255,255,0.2)'
            : '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.1)',
          border: isFinish ? '2px solid hsl(45, 80%, 65%)' : '1px solid hsl(25, 20%, 25%)',
        }}
      >
        {/* Highlight spot on stone */}
        <div
          className="absolute w-3 h-2 rounded-full opacity-30"
          style={{
            top: '20%', left: '25%',
            background: 'radial-gradient(ellipse, white, transparent)',
          }}
        />
        <span className="relative z-10">{isFinish ? '🏁' : posIndex + 1}</span>
      </div>

      {/* Tokens at this position */}
      {hasTokens && (
        <div className="flex gap-0.5 flex-wrap">
          {tokens.slice(0, 3).map((tokenId) => (
            <TikiToken key={tokenId} token={state.tokens[tokenId]} size="sm" />
          ))}
          {tokens.length > 3 && (
            <span className="text-[10px] font-bold text-tiki-wood self-center">+{tokens.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
}

/* Central Tiki Totem showing the main stack */
function TikiTotemStack({ state }: { state: GameState }) {
  const mainStack = getMainStack(state);
  if (!mainStack) return null;

  const { tokens: tokenIds, position } = mainStack;

  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-[10px] text-tiki-wood uppercase tracking-wider mb-1">
        Stack
      </span>
      <div
        className="flex flex-col gap-0 rounded-xl overflow-hidden border-2"
        style={{
          borderColor: 'hsl(25, 30%, 35%)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4), 0 0 30px rgba(0,0,0,0.15)',
        }}
      >
        {tokenIds.map((tokenId, idx) => {
          const token = state.tokens[tokenId];
          return (
            <div
              key={tokenId}
              className="relative w-16 h-14 flex items-center justify-center overflow-hidden"
              style={{
                background: `linear-gradient(180deg, ${token.color} 0%, ${token.color}cc 100%)`,
                borderBottom: idx < tokenIds.length - 1 ? '1px solid rgba(0,0,0,0.25)' : 'none',
              }}
            >
              {/* Tiki face pattern overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <svg viewBox="0 0 40 40" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground">
                  {/* Simple tiki face */}
                  <circle cx="14" cy="14" r="4" />
                  <circle cx="26" cy="14" r="4" />
                  <rect x="12" y="24" width="16" height="8" rx="2" />
                  <line x1="16" y1="24" x2="16" y2="32" />
                  <line x1="20" y1="24" x2="20" y2="32" />
                  <line x1="24" y1="24" x2="24" y2="32" />
                </svg>
              </div>
              {/* Shine */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
                }}
              />
              <span className="text-2xl drop-shadow-lg relative z-10">{token.emoji}</span>
              {/* Rank badge */}
              <span
                className="absolute top-0.5 right-1 text-[9px] font-bold opacity-60"
                style={{ color: 'rgba(0,0,0,0.5)' }}
              >
                {idx + 1}
              </span>
            </div>
          );
        })}
      </div>
      <span className="font-display text-[10px] text-tiki-wood mt-1">
        Pos {position + 1}
      </span>
    </div>
  );
}
