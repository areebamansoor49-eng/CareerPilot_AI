const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error(
        "MONGODB_URI is not configured."
      );
    }

    const connection =
      await mongoose.connect(mongoURI);

    console.log(
      `MongoDB connected: ${connection.connection.host}`
    );
  } catch (error) {
    console.error(
      "MongoDB connection error:",
      error.message
    );

    process.exit(1);
  }
};

module.exports = connectDB;