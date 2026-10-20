import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { transactionStyles as styles } from "../styles/transactionStyles";
import { COLORS } from "../styles/theme";

export default function TransactionItem({ item }) {
  const timeStr = item.purchasedAt
    ? new Date(item.purchasedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <View style={styles.item}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1, marginRight: 10 }}>
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            backgroundColor: "#FEF2F2",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="gift-outline" size={19} color={COLORS.danger} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name} numberOfLines={1}>
            {item.rewardName}
          </Text>
          {timeStr && (
            <Text style={{ color: COLORS.textMuted, fontSize: 11, marginTop: 2 }}>
              {timeStr}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.pointsBadge}>
        <Text style={styles.points}>-{item.rewardPoints} pts</Text>
      </View>
    </View>
  );
}
