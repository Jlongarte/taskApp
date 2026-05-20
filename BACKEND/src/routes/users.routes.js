const express = require("express");
const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");
const {
  register,
  login,
  getProfile,
  updateName,
  updatePassword,
  updateAvatar,
} = require("../controllers/users.controllers");

const router = express.Router();

// Rutas públicas
router.post("/register", upload.single("avatar"), register);
router.post("/login", login);

// Rutas protegidas
router.get("/profile", auth, getProfile);
router.put("/name", auth, updateName);
router.put("/password", auth, updatePassword);
router.put("/avatar", auth, upload.single("avatar"), updateAvatar);

module.exports = router;
