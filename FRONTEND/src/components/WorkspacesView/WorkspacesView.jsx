import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./WorkspacesView.css"; // Tus estilos actuales

const WorkspacesView = () => {
  const { token } = useAuth();
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]); // 📦 1. Añadimos estado para almacenar las tareas

  // 🔄 2. Cargar Tableros y Tareas en paralelo al montar la pantalla
  useEffect(() => {
    if (!token) return;

    // Traer tus tableros (Ruta sin /api que corregimos)
    fetch("http://localhost:8080/boards", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBoards(data);
        else if (data && Array.isArray(data.boards)) setBoards(data.boards);
      })
      .catch((err) => console.error("Error cargando tableros:", err));

    // Traer tus tareas globales
    fetch("http://localhost:8080/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTasks(data);
        else if (data && Array.isArray(data.tasks)) setTasks(data.tasks);
      })
      .catch((err) => console.error("Error cargando tareas en Workspaces:", err));
  }, [token]);

  return (
    <div className="workspaces-wrapper">
      <h2>Mis Espacios de Trabajo</h2>
      <p>Selecciona un tablero para gestionar tus tareas operativas.</p>

      <div className="boards-grid" style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
        {boards.map((board) => {
          // 🔍 3. Filtramos las tareas que pertenecen en exclusiva a este tablero
          // 🔍 FILTRADO ULTRA-SEGURO DE TABLEROS
const boardTasks = tasks.filter(t => {
  if (!t.board) return false;

  // Extraemos el ID tanto si viene populado como objeto, como si viene como String plano
  const taskBoardId = typeof t.board === 'object' ? t.board._id : t.board;
  const currentBoardId = typeof board._id === 'object' ? board._id.toString() : board._id;

  // Convertimos ambos a String para evitar que Mongoose u ObjectIds rompan la comparación
  return String(taskBoardId) === String(currentBoardId);
});

          return (
            <div 
              key={board._id} 
              className="board-card" 
              style={{
                background: "#13131a",
                borderTop: `4px solid ${board.color || "#6366f1"}`, // Tu barra lila superior de image_cf6a7d.png
                borderRadius: "12px",
                padding: "20px",
                minWidth: "280px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
              }}
            >
              <h3 style={{ color: "#fff", margin: "0 0 4px 0" }}>{board.name}</h3>
              <p style={{ color: "#94a3b8", fontSize: "13px", margin: "0 0 16px 0" }}>{board.description || "Tablero de proyectos dinámico"}</p>

              {/* 📋 4. PINTAR LAS TAREAS DE ESTE TABLERO AQUÍ DENTRO */}
              <div className="board-tasks-preview" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: "bold", color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Tareas ({boardTasks.length}):
                </span>
                
                {boardTasks.length === 0 ? (
                  <p style={{ color: "#475569", fontSize: "13px", fontStyle: "italic", margin: "4px 0 0 0" }}>
                    Sin tareas asignadas
                  </p>
                ) : (
                  boardTasks.map(task => (
                    <div 
                      key={task._id} 
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        color: "#e2e8f0"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong style={{ color: "#fff" }}>{task.title}</strong>
                        {/* Una pequeña etiqueta de estado estética */}
                        <span style={{ 
                          fontSize: "10px", 
                          padding: "2px 6px", 
                          borderRadius: "4px",
                          background: task.status === "completed" ? "rgba(16, 185, 129, 0.15)" : task.status === "in progress" ? "rgba(245, 158, 11, 0.15)" : "rgba(148, 163, 184, 0.15)",
                          color: task.status === "completed" ? "#10b981" : task.status === "in progress" ? "#f59e0b" : "#94a3b8"
                        }}>
                          {task.status}
                        </span>
                      </div>
                      
                      {/* Mostrar los comentarios si los tiene creados */}
                      {task.comments && (
                        <p style={{ color: "#64748b", fontSize: "11px", margin: "4px 0 0 0", fontStyle: "italic" }}>
                          💬 {task.comments}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkspacesView;