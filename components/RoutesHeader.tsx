import { View, Text } from "react-native";
import React from "react";
import SearchInput from "./SearchInput";

const RoutesHeader = () => {
  return (
    <View className="mt-10">
      <SearchInput placeholder="Search..." containerStyles="mb-6" />
      <Text className="font-bold text-2xl mb-4">Recommended Routes</Text>
    </View>
  );
};

export default RoutesHeader;
