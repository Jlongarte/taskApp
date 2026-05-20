const Task = require("../models/task.model");

const getAllTasks = async (req, res) => {
  try {
    const { status, date, sort } = req.query;
    const filter = { user: req.user._id };
    if (status && ["pending", "in progress", "completed"].includes(status)) {
      filter.status = status;
    }

    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filter.date = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }
    let query = Task.find(filter);
    if (sort === "date_asc") query = query.sort({ date: 1 });
    else if (sort === "date_desc") query = query.sort({ date: -1 });
    else if (sort === "status_asc") query = query.sort({ status: 1 });
    else if (sort === "status_desc") query = query.sort({ status: -1 });

    const tasks = await query;
    return res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, date, status } = req.body;
    if (!title || !date) {
      return res.status(400).json({ message: "Title and date are required" });
    }
    const newTask = new Task({
      title,
      date,
      status: status || "pending",
      user: req.user._id,
    });
    const savedTask = await newTask.save();
    return res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, date, status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    task.title = title || task.title;
    task.date = date || task.date;
    task.status = status || task.status;
    const updatedTask = await task.save();
    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await task.remove();
    return res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};
