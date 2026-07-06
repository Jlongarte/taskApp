import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // 👈 1. Importamos useParams
import confetti from "canvas-confetti";
import TaskForm from "../components/TaskForm/TaskForm";
import TaskList from "../components/TaskLists/TaskList";
import { useAuth } from "../context/AuthContext";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  // 👤 Consumimos los datos de autenticación directamente del contexto
  const { token, user } = useAuth();
  
  // 🎯 2. Capturamos el boardId de la URL dinámica (/dashboard/:boardId)
  const { boardId } = useParams();

  // 📦 Estados locales del tablero
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  // 📜 Estados para el Historial de Actividad (Persistente en LocalStorage)
  const [showHistory, setShowHistory] = useState(false);
  const [activityLog, setActivityLog] = useState(() => {
    const savedLog = localStorage.getItem("kanban_activity_log");
    return savedLog ? JSON.parse(savedLog) : [];
  });

  // ⏱️ Estados para el Temporizador Pomodoro Flotante
  const [activePomodoro, setActivePomodoro] = useState(null);
  const [pomodoroTime, setPomodoroTime] = useState(1500); // 25 minutos
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // 💾 Auto-guardado de logs del historial
  useEffect(() => {
    localStorage.setItem("kanban_activity_log", JSON.stringify(activityLog));
  }, [activityLog]);

  // 📜 Grabador de Logs de Actividad en Inglés e Internacional
  const logActivity = (actionText) => {
    const time = new Date().toLocaleTimeString(["en-US"], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setActivityLog((prev) =>
      [{ id: Date.now(), text: actionText, time }, ...prev].slice(0, 15),
    );
  };

  // ⏱️ Efecto Avanzado del Reloj Pomodoro (Sincronizado con el título de la pestaña)
  useEffect(() => {
    let interval = null;

    if (activePomodoro) {
      document.title = isTimerRunning
        ? `⏱️ (${formatTime(pomodoroTime)}) Kanban`
        : `⏸️ (Paused) Kanban`;
    } else {
      document.title = "Kanban Dashboard";
    }

    if (isTimerRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroTime === 0 && isTimerRunning) {
      setIsTimerRunning(false);

      // 🔊 Alarma de Audio Nativa (Web Audio API)
      try {
        const audioCtx = new (
          window.AudioContext || window.webkitAudioContext
        )();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
         oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.8);
      } catch (e) {
        console.log("Audio contexts blocked or not supported by browser");
      }

      alert(
        `🎉 Focus session completed for: "${activePomodoro?.title}"! Take a well-deserved short break.`,
      );
      logActivity(`⏱️ Completed a Pomodoro focus session`);
      setActivePomodoro(null);
      setPomodoroTime(1500);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroTime, activePomodoro]);

  const startPomodoro = (task) => {
    setActivePomodoro(task);
    setPomodoroTime(1500);
    setIsTimerRunning(true);
    logActivity(`⏱️ Started focus on: "${task.title}"`);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

 const loadTasks = async () => {
  if (!token) return; 
  try {
    // 🌍 Volvemos a pedir las tareas globales de tu usuario
    const res = await getTasks(token); 
    if (Array.isArray(res)) {
      setTasks(res);
    } else if (res && Array.isArray(res.tasks)) {
      setTasks(res.tasks);
    }
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
};

  // 4. Agregamos boardId como dependencia para recargar automáticamente si el usuario cambia de tablero
  useEffect(() => {
    loadTasks();
  }, [token, boardId]); 

  // ➕/📝 CONTROLADOR DEL FORMULARIO: Crea o Edita en Base de Datos
  const handleSubmitTask = async (taskData) => {
    try {
      if (taskToEdit) {
        const res = await updateTask(token, taskToEdit._id, taskData);
        if (res) {
          logActivity(`📝 Edited task: "${taskData.title}"`);
          setTaskToEdit(null);
          loadTasks();
        }
      } else {
        // 👈 5. SÚPER IMPORTANTE: Al crear una tarea inyectamos el boardId para que sepa a qué tablero pertenece
        const taskWithBoard = { ...taskData, board: boardId };
        const res = await createTask(token, taskWithBoard); 
        if (res) {
          logActivity(`➕ Created task: "${taskData.title}"`);
          loadTasks();
        }
      }
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  // 🗑️ CONTROLADOR PARA BORRAR TAREAS
  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(token, id);
      logActivity(`❌ Deleted a task`);
      loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // 🧲 LÓGICA DRAG & DROP
  const handleDragOver = (ev, columnStatus) => {
    ev.preventDefault();
    if (activeColumn !== columnStatus) {
      setActiveColumn(columnStatus);
    }
  };

  const handleDragLeave = () => {
    setActiveColumn(null);
  };

  const handleDrop = async (ev, newStatus) => {
    ev.preventDefault();
    setActiveColumn(null);

    const taskId = ev.dataTransfer.getData("text/plain");
    if (!taskId) return;

    const taskToUpdate = tasks.find((t) => t._id === taskId);
    if (!taskToUpdate || taskToUpdate.status === newStatus) return;

    // 🎉 EFECTO CONFETI
    if (newStatus === "completed" || newStatus === "done") {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.65 },
        colors: ["#8b5cf6", "#a78bfa", "#6366f1", "#ffffff"],
        ticks: 200,
      });
    }

    logActivity(`⚡ Moved "${taskToUpdate.title}" to "${newStatus}"`);

    // ⚡ Actualización optimista inmediata
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t._id === taskId ? { ...t, status: newStatus } : t,
      ),
    );

    try {
      await updateTask(token, taskId, { ...taskToUpdate, status: newStatus });
    } catch (error) {
      console.error("Error updating task status on server", error);
      loadTasks();
    }
  };

  const validTasks = Array.isArray(tasks) ? tasks : [];
  const pendingTasks = validTasks.filter(
    (t) => t.status === "pending" || t.status === "todo" || !t.status,
  );
  const inProgressTasks = validTasks.filter((t) => t.status === "in progress");
  const completedTasks = validTasks.filter(
    (t) => t.status === "completed" || t.status === "done",
  );

  // 📈 CÁLCULO DE PROGRESO GLOBAL
  const totalTasksCount = validTasks.length;
  const completedTasksCount = completedTasks.length;
  const progressPercentage =
    totalTasksCount > 0
      ? Math.round((completedTasksCount / totalTasksCount) * 100)
      : 0;

  return (
    <div className="kanban-wrapper">
      <header className="kanban-header">
        <div className="kanban-header-top">
          <div className="kanban-info">
            <h2>Dashboard</h2>
            <span className="user-badge">
              👋 Hola, {user?.username || user?.email || "Developer"}
            </span>
          </div>

          <div className="header-actions">
            <button
              className="history-toggle-btn"
              onClick={() => setShowHistory(!showHistory)}
            >
              📜 History
            </button>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="global-status-select"
            >
              <option value="all">👁️ All Tasks</option>
              <option value="pending">📋 Pending</option>
              <option value="in-progress">⚡ In Progress</option>
              <option value="completed">🎉 Completed</option>
            </select>
          </div>
        </div>

        {/* 📊 BARRA DE PROGRESO DE ALTO RENDIMIENTO */}
        <div className="dashboard-progress-container">
          <div className="progress-labels">
            <span className="progress-text">Tablero Completado</span>
            <span className="progress-number">{progressPercentage}%</span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </header>

      <div className="kanban-content">
        <aside className="kanban-sidebar">
          <div className="sidebar-card">
            <h3>{taskToEdit ? "📝 Edit Task" : "➕ New Task"}</h3>
            <TaskForm
              onSubmitTask={handleSubmitTask}
              taskToEdit={taskToEdit}
              clearTaskToEdit={() => setTaskToEdit(null)}
            />
          </div>
        </aside>

        <main className="kanban-columns-container">
          {/* Columna: Pending */}
          <div
            className={`kanban-column ${activeColumn === "pending" ? "column-drag-hover" : ""} ${
              statusFilter !== "all" && statusFilter !== "pending"
                ? "column-dimmed"
                : ""
            }`}
            onDragOver={(ev) => handleDragOver(ev, "pending")}
            onDragLeave={handleDragLeave}
            onDrop={(ev) => handleDrop(ev, "pending")}
          >
            <div className="column-header">
              <span className="column-dot todo"></span>
              <h3>Pending</h3>
              <span className="task-count">{pendingTasks.length}</span>
            </div>
            <TaskList
              tasks={pendingTasks}
              onEdit={setTaskToEdit}
              onDelete={handleDeleteTask}
              onStartPomodoro={startPomodoro}
            />
          </div>

          {/* Columna: In Progress */}
          <div
            className={`kanban-column ${activeColumn === "in progress" ? "column-drag-hover" : ""} ${
              statusFilter !== "all" && statusFilter !== "in-progress"
                ? "column-dimmed"
                : ""
            }`}
            onDragOver={(ev) => handleDragOver(ev, "in progress")}
            onDragLeave={handleDragLeave}
            onDrop={(ev) => handleDrop(ev, "in progress")}
          >
            <div className="column-header">
              <span className="column-dot doing"></span>
              <h3>In Progress</h3>
              <span className="task-count">{inProgressTasks.length}</span>
            </div>
            <TaskList
              tasks={inProgressTasks}
              onEdit={setTaskToEdit}
              onDelete={handleDeleteTask}
              onStartPomodoro={startPomodoro}
            />
          </div>

          {/* Columna: Completed */}
          <div
            className={`kanban-column ${activeColumn === "completed" ? "column-drag-hover" : ""} ${
              statusFilter !== "all" && statusFilter !== "completed"
                ? "column-dimmed"
                : ""
            }`}
            onDragOver={(ev) => handleDragOver(ev, "completed")}
            onDragLeave={handleDragLeave}
            onDrop={(ev) => handleDrop(ev, "completed")}
          >
            <div className="column-header">
              <span className="column-dot done"></span>
              <h3>Completed</h3>
              <span className="task-count">{completedTasks.length}</span>
            </div>
            <TaskList
              tasks={completedTasks}
              onEdit={setTaskToEdit}
              onDelete={handleDeleteTask}
              onStartPomodoro={startPomodoro}
            />
          </div>
        </main>
      </div>

      {/* ⏱️ WIDGET FLOTANTE DEL TEMPORIZADOR POMODORO */}
      {activePomodoro && (
        <div className="pomodoro-floating-widget">
          <div className="pomodoro-info">
            <span className="pomodoro-dot"></span>
            <p className="pomodoro-task-title">
              Focusing on: <strong>{activePomodoro.title}</strong>
            </p>
          </div>
          <div className="pomodoro-controls">
            <span className="pomodoro-timer">{formatTime(pomodoroTime)}</span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`pomodoro-btn ${isTimerRunning ? "pause" : "play"}`}
            >
              {isTimerRunning ? "⏸️ Pause" : "▶️ Start"}
            </button>
            <button
              onClick={() => {
                setActivePomodoro(null);
                setIsTimerRunning(false);
              }}
              className="pomodoro-btn close"
            >
              ✖️
            </button>
          </div>
        </div>
      )}

      {/* 📜 PANEL LATERAL DESLIZANTE DEL HISTORIAL */}
      <div className={`activity-sidebar ${showHistory ? "open" : ""}`}>
        <div className="sidebar-history-header">
          <h3>Activity History</h3>
          <button
            onClick={() => setShowHistory(false)}
            className="close-history-btn"
          >
            ✖️
          </button>
        </div>
        <div className="sidebar-history-content">
          {activityLog.length === 0 ? (
            <p className="empty-history-text">
              No activity recorded in this session.
            </p>
          ) : (
            <ul className="history-list">
              {activityLog.map((log) => (
                <li key={log.id} className="history-item">
                  <span className="history-time">{log.time}</span>
                  <p className="history-item-text">{log.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;