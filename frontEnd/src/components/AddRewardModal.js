import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { rewardStyles as styles } from "../styles/rewardStyles";
import { COLORS } from "../styles/theme";

export default function AddRewardModal({ visible, onClose, onSave }) {
  const [name, setName] = useState("");
  const [points, setPoints] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.7,
    });
    if (!res.canceled) {
      setImage(`data:image/jpeg;base64,${res.assets[0].base64}`);
    }
  };

  const submit = () => {
    if (!name.trim() || !points || isNaN(Number(points))) return;
    onSave({
      rewardName: name.trim(),
      rewardPoints: Number(points),
      rewardPic: image,
    });
    setName("");
    setPoints("");
    setImage(null);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalBox}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: COLORS.surface,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="gift" size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.modalTitle}>New Reward Item</Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: COLORS.surfaceAlt,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="close" size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Reward Name */}
          <TextInput
            placeholder="Reward Title (e.g. 1hr Gaming)"
            placeholderTextColor={COLORS.textMuted}
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          {/* Reward Points */}
          <TextInput
            placeholder="Cost in Points (e.g. 300)"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="numeric"
            value={points}
            onChangeText={setPoints}
            style={styles.input}
          />

          {/* Image Picker */}
          {image ? (
            <View
              style={{
                height: 120,
                borderRadius: 12,
                overflow: "hidden",
                marginBottom: 16,
                position: "relative",
              }}
            >
              <Image
                source={{ uri: image }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => setImage(null)}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="close" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.pickImage} onPress={pickImage}>
              <Ionicons name="image-outline" size={20} color={COLORS.primary} />
              <Text style={styles.pickImageText}>Select Reward Photo</Text>
            </TouchableOpacity>
          )}

          {/* Modal Actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={submit}
              style={{
                backgroundColor: COLORS.primary,
                paddingHorizontal: 22,
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
                Add Reward
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
