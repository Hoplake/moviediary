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

<div class="py-10">
  <div class="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-8">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">Most Frequent Actor Pairs</h1>
    <p class="text-center text-gray-600 mb-6">Actors who have appeared together in 3 or more movies</p>
    
    <!-- Sort Info -->
    <div class="mb-4 text-sm text-gray-600 text-center">
      Sorted by: <span class="font-medium">{sortField === 'movie_count' ? 'Movie Count' : sortField === 'actor1_name' ? 'Actor 1' : 'Actor 2'}</span> 
      ({sortDirection === 'asc' ? 'ascending' : 'descending'})
    </div>

    <div class="overflow-x-auto">
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

    <!-- Summary -->
    <div class="mt-6 text-center text-sm text-gray-500">
      Total: {commonActorPairs.length} actor pairs with 3+ movies together
    </div>
  </div>
</div> 