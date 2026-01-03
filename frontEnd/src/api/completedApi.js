import axios from "axios";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export const getCompletedByDate = async (date) => {
  const res = await axios.get(`${API_BASE}/completed?date=${date}`);
  return res.data;
};
