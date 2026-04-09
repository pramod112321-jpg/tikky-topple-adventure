export interface Token {
  id: string;
  color: string;
  label: string;
  emoji: string;
  ownerId: number;
}

export interface Player {
  id: number;
  name: string;
  tokenIds: string[];
  score: number;
  color: string;
}

export type ActionType = 'move' | 'reorder';

export interface MoveAction {
  type: 'move';
  count: 1 | 2 | 3;
}

export interface ReorderAction {
  type: 'reorder';
  count: 2 | 3;
  newOrder: string[];
}

export type GameAction = MoveAction | ReorderAction;

export interface GameState {
  players: Player[];
  track: string[][]; // track[position] = array of token IDs (top to bottom in stack)
  trackLength: number;
  currentPlayerIndex: number;
  turnNumber: number;
  maxTurns: number;
  phase: 'playing' | 'ended';
  tokens: Record<string, Token>;
  lastAction: string | null;
  history: string[];
}

export const TOKEN_CONFIGS = [
  { color: 'hsl(16, 80%, 50%)', emoji: '🔥', label: 'Fire' },
  { color: 'hsl(200, 70%, 50%)', emoji: '🌊', label: 'Wave' },
  { color: 'hsl(160, 60%, 40%)', emoji: '🌿', label: 'Leaf' },
  { color: 'hsl(45, 90%, 55%)', emoji: '⭐', label: 'Star' },
  { color: 'hsl(0, 75%, 55%)', emoji: '🌺', label: 'Hibiscus' },
  { color: 'hsl(280, 60%, 55%)', emoji: '🔮', label: 'Crystal' },
  { color: 'hsl(330, 70%, 60%)', emoji: '🌸', label: 'Blossom' },
  { color: 'hsl(180, 60%, 45%)', emoji: '💎', label: 'Gem' },
];

export const PLAYER_COLORS = [
  'hsl(16, 80%, 50%)',   // orange
  'hsl(200, 70%, 50%)',  // blue
  'hsl(160, 60%, 40%)',  // green
  'hsl(280, 60%, 55%)',  // purple
];

export type AppScreen = 'home' | 'setup' | 'rules' | 'playing' | 'ended';
