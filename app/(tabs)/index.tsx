import { FlatList, Pressable, RefreshControl, View } from "react-native";

import EmptyState from "@/components/EmptyState";
import MapScreen from "@/components/MapScreen";
import RouteCard from "@/components/RouteCard";
import RoutesHeader from "@/components/RoutesHeader";
import { useRecommendationStore } from "@/store/recommendations";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { getRecommendations } from "@/api/recommendation";
import { useUserLocationStore } from "@/store/userLocation";

export default function TabOneScreen() {
  const {
    selected,
    setSelected,
    recommendations,
    setAllRecommendations,
    setRecommendations,
    reset,
  } = useRecommendationStore();

  const { userLocation } = useUserLocationStore();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setSelected(0);
    getRecommendations({
      lat: userLocation.latitude,
      lng: userLocation.longitude,
    })
      .then((res) => {
        setAllRecommendations(res);
        setRecommendations(res);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  return (
    <View className="w-full h-full flex-row">
      <FlatList
        data={recommendations}
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <View className="w-2/3 h-full">
        <MapScreen />
      </View>
      <Pressable
        className="w-20 h-20 border border-gray-300 bg-white rounded-full absolute left-[35%] bottom-5 items-center justify-center"
        onPress={onRefresh}
        disabled={refreshing}
      >
        <FontAwesome name="refresh" size={24} color="#5932EA" />
      </Pressable>
    </View>
  );
}
