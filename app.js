const express = require("express");
const app = express();
const PORT = 3000;

const bodyParser = require("body-parser");
const fs = require("fs");

const dailyData = require("./data/dailyData");
const fitUsers = require("./data/user");

const { nanoid } = require("nanoid");
const idNumber = nanoid(5);

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

  let userRoutine = {
    id: idNumber,
    date: formData.date,
    type: formData.type,
    duration: formData.duration,
    routine: formData.routine,
  };

  data = [...data, userRoutine];

  fs.writeFile(
    `${__dirname}/data/dailyData.json`,
    JSON.stringify(data),
    (err) => {
      console.log("Something went wrong!");
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

// add a delete path for deleting routines
app.delete("/data/dailyroutines/delete/:id", (req, res) => {
  const routineId = parseInt(req.params.id);
  let data = JSON.parse(
    fs.readFileSync(`${__dirname}/data/dailyData.json`, "utf-8")
  );

  const findRoutine = data.find((delRoutine) => delRoutine.id === routineId);
  if (findRoutine) {
    const routineItem = data.indexOf(findRoutine);
    if (routineItem !== -1) {
      data.splice(routineItem, 1);
    }
  }

  fs.writeFile(
    `${__dirname}/data/dailyData.json`,
    JSON.stringify(data),
    (err) => {
      console.log("Error writing file!");
    }
  );
});

//  middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Unavailable");
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
