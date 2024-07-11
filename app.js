const express = require("express");
const app = express();
const PORT = 3000;
const dailyData = require("./data/dailyData");
const fitUsers = require("./data/user");

app.get("/", (req, res) => {
  res.send("fit daily");
});

//  routines route
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
