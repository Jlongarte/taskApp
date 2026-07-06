const API_URL = "http://localhost:8080";

//USERS
const registerUser = async (formData) => {
  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    body: formData,
  });
  return res.json();
};

const loginUser = async (userData) => {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return res.json();
};

const getUserProfile = async (token) => {
  const res = await fetch(`${API_URL}/users/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

const updateUserName = async (token, username) => {
  const res = await fetch(`${API_URL}/users/name`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username }),
  });
  return res.json();
};

const updatePassword = async (token, currentPassword, newPassword) => {
  const res = await fetch(`${API_URL}/users/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return res.json();
};

const updateAvatar = async (token, formdata) => {
  const res = await fetch(`${API_URL}/users/avatar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formdata,
  });
  return res.json();
};

//TASKS

// 🌍 getTasks debe apuntar a tu ruta general de tareas
const getTasks = async (token) => {
  const response = await fetch(`http://localhost:8080/tasks`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

// ➕ createTask debe hacer el POST a la ruta raíz de tareas
const createTask = async (token, taskData) => {
  const response = await fetch(`http://localhost:8080/tasks`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(taskData) // Aquí ya viajan title, date, status, comments y board
  });
  return response.json();
};

const updateTask = async (token, id, taskData) => {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });
  return res.json();
};

const deleteTask = async (token, id) => {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserName,
  updatePassword,
  updateAvatar,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
