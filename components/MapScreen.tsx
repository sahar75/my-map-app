import { getRecommendations } from "@/api/recommendation";
import { useRecommendationStore } from "@/store/recommendations";
import { useUserLocationStore } from "@/store/userLocation";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

const MapScreen = () => {
  const {
    selected,
    recommendations,
    setAllRecommendations,
    setRecommendations,
    setSelected,
  } = useRecommendationStore();

  const { userLocation, setUserLocation } = useUserLocationStore();
  const [userMarkerRotation, setUserMarkerRotation] = useState(0);

  const selectedRoutePoints = useMemo(
    () => recommendations?.[selected]?.points,
    [recommendations, selected]
  );

  const handleLocationUpdate = useCallback(
    (location: Location.LocationObject) => {
      if (location.coords) {
        const newUserLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(newUserLocation);

        // Calculate rotation based on the next route point
        const nextPoint = selectedRoutePoints?.[0]; // Assuming next point is the first one

        if (nextPoint) {
          const angle =
            Math.atan2(
              nextPoint.lng - newUserLocation.longitude,
              nextPoint.lat - newUserLocation.latitude
            ) *
            (180 / Math.PI);

          setUserMarkerRotation(angle);
        }
      }
    },
    [selectedRoutePoints, setUserLocation]
  );

  useEffect(() => {
    const requestLocationPermissions = async () => {
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
    };
    requestLocationPermissions();
  }, [handleLocationUpdate]);

  useEffect(() => {
    if (
      userLocation?.latitude &&
      userLocation?.longitude &&
      !recommendations.length
    ) {
      setSelected(0);
      getRecommendations({
        lat: userLocation?.latitude,
        lng: userLocation?.longitude,
      }).then((res) => {
        setAllRecommendations(res);
        setRecommendations(res);
      });
    }
  }, [userLocation.latitude]);

  const destination = useMemo(
    () => selectedRoutePoints?.[selectedRoutePoints.length - 1],
    [selectedRoutePoints]
  );

  const origin = useMemo(() => selectedRoutePoints?.[0], [selectedRoutePoints]);

  const userMarker = useMemo(
    () =>
      userLocation ? (
        <Marker
          coordinate={userLocation}
          title="Your Location"
          rotation={userMarkerRotation}
          zIndex={100}
        >
          <View className="bg-violet-400/70 rounded-full w-12 h-12 items-center justify-center border-8 border-violet-200/80">
            <FontAwesome name="location-arrow" size={24} color="white" />
          </View>
        </Marker>
      ) : null,
    [userLocation]
  );

  const destinationMarker = useMemo(
    () =>
      destination ? (
        <Marker
          coordinate={{
            latitude: destination.lat,
            longitude: destination.lng,
          }}
          title="Destination"
          zIndex={100}
          tracksInfoWindowChanges={true}
        >
          <Entypo name="location-pin" size={24} color="#5251FA" />
        </Marker>
      ) : null,
    [destination]
  );

  const originMarker = useMemo(
    () =>
      origin ? (
        <Marker
          coordinate={{ latitude: origin.lat, longitude: origin.lng }}
          title="Origin"
        >
          <View className="w-3 h-3 rounded-full bg-[#16BD97] relative" />
        </Marker>
      ) : null,
    [origin]
  );

  const polylineCoords = useMemo(
    () =>
      selectedRoutePoints?.map((point) => ({
        latitude: point.lat,
        longitude: point.lng,
      })) || [],
    [selectedRoutePoints]
  );

  return (
    <View className="flex-1">
      <MapView
        style={StyleSheet.absoluteFillObject}
        region={{
          latitude: userLocation?.latitude,
          longitude: userLocation?.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        followsUserLocation={true}
        userLocationUpdateInterval={3000}
        showsMyLocationButton
        zoomEnabled
        zoomControlEnabled
        minZoomLevel={15}
      >
        {userMarker}
        {destinationMarker}
        {originMarker}
        <Polyline
          coordinates={polylineCoords}
          strokeColor="#5932EA"
          strokeWidth={2}
        />
        <Polyline
          coordinates={polylineCoords}
          strokeColor="rgba(89, 50, 234, 0.3)"
          strokeWidth={6}
        />
      </MapView>
    </View>
  );
};

export default React.memo(MapScreen);
