import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { rewardStyles as styles } from "../styles/rewardStyles";
import { COLORS } from "../styles/theme";

export default function PurchaseModal({
  visible,
  reward,
  insufficient,
  onConfirm,
  onClose,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalBox}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              backgroundColor: insufficient ? "#FEF2F2" : COLORS.surface,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <Ionicons
              name={insufficient ? "alert-circle" : "gift"}
              size={24}
              color={insufficient ? COLORS.danger : COLORS.primary}
            />
          </View>

          <Text style={styles.modalTitle}>
            {insufficient ? "Insufficient Balance" : "Redeem Reward"}
          </Text>

          <Text style={styles.modalText}>
            {insufficient
              ? `You need ${reward?.rewardPoints} points to redeem "${reward?.rewardName}", but your wallet does not have enough.`
              : `Redeem "${reward?.rewardName}" for ${reward?.rewardPoints} points from your permanent wallet balance?`}
          </Text>

          <View style={styles.modalActions}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>
                {insufficient ? "Close" : "Cancel"}
              </Text>
            </TouchableOpacity>

            {!insufficient && (
              <TouchableOpacity
                onPress={onConfirm}
                style={{
                  backgroundColor: COLORS.primary,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 12,
                  shadowColor: COLORS.primary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Text style={{ color: COLORS.white, fontWeight: "700", fontSize: 14 }}>
                  Confirm Redeem
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
