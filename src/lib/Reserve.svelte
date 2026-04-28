<script>
  import Piece from './Piece.svelte';
  import { game } from './gameStore.js';

  export let player;
  export let stacks;
  export let current;
  export let selected;

  $: inactive = player !== current;
</script>

<div class="reserve" class:inactive>
  <div class="label" style="color:{player === 0 ? '#ffaabf' : '#93ddf9'}">
    {player === 0 ? 'Red' : 'Blue'}
  </div>
  <div class="stacks">
    {#each stacks as stack, si}
      {@const empty = stack.length === 0}
      {@const isSel = selected?.type === 'reserve' && selected.player === player && selected.stackIdx === si}
      <button
        class="rstack"
        class:empty
        class:sel={isSel}
        disabled={empty}
        on:click={() => game.selectReserve(player, si)}
      >
        {#each stack as sz}
          <Piece {player} size={sz} />
        {/each}
      </button>
    {/each}
  </div>
</div>

<style>
  .reserve {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .reserve.inactive { opacity: 0.45; pointer-events: none; }

  .label {
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.8;
  }

  .stacks {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .rstack {
    width: var(--cell); height: var(--cell);
    background: #16213e;
    border: none;
    border-radius: 9px;
    cursor: pointer;
    position: relative;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.12s;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
  .rstack:hover:not(.empty) { background: #1c2d52; }
  .rstack.sel               { outline: 3px solid gold; outline-offset: -3px; }
  .rstack.empty             { opacity: 0.22; cursor: default; }

  @media (max-width: 640px) {
    .stacks { flex-direction: row; gap: 6px; }
  }
</style>
