import React, { useState, useMemo, useEffect } from "react";
import { Image, Platform, View } from "react-native";
import MapplsGL from "mappls-map-react-native";
import MapView, { Marker } from "react-native-maps";
import { useDispatch } from "react-redux";
import { setBaseField } from "../../redux/slice/PostPropertySlice";
import { buildMapplsHandlers } from "../../utils/mapplsConfig";

export default function MapScreen() {
  const dispatch = useDispatch();
  const mapHandlers = useMemo(() => buildMapplsHandlers("MapScreen"), []);
  const isIos = Platform.OS === "ios";
  const locationIcon = useMemo(
    () => require("../../../assets/location.png"),
    [],
  );

  // initial position [lat, lng]
  const initialPosition = useMemo(() => [17.4013, 78.41104], []);
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    MapplsGL.Logger.setLogCallback((log) => {
      const msg = log?.message || "";
      const mutedProvisionMessages = [
        "setLogoGravity: Method not Provisioned",
        "enableTraffic: Method not Provisioned",
        "enableTrafficClosure: Method not Provisioned",
        "enableTrafficFreeFlow: Method not Provisioned",
        "enableTrafficNonFreeFlow: Method not Provisioned",
        "enableTrafficStopIcon: Method not Provisioned",
      ];

      const shouldMuteTile412 =
        msg.includes("Failed to load tile") && msg.includes("HTTP status code 412");

      if (mutedProvisionMessages.includes(msg) || shouldMuteTile412) {
        return true;
      }
      return false;
    });
  }, []);

  // Handle map click
  const handleMapPress = (feature) => {
    const coordinates = feature?.geometry?.coordinates;
    if (!Array.isArray(coordinates) || coordinates.length < 2) return;

    const [lng, lat] = coordinates;
    updateLocation(lat, lng);
  };

  const updateLocation = (lat, lng) => {
    setPosition([lat, lng]);
    dispatch(
      setBaseField({
        key: "location",
        value: {
          type: "Point",
          coordinates: [lng, lat],
        },
      }),
    );
  };

  const handleIosMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate || {};
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return;
    }

    updateLocation(latitude, longitude);
  };

  if (isIos) {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: position[0],
            longitude: position[1],
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          region={{
            latitude: position[0],
            longitude: position[1],
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onPress={handleIosMapPress}
        >
          <Marker
            coordinate={{
              latitude: position[0],
              longitude: position[1],
            }}
          >
            <Image
              source={locationIcon}
              style={{ width: 28, height: 28, resizeMode: "contain" }}
            />
          </Marker>
        </MapView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapplsGL.MapView
        style={{ flex: 1 }}
        onPress={handleMapPress}
        onMapError={mapHandlers.onMapError}
        onMapReinit={mapHandlers.onMapReinit}
        onDidFailLoadingMap={mapHandlers.onDidFailLoadingMap}
        logoEnabled
        attributionEnabled
      >
        {/* Camera */}
        <MapplsGL.Camera
          zoomLevel={12}
          minZoomLevel={4}
          maxZoomLevel={22}
          centerCoordinate={[position[1], position[0]]} // [lng, lat]
        />

        {/* Register Image */}
        <MapplsGL.Images
          images={{
            locationIcon,
          }}
        />

        {/* Marker using ShapeSource */}
        <MapplsGL.ShapeSource
          id="locationSource"
          shape={{
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [position[1], position[0]], 
            },
          }}
        >
          <MapplsGL.SymbolLayer
            id="locationLayer"
            style={{
              iconImage: "locationIcon",
              iconSize: 0.07,
              iconAllowOverlap: true,
            }}
          />
        </MapplsGL.ShapeSource>
      </MapplsGL.MapView>
    </View>
  );
}

// import MapView, { Marker } from 'react-native-maps';
// import { useState } from 'react';
// import { View } from 'react-native';

// export default function MapScreen() {
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   console.log("selectedLocationselectedLocation", selectedLocation)

//   return (
//     <View style={{ flex: 1 }}>
//       <MapView
//         style={{ flex: 1 }}
//         initialRegion={{
//           latitude: 17.385,
//           longitude: 78.486,
//           latitudeDelta: 0.05,
//           longitudeDelta: 0.05,
//         }}
//         onPress={(e) => {
//           setSelectedLocation(e.nativeEvent.coordinate);
//         }}
//       >
//         {selectedLocation && (
//           <Marker coordinate={selectedLocation} />
//         )}
//       </MapView>
//     </View>
//   );
// }
