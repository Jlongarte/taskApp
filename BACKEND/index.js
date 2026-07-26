require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const tasksRoutes = require("./src/routes/tasks.routes");
const authRoutes = require("./src/routes/users.routes");
const analyticsRoutes = require("./src/routes/analytics.routes");
const boardRoutes = require("./src/routes/board.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(
  cors({
    origin: "https://task-app-three-ruddy.vercel.app",
    credentials: true,
    
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();


// Rutas
app.use("/tasks", tasksRoutes);
app.use("/users", authRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/boards", boardRoutes);


// 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Route Not Found" });
});

// Errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});