import { useEffect, useState, useCallback } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppLayout from "../screens/AppLayout";
import BottomTabs from "./BottomTabs";
import TransactionsScreen from "../screens/TransactionsScreen";
import { getWallet, settleUnsettledDays } from "../store/DataStore";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [wallet, setWallet] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadWallet = async () => {
    try {
      const data = await getWallet();
      setWallet(data);
    } catch (e) {
      console.log("Wallet fetch failed", e);
    }
  };

  const handleDataImported = () => {
    setRefreshKey((k) => k + 1);
    loadWallet();
  };

  useEffect(() => {
    loadWallet();

    const runSettlementCheck = async () => {
      const changed = await settleUnsettledDays();
      if (changed) {
        await loadWallet();
        setRefreshKey((k) => k + 1);
      }
    };

    runSettlementCheck();

    // Check settlement periodically (e.g. at 11:59 PM IST)
    const interval = setInterval(runSettlementCheck, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppLayout
      permanentPoints={wallet?.permanentPoints ?? 0}
      onDataImported={handleDataImported}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* MAIN APP (BOTTOM TABS) */}
        <Stack.Screen name="Main">
          {(props) => (
            <BottomTabs
              {...props}
              reloadWallet={loadWallet}
              key={refreshKey}
              walletPoints={wallet?.permanentPoints ?? 0}
            />
          )}
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
