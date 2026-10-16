// src/store/DataStore.js
// Universal JSON-based local data store — replaces all backend API calls
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

const STORAGE_KEY = "@juststart_data";

// Daily Goal Bound
export const DAILY_GOAL = 750;

// Default data shape
const DEFAULT_DATA = {
  tasks: [],
  completedByDate: {}, // { "2026-10-16": { tasks: [...], totalPoints: 100 } }
  wallet: { permanentPoints: 0 },
  rewards: [],
  transactions: [],
  dailyLog: {}, // { "2026-10-16": { points: 500, settled: false } }
  streak: { current: 0, lastDate: null, negativeStreak: 0, lastNegativeDate: null },
  firstActiveDate: null,
};

let cachedData = null;

// ──────────────── CORE READ / WRITE ────────────────

export const loadData = async () => {
  if (cachedData) return cachedData;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      cachedData = JSON.parse(raw);
      // Merge any missing keys from defaults
      for (const key of Object.keys(DEFAULT_DATA)) {
        if (cachedData[key] === undefined) {
          cachedData[key] = DEFAULT_DATA[key];
        }
      }
      // Ensure streak object has all fields
      if (cachedData.streak) {
        if (cachedData.streak.negativeStreak === undefined) cachedData.streak.negativeStreak = 0;
        if (cachedData.streak.lastNegativeDate === undefined) cachedData.streak.lastNegativeDate = null;
      }
      return cachedData;
    }
  } catch (e) {
    console.log("Failed to load data:", e);
  }
  cachedData = { ...DEFAULT_DATA };
  return cachedData;
};

export const saveData = async (data) => {
  cachedData = data;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.log("Failed to save data:", e);
  }
};

// ──────────────── UTILITY ────────────────

const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const getISTNow = () => {
  const d = new Date();
  const ist = new Date(d.getTime() + 5.5 * 60 * 60 * 1000);
  const dateStr = ist.toISOString().slice(0, 10);
  const hours = ist.getUTCHours();
  const minutes = ist.getUTCMinutes();
  // Daily settlement happens at 11:59 PM IST (23:59)
  const isSettlementTimeOrPast = hours === 23 && minutes >= 59;
  return { dateStr, hours, minutes, isSettlementTimeOrPast };
};

const getISTDateString = (d = new Date()) => {
  const ist = new Date(d.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 10);
};

export const getISTDateStringExport = getISTDateString;

const getISTPreviousDay = (dateStr) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
};

const getDatesBetween = (startDateStr, endDateStr) => {
  const dates = [];
  let current = startDateStr;
  while (current <= endDateStr) {
    dates.push(current);
    const [y, m, d] = current.split("-").map(Number);
    const nextDate = new Date(Date.UTC(y, m - 1, d));
    nextDate.setUTCDate(nextDate.getUTCDate() + 1);
    current = nextDate.toISOString().slice(0, 10);
  }
  return dates;
};

// ──────────────── STREAK MULTIPLIER ────────────────

export const getStreakMultiplier = (currentStreak) => {
  if (currentStreak >= 15) return 2.0;
  if (currentStreak >= 10) return 1.8;
  if (currentStreak >= 5) return 1.3;
  if (currentStreak >= 3) return 1.1;
  return 1.0;
};

export const getStreakMultiplierExport = getStreakMultiplier;

// ──────────────── TASKS ────────────────

export const getTasks = async () => {
  const data = await loadData();
  const today = getISTDateString();
  // Mark routine tasks as completedToday
  return data.tasks.map((t) => {
    if (t.taskType === "Routine") {
      const dayCompleted = data.completedByDate[today];
      const done = dayCompleted?.tasks?.some((ct) => ct.sourceTaskId === t._id);
      return { ...t, completedToday: !!done };
    }
    return t;
  });
};

export const addTask = async (task) => {
  const data = await loadData();
  const newTask = {
    _id: genId(),
    name: task.name,
    rewardPoints: task.rewardPoints,
    endingTime: task.endingTime,
    taskType: task.taskType,
    hasDeadline: task.hasDeadline || false,
    isHourly: task.isHourly || false,
    hourlyRate: task.hourlyRate || 0,
    createdAt: new Date().toISOString(),
  };
  data.tasks.push(newTask);
  await saveData(data);
  return newTask;
};

export const completeTask = async (taskId, hoursWorked = null) => {
  const data = await loadData();
  const task = data.tasks.find((t) => t._id === taskId);
  if (!task) return;

  const today = getISTDateString();
  if (!data.completedByDate[today]) {
    data.completedByDate[today] = { tasks: [], totalPoints: 0 };
  }

  // Calculate points
  let points = task.rewardPoints;
  if (task.isHourly && hoursWorked) {
    points = task.hourlyRate * hoursWorked;
  }

  // Apply streak multiplier (1.1x at 3-day streak, etc.)
  const multiplier = getStreakMultiplier(data.streak.current || 0);
  if (multiplier > 1.0) {
    points = Math.round(points * multiplier);
  }

  const completedEntry = {
    _id: genId(),
    sourceTaskId: task._id,
    name: task.name,
    rewardPoints: points,
    completedAt: new Date().toISOString(),
    taskType: task.taskType,
  };

  data.completedByDate[today].tasks.push(completedEntry);
  data.completedByDate[today].totalPoints += points;

  // Update daily log
  if (!data.dailyLog[today]) {
    data.dailyLog[today] = { points: 0, settled: false };
  }
  data.dailyLog[today].points += points;

  // Remove one-time tasks after completion
  if (task.taskType === "One-Time") {
    data.tasks = data.tasks.filter((t) => t._id !== taskId);
  }

  await saveData(data);
  return completedEntry;
};

