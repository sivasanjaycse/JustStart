import { useEffect, useState, useCallback } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getTasks,
  addTask,
  getCompletedByDate,
  DAILY_GOAL,
} from "../store/DataStore";
import TaskCard from "../components/TaskCard";
import TaskTabs from "../components/TaskTabs";
import AddTaskModal from "../components/AddTaskModal";
import { styles, COLORS } from "../styles/theme";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ reloadWallet }) {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("Routine");
  const [modalVisible, setModalVisible] = useState(false);
  const [tdyPoints, setTdyPoints] = useState(0);

  const [form, setForm] = useState({
    name: "",
    rewardPoints: "",
    taskType: "Routine",
    date: new Date(),
    showDatePicker: false,
    showTimePicker: false,
    hasDeadline: false,
    isHourly: false,
    hourlyRate: "",
  });

  const setFormState = (v) => setForm((p) => ({ ...p, ...v }));

  const loadTasks = async () => {
    try {
      const taskData = await getTasks();
      setTasks(taskData);
      reloadWallet && reloadWallet();
      loadTodayProgress();
    } catch (err) {
      console.log("Failed to load tasks:", err);
    }
  };

  const loadTodayProgress = async () => {
    try {
      const now = new Date();
      const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
      const today = ist.toISOString().slice(0, 10);
      const res = await getCompletedByDate(today);
      setTdyPoints(res.totalPoints || 0);
    } catch (e) {
      console.log("Failed to load today's progress", e);
      setTdyPoints(0);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
      loadTodayProgress();
    }, [])
  );

  useEffect(() => {
    loadTasks();
    loadTodayProgress();
  }, []);

  const saveTask = async () => {
    const taskData = {
      name: form.name,
      rewardPoints: form.isHourly ? 0 : Number(form.rewardPoints),
      endingTime: form.hasDeadline ? form.date.toISOString() : null,
      taskType: form.taskType,
      hasDeadline: form.hasDeadline,
      isHourly: form.isHourly,
      hourlyRate: form.isHourly ? Number(form.hourlyRate) : 0,
    };
    await addTask(taskData);
    setModalVisible(false);
    setForm({
      name: "",
      rewardPoints: "",
      taskType: "Routine",
      date: new Date(),
      showDatePicker: false,
      showTimePicker: false,
      hasDeadline: false,
      isHourly: false,
      hourlyRate: "",
    });
    loadTasks();
    reloadWallet && reloadWallet();
  };

  const visibleTasks = tasks.filter((t) => {
    if (t.taskType !== activeTab) return false;
    if (t.taskType === "Routine" && t.completedToday) return false;
    return true;
  });

  const GOAL = DAILY_GOAL;
  const progress = Math.min(tdyPoints / GOAL, 1);
  const excessPoints = tdyPoints > GOAL ? tdyPoints - GOAL : 0;
  const isGoalReached = tdyPoints >= GOAL;

  return (
    <View style={styles.container}>
      <FlatList
        data={visibleTasks}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <TaskCard task={item} onCompleted={loadTasks} />
        )}
        ListHeaderComponent={
          <View style={{ backgroundColor: COLORS.bg, paddingBottom: 6 }}>
            {/* ── Modern Hero Progress Widget ── */}
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 20,
                padding: 18,
                marginTop: 6,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: COLORS.cardBorder,
                shadowColor: COLORS.shadow,
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 3,
              }}
            >
              {/* Header Row */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: isGoalReached ? COLORS.surface : COLORS.surfaceAlt,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons
                      name={isGoalReached ? "trophy" : "flag"}
                      size={16}
                      color={isGoalReached ? COLORS.primary : COLORS.textSecondary}
                    />
                  </View>
                  <Text
                    style={{
                      color: COLORS.text,
                      fontSize: 15,
                      fontWeight: "700",
                      letterSpacing: -0.2,
                    }}
                  >
                    Today's Target
                  </Text>
                </View>

                {/* Status Badge */}
                <View
                  style={{
                    backgroundColor: isGoalReached ? COLORS.surface : COLORS.surfaceAlt,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: isGoalReached ? COLORS.accentLight : COLORS.border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      color: isGoalReached ? COLORS.primaryDark : COLORS.textSecondary,
                    }}
                  >
                    {isGoalReached
                      ? "Goal Reached 🎉"
                      : `${Math.round(progress * 100)}% Completed`}
                  </Text>
                </View>
              </View>

              {/* Point Numbers Row */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "baseline",
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "800",
                    color: isGoalReached ? COLORS.primary : COLORS.text,
                    letterSpacing: -0.5,
                  }}
                >
                  {tdyPoints}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: COLORS.textSecondary,
                    marginLeft: 6,
                  }}
                >
                  / {GOAL} pts
                </Text>
              </View>

              {/* Sleek Progress Bar */}
              <View
                style={{
                  height: 10,
                  backgroundColor: COLORS.surfaceAlt,
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: 10,
                    borderRadius: 6,
                    width: `${progress * 100}%`,
                    backgroundColor: isGoalReached ? COLORS.primaryDark : COLORS.primary,
                  }}
                />
              </View>

              {/* Motivator / Extra Earnings Callout */}
              <View style={{ marginTop: 10 }}>
                {excessPoints > 0 ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      backgroundColor: COLORS.surface,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: COLORS.accentLight,
                    }}
                  >
                    <Ionicons name="sparkles" size={14} color={COLORS.primary} />
                    <Text
                      style={{
                        color: COLORS.primaryDark,
                        fontWeight: "700",
                        fontSize: 12,
                      }}
                    >
                      Bonus Earned: +{excessPoints} pts directly added to wallet!
                    </Text>
                  </View>
                ) : isGoalReached ? (
                  <Text
                    style={{
                      color: COLORS.primaryDark,
                      fontWeight: "600",
                      fontSize: 12,
                    }}
                  >
                    🎉 Daily goal met! Every additional point now earns wallet balance.
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: COLORS.textSecondary,
                      fontSize: 12,
                      fontWeight: "500",
                    }}
                  >
                    🎯 {GOAL - tdyPoints} pts remaining to hit goal and earn rewards.
                  </Text>
                )}
              </View>
            </View>

            {/* Sub-tabs: Routine vs One-Time */}
            <TaskTabs activeTab={activeTab} onChange={setActiveTab} />
          </View>
        }
        ListEmptyComponent={
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 48,
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 20,
                backgroundColor: COLORS.surfaceAlt,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Ionicons
                name={activeTab === "Routine" ? "checkmark-done-circle-outline" : "clipboard-outline"}
                size={32}
                color={COLORS.textMuted}
              />
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: COLORS.text,
                marginBottom: 4,
              }}
            >
              {activeTab === "Routine" ? "All Routines Done!" : "No One-Time Tasks"}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: COLORS.textSecondary,
                textAlign: "center",
                maxWidth: 240,
              }}
            >
              {activeTab === "Routine"
                ? "You've finished your daily routines for today. Great discipline!"
                : "Tap the + button below to create a new one-time task."}
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Modern Floating Action Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={30} color={COLORS.white} />
      </TouchableOpacity>

      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={saveTask}
        state={form}
        setState={setFormState}
      />
    </View>
  );
}
