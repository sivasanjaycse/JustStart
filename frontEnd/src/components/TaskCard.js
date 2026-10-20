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
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      {/* Top Header: Tag & Delete Button */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            backgroundColor: isRoutine ? COLORS.surface : "#F1F5F9",
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: isRoutine ? COLORS.accentLight : COLORS.border,
          }}
        >
          <Ionicons
            name={isRoutine ? "repeat" : task.isHourly ? "time" : "flash"}
            size={12}
            color={isRoutine ? COLORS.primary : COLORS.textSecondary}
          />
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: isRoutine ? COLORS.primaryDark : COLORS.textSecondary,
              textTransform: "uppercase",
              letterSpacing: 0.3,
            }}
          >
            {task.isHourly ? "Hourly Rate" : task.taskType}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            backgroundColor: "#FEE2E2",
            justifyContent: "center",
            alignItems: "center",
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={14} color={COLORS.danger} />
        </TouchableOpacity>
      </View>

      {/* Task Name */}
      <Text
        style={{
          color: COLORS.text,
          fontSize: 16,
          fontWeight: "700",
          letterSpacing: -0.2,
          lineHeight: 22,
        }}
      >
        {task.name}
      </Text>

      {/* Deadline Info */}
      {!isRoutine && task.hasDeadline && task.endingTime && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            marginTop: 6,
          }}
        >
          <Ionicons name="calendar-outline" size={13} color={COLORS.textMuted} />
          <Text
            style={{
              color: COLORS.textSecondary,
              fontSize: 12,
              fontWeight: "500",
            }}
          >
            Due: {formatDateTime(task.endingTime)}
          </Text>
        </View>
      )}

      {/* Bottom Row: Points Pill & Action Button */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 14,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: "#F1F5F9",
        }}
      >
        {/* Points Pill */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: COLORS.surface,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: COLORS.accentLight,
            gap: 4,
          }}
        >
          <Ionicons name="star" size={13} color={COLORS.primary} />
          <Text
            style={{
              color: COLORS.primaryDark,
              fontWeight: "800",
              fontSize: 13,
            }}
          >
            {task.isHourly
              ? `${task.hourlyRate} pts/hr`
              : `+${task.rewardPoints} pts`}
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.8}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            backgroundColor: confirm ? COLORS.warning : COLORS.primary,
            paddingHorizontal: 18,
            paddingVertical: 8,
            borderRadius: 20,
            minWidth: 92,
            shadowColor: confirm ? COLORS.warning : COLORS.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Ionicons
            name={confirm ? "help-circle-outline" : "checkmark-circle"}
            size={16}
            color={COLORS.white}
          />
          <Text
            style={{
              color: COLORS.white,
              fontWeight: "700",
              fontSize: 13,
              letterSpacing: 0.2,
            }}
          >
            {confirm ? "Confirm?" : "Done"}
          </Text>
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
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              width: "100%",
              maxWidth: 340,
              padding: 22,
              borderRadius: 20,
              shadowColor: COLORS.shadow,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: COLORS.surface,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="time" size={18} color={COLORS.primary} />
              </View>
              <Text
                style={{
                  color: COLORS.text,
                  fontSize: 17,
                  fontWeight: "700",
                }}
              >
                Log Hours
              </Text>
            </View>

            <Text
              style={{
                color: COLORS.textSecondary,
                fontSize: 13,
                marginBottom: 16,
                lineHeight: 18,
              }}
            >
              Rate: <Text style={{ fontWeight: "700", color: COLORS.primaryDark }}>{task.hourlyRate} pts/hr</Text>. Enter the total hours worked to calculate earnings.
            </Text>

            <TextInput
              placeholder="e.g. 2.5"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="decimal-pad"
              style={[
                styles.input,
                {
                  fontSize: 16,
                  fontWeight: "600",
                  textAlign: "center",
                  paddingVertical: 12,
                },
              ]}
              value={hours}
              onChangeText={setHours}
              autoFocus
            />

            {hours && !isNaN(parseFloat(hours)) && (
              <View
                style={{
                  backgroundColor: COLORS.surface,
                  borderRadius: 12,
                  padding: 10,
                  marginBottom: 16,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: COLORS.accentLight,
                }}
              >
                <Text
                  style={{
                    color: COLORS.primaryDark,
                    fontWeight: "800",
                    fontSize: 16,
                  }}
                >
                  = {Math.round(task.hourlyRate * parseFloat(hours))} Points Earned
                </Text>
              </View>
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 12,
                marginTop: 4,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setShowHoursModal(false);
                  setHours("");
                }}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: COLORS.textMuted, fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleHoursSubmit}
                style={{
                  backgroundColor: COLORS.primary,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                  shadowColor: COLORS.primary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Text style={{ color: COLORS.white, fontWeight: "700" }}>
                  Submit Points
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
