import { View, Text, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";

export default function AppHeader() {
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

        <View
          style={{
            position: "absolute",
            right: 20,
            top: 10,
            flexDirection: "row",
            gap: 16,
          }}
        >
          <Ionicons name="trophy" size={22} color="#C1121F" />
          <Ionicons name="checkmark-circle" size={22} color="#C1121F" />
        </View>
      </Animated.View>
    </LinearGradient>
  );
}
