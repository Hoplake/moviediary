<script lang="ts">
  import { page } from '$app/stores';
  import { error } from '@sveltejs/kit';
  import movies from '../../../data/movies.json';
  import actors from '../../../data/actors.json';
  import directors from '../../../data/directors.json';
  import { base } from '$app/paths';

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

<div class="py-10">
  <div class="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-8">
    <h1 class="text-4xl font-bold text-gray-800 mb-6">{personName}</h1>
    
    <div class="mb-6">
      <p class="text-lg text-gray-600">
        {uniqueMovies.length} movie{uniqueMovies.length !== 1 ? 's' : ''} in the collection
      </p>
    </div>

    {#if uniqueMovies.length > 0}
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Movie</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Year</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
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