import { View, Text, Animated, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";

export default function AppHeader({ permanentPoints }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

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

  return (
    <LinearGradient
      colors={["#0B0507", "#1C0F13", "#0B0507"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        paddingHorizontal: 20,
        paddingTop: 4,
        paddingBottom: 10,
      }}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* 🏷️ App Name */}
        <Text
          style={{
            color: "#F5F5F5",
            fontSize: 34,
            fontWeight: "bold",
            letterSpacing: 1,
          }}
        >
          Just Start
        </Text>

        {/* RIGHT SIDE ICONS */}
        <View
          style={{
            position: "absolute",
            right: 20,
            top: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
          }}
        >
          <Ionicons name="trophy" size={22} color="#C1121F" />
          <Ionicons name="checkmark-circle" size={22} color="#C1121F" />

          {/* 💰 WALLET */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              // wallet screen later
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#141012",
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#6D0F1B",
            }}
          >
            <Ionicons name="wallet" size={18} color="#F5F5F5" />
            <Text
              style={{
                color: "#F5F5F5",
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
    </LinearGradient>
  );
}
