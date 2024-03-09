const express = require("express"); // Express framework for Node.js
const bodyParser = require("body-parser"); // Middleware for handling request bodies
const db = require("./config/db"); // Connection to database
const port = 3001; // Port number for the server to listen on

require('dotenv').config(); // Load environment variables from .env file

// Import the route handlers for mentors and students
const mentorRoutes = require("./routes/mentorRoutes");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
// Route handlers for the mentor and student routes
app.use("/mentors", mentorRoutes);
app.use("/students", studentRoutes);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.listen(port);
