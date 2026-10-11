const mongoose = require("mongoose");

// A3: Task schema - title (required), completed (default false), createdAt (default now)
const taskSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Title is required"] },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);
