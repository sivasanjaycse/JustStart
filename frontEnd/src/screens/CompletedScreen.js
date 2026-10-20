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
import { getCompletedByDate, DAILY_GOAL } from "../store/DataStore";
import { styles, COLORS } from "../styles/theme";

export default function CompletedScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadCompleted = async (date) => {
    try {
      setLoading(true);
      // Convert to IST date string
      const ist = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
      const formatted = ist.toISOString().slice(0, 10);
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

  const total = data?.totalPoints ?? 0;
  const GOAL = DAILY_GOAL;

  return (
    <View style={[styles.container, { paddingHorizontal: 16, paddingTop: 10 }]}>
      {/* Date Picker Button */}
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        activeOpacity={0.8}
        style={{
          backgroundColor: COLORS.white,
          padding: 14,
          borderRadius: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderWidth: 1,
          borderColor: COLORS.border,
          marginVertical: 10,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
          elevation: 1,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: COLORS.surface,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="calendar" size={17} color={COLORS.primary} />
          </View>
          <Text style={{ color: COLORS.text, fontSize: 15, fontWeight: "700" }}>
            {selectedDate.toDateString()}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={18} color={COLORS.textSecondary} />
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

      {/* Total Points Hero Card */}
      <View
        style={{
          backgroundColor: COLORS.white,
          padding: 16,
          borderRadius: 16,
          marginBottom: 14,
          borderWidth: 1,
          borderColor: COLORS.cardBorder,
          alignItems: "center",
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: COLORS.textSecondary,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 4,
          }}
        >
          Daily Score
        </Text>
        <Text
          style={{
            fontSize: 26,
            fontWeight: "800",
            color: COLORS.primaryDark,
            letterSpacing: -0.5,
          }}
        >
          {total} pts
        </Text>

        {total >= GOAL ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: COLORS.surface,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 10,
              marginTop: 6,
              borderWidth: 1,
              borderColor: COLORS.accentLight,
            }}
          >
            <Ionicons name="sparkles" size={13} color={COLORS.primary} />
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: COLORS.primaryDark,
              }}
            >
              Goal Reached! Bonus: +{total - GOAL} pts
            </Text>
          </View>
        ) : (
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              color: COLORS.textSecondary,
              marginTop: 4,
            }}
          >
            {GOAL - total} pts needed to achieve target ({GOAL} pts)
          </Text>
        )}
      </View>

      {/* Completed List */}
      {loading ? (
        <ActivityIndicator color={COLORS.primary} size="large" style={{ marginTop: 40 }} />
      ) : data?.tasks?.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 40, paddingHorizontal: 20 }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: COLORS.surfaceAlt,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Ionicons name="calendar-outline" size={28} color={COLORS.textMuted} />
          </View>
          <Text style={{ color: COLORS.text, fontWeight: "700", fontSize: 16 }}>
            No Tasks Completed
          </Text>
          <Text style={{ color: COLORS.textMuted, marginTop: 4, fontSize: 13, textAlign: "center" }}>
            No completed tasks were found for this selected day.
          </Text>
        </View>
      ) : (
        <FlatList
          data={data?.tasks || []}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 60 }}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: COLORS.white,
                padding: 14,
                borderRadius: 14,
                marginBottom: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderWidth: 1,
                borderColor: COLORS.cardBorder,
                elevation: 1,
                shadowColor: COLORS.shadow,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.03,
                shadowRadius: 4,
              }}
            >
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  {item.name}
                </Text>
                {item.taskType && (
                  <Text style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 2 }}>
                    {item.taskType}
                  </Text>
                )}
              </View>

              <View
                style={{
                  backgroundColor: COLORS.surface,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: COLORS.accentLight,
                }}
              >
                <Text
                  style={{
                    color: COLORS.primaryDark,
                    fontWeight: "800",
                    fontSize: 13,
                  }}
                >
                  +{item.rewardPoints} pts
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
