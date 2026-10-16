import { View, Text, Modal, TextInput, TouchableOpacity, Switch } from "react-native";
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
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBg}>
        <View style={styles.modal}>
          {/* Task Name */}
          <TextInput
            placeholder="Task Name"
            placeholderTextColor={COLORS.textMuted}
            style={styles.input}
            value={name}
            onChangeText={(v) => setState({ name: v })}
          />

          {/* Task Type */}
          <View style={styles.typeRow}>
            {["Routine", "One-Time"].map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.typeBtn, taskType === type && styles.activeType]}
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
                <Text
                  style={[
                    styles.typeText,
                    taskType === type && { color: COLORS.white },
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Hourly Rate Toggle (One-Time only) */}
          {!isRoutine && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
                paddingHorizontal: 4,
              }}
            >
              <Text style={{ color: COLORS.text, fontWeight: "500" }}>
                Hourly Rate Task
              </Text>
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
              placeholder="Points per Hour"
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
                marginBottom: 12,
                paddingHorizontal: 4,
              }}
            >
              <Text style={{ color: COLORS.text, fontWeight: "500" }}>
                Set Deadline
              </Text>
              <Switch
                value={hasDeadline || false}
                onValueChange={(v) => setState({ hasDeadline: v })}
                trackColor={{ false: COLORS.border, true: COLORS.accentLight }}
                thumbColor={hasDeadline ? COLORS.primary : COLORS.textMuted}
              />
            </View>
          )}

          {/* Date & Time Pickers (only if hasDeadline for One-Time) */}
          {!isRoutine && hasDeadline && (
            <>
              {/* Date */}
              <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => setState({ showDatePicker: true })}
              >
                <Text style={styles.dateText}>
                  Date: {date.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              {/* Time */}
              <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => setState({ showTimePicker: true })}
              >
                <Text style={styles.dateText}>
                  Time: {date.toLocaleTimeString()}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="calendar"
                  themeVariant="light"
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
                  themeVariant="light"
                  onChange={(e, selected) => {
                    setState({ showTimePicker: false });
                    if (selected) {
                      setState({ date: mergeTime(selected, date) });
                    }
                  }}
                />
              )}
            </>
          )}

          {/* Reward Points (not shown for hourly tasks) */}
          {!isHourly && (
            <TextInput
              placeholder="Reward Points"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              style={styles.input}
              value={rewardPoints}
              onChangeText={(v) => setState({ rewardPoints: v })}
            />
          )}

          {/* Save */}
          <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
