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

<div class="min-h-screen">
	<!-- Navigation -->
	<nav class="backdrop-blur-md bg-white/20 shadow-lg border-b border-white/20 sticky top-0 z-50">
		<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-16">
				<div class="flex items-center">
					<!-- Hamburger button for mobile -->
					<button
						class="sm:hidden p-2 mr-2 text-white/80 hover:text-white focus:outline-none"
						on:click={() => statsDropdownOpen = true}
						aria-label="Open menu"
					>
						<svg class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
					<div class="flex-shrink-0 flex items-center">
						<h1 class="text-xl font-bold text-white drop-shadow-lg">Movie Diary</h1>
					</div>
					<div class="hidden sm:ml-6 sm:flex sm:space-x-8">
						<a href="{base}/" class="border-transparent text-white/80 hover:border-white/50 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200">
							All Movies
						</a>
						<a href="{base}/bechdel" class="border-transparent text-white/80 hover:border-white/50 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200">
							Bechdel Test
						</a>
						<!-- Statistics Dropdown -->
						<div class="relative h-full">
							<button 
								on:click={toggleStatsDropdown}
								class="h-full border-transparent text-white/80 hover:border-white/50 hover:text-white flex items-center px-1 pt-1 border-b-2 text-sm font-medium focus:outline-none transition-all duration-200"
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
									class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black/10 z-50"
									transition:slide={{ duration: 200 }}
								>
									<div class="py-1" role="menu">
										<a 
											href="{base}/top-roi" 
											on:click={closeStatsDropdown}
											class="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
											role="menuitem"
										>
											Top ROI
										</a>
										<a 
											href="{base}/actor-pairs" 
											on:click={closeStatsDropdown}
											class="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
											role="menuitem"
										>
											Actor Pairs
										</a>
										<a 
											href="{base}/most-actors" 
											on:click={closeStatsDropdown}
											class="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
											role="menuitem"
										>
											Most Frequent Actors
										</a>
										<a 
											href="{base}/highest-grossing" 
											on:click={closeStatsDropdown}
											class="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
											role="menuitem"
										>
											Highest Grossing Actors
										</a>
										<a 
											href="{base}/academy-awards" 
											on:click={closeStatsDropdown}
											class="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
											role="menuitem"
										>
											Academy Awards
										</a>
										<a 
											href="{base}/top-rated-actors" 
											on:click={closeStatsDropdown}
											class="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
											role="menuitem"
										>
											Top Rated Actors
										</a>
										<a 
											href="{base}/top-rated-directors" 
											on:click={closeStatsDropdown}
											class="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
											role="menuitem"
										>
											Top Rated Directors
										</a>
										<a 
											href="{base}/top-rated-genres" 
											on:click={closeStatsDropdown}
											class="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
											role="menuitem"
										>
											Top Rated Genres
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
		{#if statsDropdownOpen}
			<div class="sm:hidden fixed inset-x-0 top-0 z-50 bg-white/90 max-h-[70vh] overflow-y-auto rounded-b-xl shadow-lg border border-gray-200">
				<div class="flex justify-between items-center px-4 pt-2 pb-1 border-b border-gray-100">
					<span class="text-lg font-bold text-gray-900">Menu</span>
					<button type="button" class="text-gray-500 hover:text-gray-800 text-2xl font-bold" on:click={closeStatsDropdown} aria-label="Close menu">&times;</button>
				</div>
				<div class="pt-2 pb-3 space-y-1 px-2">
					<a href="{base}/" on:click={closeStatsDropdown} class="border-transparent text-gray-800 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-900 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-200">
						All Movies
					</a>
					<a href="{base}/bechdel" on:click={closeStatsDropdown} class="border-transparent text-gray-800 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-900 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-200">
						Bechdel Test
					</a>
					<!-- Statistics Section -->
					<div class="pt-4">
						<h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-3 pr-4 py-2">
							Statistics
						</h3>
						<a href="{base}/top-roi" on:click={closeStatsDropdown} class="border-transparent text-gray-800 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-900 block pl-6 pr-4 py-2 border-l-4 text-sm transition-all duration-200">
							Top ROI
						</a>
						<a href="{base}/actor-pairs" on:click={closeStatsDropdown} class="border-transparent text-gray-800 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-900 block pl-6 pr-4 py-2 border-l-4 text-sm transition-all duration-200">
							Actor Pairs
						</a>
						<a href="{base}/most-actors" on:click={closeStatsDropdown} class="border-transparent text-gray-800 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-900 block pl-6 pr-4 py-2 border-l-4 text-sm transition-all duration-200">
							Most Frequent Actors
						</a>
						<a href="{base}/highest-grossing" on:click={closeStatsDropdown} class="border-transparent text-gray-800 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-900 block pl-6 pr-4 py-2 border-l-4 text-sm transition-all duration-200">
							Highest Grossing Actors
						</a>
						<a href="{base}/academy-awards" on:click={closeStatsDropdown} class="border-transparent text-gray-800 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-900 block pl-6 pr-4 py-2 border-l-4 text-sm transition-all duration-200">
							Academy Awards
						</a>
						<a href="{base}/top-rated-actors" on:click={closeStatsDropdown} class="border-transparent text-gray-800 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-900 block pl-6 pr-4 py-2 border-l-4 text-sm transition-all duration-200">
							Top Rated Actors
						</a>
						<a href="{base}/top-rated-directors" on:click={closeStatsDropdown} class="border-transparent text-gray-800 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-900 block pl-6 pr-4 py-2 border-l-4 text-sm transition-all duration-200">
							Top Rated Directors
						</a>
						<a href="{base}/top-rated-genres" on:click={closeStatsDropdown} class="border-transparent text-gray-800 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-900 block pl-6 pr-4 py-2 border-l-4 text-sm transition-all duration-200">
							Top Rated Genres
						</a>
					</div>
				</div>
			</div>
		{/if}
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
