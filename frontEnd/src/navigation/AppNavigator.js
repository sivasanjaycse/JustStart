import { useEffect, useState } from "react";
import AppLayout from "../screens/AppLayout";
import BottomTabs from "./BottomTabs";
import { getWallet } from "../api/walletApi";

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
      <BottomTabs reloadWallet={loadWallet} />
    </AppLayout>
  );
}
