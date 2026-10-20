import { View, Text, Modal, TextInput, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles, COLORS } from "../styles/theme";
import { mergeDate, mergeTime } from "../utils/dateUtils";

export default function AddTaskModal({
  visible,
  onClose,
  onSave,
  state,
  setState,
}) {
  const {
    name,
    rewardPoints,
    taskType,
    date,
    showDatePicker,
    showTimePicker,
    hasDeadline,
    isHourly,
    hourlyRate,
  } = state;

  const ROUTINE_END_DATE = new Date("2099-12-31T23:59:59.000Z");
  const isRoutine = taskType === "Routine";

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalBg}>
        <View style={styles.modal}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
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
                <Ionicons name="add-circle" size={20} color={COLORS.primary} />
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "800",
                  color: COLORS.text,
                  letterSpacing: -0.3,
                }}
              >
                Create New Task
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: COLORS.surfaceAlt,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="close" size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Task Type Switcher */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: COLORS.surfaceAlt,
              borderRadius: 12,
              padding: 4,
              marginBottom: 14,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            {["Routine", "One-Time"].map((type) => {
              const active = taskType === type;
              return (
                <TouchableOpacity
                  key={type}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    paddingVertical: 9,
                    borderRadius: 9,
                    backgroundColor: active ? COLORS.white : "transparent",
                    shadowColor: active ? COLORS.shadow : "transparent",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: active ? 0.08 : 0,
                    shadowRadius: 3,
                    elevation: active ? 2 : 0,
                  }}
                  onPress={() => {
                    if (type === "Routine") {
                      setState({
                        taskType: "Routine",
                        date: ROUTINE_END_DATE,
                        hasDeadline: false,
                        isHourly: false,
                      });
                    } else {
                      setState({
                        taskType: "One-Time",
                        date: new Date(),
                        hasDeadline: false,
                        isHourly: false,
                      });
                    }
                  }}
                >
                  <Ionicons
                    name={type === "Routine" ? "repeat" : "flash"}
                    size={14}
                    color={active ? COLORS.primary : COLORS.textMuted}
                  />
                  <Text
                    style={{
                      color: active ? COLORS.primaryDark : COLORS.textSecondary,
                      fontWeight: active ? "700" : "600",
                      fontSize: 13,
                    }}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Task Name Input */}
          <TextInput
            placeholder="What do you want to accomplish?"
            placeholderTextColor={COLORS.textMuted}
            style={styles.input}
            value={name}
            onChangeText={(v) => setState({ name: v })}
          />

          {/* Hourly Rate Toggle (One-Time only) */}
          {!isRoutine && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: COLORS.surfaceAlt,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 12,
                marginBottom: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="time-outline" size={18} color={COLORS.primary} />
                <Text style={{ color: COLORS.text, fontWeight: "600", fontSize: 13 }}>
                  Hourly Rate Task
                </Text>
              </View>
              <Switch
                value={isHourly || false}
                onValueChange={(v) => setState({ isHourly: v })}
                trackColor={{ false: COLORS.border, true: COLORS.accentLight }}
                thumbColor={isHourly ? COLORS.primary : COLORS.textMuted}
              />
            </View>
          )}

          {/* Hourly Rate Input */}
          {!isRoutine && isHourly && (
            <TextInput
              placeholder="Points per Hour (e.g. 100)"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              style={styles.input}
              value={hourlyRate || ""}
              onChangeText={(v) => setState({ hourlyRate: v })}
            />
          )}

          {/* Deadline Toggle (One-Time only) */}
          {!isRoutine && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: COLORS.surfaceAlt,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 12,
                marginBottom: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
                <Text style={{ color: COLORS.text, fontWeight: "600", fontSize: 13 }}>
                  Set Target Deadline
                </Text>
              </View>
              <Switch
                value={hasDeadline || false}
                onValueChange={(v) => setState({ hasDeadline: v })}
                trackColor={{ false: COLORS.border, true: COLORS.accentLight }}
                thumbColor={hasDeadline ? COLORS.primary : COLORS.textMuted}
              />
            </View>
          )}

          {/* Date & Time Pickers */}
          {!isRoutine && hasDeadline && (
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
              <TouchableOpacity
                style={[styles.dateBtn, { flex: 1, marginBottom: 0 }]}
                onPress={() => setState({ showDatePicker: true })}
              >
                <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
                <Ionicons name="calendar" size={16} color={COLORS.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.dateBtn, { flex: 1, marginBottom: 0 }]}
                onPress={() => setState({ showTimePicker: true })}
              >
                <Text style={styles.dateText}>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                <Ionicons name="time" size={16} color={COLORS.primary} />
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="calendar"
                  minimumDate={new Date()}
                  onChange={(e, selected) => {
                    setState({ showDatePicker: false });
                    if (selected) {
                      setState({ date: mergeDate(selected, date) });
                    }
                  }}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={date}
                  mode="time"
                  onChange={(e, selected) => {
                    setState({ showTimePicker: false });
                    if (selected) {
                      setState({ date: mergeTime(selected, date) });
                    }
                  }}
                />
              )}
            </View>
          )}

          {/* Reward Points */}
          {!isHourly && (
            <TextInput
              placeholder="Reward Points (e.g. 50)"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              style={styles.input}
              value={rewardPoints}
              onChangeText={(v) => setState({ rewardPoints: v })}
            />
          )}

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveBtn}
            activeOpacity={0.85}
            onPress={onSave}
          >
            <Text style={styles.saveText}>Save Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
