const express = require("express");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const PORT = 3000;
const URI = process.env.ATLAS_URI || "";

// mongoose ------------------------

const client = new MongoClient(URI);
const mongoose = require("mongoose");
const Routine = require("./routineSchema");
mongoose.connect(
  "mongodb+srv://StroiDev:Developer2024!@labcluster.49b0qal.mongodb.net/"
);

const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const dailyData = require("./data/dailyData.json");
const fitUsers = require("./data/user");
const { nanoid } = require("nanoid");
const idNumber = nanoid(5);
const { middleErrors } = require("./middleware/middleware");

// -mongo edit ----
let connectToClient;
let db;

async function connectToMongo() {
  try {
    connectToClient = await client.connect();
    console.log("connected to mongodb");
  } catch (error) {
    console.log(e);
  } finally {
    db = connectToClient.db("fit_daily");
  }
}

// -mongo edit ends

app.use(express.static(path.join(__dirname, "public")));

//  PUG
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index", {
    title: "Fit Daily",
  });
});

app.get;

// GET JSON Data for all routines
app.get("/daily_routines", async (req, res) => {
  try {
    let collection = await db.collection("daily_routines");
    let mgRoutine = await collection.find().toArray();
    res.status(200).json(mgRoutine);
  } catch (error) {
    res.status(500).json({ error: "Routines are unavailable." });
  }
});

// GET -  JSON data for users
app.get("/users", async (req, res) => {
  try {
    let collection = await db.collection("users");
    let mgUsers = await collection.find().toArray();

    res.status(200).json(mgUsers);
  } catch (error) {
    res.status(500).json({ error: "Users are unavailable." });
  }
});

// mg edit ends

// GET - displays users previous routine history
app.get("/dailyroutines", async function (req, res) {
  let collection = await db.collection("daily_routines");
  let mgRoutine = await collection.find().toArray();

  let showRoutines = {};
  mgRoutine.forEach((item, index, array) => {
    showRoutines = {
      date: item.date,
      duration: item.duration,
      type: item.type,
      routine: item.routine,
    };
  });
  res.render("dailyroutines", { showRoutines });
});

// // GET -  form to add a routine
app.get("/addroutine", function (req, res) {
  res.render("addroutine");
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// POST create new routine
app.post("/submitRoutine", async (req, res) => {
  const formData = req.body;
  const userRoutine = new Routine(formData);

  try {
    await userRoutine.save();
    res.send(`
      <body style="background-color: #242424">
        <main style="background-color: #242424; color: white; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; padding: 20px; width:600px">
          <div style="display: flex; flex-direction: column">
            <h1>FIT FOR LIFE!</h1>
            <p>Your routine has been added!</p>
            <div>${formData.date}</div>
            <div>${formData.type}</div>
            <div>${formData.duration}</div>
            <div>${formData.routine}</div>
            <br><br>
            <a style="text-decoration: none; background: transparent; border: 1px solid white; border-radius:10px; padding:5px; color:white;" href="dailyroutines">View Routines</a>
          </div>
        </main>
      </body>
    `);
  } catch (error) {
    console.error("Error saving routine:", error);
    res.status(500).send("An error occurred while saving your routine.");
  }
});

// PUT  update routine by id
app.put("/submitRoutine/:id", (req, res) => {
  const routineId = req.params.id;
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

// DELETE routine by id
app.delete("/deleteRoutine/:id", (req, res) => {
  const routineId = req.params.id;

  let data = JSON.parse(
    fs.readFileSync(`${__dirname}/data/dailyData.json`, "utf-8")
  );

  const findRoutine = data.find((delRoutine) => delRoutine.id === routineId);
  if (findRoutine) {
    const routineItem = data.indexOf(findRoutine);
    if (routineItem !== -1) {
      data.splice(routineItem, 1);
    } else {
      res.status(404).json({ error: "Routine not found" });
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

// Middleware - error
app.use(middleErrors);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

connectToMongo();
