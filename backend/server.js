require("dotenv").config(); // A2: load variables from .env
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// A6: allow ONLY the React app's address (not every website)
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));

// A1: read JSON request bodies into req.body
app.use(express.json());

// API routes
app.use("/api/tasks", require("./routes/tasks"));

// Unknown address -> 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Any error that reaches here (e.g. malformed JSON in the request) -> clean JSON
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body is not valid JSON" });
  }
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;

// Only start the server when this file is run directly (node server.js)
if (require.main === module) {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is missing. Copy ".env.example" to ".env" and add your connection string.');
    process.exit(1);
  }

  // A2: connect to MongoDB with Mongoose, then start listening
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected");
      app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch((err) => {
      console.error("MongoDB connection failed:", err.message);
      process.exit(1);
    });
}

module.exports = app;
