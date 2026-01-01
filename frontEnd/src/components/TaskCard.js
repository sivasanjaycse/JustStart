import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { styles } from "../styles/theme";
import { formatDateTime } from "../utils/dateUtils";
import { completeTask } from "../api/taskApi";

export default function TaskCard({ task, onCompleted }) {
  const [confirm, setConfirm] = useState(false);
  const isRoutine = task.taskType === "Routine";

  const handlePress = async () => {
    if (!confirm) {
      setConfirm(true);
    } else {
      await completeTask(task._id);
      onCompleted && onCompleted(); // trigger refetch
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.taskName}>{task.name}</Text>

      {!isRoutine && (
        <Text style={styles.subText}>
          Ends: {formatDateTime(task.endingTime)}
        </Text>
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.points}>🎯 {task.rewardPoints} Points</Text>

        <TouchableOpacity onPress={handlePress}>
          <Text style={{ color: "#ff4d6d", fontWeight: "600" }}>
            {confirm ? "Confirm" : "Done"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
