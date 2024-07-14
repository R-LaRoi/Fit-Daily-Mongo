const express = require("express");
const app = express();
const PORT = 3000;
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const dailyData = require("./data/dailyData.json");
const fitUsers = require("./data/user");
const { nanoid } = require("nanoid");
const idNumber = nanoid(5);

app.use(express.static(path.join(__dirname, "public")));

//  PUG
app.set("view engine", "pug");
app.get("/", (req, res) => {
  res.render("index", {
    title: "Pug",
  });
});

// GET - users previous routine history
app.get("/dailyroutines", function (req, res) {
  let showRoutines = {};

  dailyData.forEach((item, index, array) => {
    showRoutines = {
      date: item.date,
      duration: item.duration,
      type: item.type,
      routine: item.routine,
    };
  });

  res.render("dailyroutines", { showRoutines });
});

// GET -  form to add a routine
app.get("/addroutine", function (req, res) {
  res.render("addroutine");
});

//  GET -  JSON data for routines
app.get("/routines", (req, res) => {
  const routine = dailyData;
  res.json(routine);
});

// GET - users JSON data for users
app.get("/user", (req, res) => {
  res.json(fitUsers);
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// POST
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

  res.send(`<body style="background-color: #242424">
  <main style="background-color: #242424; color: white; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; padding: 20px; width:600px">
  <div style="display:"flex"; flex-direction: column">
  <h1>FIT FOR LIFE!</h1>
    <p>Your routine has beed added!</p>
    <div>${formData.date}<div>
        <div>${formData.type}<div>
            <div>${formData.duration}<div>
                <div>${formData.routine}<div
           <div>
           <br><br>
    <a style=" text-decoration: none; background: transparent; border: 1px solid white; border-radius:10px; padding:5px; color:white;" href="dailyroutines">View Routines</a></div></main>
    </body>
    `);
});

// PUT
app.put("/submitRoutine/:id", (req, res) => {
  const routineId = parseInt(req.params.id);
  let data = JSON.parse(
    fs.readFileSync(`${__dirname}/data/dailyData.json`, "utf-8")
  );

  const updateRoutine = data.find((getRoutine) => getRoutine.id === routineId);
  if (updateRoutine === routineId) {
    const routineItem = data.indexOf(updateRoutine);
    if (routineItem) {
      return Object.assign({}, routineItem, {
        type: "EMOM",
        duration: "75 minutes",
        routine: "planks",
      });
    } else {
      res.status(404).send("Routine not found");
    }
  }
  fs.writeFile(
    `${__dirname}/data/dailyData.json`,
    JSON.stringify(data),
    (err) => {
      console.log("Something went wrong!");
    }
  );
  res.send("Your routine was updated!");
});

// DELETE
app.delete("dailyroutines/delete/:id", (req, res) => {
  const routineId = parseInt(req.params.id);
  let data = JSON.parse(
    fs.readFileSync(`${__dirname}/data/dailyData.json`, "utf-8")
  );

  const findRoutine = data.find((delRoutine) => delRoutine.id === routineId);
  if (findRoutine) {
    const routineItem = data.indexOf(findRoutine);
    if (routineItem !== -1) {
      data.splice(routineItem, 1);
    } else {
      res.status(404).send("Routine not found");
    }
  }

  fs.writeFile(
    `${__dirname}/data/dailyData.json`,
    JSON.stringify(data),
    (err) => {
      if (err) {
        console.error("Something went wrong", err);
        return res.status(500).send("Error deleting routine");
      }
      res.send("Routine Deleted");
    }
  );
});

//  Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Unavailable");
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
