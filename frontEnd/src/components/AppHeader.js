import { View, Text, Animated, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../styles/theme";
import { exportData, importData } from "../store/DataStore";
import { Alert } from "react-native";

export default function AppHeader({ permanentPoints, onDataImported }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;
  const navigation = useNavigation();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleExport = async () => {
    const success = await exportData();
    if (success) {
      Alert.alert("Export", "Data exported successfully!");
    } else {
      Alert.alert("Export", "Failed to export data.");
    }
  };

  const handleImport = async () => {
    Alert.alert(
      "Import Data",
      "This will replace all current data. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Import",
          onPress: async () => {
            const success = await importData();
            if (success) {
              Alert.alert("Import", "Data imported successfully!");
              onDataImported && onDataImported();
            } else {
              Alert.alert("Import", "Failed to import data. Ensure the file is valid JSON.");
            }
          },
        },
      ]
    );
  };

  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        paddingTop: 14,
        paddingBottom: 15,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
      }}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* App Name & Tagline */}
        <View>
          <Text
            style={{
              color: COLORS.primary,
              fontSize: 26,
              fontWeight: "bold",
              letterSpacing: 0.8,
            }}
          >
            JustStart
          </Text>
          <Text
            style={{
              color: COLORS.textSecondary,
              fontSize: 11,
              fontWeight: "500",
              letterSpacing: 0.2,
              marginTop: 1,
            }}
          >
            Your daily discipline
          </Text>
        </View>

        {/* RIGHT SIDE ICONS */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          {/* Export */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleExport}
            style={{
              padding: 6,
            }}
          >
            <Ionicons name="cloud-upload-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>

          {/* Import */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleImport}
            style={{
              padding: 6,
            }}
          >
            <Ionicons name="cloud-download-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>

          {/* Wallet */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Transactions")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.surfaceAlt,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Ionicons name="wallet" size={18} color={COLORS.primary} />
            <Text
              style={{
                color: COLORS.text,
                marginLeft: 6,
                fontWeight: "600",
                fontSize: 13,
              }}
            >
              {permanentPoints}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
