import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TaskForm from '../../components/TaskForm/TaskForm';
import { useAuth } from "../../context/AuthContext";
import { getTasks, createTask, updateTask, deleteTask } from '../../services/api';
import { usePomodoro } from "../../hooks/usePomodoro";
import KanbanHeader from "../../components/Dashboard/KanbanHeader";
import KanbanColumn from "../../components/Dashboard/KanbanColumn";
import PomodoroWidget from "../../components/Dashboard/PomodoroWidget";
import ActivitySidebar from "../../components/Dashboard/ActivitySidebar";
import confetti from "canvas-confetti";
import "./Dashboard.css";

const Dashboard = () => {
  const { token, user } = useAuth();
  const { boardId } = useParams();

  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showHistory, setShowHistory] = useState(false);
  const [activityLog, setActivityLog] = useState(() => {
    const savedLog = localStorage.getItem("kanban_activity_log");
    return savedLog ? JSON.parse(savedLog) : [];
  });

  // Logs e Historial
  useEffect(() => {
    localStorage.setItem("kanban_activity_log", JSON.stringify(activityLog));
  }, [activityLog]);

  const logActivity = (actionText) => {
    const time = new Date().toLocaleTimeString(["en-US"], { hour: "2-digit", minute: "2-digit" });
    setActivityLog((prev) => [{ id: Date.now(), text: actionText, time }, ...prev].slice(0, 15));
  };

  // Integración del Custom Hook de Pomodoro
  const pomodoro = usePomodoro(logActivity);

  // --- API OPERATIONS ---
  const loadTasks = async () => {
    if (!token) return;
    try {
      const res = await getTasks(token);
      setTasks(Array.isArray(res) ? res : res?.tasks || []);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  useEffect(() => { loadTasks(); }, [token, boardId]);

  const handleSubmitTask = async (taskData) => {
    try {
      if (taskToEdit) {
        await updateTask(token, taskToEdit._id, taskData);
        logActivity(`Edited task: "${taskData.title}"`);
        setTaskToEdit(null);
      } else {
        await createTask(token, { ...taskData, board: boardId });
        logActivity(`Created task: "${taskData.title}"`);
      }
      loadTasks();
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(token, id);
      logActivity(`Deleted a task`);
      loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // --- DRAG AND DROP ---
  const handleDragOver = (ev, columnStatus) => {
    ev.preventDefault();
    if (activeColumn !== columnStatus) setActiveColumn(columnStatus);
  };

  const handleDragLeave = () => setActiveColumn(null);

  const handleDrop = async (ev, newStatus) => {
    ev.preventDefault();
    setActiveColumn(null);
    const taskId = ev.dataTransfer.getData("text/plain");
    if (!taskId) return;

    const taskToUpdate = tasks.find((t) => t._id === taskId);
    if (!taskToUpdate || taskToUpdate.status === newStatus) return;

    if (newStatus === "completed" || newStatus === "done") {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.65 }, colors: ["#8b5cf6", "#a78bfa", "#6366f1", "#ffffff"] });
    }

    logActivity(`Moved "${taskToUpdate.title}" to "${newStatus}"`);
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));

    try {
      await updateTask(token, taskId, { ...taskToUpdate, status: newStatus });
    } catch (error) {
      loadTasks();
    }
  };

  // Clasificación de tareas y progreso
  const validTasks = Array.isArray(tasks) ? tasks : [];
  const columnsData = [
    { title: "Pending", type: "pending", filterType: "pending", tasks: validTasks.filter(t => t.status === "pending" || t.status === "todo" || !t.status) },
    { title: "In Progress", type: "in progress", filterType: "in-progress", tasks: validTasks.filter(t => t.status === "in progress") },
    { title: "Completed", type: "completed", filterType: "completed", tasks: validTasks.filter(t => t.status === "completed" || t.status === "done") }
  ];

  const completedCount = columnsData[2].tasks.length;
  const progressPercentage = validTasks.length > 0 ? Math.round((completedCount / validTasks.length) * 100) : 0;

  // --- RENDER ---
  return (
    <div className="kanban-wrapper">
      <KanbanHeader 
        user={user} showHistory={showHistory} setShowHistory={setShowHistory}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter} progressPercentage={progressPercentage}
      />

      <div className="kanban-content">
        <aside className="kanban-sidebar">
          <div className="sidebar-card">
            <h3>{taskToEdit ? "Edit Task" : "New Task"}</h3>
            <TaskForm onSubmitTask={handleSubmitTask} taskToEdit={taskToEdit} clearTaskToEdit={() => setTaskToEdit(null)} />
          </div>
        </aside>

        <main className="kanban-columns-container">
          {columnsData.map(col => (
            <KanbanColumn
              key={col.type} title={col.title} type={col.type} filterType={col.filterType} tasks={col.tasks}
              activeColumn={activeColumn} statusFilter={statusFilter}
              onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              onEdit={setTaskToEdit} onDelete={handleDeleteTask} onStartPomodoro={pomodoro.startPomodoro}
            />
          ))}
        </main>
      </div>

      <PomodoroWidget {...pomodoro} />
      <ActivitySidebar showHistory={showHistory} setShowHistory={setShowHistory} activityLog={activityLog} />
    </div>
  );
};

export default Dashboard;