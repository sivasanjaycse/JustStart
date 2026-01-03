import { useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { getTasks, addTask } from "../api/taskApi";
import TaskCard from "../components/TaskCard";
import TaskTabs from "../components/TaskTabs";
import AddTaskModal from "../components/AddTaskModal";
import { styles } from "../styles/theme";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen({ reloadWallet }) {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("Routine");
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

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
    } catch (err) {
      console.log("Failed to load tasks:", err);
    }
  };

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

  const todayPoints = tasks
    .filter((t) => t.completedToday)
    .reduce((sum, t) => sum + t.rewardPoints, 0);

  const progress = Math.min(todayPoints / 1000, 1);

  useEffect(() => {
    loadTasks();
  }, []);

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
            <View
              style={{ marginHorizontal: 16, marginVertical: 18 }}
            >
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
                {todayPoints} Points
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
                    width: `${progress * 100}%`,
                    backgroundColor: "#C1121F",
                    borderRadius: 4,
                  }}
                />
              </View>
            </View>

            <TaskTabs activeTab={activeTab} onChange={setActiveTab} />
          </View>
        }
        stickyHeaderIndices={[0]}
        contentContainerStyle={{ paddingBottom: 90 }}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addText}>＋ Add Task</Text>
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
