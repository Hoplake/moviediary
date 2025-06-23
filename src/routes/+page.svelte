<script>
  import movies from '../data/movies.json';
</script>

<div class="min-h-screen bg-gray-50 py-10">
  <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">Movie Diary</h1>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>            
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
          {#each movies as movie}
            <tr class="hover:bg-gray-50">
              <td class="px-4 py-2 whitespace-nowrap">{movie.name} ({movie.year})</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