export const deleteTask = async (taskId) => {
  const data = await loadData();
  data.tasks = data.tasks.filter((t) => t._id !== taskId);
  await saveData(data);
};

// ──────────────── COMPLETED ────────────────

export const getCompletedByDate = async (dateStr) => {
  const data = await loadData();
  return data.completedByDate[dateStr] || { tasks: [], totalPoints: 0 };
};

// ──────────────── WALLET ────────────────

export const getWallet = async () => {
  const data = await loadData();
  return data.wallet;
};

// ──────────────── REWARDS ────────────────

export const getRewards = async () => {
  const data = await loadData();
  return data.rewards;
};

export const addReward = async (reward) => {
  const data = await loadData();
  const newReward = {
    _id: genId(),
    rewardName: reward.rewardName,
    rewardPoints: reward.rewardPoints,
    rewardPic: reward.rewardPic,
    createdAt: new Date().toISOString(),
  };
  data.rewards.push(newReward);
  await saveData(data);
  return newReward;
};

export const purchaseReward = async (rewardId) => {
  const data = await loadData();
  const reward = data.rewards.find((r) => r._id === rewardId);
  if (!reward) return;

  // Deduct from wallet (allow negative wallet)
  data.wallet.permanentPoints -= reward.rewardPoints;

  // Add transaction
  data.transactions.push({
    _id: genId(),
    rewardName: reward.rewardName,
    rewardPoints: reward.rewardPoints,
    purchasedAt: new Date().toISOString(),
  });

  await saveData(data);
};

// ──────────────── TRANSACTIONS ────────────────

export const getTransactions = async () => {
  const data = await loadData();
  return data.transactions;
};

// ──────────────── DAILY SETTLEMENT (11:59 PM IST) ────────────────

const settleDateInternal = (data, dateStr) => {
  if (!data.dailyLog[dateStr]) {
    const comp = data.completedByDate[dateStr];
    data.dailyLog[dateStr] = {
      points: comp?.totalPoints || 0,
      settled: false,
    };
  }

  const entry = data.dailyLog[dateStr];
  if (entry.settled) return false;

  const points = entry.points || 0;
  const GOAL = DAILY_GOAL;
  const goalMet = points >= GOAL;

  if (goalMet) {
    // Add excess to wallet
    const excess = points - GOAL;
    data.wallet.permanentPoints += excess;

    // Positive streak progression
    const prevDay = getISTPreviousDay(dateStr);
    if (data.streak.lastDate === prevDay) {
      data.streak.current += 1;
    } else if (data.streak.lastDate === dateStr) {
      // already counted
    } else {
      data.streak.current = 1;
    }
    data.streak.lastDate = dateStr;

    // Reset negative streak
    data.streak.negativeStreak = 0;
    data.streak.lastNegativeDate = null;
  } else {
    // Penalty: fixed -10 points (negative wallet allowed)
    data.wallet.permanentPoints -= 10;

    // Reset positive streak
    data.streak.current = 0;
    data.streak.lastDate = null;

    // Update negative streak
    const prevDay = getISTPreviousDay(dateStr);
    if (data.streak.lastNegativeDate === prevDay) {
      data.streak.negativeStreak += 1;
    } else if (data.streak.lastNegativeDate === dateStr) {
      // already counted
    } else {
      data.streak.negativeStreak = 1;
    }
    data.streak.lastNegativeDate = dateStr;

    // Apply negative streak milestones
    const ns = data.streak.negativeStreak;
    if (ns === 3) {
      data.wallet.permanentPoints -= 300;
    } else if (ns === 5) {
      data.wallet.permanentPoints -= 200;
    } else if (ns === 10) {
      data.wallet.permanentPoints -= 1000;
    }
  }

  entry.settled = true;
  return true;
};

// Settle today's points immediately
export const settleDailyPoints = async () => {
  const data = await loadData();
  const { dateStr: today } = getISTNow();
  const settled = settleDateInternal(data, today);
  if (settled) {
    await saveData(data);
  }
  return data;
};

