import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { getTransactions } from "../store/DataStore";
import TransactionItem from "../components/TransactionItem";
import { transactionStyles as styles } from "../styles/transactionStyles";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../styles/theme";

export default function TransactionsScreen() {
  const [grouped, setGrouped] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await getTransactions();
      setTotalCount(data.length);

      // Group by IST date
      const map = {};
      data.forEach((tx) => {
        const d = new Date(tx.purchasedAt);
        const ist = new Date(d.getTime() + 5.5 * 60 * 60 * 1000);
        const key = ist.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

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
      {/* Top Navigation Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          paddingVertical: 4,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: COLORS.white,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <Ionicons name="arrow-back" size={18} color={COLORS.text} />
          <Text style={{ color: COLORS.text, fontWeight: "700", fontSize: 13 }}>
            Back
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 17,
            fontWeight: "800",
            color: COLORS.text,
            letterSpacing: -0.3,
          }}
        >
          Wallet Redemptions
        </Text>

        <View
          style={{
            backgroundColor: COLORS.surfaceAlt,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: COLORS.textSecondary, fontWeight: "700", fontSize: 12 }}>
            {totalCount} Total
          </Text>
        </View>
      </View>

      <FlatList
        data={dates}
        keyExtractor={(d) => d}
        contentContainerStyle={{ paddingBottom: 60 }}
        ListEmptyComponent={
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 60,
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 20,
                backgroundColor: COLORS.surfaceAlt,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Ionicons name="receipt-outline" size={30} color={COLORS.textMuted} />
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: COLORS.text,
                marginBottom: 4,
              }}
            >
              No Redemptions Yet
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: COLORS.textSecondary,
                textAlign: "center",
                maxWidth: 240,
              }}
            >
              Purchased rewards will appear here with date and points spent.
            </Text>
          </View>
        }
        renderItem={({ item: date }) => (
          <View style={styles.section}>
            <View style={styles.dateHeader}>
              <Ionicons name="calendar-outline" size={13} color={COLORS.textSecondary} />
              <Text style={styles.date}>{date}</Text>
            </View>

            {grouped[date].map((tx) => (
              <TransactionItem key={tx._id} item={tx} />
            ))}
          </View>
        )}
      />
    </View>
  );
}
