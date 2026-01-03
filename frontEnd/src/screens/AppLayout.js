import { View } from "react-native";
import AppHeader from "../components/AppHeader";

export default function AppLayout({ children, permanentPoints }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#0B0507" }}>
      <AppHeader permanentPoints={permanentPoints} />
      {children}
    </View>
  );
}
