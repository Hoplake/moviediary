<script lang="ts">
  import mostMoviesActor from '../../data/most_movies_actor.json';
  import { base } from '$app/paths';

  // Sort state
  let sortField: 'movie_count' | 'name' = 'movie_count';
  let sortDirection: 'asc' | 'desc' = 'desc';

  // Sort function
  function sortActors(actorsList: typeof mostMoviesActor, field: typeof sortField, direction: typeof sortDirection) {
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

  // Get sorted actors - reactive to sortField and sortDirection changes
  $: sortedActors = sortActors(mostMoviesActor, sortField, sortDirection);

  // Get IMDb link
  function getImdbLink(imdbId: string) {
    if (!imdbId) return null;
    return `https://www.imdb.com/name/${imdbId}/`;
  }
</script>

<div class="py-10">
  <div class="max-w-6xl mx-auto backdrop-blur-md bg-white/80 rounded-xl shadow-2xl p-8 border border-white/30">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-900 drop-shadow-lg">Most Frequent Actors</h1>
    <p class="text-center text-gray-700 mb-6">Actors with the most movies in the collection</p>
    
    <!-- Sort Info -->
    <div class="mb-4 text-sm text-gray-600 text-center">
      Sorted by: <span class="font-medium">{sortField === 'movie_count' ? 'Movie Count' : 'Name'}</span> 
      ({sortDirection === 'asc' ? 'ascending' : 'descending'})
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-300 shadow-lg rounded-lg overflow-hidden">
        <thead class="bg-white/95">
          <tr>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors" 
                on:click={() => handleSort('movie_count')}>
              <div class="flex items-center gap-2">
                Movie Count {getSortIndicator('movie_count')}
              </div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors" 
                on:click={() => handleSort('name')}>
              <div class="flex items-center gap-2">
                Actor Name {getSortIndicator('name')}
              </div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Links</th>
          </tr>
        </thead>
        <tbody class="bg-white/90 divide-y divide-gray-200">
          {#each sortedActors as actor}
            <tr class="hover:bg-gray-50">
              <td class="px-4 py-2 whitespace-nowrap text-center">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                  {actor.movie_count}
                </span>
              </td>
              <td class="px-4 py-2 whitespace-nowrap">
                <a href="{base}/person/{actor.person_id}" class="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
                  {#if actor.profile_path}
                    <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} class="w-7 h-7 rounded-full object-cover border border-blue-200" />
                  {:else}
                    <img src="{base}/default-avatar.png" alt="No photo" class="w-7 h-7 rounded-full object-cover border border-blue-200" />
                  {/if}
                  <span>{actor.name}</span>
                </a>
              </td>
              <td class="px-4 py-2 whitespace-nowrap">
                <div class="flex gap-2">
                  <a href="{base}/person/{actor.person_id}" 
                     class="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                    View Movies
                  </a>
                  {#if getImdbLink(actor.imdb_id)}
                    <a href={getImdbLink(actor.imdb_id)} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       class="inline-flex items-center px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors">
                      IMDb
                    </a>
                  {/if}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Summary -->
    <div class="mt-6 text-center text-sm text-gray-500">
      Total: {mostMoviesActor.length} actors with 3+ movies
    </div>
  </div>
</div> 