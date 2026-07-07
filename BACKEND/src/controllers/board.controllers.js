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

// ✏️ CONTROLADOR PARA EDITAR EL TABLERO (PUT /boards/:id)
const updateBoard = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    // Buscamos el tablero por su ID Y nos aseguramos de que pertenezca al usuario logueado
    const board = await Board.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name, description, color },
      { new: true } // Para que devuelva el tablero ya actualizado
    );

    if (!board) {
      return res.status(404).json({ message: "Tablero no encontrado o no autorizado" });
    }

    return res.status(200).json(board);
  } catch (error) {
    console.error("Error al actualizar el tablero:", error);
    return res.status(500).json({ message: "Server error al actualizar tablero" });
  }
};

// 🗑️ CONTROLADOR PARA BORRAR EL TABLERO (DELETE /boards/:id)
const deleteBoard = async (req, res) => {
  try {
    // Buscamos y eliminamos el tablero si pertenece al usuario logueado
    const board = await Board.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!board) {
      return res.status(404).json({ message: "Tablero no encontrado o no autorizado" });
    }

    // [Opcional] Desvincular las tareas que pertenecían a este tablero (las pasa a board: null)
    // Si tienes el modelo Task importado aquí, puedes descomentar la siguiente línea:
    // await Task.updateMany({ board: req.params.id }, { board: null });

    return res.status(200).json({ message: "Tablero eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar el tablero:", error);
    return res.status(500).json({ message: "Server error al eliminar tablero" });
  }
};

module.exports = { getBoards, createBoard, updateBoard, deleteBoard };