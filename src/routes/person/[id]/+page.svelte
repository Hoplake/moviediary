<script lang="ts">
  import { page } from '$app/stores';
  import { error } from '@sveltejs/kit';
  import movies from '../../../data/movies.json';
  import actors from '../../../data/actors.json';
  import directors from '../../../data/directors.json';
  import { base } from '$app/paths';
  import Rating from '$lib/Rating.svelte';

  // Get the person ID from the URL parameter
  const personId = parseInt($page.params.id);
  
  if (isNaN(personId)) {
    error(400, 'Invalid person ID');
  }
  
  // Get all movies where this person appears as an actor
  const actorMovies = actors
    .filter(a => a.person_id === personId)
    .map(a => {
      const movie = movies.find(m => m.id === a.movie_id);
      return movie ? { ...movie, role: 'Actor' } : null;
    })
    .filter((movie): movie is NonNullable<typeof movie> => movie !== null);

  // Get all movies where this person appears as a director
  const directorMovies = directors
    .filter(d => d.person_id === personId)
    .map(d => {
      const movie = movies.find(m => m.id === d.movie_id);
      return movie ? { ...movie, role: 'Director' } : null;
    })
    .filter((movie): movie is NonNullable<typeof movie> => movie !== null);

  // Combine and deduplicate movies
  const allMovies = [...actorMovies, ...directorMovies];
  const uniqueMovies = allMovies.filter((movie, index, self) => 
    index === self.findIndex(m => m && m.id === movie.id)
  );

  // Get person name from first entry
  const personName = actors.find(a => a.person_id === personId)?.name || 
                    directors.find(d => d.person_id === personId)?.name;

  // Get profile_path from actors or directors
  const profilePath = actors.find(a => a.person_id === personId)?.profile_path ||
                     directors.find(d => d.person_id === personId)?.profile_path;

  // Fetch biography from actors or directors data if available
  const biography = actors.find(a => a.person_id === personId)?.biography
    || directors.find(d => d.person_id === personId)?.biography
    || '';

  let showFullBio = false;

  if (!personName) {
    error(404, `Person with ID ${personId} not found`);
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  function getRole(movieId: number): string {
    const isActor = actorMovies.some(m => m.id === movieId);
    const isDirector = directorMovies.some(m => m.id === movieId);
    
    if (isActor && isDirector) return 'Actor, Director';
    if (isActor) return 'Actor';
    if (isDirector) return 'Director';
    return 'Unknown';
  }
</script>

<style>
  .bio-truncate {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
  }
</style>

<div class="py-10">
  <div class="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-8">
    <div class="flex flex-col items-center mb-6">
      {#if profilePath}
        <img src={`https://image.tmdb.org/t/p/w300${profilePath}`} alt={personName} class="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-md mb-4" />
      {:else}
        <img src="/default-avatar.png" alt="No photo" class="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-md mb-4" />
      {/if}
      <h1 class="text-4xl font-bold text-gray-800 mb-2">{personName}</h1>
      <div class="text-gray-600 text-lg mb-2">{uniqueMovies.length} movie{uniqueMovies.length !== 1 ? 's' : ''} in the collection</div>
      {#if biography}
        <div class="max-w-2xl text-center text-gray-700 mb-4">
          <span class={showFullBio ? '' : 'bio-truncate'}>{biography}</span>
          {#if biography.length > 200}
            <button class="ml-2 text-blue-600 hover:underline text-sm font-medium" on:click={() => showFullBio = !showFullBio}>
              {showFullBio ? 'Show less' : 'Show more'}
            </button>
          {/if}
        </div>
      {:else}
        <div class="max-w-2xl text-center text-gray-400 mb-4 italic">No biography available.</div>
      {/if}
    </div>

    {#if uniqueMovies.length > 0}
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Movie</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Year</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Runtime</th>
              {#if uniqueMovies.some(m => m.budget > 0 || m.revenue > 0)}
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Budget</th>
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Revenue</th>
              {/if}
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            {#each uniqueMovies.sort((a, b) => b.year - a.year) as movie}
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-2 whitespace-nowrap">
                  <a href="{base}/movie/{movie.id}" class="text-blue-600 hover:text-blue-800 font-medium">
                    {movie.name}
                  </a>
                </td>
                <td class="px-4 py-2 whitespace-nowrap text-gray-600">{movie.year}</td>
                <td class="px-4 py-2 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full 
                    {getRole(movie.id).includes('Director') ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">
                    {getRole(movie.id)}
                  </span>
                </td>
                <td class="px-4 py-2 whitespace-nowrap">
                  <Rating rating={movie.rating} size="sm" showNumber={true} />
                </td>
                <td class="px-4 py-2 whitespace-nowrap text-gray-600">{movie.runtime} min</td>
                {#if uniqueMovies.some(m => m.budget > 0 || m.revenue > 0)}
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
        <p class="text-gray-500">No movies found for this person.</p>
      </div>
    {/if}
  </div>
</div> 