import axios from "axios";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export const getTasks = async () => {
  const res = await axios.get(`${API_BASE}/tasks`);
  return res.data;
};

export const addTask = async (task) => {
  const res = await axios.post(`${API_BASE}/tasks`, task);
  return res.data;
};

export const completeTask = async (taskId) => {
  const res = await axios.post(`${API_BASE}/tasks/${taskId}/complete`);
  return res.data;
};
