<script lang="ts">
  import highestGrossingActors from '../../data/highest_grossing_actors.json';
  import { base } from '$app/paths';

  // Sort state
  let sortField: 'total_revenue' | 'movie_count' | 'name' = 'total_revenue';
  let sortDirection: 'asc' | 'desc' = 'desc';

  // Sort function
  function sortActors(actorsList: typeof highestGrossingActors, field: typeof sortField, direction: typeof sortDirection) {
    return [...actorsList].sort((a, b) => {
      let aValue: any = a[field];
      let bValue: any = b[field];

      // Handle string comparison for names
      if (field === 'name') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      // Handle numeric comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle string comparison
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Format revenue as currency
  function formatRevenue(revenue: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(revenue);
  }

  // Handle sort click
  function handleSort(field: typeof sortField) {
    if (sortField === field) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = field;
      sortDirection = 'desc';
    }
  }

  // Get sort icon
  function getSortIcon(field: typeof sortField): string {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  }

  // Get sorted actors
  $: sortedActors = sortActors(highestGrossingActors, sortField, sortDirection);
</script>

<svelte:head>
  <title>Highest Grossing Actors - Movie Diary</title>
</svelte:head>

<div class="py-6 sm:py-10">
  <div class="max-w-6xl mx-auto backdrop-blur-md bg-white/80 rounded-xl shadow-2xl p-4 sm:p-8 border border-white/30">
    <h1 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-900 drop-shadow-lg">Highest Grossing Actors</h1>
    <p class="text-center text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">Actors ranked by total box office revenue from movies in your collection</p>
    
    <!-- Sort Info -->
    <div class="mb-4 text-sm text-gray-700 text-center">
      Sorted by: <span class="font-medium text-gray-900">{sortField}</span> 
      ({sortDirection === 'asc' ? 'ascending' : 'descending'})
    </div>

    <!-- Desktop Table View -->
    <div class="hidden lg:block overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" on:click={() => handleSort('name')}>
              <div class="flex items-center space-x-1">
                <span>Actor</span>
                <span class="text-sm">{getSortIcon('name')}</span>
              </div>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" on:click={() => handleSort('total_revenue')}>
              <div class="flex items-center space-x-1">
                <span>Total Revenue</span>
                <span class="text-sm">{getSortIcon('total_revenue')}</span>
              </div>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" on:click={() => handleSort('movie_count')}>
              <div class="flex items-center space-x-1">
                <span>Movies</span>
                <span class="text-sm">{getSortIcon('movie_count')}</span>
              </div>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IMDb</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each sortedActors as actor, index}
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <a href="{base}/person/{actor.person_id}" class="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
                  {#if actor.profile_path}
                    <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} class="w-7 h-7 rounded-full object-cover border border-blue-200" />
                  {:else}
                    <img src="{base}/default-avatar.png" alt="No photo" class="w-7 h-7 rounded-full object-cover border border-blue-200" />
                  {/if}
                  <span>{actor.name}</span>
                </a>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-green-600">
                  {formatRevenue(actor.total_revenue)}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {actor.movie_count}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {#if actor.imdb_id}
                  <a 
                    href="https://www.imdb.com/name/{actor.imdb_id}/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    View on IMDb
                  </a>
                {:else}
                  <span class="text-gray-400">-</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Mobile Card View -->
    <div class="lg:hidden space-y-3">
      {#each sortedActors as actor, index}
        <div class="bg-white/90 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
          <div class="flex items-center gap-2 mb-2">
            {#if actor.profile_path}
              <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} class="w-8 h-8 rounded-full object-cover border border-blue-200" />
            {:else}
              <img src="{base}/default-avatar.png" alt="No photo" class="w-8 h-8 rounded-full object-cover border border-blue-200" />
            {/if}
            <a href="{base}/person/{actor.person_id}" class="text-blue-700 hover:text-blue-900 font-semibold text-lg leading-tight flex-1">
              {actor.name}
            </a>
          </div>
          <div class="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
            <div class="flex items-center">
              <span class="font-medium text-gray-700">Revenue:</span>
              <span class="ml-1 font-semibold text-green-700">{formatRevenue(actor.total_revenue)}</span>
            </div>
            <div class="flex items-center">
              <span class="font-medium text-gray-700">Movies:</span>
              <span class="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {actor.movie_count}
              </span>
            </div>
          </div>
          <div class="flex justify-between items-center">
            {#if actor.imdb_id}
              <a 
                href="https://www.imdb.com/name/{actor.imdb_id}/" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-blue-700 hover:text-blue-900 underline text-xs"
              >
                View on IMDb
              </a>
            {:else}
              <span class="text-gray-400 text-xs">-</span>
            {/if}
            <button 
              class="text-xs text-gray-500 hover:text-gray-700"
              on:click={() => handleSort(sortField === 'total_revenue' ? 'movie_count' : 'total_revenue')}
            >
              Sort by {sortField === 'total_revenue' ? 'Movies' : 'Revenue'}
            </button>
          </div>
        </div>
      {/each}
    </div>
    
    <div class="mt-6 text-center text-sm text-gray-600">
      <p>Showing {sortedActors.length} actors with the highest total box office revenue from movies in your collection.</p>
    </div>
  </div>
</div> 