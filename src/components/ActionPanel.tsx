import { useState } from 'react';
import { GameState, GameAction } from '@/lib/gameTypes';
import { canMove, canReorder, getMainStack, getMaxMovable } from '@/lib/gameEngine';
import { TikiToken } from './TikiToken';

interface ActionPanelProps {
  state: GameState;
  onAction: (action: GameAction) => void;
}

export function ActionPanel({ state, onAction }: ActionPanelProps) {
  const [mode, setMode] = useState<'choose' | 'reorder'>('choose');
  const [reorderTokens, setReorderTokens] = useState<string[]>([]);
  const [reorderCount, setReorderCount] = useState<2 | 3>(2);

  const stackInfo = getMainStack(state);
  const moveAvailable = canMove(state);
  const reorderAvailable = canReorder(state);
  const maxMovable = getMaxMovable(state);

  const handleMove = (count: 1 | 2 | 3) => {
    onAction({ type: 'move', count });
    setMode('choose');
  };

  const startReorder = (count: 2 | 3) => {
    setReorderTokens([]);
    setReorderCount(count);
    setMode('reorder');
  };

  const toggleReorderToken = (tokenId: string) => {
    setReorderTokens(prev => {
      if (prev.includes(tokenId)) {
        return prev.filter(id => id !== tokenId);
      }
      if (prev.length >= reorderCount) return prev;
      return [...prev, tokenId];
    });
  };

  const confirmReorder = () => {
    onAction({ type: 'reorder', count: reorderCount, newOrder: reorderTokens });
    setMode('choose');
    setReorderTokens([]);
  };

  if (state.phase !== 'playing') return null;

  const currentPlayer = state.players[state.currentPlayerIndex];

  if (mode === 'choose') {
    return (
      <div className="tiki-card animate-slide-up">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentPlayer.color }} />
          <h3 className="font-display text-lg text-foreground">{currentPlayer.name}'s Turn</h3>
        </div>

        <div className="space-y-4">
          {/* Move actions */}
          {moveAvailable && (
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                ➡️ Move Forward
              </p>
              <div className="flex gap-2">
                {([1, 2, 3] as const).filter(n => n <= maxMovable).map(n => (
                  <button
                    key={n}
                    onClick={() => handleMove(n)}
                    className="tiki-btn text-sm px-5 py-2.5"
                  >
                    Move {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reorder actions */}
          {reorderAvailable && (
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                🔀 Reorder Stack
              </p>
              <div className="flex gap-2">
                {stackInfo && stackInfo.tokens.length >= 2 && (
                  <button onClick={() => startReorder(2)} className="tiki-btn tiki-btn-secondary text-sm px-5 py-2.5">
                    Reorder 2
                  </button>
                )}
                {stackInfo && stackInfo.tokens.length >= 3 && (
                  <button onClick={() => startReorder(3)} className="tiki-btn tiki-btn-secondary text-sm px-5 py-2.5">
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

  // Reorder mode
  if (mode === 'reorder' && stackInfo) {
    const topTokens = stackInfo.tokens.slice(0, reorderCount);
    return (
      <div className="tiki-card animate-slide-up">
        <h3 className="font-display text-lg text-foreground mb-1">Reorder Tokens</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Tap tokens in order you want them (1st tap = top of stack)
        </p>

        <div className="flex gap-3 mb-4 justify-center">
          {topTokens.map(tokenId => {
            const orderIdx = reorderTokens.indexOf(tokenId);
            return (
              <TikiToken
                key={tokenId}
                token={state.tokens[tokenId]}
                size="lg"
                selected={orderIdx >= 0}
                onClick={() => toggleReorderToken(tokenId)}
                orderNumber={orderIdx >= 0 ? orderIdx + 1 : undefined}
              />
            );
          })}
        </div>

        {reorderTokens.length > 0 && (
          <p className="text-xs text-muted-foreground text-center mb-3">
            New order: {reorderTokens.map((id, i) => `${i + 1}. ${state.tokens[id].emoji}`).join('  ')}
          </p>
        )}

        <div className="flex gap-2 justify-center">
          <button
            onClick={confirmReorder}
            className="tiki-btn text-sm px-6 py-2"
            disabled={reorderTokens.length !== reorderCount}
          >
            Confirm ✓
          </button>
          <button
            onClick={() => { setMode('choose'); setReorderTokens([]); }}
            className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors rounded-xl bg-muted"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return null;
}
