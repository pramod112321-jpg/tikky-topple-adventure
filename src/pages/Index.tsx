import { useState, useCallback } from 'react';
import { GameState, GameAction, AppScreen } from '@/lib/gameTypes';
import { createGame, executeAction } from '@/lib/gameEngine';
import { HomeScreen } from '@/components/HomeScreen';
import { SetupScreen } from '@/components/SetupScreen';
import { RulesScreen } from '@/components/RulesScreen';
import { GamePlayScreen } from '@/components/GamePlayScreen';
import { GameOverScreen } from '@/components/GameOverScreen';

const Index = () => {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [lastPlayerNames, setLastPlayerNames] = useState<string[]>([]);

  const handleStartGame = useCallback((playerNames: string[]) => {
    setLastPlayerNames(playerNames);
    setGameState(createGame(playerNames));
    setScreen('playing');
  }, []);

  const handleAction = useCallback((action: GameAction) => {
    setGameState(prev => {
      if (!prev) return null;
      const newState = executeAction(prev, action);
      if (newState.phase === 'ended') {
        // Small delay to show last action before transitioning
        setTimeout(() => setScreen('ended'), 600);
      }
      return newState;
    });
  }, []);

  const handlePlayAgain = useCallback(() => {
    setGameState(createGame(lastPlayerNames));
    setScreen('playing');
  }, [lastPlayerNames]);

  const goHome = useCallback(() => {
    setGameState(null);
    setScreen('home');
  }, []);

  switch (screen) {
    case 'home':
      return (
        <HomeScreen
          onPlay={() => setScreen('setup')}
          onRules={() => setScreen('rules')}
        />
      );
    case 'setup':
      return <SetupScreen onStart={handleStartGame} onBack={goHome} />;
    case 'rules':
      return <RulesScreen onBack={goHome} />;
    case 'playing':
      return gameState ? (
        <GamePlayScreen state={gameState} onAction={handleAction} onQuit={goHome} />
      ) : null;
    case 'ended':
      return gameState ? (
        <GameOverScreen state={gameState} onPlayAgain={handlePlayAgain} onHome={goHome} />
      ) : null;
    default:
      return null;
  }
};

export default Index;
