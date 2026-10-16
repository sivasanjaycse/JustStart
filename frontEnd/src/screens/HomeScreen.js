import { useEffect, useState, useCallback } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { getTasks, addTask, getCompletedByDate, getStreakMultiplierExport, DAILY_GOAL } from "../store/DataStore";
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

  return (
    <View style={styles.container}>
      <FlatList
        data={visibleTasks}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <TaskCard task={item} onCompleted={loadTasks} />
        )}
        ListHeaderComponent={
          <View style={{ backgroundColor: COLORS.bg }}>
            <View style={{ marginHorizontal: 8, marginVertical: 18 }}>
              {/* Left-aligned Today's Progress */}
              <Text
                style={{
                  color: COLORS.text,
                  textAlign: "left",
                  fontSize: 18,
                  fontWeight: "700",
                  marginBottom: 4,
                  letterSpacing: 0.3,
                }}
              >
                Today's Progress
              </Text>

              {/* Left-aligned Points counter */}
              <Text
                style={{
                  color: COLORS.textSecondary,
                  marginBottom: 8,
                  textAlign: "left",
                  fontSize: 14,
                  fontWeight: "500",
                }}
              >
                {tdyPoints} / {GOAL} Points
              </Text>

              {/* Progress Bar */}
              <View
                style={{
                  height: 10,
                  backgroundColor: COLORS.accentLight,
                  borderRadius: 5,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: 10,
                    borderRadius: 5,
                    width: `${progress * 100}%`,
                    backgroundColor: tdyPoints >= GOAL ? COLORS.primaryDark : COLORS.primary,
                  }}
                />
              </View>

              {/* Today Earnings (show excess if above 1000) */}
              {excessPoints > 0 && (
                <Text
                  style={{
                    color: COLORS.primary,
                    textAlign: "left",
                    marginTop: 6,
                    fontWeight: "600",
                    fontSize: 13,
                  }}
                >
                  Today Earnings: +{excessPoints}
                </Text>
              )}
            </View>

            <TaskTabs activeTab={activeTab} onChange={setActiveTab} />
          </View>
        }
        stickyHeaderIndices={[0]}
        contentContainerStyle={{ paddingBottom: 90 }}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <View>
          <Text style={styles.addText}>+</Text>
        </View>
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
