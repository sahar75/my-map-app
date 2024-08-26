import FontAwesome from "@expo/vector-icons/FontAwesome";
import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";

import { useWindowDimensions } from "react-native";
import TabOneScreen from ".";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const Drawer = createDrawerNavigator();

export default function TabLayout() {
  const dimensions = useWindowDimensions();

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: dimensions.width >= 768 ? "front" : "front",
      }}
    >
      <Drawer.Screen name="Home">{() => <TabOneScreen />}</Drawer.Screen>
    </Drawer.Navigator>
  );
}
