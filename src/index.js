const express = require("express");
const cors = require("cors");
const movies = require("./data/movies.json");
const users = require("./data/users.json");
const Database = require("better-sqlite3");
const db = new Database("./src/db/database.db", { verbose: console.log });

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// set template engine middlewares
server.set("view engine", "ejs");

// API
server.get("/movies", (req, res) => {
  const query = db.prepare("SELECT * FROM movies");
  const moviesBD = query.all();
  res.json({ movies: moviesBD });
});

server.post("/users", (req, res) => {
  console.log(req.body);
});

// STATIC SERVER: listen files in public folder
const staticServerPath = "./src/public-react"; // relative to the root of the project
server.use(express.static(staticServerPath));

// STATIC SERVER IMG: listen files in public folder
const staticServerImgPath = "./src/public-movies-images"; // relative to the root of the project
server.use(express.static(staticServerImgPath));

// STATIC SERVER STYLES

server.use(express.static("./src/public-react/static"));

//Endpoints
server.get("/movie/:movieId", (req, res) => {
  const foundMovies = movies.find((movie) => movie.id === req.params.movieId);
  console.log("movie data", foundMovies);
  res.render("movie", foundMovies);
});

server.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const query = db.prepare(
    `SELECT * FROM users WHERE email= ? AND password= ?`
  );
  const foundUser = query.get(email, password);
  if (foundUser === undefined) {
    res.json({ error: "Usuario no encontrado" });
  } else {
    res.json({
      success: true,
      userId: foundUser.id,
    });
  }
});
server.post("/sign-up", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
});

server.get("/user/movies", (req, res) => {
  const query = db.prepare(
    `SELECT movieId FROM rel_movies_users WHERE userId=?`
  );
  const foundMovies = query.all(req.header("user-id"));
  const moviesIdsQuestions = foundMovies.map((id) => "?").join(", ");
  const moviesQuery = db.prepare(
    `SELECT * FROM movies WHERE id IN (${moviesIdsQuestions})`
  );
  const moviesIdsNumbers = foundMovies.map((movie) => movie.movieId);
  const movies = moviesQuery.all(moviesIdsNumbers);
  res.json({ success: true, movies: movies });
});
