
import { useState, useEffect } from "react";

export const usePomodoro = (logActivity) => {
  const [activePomodoro, setActivePomodoro] = useState(null);
  const [pomodoroTime, setPomodoroTime] = useState(1500);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (activePomodoro) {
      document.title = isTimerRunning ? `⏱️ (${formatTime(pomodoroTime)}) Kanban` : `⏸️ (Paused) Kanban`;
    } else {
      document.title = "Kanban Dashboard";
    }

    if (isTimerRunning && pomodoroTime > 0) {
      interval = setInterval(() => setPomodoroTime((prev) => prev - 1), 1000);
    } else if (pomodoroTime === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      
      alert(`🎉 Focus session completed for: "${activePomodoro?.title}"!`);
      logActivity(`⏱️ Completed a Pomodoro focus session`);
      setActivePomodoro(null);
      setPomodoroTime(1500);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroTime, activePomodoro]);

 const startPomodoro = (task) => {
  
  if (activePomodoro && activePomodoro._id === task._id) {
    setIsTimerRunning((prev) => !prev);
    logActivity(isTimerRunning ? `⏸️ Paused focus on: "${task.title}"` : `⏰ Resumed focus on: "${task.title}"`);
  } else {
    
    setActivePomodoro(task);
    setPomodoroTime(1500); // 25 minutos
    setIsTimerRunning(true);
    logActivity(`⏰ Started focus on: "${task.title}"`);
  }
};
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return { activePomodoro, pomodoroTime, isTimerRunning, setIsTimerRunning, startPomodoro, formatTime, setActivePomodoro };
};