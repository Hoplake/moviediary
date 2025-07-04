<script lang="ts">
  import mostOscarWins from '../../data/most_oscar_wins_movies.json';
  import mostOscarNominations from '../../data/most_oscar_nominations_movies.json';
  import { base } from '$app/paths';

  // Sort state for wins
  let winsSortField: 'oscar_count' | 'film' = 'oscar_count';
  let winsSortDirection: 'asc' | 'desc' = 'desc';

  // Sort state for nominations
  let nominationsSortField: 'oscar_count' | 'film' = 'oscar_count';
  let nominationsSortDirection: 'asc' | 'desc' = 'desc';

  // Sort function
  function sortMovies(moviesList: any[], field: 'oscar_count' | 'film', direction: 'asc' | 'desc') {
    return [...moviesList].sort((a, b) => {
      let aValue: any = a[field];
      let bValue: any = b[field];

      // Handle string comparison for film names
      if (field === 'film') {
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

  // Handle sort click for wins
  function handleWinsSort(field: 'oscar_count' | 'film') {
    if (winsSortField === field) {
      winsSortDirection = winsSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      winsSortField = field;
      winsSortDirection = 'desc';
    }
  }

  // Handle sort click for nominations
  function handleNominationsSort(field: 'oscar_count' | 'film') {
    if (nominationsSortField === field) {
      nominationsSortDirection = nominationsSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      nominationsSortField = field;
      nominationsSortDirection = 'desc';
    }
  }

  // Get sort icon
  function getSortIcon(currentField: string, sortField: string, direction: string): string {
    if (currentField !== sortField) return '↕️';
    return direction === 'asc' ? '↑' : '↓';
  }

  // Get sorted movies
  $: sortedWins = sortMovies(mostOscarWins, winsSortField, winsSortDirection);
  $: sortedNominations = sortMovies(mostOscarNominations, nominationsSortField, nominationsSortDirection);
</script>

<svelte:head>
  <title>Academy Awards - Movie Diary</title>
</svelte:head>

<div class="py-6 sm:py-10">
  <div class="max-w-6xl mx-auto backdrop-blur-md bg-white/80 rounded-xl shadow-2xl p-4 sm:p-8 border border-white/30">
    <h1 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-900 drop-shadow-lg">Academy Awards</h1>
    <p class="text-center text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">Movies with the most Academy Award wins and nominations</p>
    
    <!-- Sort Info -->
    <div class="mb-4 text-sm text-gray-700 text-center">
      Sorted by: <span class="font-medium text-gray-900">{winsSortField} {winsSortDirection === 'asc' ? 'ascending' : 'descending'}</span>
    </div>

    <!-- Desktop Table View -->
    <div class="hidden lg:block overflow-x-auto">
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Most Oscar Wins</h2>
        <div class="bg-white shadow-sm rounded-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th 
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    on:click={() => handleWinsSort('film')}
                  >
                    <div class="flex items-center space-x-1">
                      <span>Movie</span>
                      <span class="text-sm">{getSortIcon('film', winsSortField, winsSortDirection)}</span>
                    </div>
                  </th>
                  <th 
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    on:click={() => handleWinsSort('oscar_count')}
                  >
                    <div class="flex items-center space-x-1">
                      <span>Wins</span>
                      <span class="text-sm">{getSortIcon('oscar_count', winsSortField, winsSortDirection)}</span>
                    </div>
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IMDb
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {#each sortedWins as movie, index}
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="text-sm font-medium text-gray-900">
                          {movie.film}
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {movie.oscar_count} {movie.oscar_count === 1 ? 'win' : 'wins'}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a 
                        href="https://www.imdb.com/title/{movie.movie_imdb_id}/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        View on IMDb
                      </a>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Most Oscar Nominations</h2>
        <div class="bg-white shadow-sm rounded-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th 
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    on:click={() => handleNominationsSort('film')}
                  >
                    <div class="flex items-center space-x-1">
                      <span>Movie</span>
                      <span class="text-sm">{getSortIcon('film', nominationsSortField, nominationsSortDirection)}</span>
                    </div>
                  </th>
                  <th 
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    on:click={() => handleNominationsSort('oscar_count')}
                  >
                    <div class="flex items-center space-x-1">
                      <span>Nominations</span>
                      <span class="text-sm">{getSortIcon('oscar_count', nominationsSortField, nominationsSortDirection)}</span>
                    </div>
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IMDb
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {#each sortedNominations as movie, index}
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="text-sm font-medium text-gray-900">
                          {movie.film}
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {movie.oscar_count} {movie.oscar_count === 1 ? 'nomination' : 'nominations'}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a 
                        href="https://www.imdb.com/title/{movie.movie_imdb_id}/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        View on IMDb
                      </a>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Card View -->
    <div class="lg:hidden space-y-3">
      {#each sortedWins as movie, index}
        <div class="bg-white/90 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-sm font-medium text-gray-500">#{index + 1}</span>
            <span class="font-semibold text-lg leading-tight flex-1">{movie.film}</span>
          </div>
          <div class="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
            <div class="flex items-center">
              <span class="font-medium text-gray-700">Wins:</span>
              <span class="ml-1 font-semibold text-green-700">{movie.oscar_count} {movie.oscar_count === 1 ? 'win' : 'wins'}</span>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <a href="https://www.imdb.com/title/{movie.movie_imdb_id}/" target="_blank" rel="noopener noreferrer" class="text-blue-700 hover:text-blue-900 underline text-xs">View on IMDb</a>
          </div>
        </div>
      {/each}
    </div>
    
    <div class="mt-6 text-center text-sm text-gray-600">
      <p>Showing {sortedWins.length} movies with the most Academy Awards.</p>
    </div>
  </div>
</div> 