import { writable, derived } from 'svelte/store';

export const PX = [26, 46, 64, 82];
export const PLAYER_NAMES = ['Red', 'Blue'];
export const PLAYER_COLORS = ['#ffaabf', '#93ddf9'];

const WIN_LINES = [];
for (let r = 0; r < 4; r++) WIN_LINES.push([r*4, r*4+1, r*4+2, r*4+3]);
for (let c = 0; c < 4; c++) WIN_LINES.push([c, c+4, c+8, c+12]);
WIN_LINES.push([0,5,10,15], [3,6,9,12]);

function freshState() {
  return {
    board: Array(16).fill(null).map(() => []),
    reserve: [
      [[1,2,3,4],[1,2,3,4],[1,2,3,4]],
      [[1,2,3,4],[1,2,3,4],[1,2,3,4]],
    ],
    current: 0,
    selected: null,
    gameOver: false,
    winner: null,
    winLine: null,
  };
}

function topOf(board, i) {
  const s = board[i];
  return s.length ? s[s.length - 1] : null;
}

function canPlace(board, size, cellIdx) {
  const t = topOf(board, cellIdx);
  return !t || size > t.size;
}

function checkWinner(board) {
  for (const line of WIN_LINES) {
    const tops = line.map(i => topOf(board, i));
    if (tops.every(t => t && t.player === tops[0].player))
      return { player: tops[0].player, line };
  }
  return null;
}

function createGame() {
  const { subscribe, set, update } = writable(freshState());

  function newGame() {
    set(freshState());
  }

  function selectReserve(player, stackIdx) {
    update(s => {
      if (s.gameOver || player !== s.current) return s;
      const stack = s.reserve[player][stackIdx];
      if (!stack.length) return s;

      const alreadySelected =
        s.selected?.type === 'reserve' &&
        s.selected.player === player &&
        s.selected.stackIdx === stackIdx;

      return {
        ...s,
        selected: alreadySelected
          ? null
          : { type: 'reserve', player, stackIdx, piece: { player, size: stack[stack.length - 1] } },
      };
    });
  }

  function clickCell(cellIdx) {
    update(s => {
      if (s.gameOver) return s;

      if (!s.selected) {
        const t = topOf(s.board, cellIdx);
        if (t && t.player === s.current) {
          return { ...s, selected: { type: 'board', boardCell: cellIdx, piece: t } };
        }
        return s;
      }

      // Deselect if clicking source cell
      if (s.selected.type === 'board' && s.selected.boardCell === cellIdx) {
        return { ...s, selected: null };
      }

      if (!canPlace(s.board, s.selected.piece.size, cellIdx)) {
        // Re-select if it's the current player's piece
        const t = topOf(s.board, cellIdx);
        if (t && t.player === s.current) {
          return { ...s, selected: { type: 'board', boardCell: cellIdx, piece: t } };
        }
        return s;
      }

      // Execute move
      const board = s.board.map(stack => [...stack]);
      const reserve = s.reserve.map(p => p.map(stack => [...stack]));

      if (s.selected.type === 'reserve') {
        reserve[s.selected.player][s.selected.stackIdx].pop();
      } else {
        board[s.selected.boardCell].pop();
      }
      board[cellIdx].push(s.selected.piece);

      const win = checkWinner(board);
      if (win) {
        return { ...s, board, reserve, selected: null, gameOver: true, winner: win.player, winLine: win.line };
      }

      return { ...s, board, reserve, selected: null, current: 1 - s.current };
    });
  }

  return { subscribe, newGame, selectReserve, clickCell };
}

export const game = createGame();

export const validTargets = derived(game, $g => {
  if (!$g.selected) return new Set();
  const targets = new Set();
  for (let i = 0; i < 16; i++) {
    if (canPlace($g.board, $g.selected.piece.size, i)) targets.add(i);
  }
  return targets;
});
