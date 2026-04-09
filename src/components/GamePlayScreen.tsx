import { useState, useCallback } from 'react';
import { GameState, GameAction } from '@/lib/gameTypes';
import { createGame, executeAction } from '@/lib/gameEngine';
import { GameTrack } from '@/components/GameTrack';
import { PlayerPanel } from '@/components/PlayerPanel';
import { ActionPanel } from '@/components/ActionPanel';

interface GamePlayScreenProps {
  state: GameState;
  onAction: (action: GameAction) => void;
  onQuit: () => void;
}

export function GamePlayScreen({ state, onAction, onQuit }: GamePlayScreenProps) {
  const progressPercent = Math.min(100, ((state.turnNumber - 1) / state.maxTurns) * 100);

  return (
    <div className="min-h-screen flex flex-col p-3 md:p-4 max-w-5xl mx-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-3 bg-card rounded-xl px-4 py-2.5 shadow-sm border-2 border-border">
        <h1 className="font-display text-xl text-primary">Tiki Topple</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-bold">Turn</span>
            <span className="font-display text-lg text-foreground">
              {state.turnNumber}/{state.maxTurns}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <button
            onClick={onQuit}
            className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors font-bold"
          >
            ✕ Quit
          </button>
        </div>
      </div>

      {/* Last action feedback */}
      {state.lastAction && (
        <div className="text-sm text-accent font-bold mb-2 px-2 animate-slide-up">
          ↪ {state.lastAction}
        </div>
      )}

      {/* Game Track */}
      <div className="tiki-card mb-3 p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-xs text-muted-foreground uppercase tracking-wider">
            Game Track
          </h3>
          <span className="text-xs text-muted-foreground">Position 0 → {state.trackLength - 1} 🏁</span>
        </div>
        <GameTrack state={state} />
      </div>

      {/* Players + Actions */}
      <div className="grid md:grid-cols-2 gap-3 flex-1">
        <div>
          <h3 className="font-display text-xs text-muted-foreground uppercase tracking-wider mb-2 px-1">
            Players
          </h3>
          <PlayerPanel state={state} />

          {/* Action history */}
          {state.history.length > 0 && (
            <div className="mt-3 tiki-card p-3">
              <h3 className="font-display text-xs text-muted-foreground uppercase tracking-wider mb-2">
                History
              </h3>
              <div className="max-h-24 overflow-y-auto space-y-1">
                {state.history.slice(-5).reverse().map((h, i) => (
                  <p key={i} className={`text-xs ${i === 0 ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                    {h}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="font-display text-xs text-muted-foreground uppercase tracking-wider mb-2 px-1">
            Actions
          </h3>
          <ActionPanel state={state} onAction={onAction} />
        </div>
      </div>
    </div>
  );
}
