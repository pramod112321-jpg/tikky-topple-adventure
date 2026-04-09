import { useState, useCallback } from 'react';
import { GameState, GameAction } from '@/lib/gameTypes';
import { createGame, executeAction } from '@/lib/gameEngine';
import { GameTrack } from '@/components/GameTrack';
import { PlayerPanel } from '@/components/PlayerPanel';
import { ActionPanel } from '@/components/ActionPanel';
import { ScoreBoard } from '@/components/ScoreBoard';

const Index = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerCount, setPlayerCount] = useState(2);

  const startGame = useCallback(() => {
    setGameState(createGame(playerCount));
  }, [playerCount]);

  const handleAction = useCallback((action: GameAction) => {
    setGameState(prev => prev ? executeAction(prev, action) : null);
  }, []);

  const resetGame = useCallback(() => {
    setGameState(null);
  }, []);

  // Setup screen
  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="tiki-card max-w-md w-full text-center animate-bounce-in">
          <h1 className="tiki-title text-5xl mb-2">Tiki Topple</h1>
          <p className="text-muted-foreground mb-8 font-body text-lg">
            A strategic stacking game 🏝️
          </p>

          <div className="mb-8">
            <label className="block font-display text-lg text-foreground mb-3">
              Number of Players
            </label>
            <div className="flex justify-center gap-3">
              {[2, 3, 4].map(n => (
                <button
                  key={n}
                  onClick={() => setPlayerCount(n)}
                  className={`w-14 h-14 rounded-2xl font-display text-xl transition-all duration-200 ${
                    playerCount === n
                      ? 'bg-primary text-primary-foreground scale-110 shadow-lg'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button onClick={startGame} className="tiki-btn text-xl px-12 py-4">
            Start Game! 🎮
          </button>

          <div className="mt-8 text-left text-sm text-muted-foreground space-y-2">
            <p className="font-bold text-foreground">How to play:</p>
            <p>🎯 Move top tokens forward along the track</p>
            <p>🔄 Reorder top tokens to gain advantage</p>
            <p>🏆 Score highest by getting your tokens furthest!</p>
          </div>
        </div>
      </div>
    );
  }

  // Game screen
  return (
    <div className="min-h-screen p-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="tiki-title text-3xl">Tiki Topple</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground font-bold">
            Turn {gameState.turnNumber}/{gameState.maxTurns}
          </span>
          <button
            onClick={resetGame}
            className="text-sm px-3 py-1 rounded-lg bg-muted text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors font-bold"
          >
            Quit
          </button>
        </div>
      </div>

      {/* Last action */}
      {gameState.lastAction && (
        <div className="text-sm text-accent font-bold mb-3 animate-slide-up">
          ↪ {gameState.lastAction}
        </div>
      )}

      {/* Track */}
      <div className="tiki-card mb-4 p-4">
        <h3 className="font-display text-sm text-muted-foreground mb-2">Game Track</h3>
        <GameTrack state={gameState} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Players */}
        <div>
          <h3 className="font-display text-sm text-muted-foreground mb-2">Players</h3>
          <PlayerPanel state={gameState} />
        </div>

        {/* Actions / Score */}
        <div>
          {gameState.phase === 'playing' ? (
            <ActionPanel state={gameState} onAction={handleAction} />
          ) : (
            <ScoreBoard state={gameState} onPlayAgain={resetGame} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
