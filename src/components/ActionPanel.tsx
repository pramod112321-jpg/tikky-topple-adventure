import { useState } from 'react';
import { GameState, GameAction } from '@/lib/gameTypes';
import { canMove, canReorder, getStackAtPosition } from '@/lib/gameEngine';
import { TikiToken } from './TikiToken';

interface ActionPanelProps {
  state: GameState;
  onAction: (action: GameAction) => void;
}

export function ActionPanel({ state, onAction }: ActionPanelProps) {
  const [mode, setMode] = useState<'choose' | 'move' | 'reorder'>('choose');
  const [reorderTokens, setReorderTokens] = useState<string[]>([]);
  const [reorderCount, setReorderCount] = useState<2 | 3>(2);

  const stackInfo = getStackAtPosition(state);
  const moveAvailable = canMove(state);
  const reorderAvailable = canReorder(state);

  const handleMove = (count: 1 | 2 | 3) => {
    onAction({ type: 'move', count });
    setMode('choose');
  };

  const startReorder = (count: 2 | 3) => {
    if (!stackInfo) return;
    const topTokens = stackInfo.tokens.slice(0, count);
    setReorderTokens([]);
    setReorderCount(count);
    setMode('reorder');
  };

  const toggleReorderToken = (tokenId: string) => {
    setReorderTokens(prev => {
      if (prev.includes(tokenId)) {
        return prev.filter(id => id !== tokenId);
      }
      return [...prev, tokenId];
    });
  };

  const confirmReorder = () => {
    if (!stackInfo) return;
    const topTokens = stackInfo.tokens.slice(0, reorderCount);
    // Remaining tokens that weren't selected yet
    const remaining = topTokens.filter(id => !reorderTokens.includes(id));
    const newOrder = [...reorderTokens, ...remaining];
    onAction({ type: 'reorder', count: reorderCount, newOrder });
    setMode('choose');
    setReorderTokens([]);
  };

  if (state.phase !== 'playing') return null;

  const maxMovable = stackInfo ? Math.min(3, stackInfo.tokens.length) : 0;

  if (mode === 'choose') {
    return (
      <div className="tiki-card animate-slide-up">
        <h3 className="font-display text-lg text-foreground mb-3">
          {state.players[state.currentPlayerIndex].name}'s Turn
        </h3>
        <p className="text-sm text-muted-foreground mb-4">Choose an action:</p>
        <div className="flex flex-col gap-3">
          {moveAvailable && (
            <div>
              <p className="text-sm font-bold text-foreground mb-2">Move Top Tokens Forward</p>
              <div className="flex gap-2">
                {[1, 2, 3].filter(n => n <= maxMovable).map(n => (
                  <button
                    key={n}
                    onClick={() => handleMove(n as 1 | 2 | 3)}
                    className="tiki-btn text-sm px-4 py-2"
                  >
                    Move {n}
                  </button>
                ))}
              </div>
            </div>
          )}
          {reorderAvailable && (
            <div>
              <p className="text-sm font-bold text-foreground mb-2">Reorder Top Tokens</p>
              <div className="flex gap-2">
                {stackInfo && stackInfo.tokens.length >= 2 && (
                  <button
                    onClick={() => startReorder(2)}
                    className="tiki-btn tiki-btn-secondary text-sm px-4 py-2"
                  >
                    Reorder 2
                  </button>
                )}
                {stackInfo && stackInfo.tokens.length >= 3 && (
                  <button
                    onClick={() => startReorder(3)}
                    className="tiki-btn tiki-btn-secondary text-sm px-4 py-2"
                  >
                    Reorder 3
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'reorder' && stackInfo) {
    const topTokens = stackInfo.tokens.slice(0, reorderCount);
    return (
      <div className="tiki-card animate-slide-up">
        <h3 className="font-display text-lg text-foreground mb-2">Reorder Tokens</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Tap tokens in the order you want (top → bottom):
        </p>
        <div className="flex gap-2 mb-3">
          {topTokens.map((tokenId) => {
            const orderIdx = reorderTokens.indexOf(tokenId);
            return (
              <div key={tokenId} className="relative">
                <TikiToken
                  token={state.tokens[tokenId]}
                  size="lg"
                  selected={orderIdx >= 0}
                  onClick={() => toggleReorderToken(tokenId)}
                />
                {orderIdx >= 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                    {orderIdx + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {reorderTokens.length > 0 && (
          <p className="text-xs text-muted-foreground mb-3">
            New order: {reorderTokens.map((id, i) => `${i + 1}. ${state.tokens[id].label}`).join(' → ')}
          </p>
        )}
        <div className="flex gap-2">
          <button onClick={confirmReorder} className="tiki-btn text-sm px-4 py-2"
            disabled={reorderTokens.length !== reorderCount}>
            Confirm
          </button>
          <button
            onClick={() => { setMode('choose'); setReorderTokens([]); }}
            className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return null;
}
