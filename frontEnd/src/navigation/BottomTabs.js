import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import CompletedScreen from "../screens/CompletedScreen";
import RewardsScreen from "../screens/RewardsScreen";

const Tab = createMaterialTopTabNavigator();

export default function BottomTabs({ reloadWallet }) {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: true,
        animationEnabled: true,
        tabBarStyle: {
          backgroundColor: "#141012",
        },
        tabBarIndicatorStyle: {
          backgroundColor: "#C1121F",
          height: 3,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarActiveTintColor: "#C1121F",
        tabBarInactiveTintColor: "#A8A8A8",
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
        name="Completed"
        component={CompletedScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="checkmark-done" size={20} color={color} />
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
        {(props) => <RewardsScreen {...props} reloadWallet={reloadWallet} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
