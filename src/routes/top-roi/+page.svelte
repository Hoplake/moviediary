<script lang="ts">
  import topRoi from '../../data/top_roi.json';
  import { base } from '$app/paths';
  
  // Sort state
  let sortField: 'name' | 'year' | 'budget' | 'revenue' | 'roi' = 'roi';
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

<div class="py-10">
  <div class="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-8">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">Top 50 Movies by Return on Investment</h1>
    <p class="text-center text-gray-600 mb-6">Movies ranked by their revenue-to-budget ratio (ROI)</p>
    
    <!-- Sort Info -->
    <div class="mb-4 text-sm text-gray-600 text-center">
      Sorted by: <span class="font-medium">{sortField}</span> 
      ({sortDirection === 'asc' ? 'ascending' : 'descending'})
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rank</th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors" 
                on:click={() => handleSort('name')}>
              <div class="flex items-center gap-2">
                Movie {getSortIndicator('name')}
              </div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors" 
                on:click={() => handleSort('year')}>
              <div class="flex items-center gap-2">
                Year {getSortIndicator('year')}
              </div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors" 
                on:click={() => handleSort('budget')}>
              <div class="flex items-center gap-2">
                Budget {getSortIndicator('budget')}
              </div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors" 
                on:click={() => handleSort('revenue')}>
              <div class="flex items-center gap-2">
                Revenue {getSortIndicator('revenue')}
              </div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors" 
                on:click={() => handleSort('roi')}>
              <div class="flex items-center gap-2">
                ROI {getSortIndicator('roi')}
              </div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">IMDb</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
          {#each sortedMovies as movie, index}
            <tr class="hover:bg-gray-50">
              <td class="px-4 py-2 whitespace-nowrap text-gray-600 font-medium">#{index + 1}</td>
              <td class="px-4 py-2 whitespace-nowrap">
                <a href="{base}/movie/{movie.id}" class="text-blue-600 hover:text-blue-800 font-medium">
                  {movie.name}
                </a>
              </td>
              <td class="px-4 py-2 whitespace-nowrap text-gray-600">{movie.year}</td>
              <td class="px-4 py-2 whitespace-nowrap text-gray-600">{formatCurrency(movie.budget)}</td>
              <td class="px-4 py-2 whitespace-nowrap text-gray-600">{formatCurrency(movie.revenue)}</td>
              <td class="px-4 py-2 whitespace-nowrap font-semibold text-green-600">{formatROI(movie.roi)}</td>
              <td class="px-4 py-2 whitespace-nowrap">
                <a href="https://www.imdb.com/title/{movie.imdb}" target="_blank" rel="noopener noreferrer" 
                   class="text-blue-600 hover:text-blue-800 underline">
                  View on IMDb
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <div class="mt-6 text-center text-sm text-gray-500">
      Showing top 50 movies by return on investment
    </div>
  </div>
</div>