import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles/theme";

export default function TaskTabs({ activeTab, onChange }) {
  return (
    <View style={styles.tabBar}>
      {["Routine", "One-Time"].map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.tab,
            activeTab === type && styles.activeTab
          ]}
          onPress={() => onChange(type)}
        >
          <Text style={styles.tabText}>{type}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
