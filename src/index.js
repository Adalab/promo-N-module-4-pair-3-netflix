const express = require("express");
const cors = require("cors");
const movies = require("./data/movies.json");

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// API
server.get("/movies", (req, res) => {
  const response = {
    success: true,
    movies,
  };
  res.json(response);
});

// STATIC SERVER: listen files in public folder
const staticServerPath = "./src/public-react"; // relative to the root of the project
server.use(express.static(staticServerPath));

// STATIC SERVER IMG: listen files in public folder
const staticServerImgPath = "./src/public-movies-images"; // relative to the root of the project
server.use(express.static(staticServerImgPath));
