const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in progress", "completed"],
      default: "pending",
    },
    comments: { // 💬 1. AGREGAMOS EL CAMPO DE COMENTARIOS
      type: String,
      default: "",
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      default: null    
    },
        progress: {
      type: Number,
      enum: [0, 25, 50, 75, 100],
      default: 0 
},
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;