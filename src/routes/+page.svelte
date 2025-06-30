<script lang="ts">
  import movies from '../data/movies.json';
  import { base } from '$app/paths';

  // Sort state
  let sortField: 'name' | 'year' | 'runtime' | 'bechdel_rating' = 'year';
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

  function getBechdelStatus(rating: number): string {
    switch (rating) {
      case 0: return 'Less than two named women characters';
      case 1: return 'Women don\'t talk to each other';
      case 2: return 'Women only talk about men';
      case 3: return 'Passes the test';
      default: return 'Unknown';
    }
  }
</script>

<div class="py-10">
  <div class="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-8">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">All Movies</h1>
    
    <!-- Sort Info -->
    <div class="mb-4 text-sm text-gray-600 text-center">
      Sorted by: <span class="font-medium">{sortField}</span> 
      ({sortDirection === 'asc' ? 'ascending' : 'descending'})
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
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
                on:click={() => handleSort('runtime')}>
              <div class="flex items-center gap-2">
                Runtime {getSortIndicator('runtime')}
              </div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors" 
                on:click={() => handleSort('bechdel_rating')}>
              <div class="flex items-center gap-2">
                Bechdel Test {getSortIndicator('bechdel_rating')}
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
          {#each sortedMovies as movie}
            <tr class="hover:bg-gray-50">
              <td class="px-4 py-2 whitespace-nowrap">
                <a href="{base}/movie/{movie.id}" class="text-blue-600 hover:text-blue-800 font-medium">
                  {movie.name}
                </a>
              </td>
              <td class="px-4 py-2 whitespace-nowrap text-gray-600">{movie.year}</td>
              <td class="px-4 py-2 whitespace-nowrap text-gray-600">{movie.runtime} min</td>
              <td class="px-4 py-2 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full 
                  {movie.bechdel_rating === 3 ? 'bg-green-100 text-green-800' : 
                   movie.bechdel_rating === 2 ? 'bg-yellow-100 text-yellow-800' :
                   movie.bechdel_rating === 1 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}">
                  {getBechdelStatus(movie.bechdel_rating)}
                </span>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Movie Count -->
    <div class="mt-6 text-center text-sm text-gray-500">
      Total: {movies.length} movies
    </div>
  </div>
</div>
