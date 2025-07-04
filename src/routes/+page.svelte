<script lang="ts">
  import movies from '../data/movies.json';
  import { base } from '$app/paths';
  import CompactRating from '$lib/CompactRating.svelte';

  // Sort state
  let sortField: 'name' | 'year' | 'runtime' | 'bechdel_rating' | 'rating' = 'year';
  let sortDirection: 'asc' | 'desc' = 'desc';

  // Sort function
  function sortMovies(movieList: typeof movies, field: typeof sortField, direction: typeof sortDirection) {
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
  $: sortedMovies = sortMovies(movies, sortField, sortDirection);

  function getBechdelStatus(rating: number | null): string {
    switch (rating) {
      case 0: return 'Less than two named women characters';
      case 1: return 'Women don\'t talk to each other';
      case 2: return 'Women only talk about men';
      case 3: return 'Passes the test';
      default: return 'Unknown';
    }
  }
</script>

<div class="py-6 sm:py-10">
  <div class="max-w-6xl mx-auto backdrop-blur-md bg-white/80 rounded-xl shadow-2xl p-4 sm:p-8 border border-white/30">
    <h1 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-900 drop-shadow-lg">All Movies</h1>
    
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
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" 
                on:click={() => handleSort('name')}>
              <div class="flex items-center gap-2">
                Movie {getSortIndicator('name')}
              </div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" 
                on:click={() => handleSort('year')}>
              <div class="flex items-center gap-2">
                Year {getSortIndicator('year')}
              </div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" 
                on:click={() => handleSort('runtime')}>
              <div class="flex items-center gap-2">
                Runtime {getSortIndicator('runtime')}
              </div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" 
                on:click={() => handleSort('rating')}>
              <div class="flex items-center gap-2">
                Rating {getSortIndicator('rating')}
              </div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" 
                on:click={() => handleSort('bechdel_rating')}>
              <div class="flex items-center gap-2">
                Bechdel Test {getSortIndicator('bechdel_rating')}
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white/90 divide-y divide-gray-200">
          {#each sortedMovies as movie}
            <tr class="hover:bg-gray-100 transition-colors duration-200">
              <td class="px-4 py-2 whitespace-nowrap">
                <a href="{base}/movie/{movie.id}" class="text-blue-700 hover:text-blue-900 font-medium transition-colors duration-200">
                  {movie.name}
                </a>
              </td>
              <td class="px-4 py-2 whitespace-nowrap text-gray-700">{movie.year}</td>
              <td class="px-4 py-2 whitespace-nowrap text-gray-700">{movie.runtime} min</td>
              <td class="px-4 py-2 whitespace-nowrap">
                <CompactRating rating={movie.rating} size="sm" color="default" />
              </td>
              <td class="px-4 py-2 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-md
                  {movie.bechdel_rating === 3 ? 'bg-green-500/20 text-green-900' : 
                   movie.bechdel_rating === 2 ? 'bg-yellow-500/20 text-yellow-900' :
                   movie.bechdel_rating === 1 ? 'bg-orange-500/20 text-orange-900' : 'bg-red-500/20 text-red-900'}">
                  {getBechdelStatus(movie.bechdel_rating)}
                </span>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Mobile Card View -->
    <div class="lg:hidden space-y-3">
      {#each sortedMovies as movie}
        <div class="bg-white/90 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
          <div class="flex justify-between items-start mb-2">
            <a href="{base}/movie/{movie.id}" class="text-blue-700 hover:text-blue-900 font-semibold text-lg leading-tight flex-1 mr-2">
              {movie.name}
            </a>
            <CompactRating rating={movie.rating} size="sm" color="default" />
          </div>
          
          <div class="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
            <span class="flex items-center">
              <span class="font-medium">Year:</span>
              <span class="ml-1">{movie.year}</span>
            </span>
            <span class="flex items-center">
              <span class="font-medium">Runtime:</span>
              <span class="ml-1">{movie.runtime} min</span>
            </span>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-md
              {movie.bechdel_rating === 3 ? 'bg-green-500/20 text-green-900' : 
               movie.bechdel_rating === 2 ? 'bg-yellow-500/20 text-yellow-900' :
               movie.bechdel_rating === 1 ? 'bg-orange-500/20 text-orange-900' : 'bg-red-500/20 text-red-900'}">
              {getBechdelStatus(movie.bechdel_rating)}
            </span>
            <button 
              class="text-xs text-gray-500 hover:text-gray-700"
              on:click={() => handleSort(sortField === 'name' ? 'year' : 'name')}
            >
              Sort by {sortField === 'name' ? 'Year' : 'Name'}
            </button>
          </div>
        </div>
      {/each}
    </div>

    <!-- Movie Count -->
    <div class="mt-6 text-center text-sm text-gray-600">
      Total: {movies.length} movies
    </div>
  </div>
</div>
