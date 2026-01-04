import { View, Text, TouchableOpacity, Modal } from "react-native";
import { rewardStyles as styles } from "../styles/rewardStyles";

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
          <Text style={styles.modalTitle}>
            {insufficient ? "Insufficient Points" : "Confirm Purchase"}
          </Text>

          <Text style={styles.modalText}>
            {insufficient
              ? "You do not have enough points to purchase this reward."
              : `Do you want to purchase "${reward?.rewardName}" for ${reward?.rewardPoints} points?`}
          </Text>

          <View style={styles.modalActions}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>

            {!insufficient && (
              <TouchableOpacity onPress={onConfirm}>
                <Text style={styles.confirm}>Yes</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
