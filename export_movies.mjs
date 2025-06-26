import Database from 'better-sqlite3';
import fs from 'fs';

const db = new Database('src/data/my_movie_diary.db');
const movies = db.prepare(`SELECT m.*, b.rating AS bechdel_rating, COALESCE(b.dubious,0) AS bechdel_dubious FROM movies m
    LEFT JOIN bechdel b ON b.imdbid = SUBSTR(m.imdb,3)`).all();
fs.writeFileSync('src/data/movies.json', JSON.stringify(movies, null, 2));
console.log('Exported movies to src/data/movies.json');

const bechdel_pass = db.prepare('SELECT m.* FROM movies m INNER JOIN bechdel b ON b.imdbid = SUBSTR(m.imdb, 3) AND b.rating = 3').all();
fs.writeFileSync('src/data/bechdel_pass.json', JSON.stringify(bechdel_pass, null, 2));
console.log('Exported bechdel_pass to src/data/bechdel_pass.json');

const top_roi = db.prepare('SELECT m.id, m.name, m.imdb, m.year, m.revenue, m.budget, (CAST(m.revenue AS FLOAT) / m.budget) as roi FROM movies m WHERE m.budget > 0 AND m.revenue > 0 ORDER BY roi DESC LIMIT 50').all();
fs.writeFileSync('src/data/top_roi.json', JSON.stringify(top_roi, null, 2));
console.log('Exported top_roi to src/data/top_roi.json');

const actors = db.prepare(`SELECT m.id as movie_id, p.id as person_id, p.name FROM movies m
    INNER JOIN moviecrew mc ON mc.movie_tmdb_id = m.tmdb_id
    INNER JOIN people p ON p.tmdb_id = mc.crew_tmdb_id
    WHERE mc.job = 'Actor'`).all();
fs.writeFileSync('src/data/actors.json', JSON.stringify(actors, null, 2));
console.log('Exported actors to src/data/actors.json');

const directors = db.prepare(`SELECT m.id as movie_id, p.id as person_id, p.name FROM movies m
    INNER JOIN moviecrew mc ON mc.movie_tmdb_id = m.tmdb_id
    INNER JOIN people p ON p.tmdb_id = mc.crew_tmdb_id
    WHERE mc.job = 'Director'`).all();
fs.writeFileSync('src/data/directors.json', JSON.stringify(directors, null, 2));
console.log('Exported directors to src/data/directors.json');

const genres = db.prepare(`SELECT m.id AS movie_id, g.id AS genre_id, g.name FROM movies m
    INNER JOIN moviegenres mg ON mg.movie_tmdb_id = m.tmdb_id
    INNER JOIN genres g ON g.tmdb_id = mg.genre_tmdb_id`).all();
fs.writeFileSync('src/data/genres.json', JSON.stringify(genres, null, 2));
console.log('Exported genres to src/data/genres.json');

const most_movies_actor = db.prepare(`SELECT p.name, p.id as person_id, p.tmdb_id, COALESCE(p.imdb_id, '') AS imdb_id, COUNT(*) AS movie_count
    FROM people p
    JOIN moviecrew mc ON p.tmdb_id = mc.crew_tmdb_id
    WHERE mc.job = 'Actor'
    GROUP BY p.tmdb_id, p.name, p.imdb_id
    HAVING movie_count > 2
    ORDER BY movie_count DESC`).all();
fs.writeFileSync('src/data/most_movies_actor.json', JSON.stringify(most_movies_actor, null, 2));
console.log('Exported most_movies_actor to src/data/most_movies_actor.json');

const common_actors_pairs = db.prepare(`SELECT
        p1.name as actor1_name,
        p1.id as actor1_id,
        p2.name as actor2_name,
        p2.id as actor2_id,
        COUNT(DISTINCT a1.movie_tmdb_id) as movie_count,
        GROUP_CONCAT(DISTINCT m.id) as movie_ids,
        GROUP_CONCAT(DISTINCT m.name) as movie_titles
    FROM moviecrew a1
    JOIN moviecrew a2 ON a1.movie_tmdb_id = a2.movie_tmdb_id
                    AND a1.crew_tmdb_id < a2.crew_tmdb_id
                    AND a1.job = 'Actor'
                    AND a2.job = 'Actor'
    JOIN people p1 ON a1.crew_tmdb_id = p1.tmdb_id
    JOIN people p2 ON a2.crew_tmdb_id = p2.tmdb_id
    JOIN movies m ON a1.movie_tmdb_id = m.tmdb_id
    GROUP BY p1.tmdb_id, p2.tmdb_id
    HAVING movie_count >= 3
    ORDER BY movie_count DESC`).all();
fs.writeFileSync('src/data/common_actor_pairs.json', JSON.stringify(common_actors_pairs, null, 2));
console.log('Exported common_actors_pairs to src/data/common_actor_pairs.json');
