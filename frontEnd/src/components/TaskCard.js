import { View, Text } from "react-native";
import { styles } from "../styles/theme";
import { formatDateTime } from "../utils/dateUtils";

export default function TaskCard({ task }) {
  const isRoutine = task.taskType === "Routine";

  return (
    <View style={styles.card}>
      <Text style={styles.taskName}>{task.name}</Text>

      {!isRoutine && (
        <Text style={styles.subText}>
          Ends: {formatDateTime(task.endingTime)}
        </Text>
      )}

      <Text style={styles.points}>🎯 {task.rewardPoints} Points</Text>
    </View>
  );
}
