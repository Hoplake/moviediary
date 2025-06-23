import Database from 'better-sqlite3';
import fs from 'fs';

const db = new Database('src/data/my_movie_diary.db');
const movies = db.prepare('SELECT * FROM movies').all();
fs.writeFileSync('src/data/movies.json', JSON.stringify(movies, null, 2));
console.log('Exported movies to src/data/movies.json');
