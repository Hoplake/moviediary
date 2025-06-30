<script lang="ts">
	import '../app.css';
	import { slide } from 'svelte/transition';
	import { base } from '$app/paths';

	// Dropdown state
	let statsDropdownOpen = false;

	function toggleStatsDropdown() {
		statsDropdownOpen = !statsDropdownOpen;
	}

	function closeStatsDropdown() {
		statsDropdownOpen = false;
	}
</script>

<svelte:head>
	<title>Movie Diary</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Navigation -->
	<nav class="bg-white shadow-sm border-b border-gray-200">
		<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-16">
				<div class="flex">
					<div class="flex-shrink-0 flex items-center">
						<h1 class="text-xl font-bold text-gray-800">Movie Diary</h1>
					</div>
					<div class="hidden sm:ml-6 sm:flex sm:space-x-8">
						<a href="{base}/" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
							All Movies
						</a>
						<a href="{base}/bechdel" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
							Bechdel Test
						</a>
						<!-- Statistics Dropdown -->
						<div class="relative h-full">
							<button 
								on:click={toggleStatsDropdown}
								class="h-full border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 flex items-center px-1 pt-1 border-b-2 text-sm font-medium focus:outline-none"
								aria-haspopup="true"
								aria-expanded={statsDropdownOpen}
							>
								Statistics
								<svg class="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
								</svg>
							</button>
							{#if statsDropdownOpen}
								<div 
									class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
									transition:slide={{ duration: 200 }}
								>
									<div class="py-1" role="menu">
										<a 
											href="{base}/top-roi" 
											on:click={closeStatsDropdown}
											class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
											role="menuitem"
										>
											Top ROI
										</a>
										<a 
											href="{base}/actor-pairs" 
											on:click={closeStatsDropdown}
											class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
											role="menuitem"
										>
											Actor Pairs
										</a>
										<a 
											href="{base}/most-actors" 
											on:click={closeStatsDropdown}
											class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
											role="menuitem"
										>
											Most Frequent Actors
										</a>
										<a 
											href="{base}/highest-grossing" 
											on:click={closeStatsDropdown}
											class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
											role="menuitem"
										>
											Highest Grossing Actors
										</a>
										<a 
											href="{base}/academy-awards" 
											on:click={closeStatsDropdown}
											class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
											role="menuitem"
										>
											Academy Awards
										</a>
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<!-- Mobile navigation -->
		<div class="sm:hidden">
			<div class="pt-2 pb-3 space-y-1">
				<a href="{base}/" class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
					All Movies
				</a>
				<a href="{base}/bechdel" class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
					Bechdel Test
				</a>
				
				<!-- Statistics Section -->
				<div class="pt-4">
					<h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-3 pr-4 py-2">
						Statistics
					</h3>
					<a href="{base}/top-roi" class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-6 pr-4 py-2 border-l-4 text-sm">
						Top ROI
					</a>
					<a href="{base}/actor-pairs" class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-6 pr-4 py-2 border-l-4 text-sm">
						Actor Pairs
					</a>
					<a href="{base}/most-actors" class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-6 pr-4 py-2 border-l-4 text-sm">
						Most Frequent Actors
					</a>
					<a href="{base}/highest-grossing" class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-6 pr-4 py-2 border-l-4 text-sm">
						Highest Grossing Actors
					</a>
					<a href="{base}/academy-awards" class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-6 pr-4 py-2 border-l-4 text-sm">
						Academy Awards
					</a>
				</div>
			</div>
		</div>
	</nav>

	<!-- Page content -->
	<main>
		<slot />
	</main>
</div>

<!-- Click outside to close dropdown -->
{#if statsDropdownOpen}
	<button 
		type="button"
		class="fixed inset-0 z-40" 
		on:click={closeStatsDropdown}
		aria-label="Close dropdown menu"
	></button>
{/if}
