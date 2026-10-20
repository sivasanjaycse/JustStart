import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { rewardStyles as styles } from "../styles/rewardStyles";
import { COLORS } from "../styles/theme";

export default function RewardCard({ reward, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.imageContainer}>
        {reward.rewardPic ? (
          <Image
            source={{ uri: reward.rewardPic }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="gift-outline" size={42} color={COLORS.primaryLight} />
        )}
      </View>

      <Text style={styles.name} numberOfLines={2}>
        {reward.rewardName}
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 4,
        }}
      >
        <View style={styles.pointsBadge}>
          <Ionicons name="sparkles" size={12} color={COLORS.primary} />
          <Text style={styles.points}>{reward.rewardPoints} pts</Text>
        </View>

        <View
          style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: COLORS.surfaceAlt,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="arrow-forward" size={13} color={COLORS.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
