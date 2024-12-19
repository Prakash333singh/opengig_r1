const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize app and middleware
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const mongoURI = "mongodb://localhost:27017/taskmanager"; // Replace with your MongoDB connection string if needed
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Define Task Schema and Model
const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  estimatedTime: { type: Number, required: true },
  status: { type: String, default: "Paused" }, // Running or Paused
  startTime: { type: Date, default: null },
  elapsedTime: { type: Number, default: 0 }, // Time elapsed in seconds
});

const Task = mongoose.model("Task", taskSchema);

// Routes

// Add a new task
app.post("/tasks", async (req, res) => {
  try {
    const { name, estimatedTime } = req.body;
    const newTask = new Task({ name, estimatedTime });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to add task" });
  }
});

// Fetch all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    // Update elapsed time for running tasks
    tasks.forEach((task) => {
      if (task.status === "Running") {
        const now = Date.now();
        task.elapsedTime += Math.floor((now - task.startTime) / 1000);
        task.startTime = now;
      }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Update task status or mark as complete
app.put("/tasks/:id", async (req, res) => {
  try {
    const { action } = req.body; // Action can be "start", "pause", or "complete"
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ error: "Task not found" });

    if (action === "start") {
      task.status = "Running";
      task.startTime = Date.now();
    } else if (action === "pause") {
      if (task.status === "Running") {
        const now = Date.now();
        task.elapsedTime += Math.floor((now - task.startTime) / 1000);
        task.startTime = null;
        task.status = "Paused";
      }
    } else if (action === "complete") {
      await Task.findByIdAndDelete(req.params.id);
      return res.json({ message: "Task completed" });
    }

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
