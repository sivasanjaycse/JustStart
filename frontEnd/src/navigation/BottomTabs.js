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
          elevation: 8,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          height: 62,
          paddingBottom: 4,
          paddingTop: 4,
        },
        tabBarIndicatorStyle: {
          backgroundColor: COLORS.primary,
          height: 3,
          borderRadius: 3,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          textTransform: "none",
          letterSpacing: 0.1,
          marginTop: -2,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarPressColor: COLORS.surface,
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={21}
              color={color}
            />
          ),
        }}
      >
        {(props) => <HomeScreen {...props} reloadWallet={reloadWallet} />}
      </Tab.Screen>

      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "stats-chart" : "stats-chart-outline"}
              size={21}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Rewards"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "gift" : "gift-outline"}
              size={21}
              color={color}
            />
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
