const express = require("express");
const app = express();
const PORT = 3000;
const dailyData = require("./data/dailyData");
const fitUsers = require("./data/user");

app.set("view engine", "pug");
app.get("/", (req, res) => {
  res.render("index", {
    title: "Pug",
  });
});

app.get("/dailyroutines", function (req, res) {
  res.render("dailyroutines", dailyData);
});

app.get("/addroutine", function (req, res) {
  res.render("addroutine");
});

//  routines routes
app.get("/routines", (req, res) => {
  const routine = dailyData;
  res.json(routine);
});

//  user route
app.get("/user", (req, res) => {
  res.json(fitUsers);
});

//  middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Unavailable");
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
