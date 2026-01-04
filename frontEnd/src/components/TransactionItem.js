import { View, Text } from "react-native";
import { transactionStyles as styles } from "../styles/transactionStyles";

export default function TransactionItem({ item }) {
  return (
    <View style={styles.item}>
      <Text style={styles.name}>{item.rewardName}</Text>
      <Text style={styles.points}>-{item.rewardPoints} pts</Text>
    </View>
  );
}
