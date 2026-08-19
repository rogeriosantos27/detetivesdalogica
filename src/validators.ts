import { Board } from './types';

export function getIndex(board: Board, type: string, value: string): number {
  return board.findIndex(col => col[type] === value);
}

export function checkExactIndex(board: Board, type: string, value: string, exactIndex: number) {
  const i = getIndex(board, type, value);
  if (i === exactIndex) return true;
  if (i !== -1 && i !== exactIndex) return false;
  if (board[exactIndex] && board[exactIndex][type] !== "" && board[exactIndex][type] !== value) return false;
  return null;
}

export function checkExactLeft(board: Board, tA: string, vA: string, tB: string, vB: string) {
  const iA = getIndex(board, tA, vA);
  const iB = getIndex(board, tB, vB);
  
  if (iA !== -1 && iB !== -1) return iA === iB - 1;
  
  let possible = false;
  for (let i = 0; i < board.length - 1; i++) {
    const canPlaceA = (iA === -1 && (board[i][tA] === "" || board[i][tA] === vA)) || iA === i;
    const canPlaceB = (iB === -1 && (board[i + 1][tB] === "" || board[i + 1][tB] === vB)) || iB === i + 1;
    if (canPlaceA && canPlaceB) {
      possible = true;
      break;
    }
  }
  if (!possible) return false;
  return null;
}

export function checkExactRight(board: Board, tA: string, vA: string, tB: string, vB: string) {
  return checkExactLeft(board, tB, vB, tA, vA);
}

export function checkSame(board: Board, tA: string, vA: string, tB: string, vB: string) {
  const iA = getIndex(board, tA, vA);
  const iB = getIndex(board, tB, vB);
  
  if (iA !== -1 && iB !== -1) return iA === iB;
  
  let possible = false;
  for (let i = 0; i < board.length; i++) {
    const canPlaceA = (iA === -1 && (board[i][tA] === "" || board[i][tA] === vA)) || iA === i;
    const canPlaceB = (iB === -1 && (board[i][tB] === "" || board[i][tB] === vB)) || iB === i;
    if (canPlaceA && canPlaceB) {
      possible = true;
      break;
    }
  }
  if (!possible) return false;
  return null;
}

export function checkNextTo(board: Board, tA: string, vA: string, tB: string, vB: string) {
  const iA = getIndex(board, tA, vA);
  const iB = getIndex(board, tB, vB);
  
  if (iA !== -1 && iB !== -1) return Math.abs(iA - iB) === 1;
  
  let possible = false;
  for (let i = 0; i < board.length - 1; i++) {
    const canPlaceA1 = (iA === -1 && (board[i][tA] === "" || board[i][tA] === vA)) || iA === i;
    const canPlaceB1 = (iB === -1 && (board[i + 1][tB] === "" || board[i + 1][tB] === vB)) || iB === i + 1;
    if (canPlaceA1 && canPlaceB1) { possible = true; break; }
    
    const canPlaceB2 = (iB === -1 && (board[i][tB] === "" || board[i][tB] === vB)) || iB === i;
    const canPlaceA2 = (iA === -1 && (board[i + 1][tA] === "" || board[i + 1][tA] === vA)) || iA === i + 1;
    if (canPlaceB2 && canPlaceA2) { possible = true; break; }
  }
  if (!possible) return false;
  return null;
}

export function checkLeftOf(board: Board, tA: string, vA: string, tB: string, vB: string) {
  const iA = getIndex(board, tA, vA);
  const iB = getIndex(board, tB, vB);
  
  if (iA !== -1 && iB !== -1) return iA < iB;
  
  let possible = false;
  for (let a = 0; a < board.length - 1; a++) {
    for (let b = a + 1; b < board.length; b++) {
      const canPlaceA = (iA === -1 && (board[a][tA] === "" || board[a][tA] === vA)) || iA === a;
      const canPlaceB = (iB === -1 && (board[b][tB] === "" || board[b][tB] === vB)) || iB === b;
      if (canPlaceA && canPlaceB) {
        possible = true;
        break;
      }
    }
    if (possible) break;
  }
  if (!possible) return false;
  return null;
}

export function checkRightOf(board: Board, tA: string, vA: string, tB: string, vB: string) {
  return checkLeftOf(board, tB, vB, tA, vA);
}

export function checkBetweenInOrder(board: Board, tA: string, vA: string, tB: string, vB: string, tC: string, vC: string) {
  const iA = getIndex(board, tA, vA);
  const iB = getIndex(board, tB, vB);
  const iC = getIndex(board, tC, vC);
  
  if (iA !== -1 && iB !== -1 && iC !== -1) {
    return (iA < iB && iB < iC);
  }
  
  let possible = false;
  for (let a = 0; a < board.length - 2; a++) {
    for (let b = a + 1; b < board.length - 1; b++) {
      for (let c = b + 1; c < board.length; c++) {
        const canA = (iA === -1 && (board[a][tA] === "" || board[a][tA] === vA)) || iA === a;
        const canB = (iB === -1 && (board[b][tB] === "" || board[b][tB] === vB)) || iB === b;
        const canC = (iC === -1 && (board[c][tC] === "" || board[c][tC] === vC)) || iC === c;
        if (canA && canB && canC) {
          possible = true;
          break;
        }
      }
      if (possible) break;
    }
    if (possible) break;
  }
  if (!possible) return false;
  return null;
}
