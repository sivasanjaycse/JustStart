import { useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { getTasks, addTask } from "../api/taskApi";
import TaskCard from "../components/TaskCard";
import TaskTabs from "../components/TaskTabs";
import AddTaskModal from "../components/AddTaskModal";
import { styles } from "../styles/theme";
import { getCompletedByDate } from "../api/completedApi";

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
  });

  const setState = (v) => setForm((p) => ({ ...p, ...v }));

  const loadTasks = async () => {
    try {
      const taskData = await getTasks();
      setTasks(taskData);
      reloadWallet && reloadWallet();
      loadTodayProgress(); // ✅ ADD THIS
    } catch (err) {
      console.log("Failed to load tasks:", err);
    }
  };
  const loadTodayProgress = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const res = await getCompletedByDate(today);
      setTdyPoints(res.totalPoints || 0);
    } catch (e) {
      console.log("Failed to load today's progress", e);
      setTdyPoints(0);
    }
  };
  useEffect(() => {
    loadTasks();
    loadTodayProgress();
  }, []);

  const saveTask = async () => {
    await addTask({
      name: form.name,
      rewardPoints: Number(form.rewardPoints),
      endingTime: form.date.toISOString(),
      taskType: form.taskType,
    });
    setModalVisible(false);
    loadTasks();
    reloadWallet();
  };
  const visibleTasks = tasks.filter((t) => {
    if (t.taskType !== activeTab) return false;
    if (t.taskType === "Routine" && t.completedToday) return false;
    return true;
  });

  const progress = Math.min(tdyPoints / 1000, 1);
  const cappedPoints = Math.min(tdyPoints, 3000);

  const cycle = Math.floor(cappedPoints / 1000); // 0,1,2,3
  const remainder = cappedPoints >= 3000 ? 1000 : cappedPoints % 1000;

  const fillRatio = remainder / 1000;
  const cycleColors = [
    "#1A1A1A", // 0 cycles → empty / graphite
    "#C1121F", // 1st 1000 → crimson
    "#B11226", // 2nd 1000 → inferno red (glowy)
    "#7A1020", // 3rd 1000 → ember wine glow
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={visibleTasks}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <TaskCard task={item} onCompleted={loadTasks} />
        )}
        ListHeaderComponent={
          <View style={{ backgroundColor: "#0B0507" }}>
            <View style={{ marginHorizontal: 16, marginVertical: 18 }}>
              <Text
                style={{
                  color: "#F5F5F5",
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: "600",
                  marginBottom: 10,
                  letterSpacing: 0.5,
                }}
              >
                Today’s Progress
              </Text>

              <Text style={{ color: "#DADADA", marginBottom: 6 }}>
                {tdyPoints} Points
              </Text>

              <View
                style={{
                  height: 8,
                  backgroundColor: "#1A1A1A",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: 8,
                    borderRadius: 4,
                    overflow: "hidden",
                    backgroundColor: cycleColors[cycle], // 👈 previous cycle color
                  }}
                >
                  {cycle < 3 && (
                    <View
                      style={{
                        height: 8,
                        width: `${fillRatio * 100}%`,
                        backgroundColor: cycleColors[cycle + 1], // 👈 current cycle color
                      }}
                    />
                  )}
                </View>
              </View>
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
        setState={setState}
      />
    </View>
  );
}
