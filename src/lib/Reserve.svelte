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

<style>
  .reserve {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .reserve.inactive { opacity: 0.45; pointer-events: none; }

  .label {
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.8;
  }

  .rstack {
    width: 90px; height: 90px;
    background: #16213e;
    border: none;
    border-radius: 9px;
    cursor: pointer;
    position: relative;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.12s;
  }
  .rstack:hover:not(.empty) { background: #1c2d52; }
  .rstack.sel               { outline: 3px solid gold; outline-offset: -3px; }
  .rstack.empty             { opacity: 0.22; cursor: default; }
</style>
