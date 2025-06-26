<script lang="ts">
  import { page } from '$app/stores';
  import { error } from '@sveltejs/kit';
  import movies from '../../../data/movies.json';
  import actors from '../../../data/actors.json';
  import directors from '../../../data/directors.json';
  import genres from '../../../data/genres.json';
  import { base } from '$app/paths';

  // Get the movie ID from the URL parameter
  const movieId = parseInt($page.params.id);
  
  if (isNaN(movieId)) {
    error(400, 'Invalid movie ID');
  }

  const movie = movies.find(m => m.id === movieId);
  
  if (!movie) {
    error(404, `Movie with ID ${movieId} not found`);
  }

  const movieActors = actors.filter(a => a.movie_id === movieId);
  const movieDirectors = directors.filter(d => d.movie_id === movieId);
  const movieGenres = genres.filter(g => g.movie_id === movieId);

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
  <div class="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
    <!-- Movie Header -->
    <div class="md:flex">
      <!-- Poster -->
      <div class="md:w-1/3">
        {#if movie.poster_path}
          <img src="https://image.tmdb.org/t/p/w500{movie.poster_path}" 
               alt="{movie.name} poster" 
               class="w-full h-auto object-cover">
        {:else}
          <div class="w-full h-96 bg-gray-200 flex items-center justify-center">
            <div class="text-center text-gray-500">
              <svg class="w-24 h-24 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
              </svg>
              <p class="text-lg font-medium">No Poster Available</p>
            </div>
          </div>
        {/if}
      </div>

      <!-- Movie Info -->
      <div class="md:w-2/3 p-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">{movie.name}</h1>
        <p class="text-xl text-gray-600 mb-4">({movie.year})</p>
        
        {#if movie.tagline}
          <p class="text-lg text-gray-700 italic mb-6">"{movie.tagline}"</p>
        {/if}

        <!-- Basic Info -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <span class="font-semibold text-gray-700">Runtime:</span>
            <span class="ml-2 text-gray-600">{movie.runtime} minutes</span>
          </div>
          <div>
            <span class="font-semibold text-gray-700">Bechdel Test:</span>
            <span class="ml-2 text-gray-600">{getBechdelStatus(movie.bechdel_rating)}</span>
          </div>
          {#if movie.budget > 0}
            <div>
              <span class="font-semibold text-gray-700">Budget:</span>
              <span class="ml-2 text-gray-600">{formatCurrency(movie.budget)}</span>
            </div>
          {/if}
          {#if movie.revenue > 0}
            <div>
              <span class="font-semibold text-gray-700">Revenue:</span>
              <span class="ml-2 text-gray-600">{formatCurrency(movie.revenue)}</span>
            </div>
          {/if}
        </div>

        <!-- External Links -->
        <div class="mb-6">
          <a href="https://www.imdb.com/title/{movie.imdb}" 
             target="_blank" 
             rel="noopener noreferrer"
             class="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
            <span>View on IMDb</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Movie Details -->
    <div class="p-8 border-t border-gray-200">
      <!-- Directors -->
      {#if movieDirectors.length > 0}
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-3">Director{movieDirectors.length > 1 ? 's' : ''}</h2>
          <div class="flex flex-wrap gap-2">
            {#each movieDirectors as director}
              <a href="{base}/person/{director.person_id}" 
                 class="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors">
                {director.name}
              </a>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Genres -->
      {#if movieGenres.length > 0}
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-3">Genres</h2>
          <div class="flex flex-wrap gap-2">
            {#each movieGenres as genre}
              <a href="{base}/genre/{genre.name}" 
                 class="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors">
                {genre.name}
              </a>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Cast -->
      {#if movieActors.length > 0}
        <div>
          <h2 class="text-2xl font-bold text-gray-800 mb-3">Cast</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {#each movieActors as actor}
              <a href="{base}/person/{actor.person_id}" 
                 class="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span class="text-gray-800 font-medium">{actor.name}</span>
              </a>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
</div> 