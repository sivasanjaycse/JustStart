import { View } from "react-native";
import AppHeader from "../components/AppHeader";
import { COLORS } from "../styles/theme";

export default function AppLayout({ children, permanentPoints, onDataImported }) {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <AppHeader permanentPoints={permanentPoints} onDataImported={onDataImported} />
      {children}
    </View>
  );
}
