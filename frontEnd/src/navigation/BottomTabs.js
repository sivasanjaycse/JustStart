import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import AnalyticsScreen from "../screens/AnalyticsScreen";
import RewardsScreen from "../screens/RewardsScreen";
import { COLORS } from "../styles/theme";

const Tab = createMaterialTopTabNavigator();

export default function BottomTabs({ reloadWallet, walletPoints }) {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: true,
        animationEnabled: true,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          elevation: 4,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
        },
        tabBarIndicatorStyle: {
          backgroundColor: COLORS.primary,
          height: 3,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          textTransform: "capitalize",
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarPressColor: COLORS.surfaceAlt,
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={20} color={color} />
          ),
        }}
      >
        {(props) => <HomeScreen {...props} reloadWallet={reloadWallet} />}
      </Tab.Screen>

      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="stats-chart" size={20} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Rewards"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="gift" size={20} color={color} />
          ),
        }}
      >
        {(props) => (
          <RewardsScreen
            {...props}
            reloadWallet={reloadWallet}
            walletPoints={walletPoints}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
