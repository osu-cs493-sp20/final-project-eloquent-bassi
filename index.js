const express = require("express");
const morgan = require("morgan");

const api = require("./api");
const users = require("./api/users");
const rateLimit = require("./lib/rateLimiting");

const app = express();
const port = process.env.PORT || 8000;

app.use(rateLimit);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("public"));
app.use("*", (req, res, next) => {
  // TODO replace this with a real middleware
  req.jwt = {
    iat: 12345667,
    exp: 12345667,
    sub: 1,
    role: "student"
  };
  next();
});
app.use("/users", users);
app.use("/", api);

app.use("*", function (req, res, next) {
  res.status(404).json({
    error: "Requested resource " + req.originalUrl + " does not exist"
  });
});

app.listen(port, function () {
  console.log("== Server is running on port", port);
});
