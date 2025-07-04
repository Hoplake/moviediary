<script lang="ts">
  import commonActorPairs from '../../data/common_actor_pairs.json';
  import { base } from '$app/paths';

  // Sort state
  let sortField: 'movie_count' | 'actor1_name' | 'actor2_name' = 'movie_count';
  let sortDirection: 'asc' | 'desc' = 'desc';

  // Sort function
  function sortPairs(pairsList: typeof commonActorPairs, field: typeof sortField, direction: typeof sortDirection) {
    return [...pairsList].sort((a, b) => {
      let aValue: any = a[field];
      let bValue: any = b[field];

      // Handle string comparison for names
      if (field === 'actor1_name' || field === 'actor2_name') {
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

  // Handle sort click
  function handleSort(field: typeof sortField) {
    if (sortField === field) {
      // Toggle direction if same field
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set new field with default direction
      sortField = field;
      sortDirection = 'asc';
    }
  }

  // Get sort indicator
  function getSortIndicator(field: typeof sortField) {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  }

  // Get sorted pairs - reactive to sortField and sortDirection changes
  $: sortedPairs = sortPairs(commonActorPairs, sortField, sortDirection);

  // Parse movie IDs and titles
  function parseMovies(movieIds: string, movieTitles: string) {
    const ids = movieIds.split(',').map(id => parseInt(id.trim()));
    const titles = movieTitles.split(',');
    return ids.map((id, index) => ({
      id,
      title: titles[index]?.trim() || 'Unknown'
    }));
  }
</script>

<div class="py-6 sm:py-10">
  <div class="max-w-6xl mx-auto backdrop-blur-md bg-white/80 rounded-xl shadow-2xl p-4 sm:p-8 border border-white/30">
    <h1 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-900 drop-shadow-lg">Actor Pairs</h1>
    <p class="text-center text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">Actor pairs who have appeared together in the most movies</p>
    
    <!-- Sort Info -->
    <div class="mb-4 text-sm text-gray-700 text-center">
      Sorted by: <span class="font-medium text-gray-900">{sortField}</span> 
      ({sortDirection === 'asc' ? 'ascending' : 'descending'})
    </div>

    <!-- Desktop Table View -->
    <div class="hidden lg:block overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors" 
                on:click={() => handleSort('movie_count')}>
              <div class="flex items-center gap-2">
                Movies Together {getSortIndicator('movie_count')}
              </div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors" 
                on:click={() => handleSort('actor1_name')}>
              <div class="flex items-center gap-2">
                Actor 1 {getSortIndicator('actor1_name')}
              </div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors" 
                on:click={() => handleSort('actor2_name')}>
              <div class="flex items-center gap-2">
                Actor 2 {getSortIndicator('actor2_name')}
              </div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Movies</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
          {#each sortedPairs as pair}
            <tr class="hover:bg-gray-50">
              <td class="px-4 py-2 whitespace-nowrap text-center">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                  {pair.movie_count}
                </span>
              </td>
              <td class="px-4 py-2 whitespace-nowrap">
                <a href="{base}/person/{pair.actor1_id}" class="text-blue-600 hover:text-blue-800 font-medium">
                  {pair.actor1_name}
                </a>
              </td>
              <td class="px-4 py-2 whitespace-nowrap">
                <a href="{base}/person/{pair.actor2_id}" class="text-blue-600 hover:text-blue-800 font-medium">
                  {pair.actor2_name}
                </a>
              </td>
              <td class="px-4 py-2">
                <div class="flex flex-wrap gap-1">
                  {#each parseMovies(pair.movie_ids, pair.movie_titles) as movie}
                    <a href="{base}/movie/{movie.id}" 
                       class="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                      {movie.title}
                    </a>
                  {/each}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Mobile Card View -->
    <div class="lg:hidden space-y-3">
      {#each sortedPairs as pair, index}
        <div class="bg-white/90 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-sm font-medium text-gray-500">#{index + 1}</span>
            <span class="font-semibold text-lg leading-tight flex-1">{pair.actor1_name} & {pair.actor2_name}</span>
          </div>
          <div class="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
            <div class="flex items-center">
              <span class="font-medium text-gray-700">Movies Together:</span>
              <span class="ml-1 font-semibold text-blue-700">{pair.movie_count}</span>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-500">{pair.movie_titles}</span>
          </div>
        </div>
      {/each}
    </div>
    
    <div class="mt-6 text-center text-sm text-gray-600">
      <p>Showing {sortedPairs.length} actor pairs with the most movies together.</p>
    </div>
  </div>
</div> 