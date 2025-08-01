<script lang="ts">
  import topRoi from '../../data/top_roi.json';
  import { base } from '$app/paths';
  import CompactRating from '$lib/CompactRating.svelte';
  
  // Sort state
  let sortField: 'name' | 'year' | 'budget' | 'revenue' | 'roi' | 'rating' = 'roi';
  let sortDirection: 'asc' | 'desc' = 'desc';

  // Sort function
  function sortMovies(movieList: typeof topRoi, field: typeof sortField, direction: typeof sortDirection) {
    return [...movieList].sort((a, b) => {
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

  // Get sorted movies - reactive to sortField and sortDirection changes
  $: sortedMovies = sortMovies(topRoi, sortField, sortDirection);
  
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  function formatROI(roi: number): string {
    return (roi * 100).toFixed(1) + '%';
  }
</script>

<div class="py-6 sm:py-10">
  <div class="max-w-6xl mx-auto backdrop-blur-md bg-white/80 rounded-xl shadow-2xl p-4 sm:p-8 border border-white/30">
    <h1 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-900 drop-shadow-lg">Top 50 Movies by Return on Investment</h1>
    <p class="text-center text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">Movies ranked by their revenue-to-budget ratio (ROI)</p>
    
    <!-- Sort Info -->
    <div class="mb-4 text-sm text-gray-700 text-center">
      Sorted by: <span class="font-medium text-gray-900">{sortField}</span> 
      ({sortDirection === 'asc' ? 'ascending' : 'descending'})
    </div>

    <!-- Desktop Table View -->
    <div class="hidden lg:block overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-300 shadow-lg rounded-lg overflow-hidden">
        <thead class="bg-white/95">
          <tr>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rank</th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" on:click={() => handleSort('name')}><div class="flex items-center gap-2">Movie {getSortIndicator('name')}</div></th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" on:click={() => handleSort('year')}><div class="flex items-center gap-2">Year {getSortIndicator('year')}</div></th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" on:click={() => handleSort('rating')}><div class="flex items-center gap-2">Rating {getSortIndicator('rating')}</div></th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" on:click={() => handleSort('budget')}><div class="flex items-center gap-2">Budget {getSortIndicator('budget')}</div></th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" on:click={() => handleSort('revenue')}><div class="flex items-center gap-2">Revenue {getSortIndicator('revenue')}</div></th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" on:click={() => handleSort('roi')}><div class="flex items-center gap-2">ROI {getSortIndicator('roi')}</div></th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">IMDb</th>
          </tr>
        </thead>
        <tbody class="bg-white/90 divide-y divide-gray-200">
          {#each sortedMovies as movie, index}
            <tr class="hover:bg-gray-100 transition-colors duration-200">
              <td class="px-4 py-2 whitespace-nowrap text-gray-700 font-medium">#{index + 1}</td>
              <td class="px-4 py-2 whitespace-nowrap"><a href="{base}/movie/{movie.id}" class="text-blue-700 hover:text-blue-900 font-medium transition-colors duration-200">{movie.name}</a></td>
              <td class="px-4 py-2 whitespace-nowrap text-gray-700">{movie.year}</td>
              <td class="px-4 py-2 whitespace-nowrap"><CompactRating rating={movie.rating} size="sm" color="default" /></td>
              <td class="px-4 py-2 whitespace-nowrap text-gray-700">{formatCurrency(movie.budget)}</td>
              <td class="px-4 py-2 whitespace-nowrap text-gray-700">{formatCurrency(movie.revenue)}</td>
              <td class="px-4 py-2 whitespace-nowrap font-semibold text-green-700">{formatROI(movie.roi)}</td>
              <td class="px-4 py-2 whitespace-nowrap"><a href="https://www.imdb.com/title/{movie.imdb}" target="_blank" rel="noopener noreferrer" class="text-blue-700 hover:text-blue-900 underline">View on IMDb</a></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Mobile Card View -->
    <div class="lg:hidden space-y-3">
      {#each sortedMovies as movie, index}
        <div class="bg-white/90 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
          <div class="flex justify-between items-start mb-2">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-500">#{index + 1}</span>
              <a href="{base}/movie/{movie.id}" class="text-blue-700 hover:text-blue-900 font-semibold text-lg leading-tight">
                {movie.name}
              </a>
            </div>
            <CompactRating rating={movie.rating} size="sm" color="default" />
          </div>
          <div class="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
            <div class="flex items-center">
              <span class="font-medium text-gray-700">Year:</span>
              <span class="ml-1">{movie.year}</span>
            </div>
            <div class="flex items-center">
              <span class="font-medium text-gray-700">Budget:</span>
              <span class="ml-1">{formatCurrency(movie.budget)}</span>
            </div>
            <div class="flex items-center">
              <span class="font-medium text-gray-700">Revenue:</span>
              <span class="ml-1">{formatCurrency(movie.revenue)}</span>
            </div>
            <div class="flex items-center">
              <span class="font-medium text-gray-700">ROI:</span>
              <span class="ml-1 font-semibold text-green-700">{formatROI(movie.roi)}</span>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <a href="https://www.imdb.com/title/{movie.imdb}" target="_blank" rel="noopener noreferrer" class="text-blue-700 hover:text-blue-900 underline text-xs">View on IMDb</a>
            <button 
              class="text-xs text-gray-500 hover:text-gray-700"
              on:click={() => handleSort(sortField === 'roi' ? 'year' : 'roi')}
            >
              Sort by {sortField === 'roi' ? 'Year' : 'ROI'}
            </button>
          </div>
        </div>
      {/each}
    </div>
    
    <div class="mt-6 text-center text-sm text-gray-600">
      Showing top 50 movies by return on investment
    </div>
  </div>
</div>