const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");

const router = express.Router();

// A5: turn the value into a string and trim the spaces around it
function cleanTitle(value) {
  return String(value ?? "").trim();
}

// ---------------------------------------------------------------
// GET /api/tasks  ->  fetch all tasks (oldest first)
// ---------------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: 1 });
    res.json(tasks); // 200
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch tasks" });
  }
});

// ---------------------------------------------------------------
// POST /api/tasks  ->  add a new task   body: { "title": "Buy milk" }
// ---------------------------------------------------------------
router.post("/", async (req, res) => {
  try {
    const title = cleanTitle((req.body || {}).title);
    if (!title) {
      return res.status(400).json({ message: "Title cannot be empty" });
    }
    const task = await Task.create({ title });
    res.status(201).json(task); // 201 Created
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not create task" });
  }
});

// ---------------------------------------------------------------
// PUT /api/tasks/:id  ->  update a task
//   body can hold: { "completed": true }  and/or  { "title": "New title" }
// ---------------------------------------------------------------
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const body = req.body || {};
    const updates = {};

    if (body.title !== undefined) {
      const title = cleanTitle(body.title);
      if (!title) {
        return res.status(400).json({ message: "Title cannot be empty" });
      }
      updates.title = title;
    }

    if (body.completed !== undefined) {
      if (typeof body.completed !== "boolean") {
        return res.status(400).json({ message: "completed must be true or false" });
      }
      updates.completed = body.completed;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Send a title or completed value to update" });
    }

    const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task); // 200, returns the updated task
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update task" });
  }
});

// ---------------------------------------------------------------
// DELETE /api/tasks/:id  ->  delete a task
// ---------------------------------------------------------------
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted", id: req.params.id }); // 200
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not delete task" });
  }
});

module.exports = router;
