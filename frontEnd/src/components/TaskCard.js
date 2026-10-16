import { View, Text, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { styles, COLORS } from "../styles/theme";
import { formatDateTime } from "../utils/dateUtils";
import { completeTask, deleteTask } from "../store/DataStore";

export default function TaskCard({ task, onCompleted }) {
  const [confirm, setConfirm] = useState(false);
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [hours, setHours] = useState("");
  const isRoutine = task.taskType === "Routine";

  const handlePress = async () => {
    if (task.isHourly) {
      setShowHoursModal(true);
      return;
    }
    if (!confirm) {
      setConfirm(true);
    } else {
      await completeTask(task._id);
      setConfirm(false);
      onCompleted && onCompleted();
    }
  };

  const handleHoursSubmit = async () => {
    const h = parseFloat(hours);
    if (isNaN(h) || h <= 0) return;
    await completeTask(task._id, h);
    setShowHoursModal(false);
    setHours("");
    onCompleted && onCompleted();
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Task",
      `Are you sure you want to delete "${task.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteTask(task._id);
            onCompleted && onCompleted();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      {/* Header: Name + Delete Icon */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Text style={[styles.taskName, { flex: 1, marginRight: 8 }]}>
          {task.name}
        </Text>
        <TouchableOpacity
          onPress={handleDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ padding: 4 }}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
        </TouchableOpacity>
      </View>

      {!isRoutine && task.hasDeadline && task.endingTime && (
        <Text style={styles.subText}>
          Ends: {formatDateTime(task.endingTime)}
        </Text>
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text style={styles.points}>
          {task.isHourly
            ? `${task.hourlyRate} pts/hr`
            : `${task.rewardPoints} Points`}
        </Text>

        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
          <View style={styles.doneButton}>
            <Text style={styles.doneButtonText}>
              {confirm ? "Confirm" : "Done"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Hours Input Modal for Hourly Tasks */}
      <Modal visible={showHoursModal} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.overlay,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              width: "80%",
              padding: 20,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: COLORS.text,
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 6,
              }}
            >
              Hours Worked
            </Text>
            <Text
              style={{
                color: COLORS.textSecondary,
                fontSize: 13,
                marginBottom: 14,
              }}
            >
              {task.hourlyRate} pts/hr — Enter hours to calculate points
            </Text>

            <TextInput
              placeholder="e.g. 2.5"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="decimal-pad"
              style={styles.input}
              value={hours}
              onChangeText={setHours}
              autoFocus
            />

            {hours && !isNaN(parseFloat(hours)) && (
              <Text
                style={{
                  color: COLORS.primary,
                  fontWeight: "600",
                  marginBottom: 12,
                  textAlign: "center",
                  fontSize: 15,
                }}
              >
                = {Math.round(task.hourlyRate * parseFloat(hours))} Points
              </Text>
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 16,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setShowHoursModal(false);
                  setHours("");
                }}
              >
                <Text style={{ color: COLORS.textMuted }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleHoursSubmit}>
                <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
