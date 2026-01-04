import axios from "axios";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export const getTransactions = async () => {
  const res = await axios.get(`${API_BASE}/transactions`);
  return res.data;
};
