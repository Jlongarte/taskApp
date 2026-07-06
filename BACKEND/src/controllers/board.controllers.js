const Board = require('../models/board.model'); 

// Obtener los tableros del usuario logueado
const getBoards = async (req, res) => {
  try {
    // Si tu middleware de auth inyecta el usuario en req.user:
    const userId = req.user ? req.user.id : req.body.userId; 
    
    const boards = await Board.find({ user: userId });
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tableros", error });
  }
};

// Crear un nuevo tablero
const createBoard = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const userId = req.user ? req.user.id : req.body.userId;

    const newBoard = await Board.create({
      name,
      description: description || "Tablero operativo",
      color: color || "#6366f1",
      user: userId
    });

    res.status(201).json(newBoard);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el tablero", error });
  }
};

module.exports = { getBoards, createBoard };