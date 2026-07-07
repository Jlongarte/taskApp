import "./TaskForm.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const TaskForm = ({ onSubmitTask, taskToEdit, clearTaskToEdit }) => {
  const { token } = useAuth();
  const [boards, setBoards] = useState([]);
  
  // 🔘 Controlamos la opción mediante botones de radio ("si" o "no")
  const [hasBoardOption, setHasBoardOption] = useState("no");

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    status: "pending",
    comments: "", 
    board: "",    
  });

  // Cargar los tableros del usuario
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8080/boards", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBoards(data);
      })
      .catch((err) => console.error("Error cargando tableros:", err));
  }, [token]);

  // Sincronizar edición
  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        date: taskToEdit.date?.slice(0, 10) || "",
        status: taskToEdit.status || "pending",
        comments: taskToEdit.comments || "", 
        board: taskToEdit.board?._id || taskToEdit.board || "", 
      });
      setHasBoardOption(taskToEdit.board ? "si" : "no");
    }
  }, [taskToEdit]);

  const handleChange = (ev) => {
    setFormData({ ...formData, [ev.target.name]: ev.target.value });
  };

  const handleRadioChange = (ev) => {
    const val = ev.target.value;
    setHasBoardOption(val);
    if (val === "no") {
      setFormData(prev => ({ ...prev, board: "" }));
    }
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    
    const finalData = {
      ...formData,
      board: hasBoardOption === "si" && formData.board ? formData.board : null
    };

    onSubmitTask(finalData);
    
    setFormData({
      title: "",
      date: "",
      status: "pending",
      comments: "",
      board: "",
    });
    setHasBoardOption("no");
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 📋 Input de Título */}
      <div className="form-group">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      {/* 📅 Input de Fecha */}
      <div className="form-group">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      {/* 💬 Input de Comentarios */}
      <div className="form-group">
        <input
          type="text"
          name="comments"
          placeholder="Add comments or extra notes..."
          value={formData.comments}
          onChange={handleChange}
        />
      </div>

      {/* 🎯 Selector de Estado */}
      <div className="form-group">
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* ❓ NUEVOS BOTONES DE RADIO: ¿Desea añadirlo a un tablero? */}
      <div className="form-group">
        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px", color: "#94a3b8" }}>
          Would you like to add this to a board?
        </label>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", marginBottom: "0.5rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "14px", color: "#fff" }}>
            <input
              type="radio"
              name="hasBoardOption"
              value="no"
              checked={hasBoardOption === "no"}
              onChange={handleRadioChange}
              style={{ accentColor: "#6366f1", width: "16px", height: "16px", cursor: "pointer" }}
            />
            No
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "14px", color: "#fff" }}>
            <input
              type="radio"
              name="hasBoardOption"
              value="yes"
              checked={hasBoardOption === "yes"}
              onChange={handleRadioChange}
              style={{ accentColor: "#6366f1", width: "16px", height: "16px", cursor: "pointer" }}
            />
            Yes
          </label>
        </div>
      </div>

      {/* 📁 Despliegue condicional si pulsa "Sí" */}
      {hasBoardOption === "yes" && (
        <div className="form-group" style={{ animation: "fadeIn 0.2s ease" }}>
          {boards.length === 0 ? (
            /* 💙 Caso: No hay tableros creados (¡Ahora en AZUL!) */
            <div style={{ padding: "10px", background: "rgba(59, 130, 246, 0.1)", border: "1px dashed #3b82f6", borderRadius: "8px", fontSize: "13px", textAlign: "center" }}>
              <p style={{ color: "#60a5fa", marginBottom: "6px", fontWeight: "500" }}>You don't have any boards yet.</p>
              <Link to="/workspaces" style={{ color: "#a78bfa", fontWeight: "600", textDecoration: "underline" }}>
                Create Board
              </Link>
            </div>
          ) : (
            /* ✅ Caso: Sí hay tableros */
            <>
              <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "13px", color: "#a78bfa" }}>
                Select a destination board
              </label>
              <select
                name="board"
                value={formData.board}
                onChange={handleChange}
                required={hasBoardOption === "yes"}
                style={{ borderColor: "#3b82f6" }} // Borde azul a juego
              >
                <option value="">-- Select a board --</option>
                {boards.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      )}

      {/* 🚀 Botón de acción principal */}
      <button type="submit" disabled={hasBoardOption === "yes" && boards.length === 0}>
        {taskToEdit ? "Save Changes" : "Create Task"}
      </button>

      {/* ❌ Botón para cancelar la edición */}
      {taskToEdit && (
        <button
          type="button"
          className="cancel-edit-btn"
          onClick={() => {
            clearTaskToEdit();
            setFormData({ title: "", date: "", status: "pending", comments: "", board: "" });
            setHasBoardOption("no");
          }}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: "#94a3b8",
            marginTop: "8px",
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Cancel Edit
        </button>
      )}
    </form>
  );
};

export default TaskForm;