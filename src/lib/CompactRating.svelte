<script lang="ts">
  export let rating: number | null = 0; // 0-10 scale
  export let showStars: boolean = true;
  export let showNumber: boolean = true;
  export let size: 'xs' | 'sm' | 'md' = 'sm';
  export let color: 'default' | 'green' | 'blue' | 'purple' = 'default';

  // Scale to 0-5
  $: popcorns = rating ? Math.round(rating / 2) : 0;
  $: popcornArray = Array(5).fill(0).map((_, i) => i < popcorns);
  
  // Size classes
  $: sizeClasses = {
    xs: 'text-sm',
    sm: 'text-base', 
    md: 'text-lg'
  };
  
  // Color classes for the number
  $: colorClasses = {
    default: 'text-gray-700',
    green: 'text-green-700',
    blue: 'text-blue-700',
    purple: 'text-purple-700'
  };
  
  $: fontSize = sizeClasses[size];
  $: textColor = colorClasses[color];
</script>

<div class="flex items-center gap-1">
  {#if showStars && rating !== null}
    {#each popcornArray as filled, i}
      <span class={fontSize} aria-label={(i+1) + ' popcorn'}>{filled ? '🍿' : '⬜'}</span>
    {/each}
  {/if}
  {#if showNumber && rating !== null}
    <span class="ml-1 {fontSize} {textColor} font-medium">{Math.round(rating / 2)}</span>
  {:else if showNumber}
    <span class="ml-1 {fontSize} text-gray-400">-</span>
  {/if}
</div> 