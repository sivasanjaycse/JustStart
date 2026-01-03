import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { getCompletedByDate } from "../api/completedApi";
import { styles } from "../styles/theme";

export default function CompletedScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadCompleted = async (date) => {
    try {
      setLoading(true);
      const formatted = date.toISOString().slice(0, 10); // YYYY-MM-DD
      const res = await getCompletedByDate(formatted);
      setData(res);
    } catch (e) {
      console.log("Completed fetch error:", e);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompleted(selectedDate);
  }, [selectedDate]);

  const onDateChange = (_, date) => {
    setShowPicker(false);
    if (date) setSelectedDate(date);
  };

  return (
    <View style={[styles.container, { padding: 16 }]}>
      {/* 📅 Date Picker */}
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={{
          backgroundColor: "#141012",
          padding: 12,
          borderRadius: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderWidth: 1,
          borderColor: "#6D0F1B",
        }}
      >
        <Text style={{ color: "#F5F5F5", fontSize: 15 }}>
          {selectedDate.toDateString()}
        </Text>
        <Ionicons name="calendar" size={20} color="#C1121F" />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          minimumDate={new Date("2026-01-01")}
          maximumDate={new Date()}
          onChange={onDateChange}
        />
      )}

      {/* 🔢 Total Points */}
      <View style={{ marginVertical: 20 }}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 22,
            fontWeight: "700",
            color: "#C1121F",
          }}
        >
          Total: {data?.totalPoints ?? 0} Points
        </Text>
      </View>

      {/* 📋 Completed List */}
      {loading ? (
        <ActivityIndicator color="#C1121F" size="large" />
      ) : data?.tasks?.length === 0 ? (
        <Text
          style={{
            textAlign: "center",
            color: "#A8A8A8",
            marginTop: 40,
          }}
        >
          No tasks completed on this day
        </Text>
      ) : (
        <FlatList
          data={data?.tasks || []}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "#141012",
                padding: 14,
                borderRadius: 12,
                marginBottom: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#F5F5F5",
                  fontSize: 15,
                  flex: 1,
                }}
              >
                {item.name}
              </Text>

              <Text
                style={{
                  color: "#C1121F",
                  fontWeight: "600",
                  marginLeft: 10,
                }}
              >
                +{item.rewardPoints}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
