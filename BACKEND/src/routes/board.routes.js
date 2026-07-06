const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth");
const { getBoards, createBoard } = require('../controllers/board.controllers');
// Definimos la ruta GET para las estadísticas
router.get('/', auth, getBoards);
router.post('/', auth, createBoard);

module.exports = router;