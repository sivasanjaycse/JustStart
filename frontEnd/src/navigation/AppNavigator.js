import { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppLayout from "../screens/AppLayout";
import BottomTabs from "./BottomTabs";
import TransactionsScreen from "../screens/TransactionsScreen";
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
        {/* MAIN APP (BOTTOM TABS) */}
        <Stack.Screen name="Main">
          {(props) => <BottomTabs {...props} reloadWallet={loadWallet} />}
        </Stack.Screen>

        {/* WALLET → TRANSACTIONS (HIDDEN) */}
        <Stack.Screen
          name="Transactions"
          component={TransactionsScreen}
          options={{
            animation: "slide_from_left",
            gestureEnabled: true,
          }}
        />
      </Stack.Navigator>
    </AppLayout>
  );
}
