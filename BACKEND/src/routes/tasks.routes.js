const express = require("express");
const auth = require("../middlewares/auth");
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/tasks.controllers");

const Taskrouter = express.Router();

Taskrouter.get("/", auth, getAllTasks);
Taskrouter.post("/", auth, createTask);
Taskrouter.put("/:id", auth, updateTask);
Taskrouter.delete("/:id", auth, deleteTask);

module.exports = Taskrouter;
