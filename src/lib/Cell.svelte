<script>
  import Piece from './Piece.svelte';
  import { game, validTargets } from './gameStore.js';

  export let index;
  export let stack;
  export let winLine;
  export let selected;

  $: top = stack.length ? stack[stack.length - 1] : null;
  $: isSelected = selected?.type === 'board' && selected.boardCell === index;
  $: isHighlight = $validTargets.has(index);
  $: isWin = winLine?.includes(index);
</script>

<button
  class="cell"
  class:highlight={isHighlight}
  class:win-cell={isWin}
  on:click={() => game.clickCell(index)}
>
  {#if top}
    <Piece player={top.player} size={top.size} selected={isSelected} />
    {#if stack.length > 1}
      <span class="badge">+{stack.length - 1}</span>
    {/if}
  {/if}
</button>

<style>
  .cell {
    width: var(--cell); height: var(--cell);
    background: #16213e;
    border: none;
    border-radius: 9px;
    cursor: pointer;
    position: relative;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.12s;
  }
  .cell:hover            { background: #1c2d52; }
  .cell.highlight        { background: #1a3d70; outline: 2px solid rgba(255,210,0,0.45); outline-offset: -2px; }
  .cell.win-cell         { box-shadow: inset 0 0 22px rgba(255,215,0,0.45); }
  .badge {
    position: absolute;
    bottom: 4px; right: 5px;
    font-size: 9px;
    color: #aaa;
    pointer-events: none;
    opacity: 0.6;
  }
</style>
