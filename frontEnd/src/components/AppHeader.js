import { View, Text, Animated, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../styles/theme";
import { exportData, importData } from "../store/DataStore";
import { Alert } from "react-native";

export default function AppHeader({ permanentPoints, onDataImported }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-15)).current;
  const navigation = useNavigation();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleExport = async () => {
    const success = await exportData();
    if (success) {
      Alert.alert("Export Successful", "Your data was exported successfully!");
    } else {
      Alert.alert("Export Failed", "Could not export data. Please try again.");
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
          style: "destructive",
          onPress: async () => {
            const success = await importData();
            if (success) {
              Alert.alert("Import Successful", "Your data has been restored!");
              onDataImported && onDataImported();
            } else {
              Alert.alert("Import Failed", "Failed to import data. Ensure the file is valid JSON.");
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
        paddingTop: 12,
        paddingBottom: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 3,
        zIndex: 10,
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
        {/* Brand Logo & Name */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              backgroundColor: COLORS.surface,
              borderWidth: 1.5,
              borderColor: COLORS.accentLight,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.12,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Ionicons name="flash" size={20} color={COLORS.primary} />
          </View>

          <View>
            <Text
              style={{
                color: COLORS.text,
                fontSize: 21,
                fontWeight: "800",
                letterSpacing: -0.5,
              }}
            >
              JustStart
            </Text>
            <Text
              style={{
                color: COLORS.textSecondary,
                fontSize: 11,
                fontWeight: "500",
                marginTop: -1,
                letterSpacing: 0.1,
              }}
            >
              Daily Discipline & Rewards
            </Text>
          </View>
        </View>

        {/* RIGHT SIDE ICONS & WALLET */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* Export Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleExport}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: COLORS.surfaceAlt,
              borderWidth: 1,
              borderColor: COLORS.border,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="cloud-upload-outline" size={17} color={COLORS.textSecondary} />
          </TouchableOpacity>

          {/* Import Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleImport}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: COLORS.surfaceAlt,
              borderWidth: 1,
              borderColor: COLORS.border,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="cloud-download-outline" size={17} color={COLORS.textSecondary} />
          </TouchableOpacity>

          {/* Wallet Chip */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => navigation.navigate("Transactions")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.surface,
              paddingHorizontal: 12,
              paddingVertical: 7,
              borderRadius: 20,
              borderWidth: 1.5,
              borderColor: COLORS.accentLight,
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 3,
              elevation: 1,
            }}
          >
            <Ionicons name="wallet" size={16} color={COLORS.primary} />
            <Text
              style={{
                color: COLORS.primaryDark,
                marginLeft: 6,
                fontWeight: "800",
                fontSize: 13,
                letterSpacing: 0.2,
              }}
            >
              {permanentPoints.toLocaleString()}
            </Text>
            <Text
              style={{
                color: COLORS.primary,
                marginLeft: 2,
                fontWeight: "600",
                fontSize: 11,
              }}
            >
              pts
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
