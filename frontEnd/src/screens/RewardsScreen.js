import { useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RewardCard from "../components/RewardCard";
import PurchaseModal from "../components/PurchaseModal";
import AddRewardModal from "../components/AddRewardModal";
import { getRewards, purchaseReward, addReward } from "../store/DataStore";
import { rewardStyles as styles } from "../styles/rewardStyles";
import { COLORS } from "../styles/theme";

export default function RewardsScreen({ walletPoints, reloadWallet }) {
  const [rewards, setRewards] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(false);
  const [insufficient, setInsufficient] = useState(false);
  const [addModal, setAddModal] = useState(false);

  const loadRewards = async () => {
    const data = await getRewards();
    setRewards(data);
  };

  useEffect(() => {
    loadRewards();
  }, []);

  const onRewardPress = (reward) => {
    if (walletPoints < reward.rewardPoints) {
      setInsufficient(true);
    } else {
      setInsufficient(false);
    }
    setSelected(reward);
    setModal(true);
  };

  const confirmPurchase = async () => {
    try {
      await purchaseReward(selected._id);
      await reloadWallet();
      setModal(false);
      setSelected(null);
    } catch (e) {
      console.log("Purchase failed", e);
    }
  };

  const saveReward = async (reward) => {
    await addReward(reward);
    setAddModal(false);
    loadRewards();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={rewards}
        numColumns={2}
        keyExtractor={(i) => i._id}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <View style={{ marginBottom: 14 }}>
            {/* Wallet Balance Hero Banner */}
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 18,
                padding: 16,
                marginTop: 6,
                borderWidth: 1,
                borderColor: COLORS.cardBorder,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                shadowColor: COLORS.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <View>
                <Text
                  style={{
                    color: COLORS.textSecondary,
                    fontSize: 12,
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Spendable Balance
                </Text>
                <View style={{ flexDirection: "row", alignItems: "baseline", marginTop: 2 }}>
                  <Text
                    style={{
                      color: COLORS.primaryDark,
                      fontSize: 26,
                      fontWeight: "800",
                      letterSpacing: -0.5,
                    }}
                  >
                    {walletPoints.toLocaleString()}
                  </Text>
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontSize: 14,
                      fontWeight: "700",
                      marginLeft: 4,
                    }}
                  >
                    pts
                  </Text>
                </View>
              </View>

              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: COLORS.surface,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: COLORS.accentLight,
                }}
              >
                <Ionicons name="gift" size={22} color={COLORS.primary} />
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 48,
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
              <Ionicons name="gift-outline" size={32} color={COLORS.textMuted} />
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: COLORS.text,
                marginBottom: 4,
              }}
            >
              No Rewards Yet
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: COLORS.textSecondary,
                textAlign: "center",
                maxWidth: 240,
              }}
            >
              Treat yourself! Add custom rewards that you can unlock with points earned.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <RewardCard reward={item} onPress={() => onRewardPress(item)} />
        )}
      />

      {/* Modern Floating Action Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.fab}
        onPress={() => setAddModal(true)}
      >
        <Ionicons name="add" size={30} color={COLORS.white} />
      </TouchableOpacity>

      <PurchaseModal
        visible={modal}
        reward={selected}
        insufficient={insufficient}
        onClose={() => setModal(false)}
        onConfirm={confirmPurchase}
      />

      <AddRewardModal
        visible={addModal}
        onClose={() => setAddModal(false)}
        onSave={saveReward}
      />
    </View>
  );
}
