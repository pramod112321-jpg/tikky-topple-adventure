export interface Token {
  id: string;
  color: string;
  label: string;
  ownerId: number; // player index
}

export interface Player {
  id: number;
  name: string;
  tokenIds: string[];
  score: number;
}

export type ActionType = 'move' | 'reorder';

export interface MoveAction {
  type: 'move';
  count: 1 | 2 | 3; // move top 1, 2, or 3 tokens forward
}

export interface ReorderAction {
  type: 'reorder';
  count: 2 | 3; // reorder top 2 or 3 tokens
  newOrder: string[]; // token IDs in new order (top to bottom)
}

export type GameAction = MoveAction | ReorderAction;

export interface GameState {
  players: Player[];
  stack: string[]; // token IDs from top to bottom
  track: string[][]; // track positions, each position can hold tokens
  trackLength: number;
  currentPlayerIndex: number;
  turnNumber: number;
  maxTurns: number;
  phase: 'setup' | 'playing' | 'ended';
  tokens: Record<string, Token>;
  lastAction: string | null;
}

export const TOKEN_COLORS = [
  { color: 'hsl(16, 80%, 50%)', label: '🔥' },   // orange
  { color: 'hsl(200, 70%, 50%)', label: '🌊' },   // blue
  { color: 'hsl(160, 60%, 40%)', label: '🌿' },   // green
  { color: 'hsl(45, 90%, 55%)', label: '⭐' },    // yellow
  { color: 'hsl(0, 75%, 55%)', label: '🌺' },     // red
  { color: 'hsl(280, 60%, 55%)', label: '🔮' },   // purple
  { color: 'hsl(330, 70%, 60%)', label: '🌸' },   // pink
  { color: 'hsl(180, 60%, 45%)', label: '💎' },   // teal
];

export const PLAYER_NAMES = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
