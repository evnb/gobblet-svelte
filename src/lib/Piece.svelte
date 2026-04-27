<script>
  import { PX } from './gameStore.js';
  export let player;
  export let size;
  export let selected = false;
</script>

<div
  class="piece"
  class:p0={player === 0}
  class:p1={player === 1}
  class:sel={selected}
  style="width:{PX[size-1]}px; height:{PX[size-1]}px"
></div>

<style>
  .piece {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    transition: transform 0.1s;
  }
  .p0 {
    background: radial-gradient(circle at 36% 30%, #ffaabf, #e94560, #9b1c36);
    border: 2px solid #ffaabf;
  }
  .p1 {
    background: radial-gradient(circle at 36% 30%, #93ddf9, #4fc3f7, #1a7ea8);
    border: 2px solid #93ddf9;
  }
  .sel {
    box-shadow: 0 0 0 3px gold, 0 0 16px rgba(255,215,0,0.75);
  }
</style>
