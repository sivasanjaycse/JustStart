import { useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { getTasks, addTask } from "../api/taskApi";
import TaskCard from "../components/TaskCard";
import TaskTabs from "../components/TaskTabs";
import AddTaskModal from "../components/AddTaskModal";
import AppHeader from "../components/AppHeader";
import { styles } from "../styles/theme";

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("Routine");
  const [modalVisible, setModalVisible] = useState(false);

  const [form, setForm] = useState({
    name: "",
    rewardPoints: "",
    taskType: "Routine",
    date: new Date(),
    showDatePicker: false,
    showTimePicker: false,
  });

  const setState = (v) => setForm((p) => ({ ...p, ...v }));

  const loadTasks = async () => setTasks(await getTasks());

  const saveTask = async () => {
    await addTask({
      name: form.name,
      rewardPoints: Number(form.rewardPoints),
      endingTime: form.date.toISOString(),
      taskType: form.taskType,
    });
    setModalVisible(false);
    loadTasks();
  };
  const visibleTasks = tasks.filter((t) => {
    if (t.taskType !== activeTab) return false;
    if (t.taskType === "Routine" && t.completedToday) return false;
    return true;
  });

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
            <AppHeader />
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
