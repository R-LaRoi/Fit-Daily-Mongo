const mongoose = require("mongoose");
const Routine = require("./routineSchema");

mongoose.connect("mongodb://localhost:3000/fit_daily");

const Schema = mongoose.Schema;

saveRoutine();
async function saveRoutine() {
  // const thisRoutine = Routine.create({}) || you can use "new"
  const Routine = new Schema({
    date: { type: String, required: true },
    type: { type: String, required: true },
    duration: { type: String, required: true },
    routine: { type: String, required: true },
  });
}

const RoutineModel = mongoose.model("daily_routines", Routine);
module.exports = RoutineModel;
