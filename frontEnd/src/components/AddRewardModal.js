import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { rewardStyles as styles } from "../styles/rewardStyles";

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
    onSave({
      rewardName: name,
      rewardPoints: Number(points),
      rewardPic: image,
    });
    setName("");
    setPoints("");
    setImage(null);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Add Reward</Text>

          <TextInput
            placeholder="Reward Name"
            placeholderTextColor="#A8A8A8"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Reward Points"
            placeholderTextColor="#A8A8A8"
            keyboardType="numeric"
            value={points}
            onChangeText={setPoints}
            style={styles.input}
          />

          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.pickImage}>
              {image ? "Image Selected" : "Pick Image"}
            </Text>
          </TouchableOpacity>

          <View style={styles.modalActions}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={submit}>
              <Text style={styles.confirm}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
