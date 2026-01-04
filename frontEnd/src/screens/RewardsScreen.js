import { useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import RewardCard from "../components/RewardCard";
import PurchaseModal from "../components/PurchaseModal";
import AddRewardModal from "../components/AddRewardModal";
import { getRewards, purchaseReward, addReward } from "../api/rewardsApi";
import { rewardStyles as styles } from "../styles/rewardStyles";

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
      setSelected(reward);
    }
    setModal(true);
  };

  const confirmPurchase = async () => {
    await purchaseReward(selected._id);
    setModal(false);
    reloadWallet();
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
        renderItem={({ item }) => (
          <RewardCard reward={item} onPress={() => onRewardPress(item)} />
        )}
      />

      {/* + FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setAddModal(true)}>
        <View>
          <View />
        </View>
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
