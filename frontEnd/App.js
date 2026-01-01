import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import HomeScreen from "./src/screens/HomeScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0B0507" }}>
        <HomeScreen />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
