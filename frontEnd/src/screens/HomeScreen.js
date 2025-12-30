import { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { getTasks, addTask } from "../api/taskApi";
import TaskCard from "../components/TaskCard";
import TaskTabs from "../components/TaskTabs";
import AddTaskModal from "../components/AddTaskModal";
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
    showTimePicker: false
  });

  const setState = (v) => setForm((p) => ({ ...p, ...v }));

  const loadTasks = async () => setTasks(await getTasks());

  const saveTask = async () => {
    console.log("SAVE CLICKED");
    await addTask({
      name: form.name,
      rewardPoints: Number(form.rewardPoints),
      endingTime: form.date.toISOString(),
      taskType: form.taskType
    });
    setModalVisible(false);
    loadTasks();
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tasks</Text>

      <TaskTabs activeTab={activeTab} onChange={setActiveTab} />

      <FlatList
        data={tasks.filter(t => t.taskType === activeTab)}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => <TaskCard task={item} />}
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
