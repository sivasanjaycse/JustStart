import { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import CompletedScreen from "../screens/CompletedScreen";
import AppLayout from "../screens/AppLayout";
import { getWallet } from "../api/walletApi";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [wallet, setWallet] = useState(null);

  const loadWallet = async () => {
    try {
      const data = await getWallet();
      setWallet(data);
    } catch (e) {
      console.log("Wallet fetch failed", e);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  return (
    <AppLayout permanentPoints={wallet?.permanentPoints ?? 0}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} reloadWallet={loadWallet} />}
        </Stack.Screen>

        <Stack.Screen
          name="Completed"
          component={CompletedScreen}
          options={{
            animation: "slide_from_right", // ✅ smooth native slide
            animationDuration: 1550,
          }}
        />
      </Stack.Navigator>
    </AppLayout>
  );
}
