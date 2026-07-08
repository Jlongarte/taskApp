import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import confetti from "canvas-confetti"; 
import "./WorkspacesView.css"; 

const WorkspacesView = () => {
  const { token } = useAuth();
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({ name: "", description: "", color: "#6366f1" });

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [editingBoard, setEditingBoard] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", description: "", color: "#6366f1" });

  const [activeTaskSliderId, setActiveTaskSliderId] = useState(null);

  const loadData = () => {
    if (!token) return;

    fetch("http://localhost:8080/boards", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setBoards(Array.isArray(data) ? data : data.boards || []))
      .catch((err) => console.error("Error cargando tableros:", err));

    fetch("http://localhost:8080/tasks", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setTasks(Array.isArray(data) ? data : data.tasks || []))
      .catch((err) => console.error("Error cargando tareas:", err));
  };

  useEffect(() => { loadData(); }, [token]);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(createFormData)
      });
      if (res.ok) {
        setIsCreateModalOpen(false);
        setCreateFormData({ name: "", description: "", color: "#6366f1" });
        loadData();
      }
    } catch (err) { console.error("Error al crear el tablero:", err); }
  };

  const handleDeleteBoard = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este tablero?")) return;
    try {
      const res = await fetch(`http://localhost:8080/boards/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setActiveMenuId(null);
        loadData();
      }
    } catch (err) { console.error("Error eliminando tablero:", err); }
  };

  const openEditModal = (board) => {
    setEditingBoard(board);
    setEditFormData({
      name: board.name,
      description: board.description || "",
      color: board.color || "#6366f1"
    });
    setActiveMenuId(null);
  };

  const handleSaveBoardEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8080/boards/${editingBoard._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });
      if (res.ok) {
        setEditingBoard(null);
        loadData();
      }
    } catch (err) { console.error("Error editando tablero:", err); }
  };

  const handleProgressChange = async (taskId, newProgressValue) => {
    const progressNum = parseInt(newProgressValue, 10);
    
    if (progressNum === 100) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, progress: progressNum } : t));

    try {
      await fetch(`http://localhost:8080/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ progress: progressNum })
      });
    } catch (err) { console.error("Error actualizando progreso:", err); }
  };

  const filteredBoards = boards.filter(board => {
    return board.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           (board.description && board.description.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="workspaces-container">
      
      {/* 🔝 SECCIÓN SUPERIOR */}
      <div className="workspaces-header-section">
        <div className="workspaces-title-group">
          <h2>Mis Espacios de Trabajo</h2>
          <p>Administra, busca y clasifica tus proyectos de alto nivel.</p>
        </div>
        
        <div className="workspaces-action-group">
          <input 
            type="text" 
            placeholder="🔍 Buscar tablero..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="workspaces-search-input"
          />
          <button onClick={() => setIsCreateModalOpen(true)} className="workspaces-btn-create">
            ➕ Nuevo Tablero
          </button>
        </div>
      </div>

      {/* 🎴 CUADRÍCULA DE TARJETAS */}
      <div className="workspaces-boards-grid">
        {filteredBoards.map((board) => {
          // 🔍 FILTRADO ULTRA-SEGURO DE TAREAS ASOCIADAS
          const boardTasks = tasks.filter(t => {
            if (!t.board) return false;
            const taskBoardId = typeof t.board === 'object' ? t.board._id : t.board;
            return String(taskBoardId) === String(board._id);
          });

          return (
            <div 
              key={board._id} 
              className="workspaces-board-card" 
              style={{ borderTop: `4px solid ${board.color || "#6366f1"}` }}
            >
              {/* ⚙️ MENÚ DESPLEGABLE (TRES PUNTOS) */}
              <div className="workspaces-options-menu">
                <button 
                  onClick={() => setActiveMenuId(activeMenuId === board._id ? null : board._id)}
                  className="workspaces-btn-dots"
                >
                  ⋮
                </button>
                {activeMenuId === board._id && (
                  <div className="workspaces-dropdown-box">
                    <button onClick={() => openEditModal(board)} className="workspaces-dropdown-btn">✏️ Editar</button>
                    <button onClick={() => handleDeleteBoard(board._id)} className="workspaces-dropdown-btn btn-delete">🗑️ Eliminar</button>
                  </div>
                )}
              </div>

              <h3>{board.name}</h3>
              <p className="board-desc">{board.description || "Sin descripción asignada"}</p>

              {/* 📋 PREVISUALIZACIÓN DE TAREAS */}
              <div className="workspaces-tasks-section">
                <span className="workspaces-tasks-title">Tareas ({boardTasks.length}):</span>
                
                {boardTasks.length === 0 ? (
                  <p className="workspaces-no-tasks">Sin tareas vinculadas</p>
                ) : (
                  boardTasks.map(task => {
                    const currentProgress = task.progress ?? 0;
                    const isCompleted = currentProgress === 100;

                    return (
                      <div 
                        key={task._id} 
                        className={`workspaces-task-item ${isCompleted ? 'is-completed' : ''}`}
                      >
                        <div className="workspaces-task-row">
                          <span className="workspaces-task-title">{task.title}</span>
                          <button
                            onClick={() => setActiveTaskSliderId(activeTaskSliderId === task._id ? null : task._id)}
                            className="workspaces-btn-percentage"
                          >
                            {currentProgress}%
                          </button>
                        </div>

                        {task.comments && <p className="workspaces-task-comments">💬 {task.comments}</p>}

                        {/* 🎛️ BARRA DESLIZABLE MOVIBLE */}
                        {activeTaskSliderId === task._id && (
                          <div className="workspaces-slider-container">
                            <div className="workspaces-slider-header">
                              <span>Progreso:</span>
                              <strong>{currentProgress}%</strong>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="100" 
                              step="25" 
                              value={currentProgress} 
                              onChange={(e) => handleProgressChange(task._id, e.target.value)}
                              className="workspaces-range-input"
                            />
                            <div className="workspaces-slider-labels">
                              <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ➕ MODAL: CREAR TABLERO */}
      {isCreateModalOpen && (
        <div className="workspaces-modal-backdrop">
          <form onSubmit={handleCreateBoard} className="workspaces-modal-form">
            <h3>Crear Nuevo Tablero</h3>
            
            <div className="workspaces-modal-form-group workspaces-form-group">
              <label>Nombre del Tablero</label>
              <input type="text" placeholder="ej: Proyecto de Diseño" value={createFormData.name} onChange={e => setCreateFormData({...createFormData, name: e.target.value})} required />
            </div>

            <div className="workspaces-modal-form-group workspaces-form-group">
              <label>Descripción</label>
              <input type="text" placeholder="Breve descripción..." value={createFormData.description} onChange={e => setCreateFormData({...createFormData, description: e.target.value})} />
            </div>

            <div className="workspaces-modal-form-group workspaces-form-group">
              <label>Color Identificador</label>
              <div className="workspaces-color-picker-row">
                <input type="color" value={createFormData.color} onChange={e => setCreateFormData({...createFormData, color: e.target.value})} className="workspaces-color-input" />
                <span className="workspaces-color-hex">{createFormData.color.toUpperCase()}</span>
              </div>
            </div>

            <div className="workspaces-modal-actions">
              <button type="submit" className="workspaces-btn-submit">Crear</button>
              <button type="button" onClick={() => setIsCreateModalOpen(false)} className="workspaces-btn-cancel">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* ✏️ MODAL: EDITAR TABLERO */}
      {editingBoard && (
        <div className="workspaces-modal-backdrop">
          <form onSubmit={handleSaveBoardEdit} className="workspaces-modal-form">
            <h3>Ajustes del Tablero</h3>
            
            <div className="workspaces-modal-form-group workspaces-form-group">
              <label>Nombre del Proyecto</label>
              <input type="text" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} required />
            </div>

            <div className="workspaces-modal-form-group workspaces-form-group">
              <label>Descripción</label>
              <input type="text" value={editFormData.description} onChange={e => setEditFormData({...editFormData, description: e.target.value})} />
            </div>

            <div className="workspaces-modal-form-group workspaces-form-group">
              <label>Color de Identificación</label>
              <div className="workspaces-color-picker-row">
                <input type="color" value={editFormData.color} onChange={e => setEditFormData({...editFormData, color: e.target.value})} className="workspaces-color-input" />
                <span className="workspaces-color-hex">{editFormData.color.toUpperCase()}</span>
              </div>
            </div>

            <div className="workspaces-modal-actions">
              <button type="submit" className="workspaces-btn-submit">Guardar</button>
              <button type="button" onClick={() => setEditingBoard(null)} className="workspaces-btn-cancel">Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default WorkspacesView;