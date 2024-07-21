const mongoose = require("mongoose");

const routineSchema = new mongoose.Schema({
  date: { type: String, required: true },
  type: { type: String, required: true },
  duration: { type: String, required: true },
  routine: { type: String, required: true },
});

const routineModel = mongoose.model("daily_routines", routineSchema);

module.exports = routineModel;
