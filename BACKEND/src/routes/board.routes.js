const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth");
const { getBoards, createBoard, updateBoard, deleteBoard } = require('../controllers/board.controllers');
router.get('/', auth, getBoards);
router.post('/', auth, createBoard);
router.put('/:id', auth, updateBoard);
router.delete('/:id', auth, deleteBoard);

module.exports = router;