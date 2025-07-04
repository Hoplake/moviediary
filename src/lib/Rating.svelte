<script lang="ts">
  export let rating: number = 0; // 0-10 scale
  export let showNumber: boolean = false;
  export let size: 'sm' | 'md' | 'lg' = 'md';

  // Scale to 0-5
  $: popcorns = Math.round(rating / 2);
  $: popcornArray = Array(5).fill(0).map((_, i) => i < popcorns);
  $: fontSize = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-xl';
</script>

<div class="flex items-center gap-1">
  {#each popcornArray as filled, i}
    <span class={fontSize} aria-label={(i+1) + ' popcorn'}>{filled ? '🍿' : '⬜'}</span>
  {/each}
  {#if showNumber}
    <span class="ml-2 text-gray-600 text-base align-middle">({popcorns}/5)</span>
  {/if}
</div> 