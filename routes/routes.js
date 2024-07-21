const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.post("/submitRoutine", async (req, res) => {
  try {
    const formData = req.body;

    await dailyRoutine.save();

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
    res.status(400).send("An error occurred while saving your routine.");
  }
});

module.exports = app;
