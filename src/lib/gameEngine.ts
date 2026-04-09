import { GameState, Token, Player, GameAction, TOKEN_COLORS, PLAYER_NAMES } from './gameTypes';

export function createGame(playerCount: number): GameState {
  const tokensPerPlayer = 2;
  const totalTokens = playerCount * tokensPerPlayer;
  const trackLength = 10;
  const maxTurns = 25;

  const tokens: Record<string, Token> = {};
  const players: Player[] = [];
  const stack: string[] = [];

  // Create players and tokens
  for (let p = 0; p < playerCount; p++) {
    const playerTokenIds: string[] = [];
    for (let t = 0; t < tokensPerPlayer; t++) {
      const colorIndex = p * tokensPerPlayer + t;
      const tokenId = `token-${p}-${t}`;
      tokens[tokenId] = {
        id: tokenId,
        color: TOKEN_COLORS[colorIndex % TOKEN_COLORS.length].color,
        label: TOKEN_COLORS[colorIndex % TOKEN_COLORS.length].label,
        ownerId: p,
      };
      playerTokenIds.push(tokenId);
      stack.push(tokenId);
    }
    players.push({
      id: p,
      name: PLAYER_NAMES[p],
      tokenIds: playerTokenIds,
      score: 0,
    });
  }

  // Shuffle stack
  for (let i = stack.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [stack[i], stack[j]] = [stack[j], stack[i]];
  }

  // Initialize track - all tokens start at position 0
  const track: string[][] = Array.from({ length: trackLength }, () => []);
  track[0] = [...stack];

  return {
    players,
    stack, // this represents the order at current position (top to bottom)
    track,
    trackLength,
    currentPlayerIndex: 0,
    turnNumber: 1,
    maxTurns,
    phase: 'playing',
    tokens,
    lastAction: null,
  };
}

export function getStackAtPosition(state: GameState): { position: number; tokens: string[] } | null {
  // Find the rearmost position that has tokens (main stack)
  for (let i = 0; i < state.trackLength; i++) {
    if (state.track[i].length > 0) {
      return { position: i, tokens: state.track[i] };
    }
  }
  return null;
}

export function executeAction(state: GameState, action: GameAction): GameState {
  const newState = JSON.parse(JSON.stringify(state)) as GameState;

  if (action.type === 'move') {
    // Find the rearmost stack with tokens
    const stackInfo = getStackAtPosition(newState);
    if (!stackInfo) return newState;

    const { position, tokens: currentStack } = stackInfo;
    const nextPos = position + 1;
    if (nextPos >= newState.trackLength) return newState;

    // Take top N tokens (maintaining order) and move them forward
    const count = Math.min(action.count, currentStack.length);
    const movedTokens = currentStack.splice(0, count);

    // Place them at next position, on top of any existing tokens there
    newState.track[nextPos] = [...movedTokens, ...newState.track[nextPos]];
    
    newState.lastAction = `${newState.players[newState.currentPlayerIndex].name} moved ${count} token${count > 1 ? 's' : ''} forward`;

  } else if (action.type === 'reorder') {
    // Find the rearmost stack
    const stackInfo = getStackAtPosition(newState);
    if (!stackInfo) return newState;

    const { tokens: currentStack } = stackInfo;
    const count = Math.min(action.count, currentStack.length);

    // Remove top N tokens
    currentStack.splice(0, count);

    // Insert new order at top
    const reordered = action.newOrder.slice(0, count);
    stackInfo.tokens.unshift(...reordered);

    // Update the track
    for (let i = 0; i < newState.trackLength; i++) {
      if (newState.track[i].length > 0) {
        newState.track[i] = stackInfo.tokens;
        break;
      }
    }

    newState.lastAction = `${newState.players[newState.currentPlayerIndex].name} reordered top ${count} tokens`;
  }

  // Advance turn
  newState.currentPlayerIndex = (newState.currentPlayerIndex + 1) % newState.players.length;
  if (newState.currentPlayerIndex === 0) {
    newState.turnNumber++;
  }

  // Check end conditions
  const allAtEnd = newState.track[newState.trackLength - 1].length > 0 &&
    newState.track.slice(0, newState.trackLength - 1).every(pos => pos.length === 0);
  
  if (allAtEnd || newState.turnNumber > newState.maxTurns) {
    newState.phase = 'ended';
    calculateScores(newState);
  }

  return newState;
}

function calculateScores(state: GameState): void {
  // Score based on position - tokens further along get more points
  // Also, within a position, tokens higher in stack get more points
  const totalTokens = Object.keys(state.tokens).length;
  let rank = totalTokens;

  // From end to start
  for (let pos = state.trackLength - 1; pos >= 0; pos--) {
    const tokensAtPos = state.track[pos];
    for (const tokenId of tokensAtPos) {
      const token = state.tokens[tokenId];
      const player = state.players[token.ownerId];
      player.score += rank;
      rank--;
    }
  }
}

export function canMove(state: GameState): boolean {
  const stackInfo = getStackAtPosition(state);
  if (!stackInfo) return false;
  return stackInfo.position + 1 < state.trackLength;
}

export function canReorder(state: GameState): boolean {
  const stackInfo = getStackAtPosition(state);
  if (!stackInfo) return false;
  return stackInfo.tokens.length >= 2;
}
