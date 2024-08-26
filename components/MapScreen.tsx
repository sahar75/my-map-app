import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, StyleSheet, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { useGetRecommendationsQuery } from "@/api/recommendation";
import { useRecommendationStore } from "@/store/recommendations";

interface RoutePoint {
  latitude: number;
  longitude: number;
}

export const MapScreen = () => {
  const [region, setRegion] = useState({
    latitude: 32.4279,
    longitude: 53.688,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [userLocation, setUserLocation] = useState<RoutePoint | null>(null);

  const { data: recommendations } = useGetRecommendationsQuery({
    lat: 32.4279,
    lng: 53.688,
  });
  console.log("recommendations", recommendations?.length);
  const { selected } = useRecommendationStore();

  const handleLocationUpdate = useCallback(
    (location: Location.LocationObject) => {
      if (location.coords) {
        const { latitude, longitude } = location.coords;
        setUserLocation({ latitude, longitude });
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
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
    [recommendations]
  );

  const destination = useMemo(
    () => selectedRoutePoints?.[selectedRoutePoints.length - 1],
    [selectedRoutePoints]
  );

  const origin = useMemo(() => selectedRoutePoints?.[0], [selectedRoutePoints]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {userLocation && (
          <Marker coordinate={userLocation} title="Your Location" />
        )}
        <Marker
          coordinate={{
            latitude: destination?.lat ?? 0,
            longitude: destination?.lng ?? 0,
          }}
          title="Destination"
        />
        <Marker
          coordinate={{
            latitude: origin?.lat ?? 0,
            longitude: origin?.lng ?? 0,
          }}
          title="Origin"
        />
        <Polyline
          coordinates={
            selectedRoutePoints?.map((point) => {
              return { latitude: point.lat, longitude: point.lng };
            }) ?? []
          }
          strokeColor="#FF0000"
          strokeWidth={3}
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
