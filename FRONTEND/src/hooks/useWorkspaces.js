import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

export const useWorkspaces = (token) => {
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);

  const loadData = () => {
    if (!token) return;
    fetch("http://localhost:8080/boards", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setBoards(Array.isArray(data) ? data : data.boards || []))
      .catch((err) => console.error("Error loading boards:", err));

    fetch("http://localhost:8080/tasks", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setTasks(Array.isArray(data) ? data : data.tasks || []))
      .catch((err) => console.error("Error loading tasks:", err));
  };

  useEffect(() => { loadData(); }, [token]);

  const handleCreateBoard = async (formData) => {
    try {
      const res = await fetch("http://localhost:8080/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsCreateModalOpen(false);
        loadData();
      }
    } catch (err) { console.error("Error creating board:", err); }
  };

  const handleDeleteBoard = async (id) => {
    if (!window.confirm("Are you sure you want to delete this board?")) return;
    try {
      const res = await fetch(`http://localhost:8080/boards/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) loadData();
    } catch (err) { console.error("Error deleting board:", err); }
  };

  const handleSaveBoardEdit = async (id, formData) => {
    try {
      const res = await fetch(`http://localhost:8080/boards/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setEditingBoard(null);
        loadData();
      }
    } catch (err) { console.error("Error editing board:", err); }
  };

  const handleProgressChange = async (taskId, newProgressValue) => {
    const progressNum = parseInt(newProgressValue, 10);
    if (progressNum === 100) confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, progress: progressNum } : t));

    try {
      await fetch(`http://localhost:8080/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ progress: progressNum })
      });
    } catch (err) { console.error("Error updating progress:", err); }
  };

  const filteredBoards = boards.filter(board => 
    board.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (board.description && board.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return {
    tasks,
    searchTerm,
    setSearchTerm,
    isCreateModalOpen,
    setIsCreateModalOpen,
    editingBoard,
    setEditingBoard,
    filteredBoards,
    handleCreateBoard,
    handleDeleteBoard,
    handleSaveBoardEdit,
    handleProgressChange
  };
};