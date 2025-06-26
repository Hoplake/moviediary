<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="py-10">
  <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
    <div class="mb-6">
      <svg class="w-24 h-24 mx-auto text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    </div>
    
    <h1 class="text-3xl font-bold text-gray-800 mb-4">Movie Not Found</h1>
    <p class="text-lg text-gray-600 mb-6">
      Sorry, we couldn't find a movie with ID {$page.params.id}.
    </p>
    
    <div class="space-y-4">
      <a href="/" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
        Back to All Movies
      </a>
    </div>
  </div>
</div> 