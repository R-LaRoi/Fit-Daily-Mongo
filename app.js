const express = require("express");
const app = express();
const connectDB = require("./config.js/db");
const { default: mongoose } = require("mongoose");
const port = 3000;
const fs = require("fs");
const path = require("path");

const { middleErrors } = require("./middleware/middleware");
const routineModel = require("./models/routineSchema");
const userModel = require("./models/userSchema");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// PUG
app.set("view engine", "pug");
app.get("/", (req, res) => {
  res.render("index", {
    title: "Fit Daily",
  });
});

// GET - displays users previous routine history
app.get("/fitDailyRoutines", async function (req, res) {
  let routineData = await routineModel.find();

  let showRoutines = {};
  routineData.forEach((item, index, array) => {
    showRoutines = {
      date: item.date,
      duration: item.duration,
      type: item.type,
      routine: item.routine,
    };
  });
  res.render("fitDailyRoutines", { showRoutines });
});

// GET - JSON data for daily_routines -----
app.get("/daily_routines", async (req, res) => {
  try {
    let routineData = await routineModel.find();
    res.status(200).json(routineData);
  } catch (error) {
    res.status(500).json({ error: "Routines are unavailable." });
  }
});

// GET -  JSON data for users ---------------
app.get("/users", async (req, res) => {
  try {
    let userData = await userModel.find();
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ error: "Users are unavailable." });
  }
});

// GET -  form to add a routine
app.get("/addroutine", function (req, res) {
  res.render("addroutine");
});

app.post("/submitroutine", async (req, res) => {
  const formData = req.body;
  const newRoutine = new Routine(formData);
  try {
    await newRoutine.save();
    res.status(201).json(newRoutine);
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ message: "Error saving post", error });
  }
});

// Middleware
app.use(middleErrors);
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server listening on 3000`);
});

connectDB();
