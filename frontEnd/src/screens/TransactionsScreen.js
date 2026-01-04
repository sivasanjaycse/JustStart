import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { getTransactions } from "../api/transactionsApi";
import TransactionItem from "../components/TransactionItem";
import { transactionStyles as styles } from "../styles/transactionStyles";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function TransactionsScreen() {
  const [grouped, setGrouped] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await getTransactions();

      // Group by IST date
      const map = {};
      data.forEach((tx) => {
        const d = new Date(tx.purchasedAt);
        const ist = new Date(d.getTime() + 5.5 * 60 * 60 * 1000);
        const key = ist.toLocaleDateString("en-IN");

        if (!map[key]) map[key] = [];
        map[key].push(tx);
      });

      setGrouped(map);
    } catch (e) {
      console.log("Failed to load transactions", e);
    }
  };

  const dates = Object.keys(grouped);

  return (
    <View style={styles.container}>
      <FlatList
        data={dates}
        keyExtractor={(d) => d}
        renderItem={({ item: date }) => (
          <View style={styles.section}>
            <Text style={styles.date}>{date}</Text>

            {grouped[date].map((tx) => (
              <TransactionItem key={tx._id} item={tx} />
            ))}
          </View>
        )}
      />
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.goBack()}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          width: 54,
          height: 54,
          borderRadius: 27,
          backgroundColor: "#C1121F",
          justifyContent: "center",
          alignItems: "center",
          elevation: 6, // Android shadow
          shadowColor: "#C1121F", // iOS glow
          shadowOpacity: 0.4,
          shadowRadius: 6,
        }}
      >
        <Ionicons name="home" size={26} color="#F5F5F5" />
      </TouchableOpacity>
    </View>
  );
}
