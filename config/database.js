require("dotenv").config(); // Load environment variables from .env file
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const URL = process.env.MONGODB_URI;

    // Connect to MongoDB using Mongoose
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // poolSize: 10, // Adjust the poolSize
    });

    console.log("Database Connected");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit the application on connection failure
  }

  // Close the database connection when the application is terminated
  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      console.log("Database connection closed");
      process.exit(0);
    });
  });
};

module.exports = connectDB;
