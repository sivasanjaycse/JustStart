import { View, Text, Modal, TextInput, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "../styles/theme";
import { mergeDate, mergeTime } from "../utils/dateUtils";

export default function AddTaskModal({
  visible,
  onClose,
  onSave,
  state,
  setState,
}) {
  const { name, rewardPoints, taskType, date, showDatePicker, showTimePicker } =
    state;

  const ROUTINE_END_DATE = new Date("2099-12-31T23:59:59.000Z");
  const isRoutine = taskType === "Routine";

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBg}>
        <View style={styles.modal}>
          {/* 📝 Task Name */}
          <TextInput
            placeholder="Task Name"
            placeholderTextColor="#A8A8A8"
            style={styles.input}
            value={name}
            onChangeText={(v) => setState({ name: v })}
          />

          {/* 🧩 Task Type — MOVED TO TOP */}
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
                    });
                  } else {
                    setState({
                      taskType: "One-Time",
                      date: new Date(),
                    });
                  }
                }}
              >
                <Text style={styles.typeText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {!isRoutine && (
            <>
              {/* 📅 Date */}
              <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => setState({ showDatePicker: true })}
              >
                <Text style={styles.dateText}>
                  📅 {date.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              {/* ⏰ Time */}

              <TouchableOpacity
                style={styles.dateBtn}
                disabled={isRoutine}
                onPress={() => setState({ showTimePicker: true })}
              >
                <Text style={styles.dateText}>
                  ⏰ {date.toLocaleTimeString()}
                </Text>
              </TouchableOpacity>

              {showDatePicker && !isRoutine && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="calendar"
                  themeVariant="dark"
                  minimumDate={new Date()}
                  onChange={(e, selected) => {
                    setState({ showDatePicker: false });
                    if (selected) {
                      setState({ date: mergeDate(selected, date) });
                    }
                  }}
                />
              )}

              {showTimePicker && !isRoutine && (
                <DateTimePicker
                  value={date}
                  mode="time"
                  themeVariant="dark"
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

          {/* 🎯 Reward Points */}
          <TextInput
            placeholder="Reward Points"
            placeholderTextColor="#A8A8A8"
            keyboardType="numeric"
            style={styles.input}
            value={rewardPoints}
            onChangeText={(v) => setState({ rewardPoints: v })}
          />

          {/* 💾 Save */}
          <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>

          {/* ❌ Cancel */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
