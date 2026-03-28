import React, { useState, useMemo, useEffect } from "react";
import { View } from "react-native";
import MapplsGL from "mappls-map-react-native";
import { useDispatch } from "react-redux";
import { setBaseField } from "../../redux/slice/PostPropertySlice";

export default function MapScreen() {
  const dispatch = useDispatch();

  // initial position [lat, lng]
  const initialPosition = useMemo(() => [17.4013, 78.41104], []);
  const [position, setPosition] = useState(initialPosition);

  // Optional: mute unnecessary logs
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

    // update state
    setPosition([lat, lng]);

    console.log("Selected:", lat, lng);

    // redux update
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

  return (
    <View style={{ flex: 1 }}>
      <MapplsGL.MapView
        style={{ flex: 1 }}
        onPress={handleMapPress}
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
            locationIcon: require("../../../assets/location.png"),
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
