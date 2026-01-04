import { View, Text, Image, TouchableOpacity } from "react-native";
import { rewardStyles as styles } from "../styles/rewardStyles";

export default function RewardCard({ reward, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: reward.rewardPic }}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.name} numberOfLines={2}>
        {reward.rewardName}
      </Text>

      <Text style={styles.points}>{reward.rewardPoints} pts</Text>
    </TouchableOpacity>
  );
}
