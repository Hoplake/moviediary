<script lang="ts">
  import { page } from '$app/stores';
  import { error } from '@sveltejs/kit';
  import movies from '../../../data/movies.json';
  import genres from '../../../data/genres.json';
  import { base } from '$app/paths';

  // Get the genre name from the URL parameter
  const genreName = decodeURIComponent($page.params.name);
  
  // Get all movies in this genre
  const genreMovies = genres
    .filter(g => g.name === genreName)
    .map(g => movies.find(m => m.id === g.movie_id))
    .filter((movie): movie is NonNullable<typeof movie> => movie !== null);

  if (genreMovies.length === 0) {
    error(404, `No movies found for genre "${genreName}"`);
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  function getBechdelStatus(rating: number): string {
    switch (rating) {
      case 0: return 'No women';
      case 1: return 'Women don\'t talk to each other';
      case 2: return 'Women only talk about men';
      case 3: return 'Passes the test';
      default: return 'Unknown';
    }
  }
</script>

<div class="py-10">
  <div class="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-8">
    <h1 class="text-4xl font-bold text-gray-800 mb-6">{genreName} Movies</h1>
    
    <div class="mb-6">
      <p class="text-lg text-gray-600">
        {genreMovies.length} movie{genreMovies.length !== 1 ? 's' : ''} in the {genreName.toLowerCase()} genre
      </p>
    </div>

    {#if genreMovies.length > 0}
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Movie</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Year</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Runtime</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bechdel Test</th>
              {#if genreMovies.some(m => m.budget > 0 || m.revenue > 0)}
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Budget</th>
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Revenue</th>
              {/if}
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            {#each genreMovies.sort((a, b) => b.year - a.year) as movie}
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
                {#if genreMovies.some(m => m.budget > 0 || m.revenue > 0)}
                  <td class="px-4 py-2 whitespace-nowrap text-gray-600">
                    {movie.budget > 0 ? formatCurrency(movie.budget) : '-'}
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap text-gray-600">
                    {movie.revenue > 0 ? formatCurrency(movie.revenue) : '-'}
                  </td>
                {/if}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <div class="text-center py-8">
        <p class="text-gray-500">No movies found in the {genreName.toLowerCase()} genre.</p>
      </div>
    {/if}
  </div>
</div> 