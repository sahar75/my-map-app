import { FlatList, Pressable, View } from "react-native";

import { useGetRecommendationsQuery } from "@/api/recommendation";
import EmptyState from "@/components/EmptyState";
import RouteCard from "@/components/RouteCard";
import RoutesHeader from "@/components/RoutesHeader";
import { FontAwesome } from "@expo/vector-icons";
import { useRecommendationStore } from "@/store/recommendations";
import { MapScreen } from "@/components/MapScreen";

export default function TabOneScreen() {
  const { selected, setSelected } = useRecommendationStore();
  const { data } = useGetRecommendationsQuery();

  console.log("data", data?.length);

  return (
    <View className="w-full h-full flex-row">
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <RouteCard
            item={item}
            selected={selected === index}
            onPress={() => setSelected(index)}
            index={index + 1}
          />
        )}
        ListHeaderComponent={() => <RoutesHeader />}
        ListEmptyComponent={() => <EmptyState title="No Route Found" />}
        className="p-10 pt-0 w-1/3 h-full bg-[#FBFBFB]"
        ListFooterComponent={() => <View className="h-5" />}
      />
      <View className="w-2/3 h-full">
        <MapScreen />
      </View>
      <Pressable className="w-20 h-20 border border-gray-300 bg-white rounded-full absolute right-5 bottom-5 items-center justify-center">
        <FontAwesome name="refresh" size={24} color="#5932EA" />
      </Pressable>
    </View>
  );
}
