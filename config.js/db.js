const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB() {
  const url = process.env.ATLAS_URI;

  try {
    await mongoose.connect(url);
    console.log(`Database connected.`);
    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB error: ${err}`);
    });
  } catch (err) {
    console.error(`Failed to connect to MongoDB: ${err.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;
