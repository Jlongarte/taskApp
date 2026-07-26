const API_URL = "https://taskapp-6gsr.onrender.com";

// USERS
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
      
      Authorization: `Bearer ${token}`,
    },
    body: formdata,
  });
  return res.json();
};

// TASKS 
const getTasks = async (token) => {
  const response = await fetch(`${API_URL}/tasks`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

const createTask = async (token, taskData) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(taskData)
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