import { useState, useCallback } from 'react';
import { GameState, GameAction } from '@/lib/gameTypes';
import { GameBoard } from '@/components/GameBoard';
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
    <div className="min-h-screen flex flex-col p-3 md:p-4 max-w-6xl mx-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-3 bg-card/90 rounded-xl px-4 py-2.5 shadow-sm border-2 border-border backdrop-blur-sm">
        <h1 className="font-display text-xl text-primary">Tiki Topple</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-bold">Turn</span>
            <span className="font-display text-lg text-foreground">
              {state.turnNumber}/{state.maxTurns}
            </span>
          </div>
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
        <div className="text-sm text-accent font-bold mb-2 px-2 animate-slide-up text-center">
          ↪ {state.lastAction}
        </div>
      )}

      {/* Main layout: Board in center with panels on sides */}
      <div className="flex flex-col lg:flex-row gap-3 flex-1 items-start">
        {/* Left side: Players */}
        <div className="w-full lg:w-48 order-2 lg:order-1">
          <h3 className="font-display text-xs text-muted-foreground uppercase tracking-wider mb-2 px-1 text-center">
            Players
          </h3>
          <div className="tiki-card p-3">
            <PlayerPanel state={state} />
          </div>

          {/* History */}
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

        {/* Center: Game Board */}
        <div className="flex-1 order-1 lg:order-2">
          <GameBoard state={state} />
        </div>

        {/* Right side: Actions */}
        <div className="w-full lg:w-64 order-3">
          <h3 className="font-display text-xs text-muted-foreground uppercase tracking-wider mb-2 px-1 text-center">
            Actions
          </h3>
          <ActionPanel state={state} onAction={onAction} />
        </div>
      </div>
    </div>
  );
}