// Check and settle previous unsettled days and today if 11:59 PM IST reached
export const settleUnsettledDays = async () => {
  const data = await loadData();
  const { dateStr: today, isSettlementTimeOrPast } = getISTNow();
  let changed = false;

  // Initialize firstActiveDate if not set
  if (!data.firstActiveDate) {
    data.firstActiveDate = today;
    changed = true;
  }

  // Check past dates between firstActiveDate and yesterday
  const yesterday = getISTPreviousDay(today);
  if (data.firstActiveDate <= yesterday) {
    const pastDates = getDatesBetween(data.firstActiveDate, yesterday);
    for (const dateStr of pastDates) {
      if (settleDateInternal(data, dateStr)) {
        changed = true;
      }
    }
  }

  // Also check any dates present in dailyLog or completedByDate that are before today
  for (const dateStr of Object.keys(data.dailyLog)) {
    if (dateStr < today) {
      if (settleDateInternal(data, dateStr)) {
        changed = true;
      }
    }
  }
  for (const dateStr of Object.keys(data.completedByDate)) {
    if (dateStr < today) {
      if (settleDateInternal(data, dateStr)) {
        changed = true;
      }
    }
  }

  // If today is at or past 11:59 PM IST (23:59), settle today!
  if (isSettlementTimeOrPast) {
    if (settleDateInternal(data, today)) {
      changed = true;
    }
  }

  if (changed) {
    await saveData(data);
  }
  return changed;
};

// ──────────────── ANALYTICS ────────────────

export const getLast7DaysData = async () => {
  const data = await loadData();
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const dateStr = getISTDateString(d);
    const dayLog = data.dailyLog[dateStr];
    const completed = data.completedByDate[dateStr];
    result.push({
      date: dateStr,
      shortDate: d.toLocaleDateString("en-IN", { weekday: "short" }),
      points: dayLog?.points || completed?.totalPoints || 0,
    });
  }
  return result;
};

export const getMonthlyStats = async (year, month) => {
  const data = await loadData();
  let goalAchievedDays = 0;
  let goalMissedDays = 0;
  let totalEarnings = 0;
  let daysWithData = 0;

  const GOAL = DAILY_GOAL;

  for (const [dateStr, entry] of Object.entries(data.dailyLog)) {
    const d = new Date(dateStr + "T00:00:00");
    if (d.getFullYear() === year && d.getMonth() === month) {
      daysWithData++;
      const excess = entry.points > GOAL ? entry.points - GOAL : 0;
      totalEarnings += excess;
      if (entry.points >= GOAL) {
        goalAchievedDays++;
      } else {
        goalMissedDays++;
      }
    }
  }

  // Also check completedByDate for dates not in dailyLog
  for (const [dateStr, entry] of Object.entries(data.completedByDate)) {
    const d = new Date(dateStr + "T00:00:00");
    if (d.getFullYear() === year && d.getMonth() === month && !data.dailyLog[dateStr]) {
      daysWithData++;
      const excess = entry.totalPoints > GOAL ? entry.totalPoints - GOAL : 0;
      totalEarnings += excess;
      if (entry.totalPoints >= GOAL) {
        goalAchievedDays++;
      } else {
        goalMissedDays++;
      }
    }
  }

  return {
    goalAchievedDays,
    goalMissedDays,
    averageDailyEarnings: daysWithData > 0 ? Math.round(totalEarnings / daysWithData) : 0,
    totalEarnings,
  };
};

export const getStreakData = async () => {
  const data = await loadData();
  return {
    current: data.streak.current,
    negativeStreak: data.streak.negativeStreak,
    multiplier: getStreakMultiplier(data.streak.current),
  };
};

// ──────────────── EXPORT / IMPORT (Safe Expo Filesystem) ────────────────

export const exportData = async () => {
  try {
    const data = await loadData();
    const jsonString = JSON.stringify(data, null, 2);
    const fileName = `JustStart_Backup_${getISTDateString()}.json`;
    let filePath = null;

    // Use legacy API which is safe in Expo SDK 54, with fallback to new File API
    if (FileSystem?.documentDirectory && FileSystem?.writeAsStringAsync) {
      filePath = FileSystem.documentDirectory + fileName;
      await FileSystem.writeAsStringAsync(filePath, jsonString);
    } else if (File && Paths?.document) {
      const file = new File(Paths.document, fileName);
      file.write(jsonString);
      filePath = file.uri;
    } else {
      throw new Error("No filesystem API available");
    }

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: "application/json",
        dialogTitle: "Export JustStart Data",
        UTI: "public.json",
      });
    }
    return true;
  } catch (e) {
    console.log("Export failed:", e);
    return false;
  }
};

export const importData = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/json",
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return false;
    }

    const fileUri = result.assets[0].uri;
    let content = null;

    if (FileSystem?.readAsStringAsync) {
      content = await FileSystem.readAsStringAsync(fileUri);
    } else if (File) {
      const file = new File(fileUri);
      content = await file.text();
    } else {
      throw new Error("No filesystem API available");
    }

    const parsed = JSON.parse(content);

    // Validate structure
    if (!parsed || typeof parsed !== "object" || !parsed.tasks || !parsed.wallet) {
      throw new Error("Invalid data format");
    }

    // Merge defaults for missing keys
    for (const key of Object.keys(DEFAULT_DATA)) {
      if (parsed[key] === undefined) {
        parsed[key] = DEFAULT_DATA[key];
      }
    }

    cachedData = parsed;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    return true;
  } catch (e) {
    console.log("Import failed:", e);
    return false;
  }
};

// ──────────────── CLEAR DATA ────────────────

export const clearAllData = async () => {
  cachedData = { ...DEFAULT_DATA };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cachedData));
};
