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

const top_roi = db.prepare('SELECT m.id, m.name, m.imdb, m.year, m.revenue, m.budget, m.rating, (CAST(m.revenue AS FLOAT) / m.budget) as roi FROM movies m WHERE m.budget > 0 AND m.revenue > 0 ORDER BY roi DESC LIMIT 50').all();
fs.writeFileSync('src/data/top_roi.json', JSON.stringify(top_roi, null, 2));
console.log('Exported top_roi to src/data/top_roi.json');

const actors = db.prepare(`SELECT m.id as movie_id, p.id as person_id, p.name, p.profile_path, p.biography FROM movies m
    INNER JOIN moviecrew mc ON mc.movie_tmdb_id = m.tmdb_id
    INNER JOIN people p ON p.tmdb_id = mc.crew_tmdb_id
    WHERE mc.job = 'Actor'`).all();
fs.writeFileSync('src/data/actors.json', JSON.stringify(actors, null, 2));
console.log('Exported actors to src/data/actors.json');

const directors = db.prepare(`SELECT m.id as movie_id, p.id as person_id, p.name, p.profile_path, p.biography FROM movies m
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

const most_movies_actor = db.prepare(`SELECT p.name, p.id as person_id, p.tmdb_id, COALESCE(p.imdb_id, '') AS imdb_id, COUNT(*) AS movie_count, p.profile_path
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

const highest_grossing_actors = db.prepare(`SELECT 
                p.id as person_id,
                p.name, 
                COALESCE(p.imdb_id, '') as imdb_id,
                COUNT(DISTINCT m.tmdb_id) as movie_count,
                SUM(m.revenue) as total_revenue,
                p.profile_path
            FROM people p
            JOIN moviecrew mc ON p.tmdb_id = mc.crew_tmdb_id
            JOIN movies m ON mc.movie_tmdb_id = m.tmdb_id
            WHERE mc.job = 'Actor' AND m.revenue > 0
            GROUP BY p.name, p.imdb_id
            ORDER BY total_revenue DESC
            LIMIT 50`).all();
fs.writeFileSync('src/data/highest_grossing_actors.json', JSON.stringify(highest_grossing_actors, null, 2));
console.log('Exported highest_grossing_actors to src/data/highest_grossing_actors.json');

const most_oscar_wins_movies = db.prepare(`SELECT oa.film, oa.movie_imdb_id, m.imdb as movie_imdb_id_full, COUNT(*) as oscar_count
            FROM oscar_awards oa
            INNER JOIN movies m ON oa.movie_imdb_id = m.imdb
            WHERE oa.winner = 1
            GROUP BY oa.film, oa.movie_imdb_id, m.imdb
            ORDER BY oscar_count DESC
            LIMIT 50`).all();
fs.writeFileSync('src/data/most_oscar_wins_movies.json', JSON.stringify(most_oscar_wins_movies, null, 2));
console.log('Exported most_oscar_wins_movies to src/data/most_oscar_wins_movies.json');

const most_oscar_nominations_movies = db.prepare(`SELECT oa.film, oa.movie_imdb_id, m.imdb as movie_imdb_id_full, COUNT(*) as oscar_count
            FROM oscar_awards oa
            INNER JOIN movies m ON oa.movie_imdb_id = m.imdb
            GROUP BY oa.film, oa.movie_imdb_id, m.imdb
            ORDER BY oscar_count DESC
            LIMIT 50`).all();
fs.writeFileSync('src/data/most_oscar_nominations_movies.json', JSON.stringify(most_oscar_nominations_movies, null, 2));
console.log('Exported most_oscar_nominations_movies to src/data/most_oscar_nominations_movies.json');

const top_rated_genres = db.prepare(`SELECT 
                g.name as genre_name,
                g.id as genre_id,
                COUNT(m.tmdb_id) as movie_count,
                AVG(m.rating) as avg_rating,
                MIN(m.rating) as min_rating,
                MAX(m.rating) as max_rating
            FROM genres g
            JOIN moviegenres mg ON g.tmdb_id = mg.genre_tmdb_id
            JOIN movies m ON mg.movie_tmdb_id = m.tmdb_id
            WHERE m.rating IS NOT NULL
            GROUP BY g.tmdb_id, g.name
            HAVING COUNT(m.tmdb_id) >= 3  -- Only include genres with at least 3 rated movies
            ORDER BY avg_rating DESC`).all();
fs.writeFileSync('src/data/top_rated_genres.json', JSON.stringify(top_rated_genres, null, 2));
console.log('Exported top_rated_genres to src/data/top_rated_genres.json');

/**
 * Get average user ratings by actor using Bayesian shrinkage.
 * 
 * This function uses a shrinkage approach that pulls individual averages toward 
 * the global average, with less shrinkage for actors with more data:
 * Adjusted Rating = (Actor's Average × Number of Films + Global Average × Weight) / (Number of Films + Weight)
 * 
 * @param {number} limit - Maximum number of actors to return
 * @param {number} minMovies - Minimum number of rated movies required for inclusion
 * @param {number} weight - Shrinkage weight (higher = more shrinkage toward global average)
 * @returns {Array} List of objects containing actor information and rating statistics
 */
function getAverageRatingByActor(limit = 20, minMovies = 2, weight = 5.0) {
    // First, get the global average rating
    const globalAvgQuery = db.prepare(`
        SELECT AVG(rating) as global_avg
        FROM movies 
        WHERE rating IS NOT NULL
    `);
    const globalResult = globalAvgQuery.get();
    const globalAvg = globalResult?.global_avg || 5.0;
    
    // Get actor ratings with Bayesian shrinkage
    const query = db.prepare(`
        SELECT 
            p.name as actor_name,
            p.id as actor_id,
            COALESCE(p.imdb_id, '') as imdb_id,
            COUNT(m.tmdb_id) as movie_count,
            AVG(m.rating) as raw_avg_rating,
            MIN(m.rating) as min_rating,
            MAX(m.rating) as max_rating
        FROM people p
        JOIN moviecrew mc ON p.tmdb_id = mc.crew_tmdb_id
        JOIN movies m ON mc.movie_tmdb_id = m.tmdb_id
        WHERE mc.job = 'Actor' AND m.rating IS NOT NULL
        GROUP BY p.tmdb_id, p.name, p.imdb_id
        HAVING COUNT(m.tmdb_id) >= ?
        ORDER BY (AVG(m.rating) * COUNT(m.tmdb_id) + ? * ?) / (COUNT(m.tmdb_id) + ?) DESC
        LIMIT ?
    `);
    
    console.log(`Calculating average ratings by actor with Bayesian shrinkage (top ${limit})`);
    const result = query.all(minMovies, globalAvg, weight, weight, limit);
    
    if (!result || result.length === 0) {
        console.warn("No actor rating data found in the database");
        return [];
    }
    
    const actors = result.map(row => {
        const rawAvg = row.raw_avg_rating;
        const movieCount = row.movie_count;
        
        // Calculate adjusted rating using Bayesian shrinkage
        const adjustedRating = (rawAvg * movieCount + globalAvg * weight) / (movieCount + weight);
        
        return {
            name: row.actor_name,
            tmdb_id: row.actor_id,
            imdb_id: row.imdb_id || null,
            movie_count: movieCount,
            raw_avg_rating: rawAvg ? Math.round(rawAvg * 100) / 100 : 0,
            adjusted_rating: Math.round(adjustedRating * 100) / 100,
            min_rating: row.min_rating,
            max_rating: row.max_rating,
            shrinkage_factor: Math.round((weight / (movieCount + weight)) * 1000) / 1000
        };
    });
    
    actors.forEach(actor => {
        console.debug(`Found actor: ${actor.name} with adjusted rating ${actor.adjusted_rating.toFixed(2)} from ${actor.movie_count} movies`);
    });
    
    return actors;
}

/**
 * Get average user ratings by director using Bayesian shrinkage.
 * 
 * This function uses a shrinkage approach that pulls individual averages toward 
 * the global average, with less shrinkage for directors with more data:
 * Adjusted Rating = (Director's Average × Number of Films + Global Average × Weight) / (Number of Films + Weight)
 * 
 * @param {number} limit - Maximum number of directors to return
 * @param {number} minMovies - Minimum number of rated movies required for inclusion
 * @param {number} weight - Shrinkage weight (higher = more shrinkage toward global average)
 * @returns {Array} List of objects containing director information and rating statistics
 */
function getAverageRatingByDirector(limit = 20, minMovies = 2, weight = 5.0) {
    // First, get the global average rating
    const globalAvgQuery = db.prepare(`
        SELECT AVG(rating) as global_avg
        FROM movies 
        WHERE rating IS NOT NULL
    `);
    const globalResult = globalAvgQuery.get();
    const globalAvg = globalResult?.global_avg || 5.0;
    
    // Get director ratings with Bayesian shrinkage
    const query = db.prepare(`
        SELECT 
            p.name as director_name,
            p.id as director_id,
            COALESCE(p.imdb_id, '') as imdb_id,
            COUNT(m.tmdb_id) as movie_count,
            AVG(m.rating) as raw_avg_rating,
            MIN(m.rating) as min_rating,
            MAX(m.rating) as max_rating
        FROM people p
        JOIN moviecrew mc ON p.tmdb_id = mc.crew_tmdb_id
        JOIN movies m ON mc.movie_tmdb_id = m.tmdb_id
        WHERE mc.job = 'Director' AND m.rating IS NOT NULL
        GROUP BY p.tmdb_id, p.name, p.imdb_id
        HAVING COUNT(m.tmdb_id) >= ?
        ORDER BY (AVG(m.rating) * COUNT(m.tmdb_id) + ? * ?) / (COUNT(m.tmdb_id) + ?) DESC
        LIMIT ?
    `);
    
    console.log(`Calculating average ratings by director with Bayesian shrinkage (top ${limit})`);
    const result = query.all(minMovies, globalAvg, weight, weight, limit);
    
    if (!result || result.length === 0) {
        console.warn("No director rating data found in the database");
        return [];
    }
    
    const directors = result.map(row => {
        const rawAvg = row.raw_avg_rating;
        const movieCount = row.movie_count;
        
        // Calculate adjusted rating using Bayesian shrinkage
        const adjustedRating = (rawAvg * movieCount + globalAvg * weight) / (movieCount + weight);
        
        return {
            name: row.director_name,
            tmdb_id: row.director_id,
            imdb_id: row.imdb_id || null,
            movie_count: movieCount,
            raw_avg_rating: rawAvg ? Math.round(rawAvg * 100) / 100 : 0,
            adjusted_rating: Math.round(adjustedRating * 100) / 100,
            min_rating: row.min_rating,
            max_rating: row.max_rating,
            shrinkage_factor: Math.round((weight / (movieCount + weight)) * 1000) / 1000
        };
    });
    
    directors.forEach(director => {
        console.debug(`Found director: ${director.name} with adjusted rating ${director.adjusted_rating.toFixed(2)} from ${director.movie_count} movies`);
    });
    
    return directors;
}

// Export the new rating data
const top_rated_actors = getAverageRatingByActor(50, 2, 5.0);
fs.writeFileSync('src/data/top_rated_actors.json', JSON.stringify(top_rated_actors, null, 2));
console.log('Exported top_rated_actors to src/data/top_rated_actors.json');

const top_rated_directors = getAverageRatingByDirector(50, 2, 5.0);
fs.writeFileSync('src/data/top_rated_directors.json', JSON.stringify(top_rated_directors, null, 2));
console.log('Exported top_rated_directors to src/data/top_rated_directors.json');