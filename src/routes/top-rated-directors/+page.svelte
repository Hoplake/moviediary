<script lang="ts">
  import topRatedDirectors from '../../data/top_rated_directors.json';
  import { base } from '$app/paths';
  import CompactRating from '$lib/CompactRating.svelte';
  
  // Sort state
  let sortField: 'name' | 'adjusted_rating' | 'raw_avg_rating' | 'movie_count' | 'shrinkage_factor' = 'adjusted_rating';
  let sortDirection: 'asc' | 'desc' = 'desc';

  // Sort function
  function sortDirectors(directorsList: typeof topRatedDirectors, field: typeof sortField, direction: typeof sortDirection) {
    return [...directorsList].sort((a, b) => {
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

  // Handle sort click
  function handleSort(field: typeof sortField) {
    if (sortField === field) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = field;
      sortDirection = 'desc';
    }
  }

  // Get sort indicator
  function getSortIndicator(field: typeof sortField) {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  }

  // Get sorted directors - reactive to sortField and sortDirection changes
  $: sortedDirectors = sortDirectors(topRatedDirectors, sortField, sortDirection);
</script>

<svelte:head>
  <title>Top Rated Directors - Movie Diary</title>
</svelte:head>

<div class="py-6 sm:py-10">
  <div class="max-w-6xl mx-auto backdrop-blur-md bg-white/80 rounded-xl shadow-2xl p-4 sm:p-8 border border-white/30">
    <h1 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-900 drop-shadow-lg">Top Rated Directors</h1>
    <p class="text-center text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">Directors ranked by adjusted average rating using Bayesian shrinkage</p>
    
    <!-- Sort Info -->
    <div class="mb-4 text-sm text-gray-700 text-center">
      Sorted by: <span class="font-medium text-gray-900">{sortField.replace('_', ' ')}</span> 
      ({sortDirection === 'asc' ? 'ascending' : 'descending'})
    </div>

    <!-- Desktop Table View -->
    <div class="hidden lg:block overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-300 shadow-lg rounded-lg overflow-hidden">
        <thead class="bg-white/95">
          <tr>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rank</th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" on:click={() => handleSort('name')}>
              <div class="flex items-center gap-2">Director {getSortIndicator('name')}</div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" on:click={() => handleSort('adjusted_rating')}>
              <div class="flex items-center gap-2">Adjusted Rating {getSortIndicator('adjusted_rating')}</div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" on:click={() => handleSort('raw_avg_rating')}>
              <div class="flex items-center gap-2">Raw Average {getSortIndicator('raw_avg_rating')}</div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" on:click={() => handleSort('movie_count')}>
              <div class="flex items-center gap-2">Movies {getSortIndicator('movie_count')}</div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" on:click={() => handleSort('shrinkage_factor')}>
              <div class="flex items-center gap-2">Shrinkage {getSortIndicator('shrinkage_factor')}</div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rating Range</th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">IMDb</th>
          </tr>
        </thead>
        <tbody class="bg-white/90 divide-y divide-gray-200">
          {#each sortedDirectors as director, index}
            <tr class="hover:bg-gray-100 transition-colors duration-200">
              <td class="px-4 py-2 whitespace-nowrap text-gray-700 font-medium">#{index + 1}</td>
              <td class="px-4 py-2 whitespace-nowrap">
                <a href="{base}/person/{director.tmdb_id}" class="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium transition-colors duration-200">
                  <span>{director.name}</span>
                </a>
              </td>
              <td class="px-4 py-2 whitespace-nowrap">
                <CompactRating rating={director.adjusted_rating} size="sm" color="green" />
              </td>
              <td class="px-4 py-2 whitespace-nowrap">
                <CompactRating rating={director.raw_avg_rating} size="sm" color="blue" />
              </td>
              <td class="px-4 py-2 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {director.movie_count}
                </span>
              </td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                {director.shrinkage_factor}
              </td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                {director.min_rating} - {director.max_rating}
              </td>
              <td class="px-4 py-2 whitespace-nowrap">
                {#if director.imdb_id}
                  <a 
                    href="https://www.imdb.com/name/{director.imdb_id}/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-blue-700 hover:text-blue-900 underline text-sm"
                  >
                    View on IMDb
                  </a>
                {:else}
                  <span class="text-gray-400 text-sm">-</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Mobile Card View -->
    <div class="lg:hidden space-y-3">
      {#each sortedDirectors as director, index}
        <div class="bg-white/90 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
          <div class="flex justify-between items-start mb-3">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-medium text-gray-500">#{index + 1}</span>
                <a href="{base}/person/{director.tmdb_id}" class="text-blue-700 hover:text-blue-900 font-semibold text-lg leading-tight">
                  {director.name}
                </a>
              </div>
            </div>
            <CompactRating rating={director.adjusted_rating} size="sm" color="green" />
          </div>
          
          <div class="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
            <div class="flex items-center">
              <span class="font-medium text-gray-700">Raw Avg:</span>
              <CompactRating rating={director.raw_avg_rating} size="xs" color="blue" />
            </div>
            <div class="flex items-center">
              <span class="font-medium text-gray-700">Movies:</span>
              <span class="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {director.movie_count}
              </span>
            </div>
            <div class="flex items-center">
              <span class="font-medium text-gray-700">Range:</span>
              <span class="ml-1 text-xs">{director.min_rating}-{director.max_rating}</span>
            </div>
            <div class="flex items-center">
              <span class="font-medium text-gray-700">Shrinkage:</span>
              <span class="ml-1 text-xs">{director.shrinkage_factor}</span>
            </div>
          </div>
          
          <div class="flex justify-between items-center">
            {#if director.imdb_id}
              <a 
                href="https://www.imdb.com/name/{director.imdb_id}/" 
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
              on:click={() => handleSort(sortField === 'adjusted_rating' ? 'movie_count' : 'adjusted_rating')}
            >
              Sort by {sortField === 'adjusted_rating' ? 'Movies' : 'Rating'}
            </button>
          </div>
        </div>
      {/each}
    </div>
    
    <div class="mt-6 text-center text-sm text-gray-600">
      <p>Showing top {sortedDirectors.length} directors by adjusted rating (minimum 2 movies)</p>
      <p class="mt-2 text-xs text-gray-500">
        Adjusted ratings use Bayesian shrinkage to account for sample size. 
        Lower shrinkage factors indicate more reliable ratings based on more movies.
      </p>
    </div>
  </div>
</div> 