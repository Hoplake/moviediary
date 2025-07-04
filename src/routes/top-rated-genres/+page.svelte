<script lang="ts">
  import topRatedGenres from '../../data/top_rated_genres.json';
  import { base } from '$app/paths';
  import CompactRating from '$lib/CompactRating.svelte';
  
  // Sort state
  let sortField: 'genre_name' | 'avg_rating' | 'movie_count' | 'min_rating' | 'max_rating' = 'avg_rating';
  let sortDirection: 'asc' | 'desc' = 'desc';

  // Sort function
  function sortGenres(genresList: typeof topRatedGenres, field: typeof sortField, direction: typeof sortDirection) {
    return [...genresList].sort((a, b) => {
      let aValue: any = a[field];
      let bValue: any = b[field];

      // Handle string comparison for names
      if (field === 'genre_name') {
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

  // Get sorted genres - reactive to sortField and sortDirection changes
  $: sortedGenres = sortGenres(topRatedGenres, sortField, sortDirection);
</script>

<svelte:head>
  <title>Top Rated Genres - Movie Diary</title>
</svelte:head>

<div class="py-10">
  <div class="max-w-6xl mx-auto backdrop-blur-md bg-white/80 rounded-xl shadow-2xl p-8 border border-white/30">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-900 drop-shadow-lg">Top Rated Genres</h1>
    <p class="text-center text-gray-700 mb-6">Movie genres ranked by average rating from your collection</p>
    
    <!-- Sort Info -->
    <div class="mb-4 text-sm text-gray-700 text-center">
      Sorted by: <span class="font-medium text-gray-900">{sortField.replace('_', ' ')}</span> 
      ({sortDirection === 'asc' ? 'ascending' : 'descending'})
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-300 shadow-lg rounded-lg overflow-hidden">
        <thead class="bg-white/95">
          <tr>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rank</th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" on:click={() => handleSort('genre_name')}>
              <div class="flex items-center gap-2">Genre {getSortIndicator('genre_name')}</div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" on:click={() => handleSort('avg_rating')}>
              <div class="flex items-center gap-2">Average Rating {getSortIndicator('avg_rating')}</div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" on:click={() => handleSort('movie_count')}>
              <div class="flex items-center gap-2">Movies {getSortIndicator('movie_count')}</div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" on:click={() => handleSort('min_rating')}>
              <div class="flex items-center gap-2">Min Rating {getSortIndicator('min_rating')}</div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" on:click={() => handleSort('max_rating')}>
              <div class="flex items-center gap-2">Max Rating {getSortIndicator('max_rating')}</div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rating Range</th>
          </tr>
        </thead>
        <tbody class="bg-white/90 divide-y divide-gray-200">
          {#each sortedGenres as genre, index}
            <tr class="hover:bg-gray-100 transition-colors duration-200">
              <td class="px-4 py-2 whitespace-nowrap text-gray-700 font-medium">#{index + 1}</td>
              <td class="px-4 py-2 whitespace-nowrap">
                <a href="{base}/genre/{encodeURIComponent(genre.genre_name)}" class="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium transition-colors duration-200">
                  <span>{genre.genre_name}</span>
                </a>
              </td>
              <td class="px-4 py-2 whitespace-nowrap">
                <CompactRating rating={genre.avg_rating} size="sm" color="purple" />
              </td>
              <td class="px-4 py-2 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {genre.movie_count}
                </span>
              </td>
              <td class="px-4 py-2 whitespace-nowrap">
                <CompactRating rating={genre.min_rating} size="xs" showStars={false} color="default" />
              </td>
              <td class="px-4 py-2 whitespace-nowrap">
                <CompactRating rating={genre.max_rating} size="xs" showStars={false} color="default" />
              </td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                {genre.min_rating} - {genre.max_rating}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    
    <div class="mt-6 text-center text-sm text-gray-600">
      <p>Showing {sortedGenres.length} genres by average rating (minimum 3 movies)</p>
      <p class="mt-2 text-xs text-gray-500">
        Genres are ranked by the average rating of all movies in that genre from your collection.
      </p>
    </div>
  </div>
</div> 