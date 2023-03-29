const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();

module.exports = app;
const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

app.get("/movies/", async (request, response) => {
  const convertDbObjectToResponseObject = (eachMovieName) => {
    return {
      movieName: eachMovieName.movie_name,
    };
  };

  const { movieId } = request.params;
  const getMoviesQuery = `
    SELECT
      movie_name	
    FROM
      movie`;
  const movies = await db.all(getMoviesQuery);
  response.send(
    movies.map((eachMovieName) =>
      convertDbObjectToResponseObject(eachMovieName)
    )
  );
});

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { director_id, movie_name, lead_actor } = movieDetails;
  const addMoviesQuery = `
    INSERT INTO
      movie_id (director_id,movie_name,lead_actor)
    VALUES
      (
        '${director_Id}',
        '${movie_name}',
         '${lead_actor}'
      );`;

  const dbResponse = await db.run(addMoviesQuery);
  const moviesId = dbResponse.lastID;

  response.send({ movieId: movieId });
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
    SELECT
      *
    FROM
      movie
    WHERE
      movie_id = ${movieId};`;
  const movie = await db.get(getMovieQuery);
  response.send(movie);
});

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
    DELETE FROM
      movie
    WHERE
      movie_id = ${movieId};`;
  await db.run(deleteMovieQuery);
  response.send("movie Removed");
});

app.get("/directors/", async (request, response) => {
  const { directorId } = request.params;
  const getDirectorQuery = `
    SELECT
     director_id, director_name
    FROM
      director`;
  const movies = await db.all(getDirectorQuery);

  response.send(movies);
});

app.get("/movies/:movieId/directors/", async (request, response) => {
  const { directorId } = request.params;
  const getMovieDirectorQuery = `
    SELECT
     *
    FROM
     movie
    ORDER BY
      director_id = ${directorId};`;
  const movieArray = await db.all(getMovieDirectorQuery);
  response.send(movieArray);
});
