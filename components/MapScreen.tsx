import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, StyleSheet, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { useRecommendationStore } from "@/store/recommendations";
import { getRecommendations } from "@/api/recommendation";
import Entypo from "@expo/vector-icons/Entypo";
import { FontAwesome } from "@expo/vector-icons";
import { useUserLocationStore } from "@/store/userLocation";

export const MapScreen = () => {
  const {
    selected,
    recommendations,
    setAllRecommendations,
    setRecommendations,
    setSelected,
  } = useRecommendationStore();

  const { userLocation, setUserLocation } = useUserLocationStore();

  useEffect(() => {
    if (userLocation?.latitude && userLocation?.longitude) {
      setSelected(0);
      getRecommendations({
        lat: userLocation?.latitude ?? 0,
        lng: userLocation?.longitude ?? 0,
      }).then((res) => {
        setAllRecommendations(res);
        setRecommendations(res);
      });
    }
  }, [userLocation?.latitude, userLocation?.longitude]);

  const handleLocationUpdate = useCallback(
    (location: Location.LocationObject) => {
      if (location.coords) {
        const { latitude, longitude } = location.coords;
        setUserLocation({ latitude, longitude });
      }
    },
    []
  );

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Permission to access location was denied"
        );
        return;
      }

      const locationSubscription = Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
        },
        handleLocationUpdate
      );

      return () => locationSubscription.then((sub) => sub.remove());
    })();
  }, [handleLocationUpdate]);

  const selectedRoutePoints = useMemo(
    () => recommendations?.[selected]?.points,
    [recommendations, selected]
  );
  console.log(selected);
  const destination = useMemo(
    () => selectedRoutePoints?.[selectedRoutePoints.length - 1],
    [selectedRoutePoints]
  );

  const origin = useMemo(() => selectedRoutePoints?.[0], [selectedRoutePoints]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: userLocation?.latitude,
          longitude: userLocation?.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        followsUserLocation={true}
        userLocationUpdateInterval={3000}
      >
        {userLocation && (
          <Marker coordinate={userLocation} title="Your Location">
            <FontAwesome name="location-arrow" size={24} color="black" />
          </Marker>
        )}
        <Marker
          coordinate={{
            latitude: destination?.lat ?? 0,
            longitude: destination?.lng ?? 0,
          }}
          title="Destination"
        >
          <Entypo name="location-pin" size={24} color="#5251FA" />
        </Marker>
        <Marker
          coordinate={{
            latitude: origin?.lat ?? 0,
            longitude: origin?.lng ?? 0,
          }}
          title="Origin"
        >
          <View className="w-3 h-3 rounded-full bg-[#16BD97]" />
        </Marker>
        <Polyline
          coordinates={
            selectedRoutePoints?.map((point) => {
              return { latitude: point.lat, longitude: point.lng };
            }) ?? []
          }
          strokeColor="#5932EA"
          strokeWidth={2}
        />
        <Polyline
          coordinates={
            selectedRoutePoints?.map((point) => {
              return { latitude: point.lat, longitude: point.lng };
            }) ?? []
          }
          strokeColor="rgba(89, 50, 234, 0.3)" // Darker color for shadow effect
          strokeWidth={6} // Thicker width for shadow
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
