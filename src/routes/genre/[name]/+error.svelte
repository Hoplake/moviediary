<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="py-10">
  <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
    <div class="mb-6">
      <svg class="w-24 h-24 mx-auto text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
      </svg>
    </div>
    
    <h1 class="text-3xl font-bold text-gray-800 mb-4">Genre Not Found</h1>
    <p class="text-lg text-gray-600 mb-6">
      Sorry, we couldn't find the genre "{$page.params.name}".
    </p>
    
    <div class="space-y-4">
      <a href="/" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
        Back to All Movies
      </a>
    </div>
  </div>
</div> 