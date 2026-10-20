// Used in HomeScreen
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles, COLORS } from "../styles/theme";

export default function TaskTabs({ activeTab, onChange }) {
  const tabs = [
    { key: "Routine", label: "Routine Tasks", icon: "repeat" },
    { key: "One-Time", label: "One-Time Tasks", icon: "flash" },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: COLORS.surfaceAlt,
        borderRadius: 14,
        padding: 4,
        marginHorizontal: 4,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.8}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor: isActive ? COLORS.white : "transparent",
              gap: 6,
              shadowColor: isActive ? COLORS.shadow : "transparent",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: isActive ? 0.08 : 0,
              shadowRadius: 3,
              elevation: isActive ? 2 : 0,
            }}
            onPress={() => onChange(tab.key)}
          >
            <Ionicons
              name={tab.icon}
              size={15}
              color={isActive ? COLORS.primary : COLORS.textMuted}
            />
            <Text
              style={{
                color: isActive ? COLORS.text : COLORS.textSecondary,
                fontWeight: isActive ? "700" : "600",
                fontSize: 13,
                letterSpacing: 0.1,
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
