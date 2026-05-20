require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const tasksRoutes = require("./src/routes/tasks.routes");
const authRoutes = require("./src/routes/users.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Queda pendiente conocer las direcciones del frontal para configurar CORS de manera adecuada, por ahora se permite el acceso desde cualquier origen
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/tasks", tasksRoutes);
app.use("/users", authRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route Not Found" });
});

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
