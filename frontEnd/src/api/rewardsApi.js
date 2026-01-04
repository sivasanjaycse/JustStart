import axios from "axios";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export const getRewards = async () => {
  const res = await axios.get(`${API_BASE}/rewards`);
  return res.data;
};

export const purchaseReward = async (rewardId) => {
  console.log("Purchase Called");
  console.log(rewardId);
  const res = await axios.post(`${API_BASE}/rewards/${rewardId}/purchase`);
  return res.data;
};

export const addReward = async (reward) => {
  const res = await axios.post(`${API_BASE}/rewards`, reward);
  return res.data;
};
