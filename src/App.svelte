<script>
  import { game, PLAYER_NAMES, PLAYER_COLORS } from './lib/gameStore.js';
  import Cell from './lib/Cell.svelte';
  import Reserve from './lib/Reserve.svelte';

  $: g = $game;
  $: statusText = g.selected
    ? `${PLAYER_NAMES[g.current]}: pick a square to place`
    : `${PLAYER_NAMES[g.current]}'s turn`;
  $: statusColor = PLAYER_COLORS[g.current];
</script>

<h1>Gobblet</h1>

{#if !g.gameOver}
  <p class="status" style="color:{statusColor}">{statusText}</p>
{/if}

<div class="game-area">
  <Reserve player={0} stacks={g.reserve[0]} current={g.current} selected={g.selected} />

  <div class="board">
    {#each g.board as stack, i}
      <Cell index={i} {stack} winLine={g.winLine} selected={g.selected} />
    {/each}
  </div>

  <Reserve player={1} stacks={g.reserve[1]} current={g.current} selected={g.selected} />
</div>

<button class="new-game-btn" on:click={() => game.newGame()}>New Game</button>

<p class="rules">
  Click a piece to select it, then click a square to place it.<br>
  Larger pieces can gobble smaller ones. Get 4 in a row to win.
</p>

{#if g.gameOver}
  <div class="overlay">
    <div class="winner-msg">{PLAYER_NAMES[g.winner]} wins!</div>
    <button on:click={() => game.newGame()}>Play Again</button>
  </div>
{/if}

<style>
  :global(*, *::before, *::after) { box-sizing: border-box; margin: 0; padding: 0; }

  :global(:root) { --cell: 90px; }

  :global(body) {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    background: #1a1a2e;
    font-family: 'Segoe UI', sans-serif;
    color: #eee;
    padding: 16px;
  }

  :global(button) {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  h1 { font-size: 2rem; letter-spacing: 0.06em; color: #ccc; }

  @media (max-width: 640px) {
    :global(:root) { --cell: clamp(60px, calc((100vw - 50px) / 4), 90px); }
    :global(body) { justify-content: flex-start; gap: 10px; padding: 12px 8px; }
    h1 { font-size: 1.5rem; }
  }

  .status {
    font-size: 1.05rem;
    min-height: 1.5em;
    text-align: center;
  }

  .game-area {
    display: flex;
    align-items: center;
    gap: 22px;
  }

  @media (max-width: 640px) {
    .game-area { flex-direction: column; gap: 10px; }
  }

  .board {
    display: grid;
    grid-template-columns: repeat(4, var(--cell));
    grid-template-rows: repeat(4, var(--cell));
    gap: 6px;
    padding: 8px;
    background: #0f3460;
    border-radius: 14px;
    box-shadow: 0 4px 28px rgba(0,0,0,0.55);
  }

  .new-game-btn {
    padding: 0.5rem 1.4rem;
    font-size: 0.88rem;
    border: none; border-radius: 8px;
    background: #0f3460; color: #aaa;
    cursor: pointer;
  }
  .new-game-btn:hover { background: #1a4a80; }

  .rules {
    font-size: 0.75rem;
    color: #555;
    text-align: center;
    max-width: 500px;
    line-height: 1.5;
  }

  .overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.72);
    display: flex;
    align-items: center; justify-content: center;
    flex-direction: column; gap: 20px;
    z-index: 20;
  }
  .winner-msg { font-size: 2.6rem; color: gold; }
  .overlay button {
    padding: 0.65rem 2rem;
    font-size: 1rem;
    border: none; border-radius: 8px;
    background: #e94560; color: #fff;
    cursor: pointer;
  }
  .overlay button:hover { background: #c73652; }
</style>
