import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import fs from 'fs';

const dev = process.env.NODE_ENV === 'development';

const movies = JSON.parse(fs.readFileSync('src/data/movies.json', 'utf-8'));
const people = JSON.parse(fs.readFileSync('src/data/actors.json', 'utf-8'));
const genres = JSON.parse(fs.readFileSync('src/data/genres.json', 'utf-8'));

const movieIds = [...new Set(movies.map(m => m.id))];
const personIds = [...new Set(people.map(p => p.person_id))];
const genreNames = [...new Set(genres.map(g => g.name))];

const prerenderEntries = [
	'/',
	'/bechdel',
	'/top-roi',
	'/actor-pairs',
	'/most-actors',
	'/academy-awards',
	'/highest-grossing',
	'/top-rated-actors',
	'/top-rated-directors',
	'/top-rated-genres',
	...movieIds.map(id => `/movie/${id}`),
	...personIds.map(id => `/person/${id}`),
	...genreNames.map(name => `/genre/${encodeURIComponent(name)}`)
];

const config = {
	preprocess: vitePreprocess(),
	kit: { 
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null
		}),
		paths: {
			base: dev ? '' : '/moviediary'
		},
		prerender: {
			entries: prerenderEntries
		}
	}
};

export default config;

export const prerender = true;
