const express = require("express");
const app = express();
const connectDB = require("./config.js/db");
const port = 3000;
const path = require("path");

const { middleErrors } = require("./middleware/middleware");
const routineModel = require("./models/routineSchema");
const userModel = require("./models/userSchema");

app.use(express.static(path.join(__dirname, "public")));

// PUG
app.set("view engine", "pug");
app.get("/", (req, res) => {
  res.render("index", {
    title: "Fit Daily",
  });
});

// GET - displays users previous routine history
app.get("/routines", async function (req, res) {
  let routines = await routineModel.find();
  console.log(routines);

  res.render("dailyroutines", { routines });
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

app.use(middleErrors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET -  form to add a routine
app.get("/addroutine", function (req, res) {
  res.render("addroutine");
});

app.post("/submitroutine", async (req, res) => {
  try {
    const formData = req.body;
    const newRoutine = new routineModel(formData);
    await newRoutine.save();
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
            <a style="text-decoration: none; background: transparent; border: 1px solid white; border-radius:10px; padding:5px; color:white;" href="/routines">View Routines</a>
          </div>
        </main>
      </body>
    `);
  } catch (error) {
    console.error("Error saving routine", error);
    res.status(500).json({ message: "Error saving routine", error });
  }
});

app.delete("/deleteRoutine/:id", async (req, res) => {
  const routineId = req.params.id;
  try {
    const deleteRoutine = await routineModel.findByIdAndDelete(routineId);

    if (!deleteRoutine) {
      return res.status(404).json({ message: "Routine not found" });
    }
    res
      .status(200)
      .json({ message: "Routine deleted successfully", deleteRoutine });
  } catch (error) {}
});

app.put("/updateroutine/:id", async (req, res) => {
  const routineId = req.params.id;
  const updatedData = req.body;

  try {
    const updatedRoutine = await routineModel.findByIdAndUpdate(
      routineId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedRoutine) {
      return res.status(404).json({ message: "Routine not found" });
    }
    res
      .status(200)
      .json({ message: "Routine updated successfully", updatedRoutine });
  } catch (error) {
    console.error("Error updating routine", error);
    res.status(500).json({ message: "Error updating routine", error });
  }
});

app.listen(port, () => {
  console.log(`Server listening on 3000`);
});

connectDB();
