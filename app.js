const express = require("express");
const app = express();
const PORT = 3000;

const bodyParser = require("body-parser");
const fs = require("fs");
const dailyDataFile = "./data/dailyData";
const dailyRoutines = require(dailyDataFile);

const dailyData = require("./data/dailyData");
const fitUsers = require("./data/user");

app.set("view engine", "pug");
app.get("/", (req, res) => {
  res.render("index", {
    title: "Pug",
  });
});

// shows users previous routine history
app.get("/dailyroutines", function (req, res) {
  res.render("dailyroutines", dailyData);
});

//form - to add a routine
app.get("/addroutine", function (req, res) {
  res.render("addroutine");
});

//  maka method to delete a routine....

//  routines JSON data route
app.get("/routines", (req, res) => {
  const routine = dailyData;
  res.json(routine);
});

//  users JSON data route
app.get("/user", (req, res) => {
  res.json(fitUsers);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/submitRoutine", (req, res) => {
  let data = JSON.parse(
    fs.readFileSync(`${__dirname}/data/dailyData.json`, "utf-8")
  );

  const formData = req.body;
  // console.log(routineData);
  // const routineData = JSON.stringify(formData);
  //  need to add this routine data to daily data ....
  let userRoutine = {
    date: formData.date,
    type: formData.type,
    duration: formData.duration,
    routine: formData.message,
  };

  data = [...data, userRoutine];

  fs.writeFile(
    `${__dirname}/data/dailyData.json`,
    JSON.stringify(data),
    (err) => {
      console.log("Something went wrong Mr. ES6-2015, get it right!");
    }
  );

  res.send(`<main style="text-align: center><h1 style="text-align: center; 
    margin-top: 50vh; transform: translateY(-50%);">
    FIT FOR LIFE!</h1>
    <div>${formData.date}<div>
        <div>${formData.type}<div>
            <div>${formData.duration}<div>
                <div>${formData.routine}<div>
    <a href="dailyroutines">routines</a></main>
    `);
});

// add a delete path on daily routines

//  middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Unavailable");
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
