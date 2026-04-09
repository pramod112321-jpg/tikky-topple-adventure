import { GameState, Token, Player, GameAction, TOKEN_CONFIGS, PLAYER_COLORS } from './gameTypes';

export function createGame(playerNames: string[]): GameState {
  const playerCount = playerNames.length;
  const tokensPerPlayer = 2;
  const trackLength = 12;
  const maxTurns = 30;

  const tokens: Record<string, Token> = {};
  const players: Player[] = [];
  const allTokenIds: string[] = [];

  for (let p = 0; p < playerCount; p++) {
    const playerTokenIds: string[] = [];
    for (let t = 0; t < tokensPerPlayer; t++) {
      const colorIndex = p * tokensPerPlayer + t;
      const config = TOKEN_CONFIGS[colorIndex % TOKEN_CONFIGS.length];
      const tokenId = `t-${p}-${t}`;
      tokens[tokenId] = {
        id: tokenId,
        color: config.color,
        label: config.label,
        emoji: config.emoji,
        ownerId: p,
      };
      playerTokenIds.push(tokenId);
      allTokenIds.push(tokenId);
    }
    players.push({
      id: p,
      name: playerNames[p] || `Player ${p + 1}`,
      tokenIds: playerTokenIds,
      score: 0,
      color: PLAYER_COLORS[p % PLAYER_COLORS.length],
    });
  }

  // Shuffle all tokens
  for (let i = allTokenIds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allTokenIds[i], allTokenIds[j]] = [allTokenIds[j], allTokenIds[i]];
  }

  const track: string[][] = Array.from({ length: trackLength }, () => []);
  track[0] = [...allTokenIds]; // all start at position 0

  return {
    players,
    track,
    trackLength,
    currentPlayerIndex: 0,
    turnNumber: 1,
    maxTurns,
    phase: 'playing',
    tokens,
    lastAction: null,
    history: [],
  };
}

// Find the furthest-back (leftmost) position that has tokens
export function getMainStack(state: GameState): { position: number; tokens: string[] } | null {
  for (let i = 0; i < state.trackLength; i++) {
    if (state.track[i].length > 0) {
      return { position: i, tokens: state.track[i] };
    }
  }
  return null;
}

// Get all positions that have tokens
export function getOccupiedPositions(state: GameState): { position: number; tokens: string[] }[] {
  const result: { position: number; tokens: string[] }[] = [];
  for (let i = 0; i < state.trackLength; i++) {
    if (state.track[i].length > 0) {
      result.push({ position: i, tokens: state.track[i] });
    }
  }
  return result;
}

export function executeAction(state: GameState, action: GameAction): GameState {
  const newState: GameState = JSON.parse(JSON.stringify(state));
  const playerName = newState.players[newState.currentPlayerIndex].name;

  if (action.type === 'move') {
    // Find the rearmost position with tokens
    const mainStack = getMainStack(newState);
    if (!mainStack) return newState;

    const { position, tokens: currentTokens } = mainStack;
    const nextPos = position + 1;
    if (nextPos >= newState.trackLength) return newState;

    const count = Math.min(action.count, currentTokens.length);
    const movedTokens = currentTokens.splice(0, count);

    // Place at next position on top of existing
    newState.track[nextPos] = [...movedTokens, ...newState.track[nextPos]];

    const msg = `${playerName} moved ${count} token${count > 1 ? 's' : ''} forward`;
    newState.lastAction = msg;
    newState.history.push(msg);

  } else if (action.type === 'reorder') {
    // Find the rearmost position with tokens
    const mainStack = getMainStack(newState);
    if (!mainStack) return newState;

    const { position } = mainStack;
    const currentTokens = newState.track[position];
    const count = Math.min(action.count, currentTokens.length);

    // Remove top N tokens
    currentTokens.splice(0, count);
    // Insert in new order at top
    const reordered = action.newOrder.slice(0, count);
    newState.track[position] = [...reordered, ...currentTokens];

    const msg = `${playerName} reordered top ${count} tokens`;
    newState.lastAction = msg;
    newState.history.push(msg);
  }

  // Advance turn
  newState.currentPlayerIndex = (newState.currentPlayerIndex + 1) % newState.players.length;
  if (newState.currentPlayerIndex === 0) {
    newState.turnNumber++;
  }

  // Check end conditions
  if (checkGameEnd(newState)) {
    newState.phase = 'ended';
    calculateScores(newState);
  }

  return newState;
}

function checkGameEnd(state: GameState): boolean {
  // All tokens at final position
  const lastPos = state.track[state.trackLength - 1];
  const totalTokens = Object.keys(state.tokens).length;
  if (lastPos.length === totalTokens) return true;

  // Exceeded max turns
  if (state.turnNumber > state.maxTurns) return true;

  return false;
}

function calculateScores(state: GameState): void {
  // Reset scores
  state.players.forEach(p => p.score = 0);

  const totalTokens = Object.keys(state.tokens).length;
  let rank = totalTokens; // highest rank = most points

  // From furthest position to nearest, top of stack first
  for (let pos = state.trackLength - 1; pos >= 0; pos--) {
    for (const tokenId of state.track[pos]) {
      const token = state.tokens[tokenId];
      state.players[token.ownerId].score += rank;
      rank--;
    }
  }
}

export function canMove(state: GameState): boolean {
  const stack = getMainStack(state);
  if (!stack) return false;
  return stack.position + 1 < state.trackLength;
}

export function canReorder(state: GameState): boolean {
  const stack = getMainStack(state);
  if (!stack) return false;
  return stack.tokens.length >= 2;
}

export function getMaxMovable(state: GameState): number {
  const stack = getMainStack(state);
  if (!stack) return 0;
  return Math.min(3, stack.tokens.length);
}
