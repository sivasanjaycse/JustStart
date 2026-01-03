// ../api/walletApi.js
import axios from "axios";
const API_BASE = process.env.EXPO_PUBLIC_API_URL;
export const getWallet = async () => {
  const res = await axios.get(`${API_BASE}/wallet`);
  return res.data;
};
