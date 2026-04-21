import { useEffect, useMemo, useRef, useState } from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { buildMapplsHandlers, getMapplsGL } from "../../../utils/mapplsConfig";

export default function NearByLocations({
  nearbyPlaces = [],
  location = null,
}) {

  const cameraRef = useRef(null);
  const iosMapRef = useRef(null);
  const [selectedPlaceName, setSelectedPlaceName] = useState("");
  const isIos = Platform.OS === "ios";
  const MapplsGL = useMemo(() => (isIos ? null : getMapplsGL()), [isIos]);
  const propertyIcon = useMemo(
    () => require("../../../../assets/location.png"),
    [],
  );
  const nearbyIcon = useMemo(
    () => require("../../../../assets/redLocation.png"),
    [],
  );
  const mapHandlers = useMemo(
    () => buildMapplsHandlers("NearByLocations"),
    [],
  );

  useEffect(() => {
    if (!MapplsGL?.Logger?.setLogCallback) {
      return;
    }

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
        msg.includes("Failed to load tile") &&
        msg.includes("HTTP status code 412");

      return mutedProvisionMessages.includes(msg) || shouldMuteTile412;
    });
  }, [MapplsGL]);

  const nearbyPoints = useMemo(
    () =>
      Array.isArray(nearbyPlaces)
        ? nearbyPlaces
            .filter(
              (place) =>
                Array.isArray(place.coordinates) &&
                place.coordinates.length === 2,
            )
            .map((place, index) => ({
              id: `nearby-${index}`,
              lng: place.coordinates[0],
              lat: place.coordinates[1],
              label: place.name || `Nearby ${index + 1}`,
            }))
        : [],
    [nearbyPlaces],
  );

  const propertyPoint = useMemo(
    () => {
      const coordinates = Array.isArray(location?.coordinates)
        ? location.coordinates
        : Array.isArray(location) && location.length === 2
          ? location
          : null;

      return coordinates
        ? {
            id: "property-location",
            lng: coordinates[0],
            lat: coordinates[1],
            label: "Property Location",
          }
        : null;
    },
    [location],
  );

  const allPoints = useMemo(
    () => (propertyPoint ? [propertyPoint, ...nearbyPoints] : nearbyPoints),
    [nearbyPoints, propertyPoint],
  );

  const initialCenter = useMemo(() => {
    if (propertyPoint) {
      return [propertyPoint.lng, propertyPoint.lat];
    }

    if (!allPoints.length) {
      return [78.9629, 20.5937];
    }

    if (allPoints.length === 1) {
      return [allPoints[0].lng, allPoints[0].lat];
    }

    const totals = allPoints.reduce(
      (acc, point) => ({
        lng: acc.lng + point.lng,
        lat: acc.lat + point.lat,
      }),
      { lng: 0, lat: 0 },
    );

    return [totals.lng / allPoints.length, totals.lat / allPoints.length];
  }, [allPoints]);

  const nearbyShape = useMemo(
    () => ({
      type: "FeatureCollection",
      features: nearbyPoints.map((point) => ({
        type: "Feature",
        id: point.id,
        properties: {
          label: point.label,
        },
        geometry: {
          type: "Point",
          coordinates: [point.lng, point.lat],
        },
      })),
    }),
    [nearbyPoints],
  );

  const propertyShape = useMemo(
    () =>
      propertyPoint
        ? {
            type: "Feature",
            id: propertyPoint.id,
            properties: {
              label: propertyPoint.label,
            },
            geometry: {
              type: "Point",
              coordinates: [propertyPoint.lng, propertyPoint.lat],
            },
          }
        : null,
    [propertyPoint],
  );

  useEffect(() => {
    if (isIos || !cameraRef.current || !allPoints.length) {
      return;
    }

    if (propertyPoint) {
      cameraRef.current.moveTo([propertyPoint.lng, propertyPoint.lat], 800);
    }

    if (allPoints.length === 1) {
      cameraRef.current.zoomTo(14, 800);
      return;
    }

    const bounds = allPoints.reduce(
      (acc, point) => ({
        minLng: Math.min(acc.minLng, point.lng),
        maxLng: Math.max(acc.maxLng, point.lng),
        minLat: Math.min(acc.minLat, point.lat),
        maxLat: Math.max(acc.maxLat, point.lat),
      }),
      {
        minLng: allPoints[0].lng,
        maxLng: allPoints[0].lng,
        minLat: allPoints[0].lat,
        maxLat: allPoints[0].lat,
      },
    );

    cameraRef.current.fitBounds(
      [bounds.maxLng, bounds.maxLat],
      [bounds.minLng, bounds.minLat],
      40,
      800,
    );
  }, [allPoints, isIos, propertyPoint]);

  useEffect(() => {
    if (!isIos || !iosMapRef.current || !allPoints.length) {
      return;
    }

    if (allPoints.length === 1) {
      iosMapRef.current.animateToRegion(
        {
          latitude: allPoints[0].lat,
          longitude: allPoints[0].lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        800,
      );
      return;
    }

    iosMapRef.current.fitToCoordinates(
      allPoints.map((point) => ({
        latitude: point.lat,
        longitude: point.lng,
      })),
      {
        edgePadding: {
          top: 40,
          right: 40,
          bottom: 40,
          left: 40,
        },
        animated: true,
      },
    );
  }, [allPoints, isIos]);

  const initialRegion = useMemo(
    () => ({
      latitude: initialCenter[1],
      longitude: initialCenter[0],
      latitudeDelta: allPoints.length <= 1 ? 0.02 : 0.12,
      longitudeDelta: allPoints.length <= 1 ? 0.02 : 0.12,
    }),
    [allPoints.length, initialCenter],
  );

  if (isIos) {
    return (
      <View style={styles.container}>
        <MapView
          ref={iosMapRef}
          style={styles.map}
          initialRegion={initialRegion}
          onPress={() => setSelectedPlaceName("")}
        >
          {propertyPoint ? (
            <Marker
              coordinate={{
                latitude: propertyPoint.lat,
                longitude: propertyPoint.lng,
              }}
              title={propertyPoint.label}
            >
              <Image source={propertyIcon} style={styles.propertyMarkerIcon} />
            </Marker>
          ) : null}
          {nearbyPoints.map((point) => (
            <Marker
              key={point.id}
              coordinate={{
                latitude: point.lat,
                longitude: point.lng,
              }}
              title={point.label}
              onPress={() => setSelectedPlaceName(point.label)}
            >
              <Image source={nearbyIcon} style={styles.nearbyMarkerIcon} />
            </Marker>
          ))}
        </MapView>

        {selectedPlaceName ? (
          <View style={styles.labelBubble}>
            <Text style={styles.labelText}>{selectedPlaceName}</Text>
          </View>
        ) : null}
      </View>
    );
  }

  useEffect(() => {
    if (!cameraRef.current || !allPoints.length) {
      return;
    }

    if (propertyPoint) {
      cameraRef.current.moveTo([propertyPoint.lng, propertyPoint.lat], 800);
    }

    if (allPoints.length === 1) {
      cameraRef.current.zoomTo(14, 800);
      return;
    }

    const bounds = allPoints.reduce(
      (acc, point) => ({
        minLng: Math.min(acc.minLng, point.lng),
        maxLng: Math.max(acc.maxLng, point.lng),
        minLat: Math.min(acc.minLat, point.lat),
        maxLat: Math.max(acc.maxLat, point.lat),
      }),
      {
        minLng: allPoints[0].lng,
        maxLng: allPoints[0].lng,
        minLat: allPoints[0].lat,
        maxLat: allPoints[0].lat,
      },
    );

    cameraRef.current.fitBounds(
      [bounds.maxLng, bounds.maxLat],
      [bounds.minLng, bounds.minLat],
      40,
      800,
    );
  }, [allPoints, propertyPoint]);
  if (!MapplsGL) {
    return null;
  }

  return (
    <View style={styles.container}>
      <MapplsGL.MapView
        style={styles.map}
        logoEnabled={false}
        attributionEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        onPress={() => setSelectedPlaceName("")}
        onMapError={mapHandlers.onMapError}
        onMapReinit={mapHandlers.onMapReinit}
        onDidFailLoadingMap={mapHandlers.onDidFailLoadingMap}
      >
        <MapplsGL.Camera
          ref={cameraRef}
          minZoomLevel={4}
          maxZoomLevel={20}
          centerCoordinate={initialCenter}
          zoomLevel={allPoints.length === 1 ? 14 : 11}
        />
        {nearbyPoints.length ? (
          <>
            <MapplsGL.Images
              images={{
                nearbyIcon,
              }}
            />

            <MapplsGL.ShapeSource
              id="nearbyLocationsSource"
              shape={nearbyShape}
              onPress={(event) => {
                const feature = event?.features?.[0];
                const label = feature?.properties?.label;
                setSelectedPlaceName(label || "");
              }}
            >
              <MapplsGL.SymbolLayer
                id="nearbyLocationsLayer"
                style={{
                  iconImage: "nearbyIcon",
                  iconSize: 0.02,
                  iconRotate: 180,
                  iconAllowOverlap: true,
                }}
              />
            </MapplsGL.ShapeSource>
          </>
        ) : (null
          // <MapplsGL.Camera
          //   ref={cameraRef}
          //   minZoomLevel={4}
          //   maxZoomLevel={20}
          //   centerCoordinate={initialCenter}
          //   zoomLevel={hasAnyPoint ? (allPoints.length === 1 ? 14 : 11) : 5}
          // />
        )}
        {propertyShape ? (
          <>
            <MapplsGL.Images
              images={{
                propertyLocationIcon: propertyIcon,
              }}
            />
            <MapplsGL.ShapeSource
              id="propertyLocationSource"
              shape={propertyShape}
            >
              <MapplsGL.SymbolLayer
                id="propertyLocationLayer"
                style={{
                  iconImage: "propertyLocationIcon",
                  iconSize: 0.05,
                  iconAllowOverlap: true,
                }}
              />
            </MapplsGL.ShapeSource>
          </>
        ) : null}
      </MapplsGL.MapView>

      {selectedPlaceName ? (
        <View style={styles.labelBubble}>
          <Text style={styles.labelText}>{selectedPlaceName}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  labelBubble: {
    position: "absolute",
    top: 12,
    alignSelf: "center",
    maxWidth: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  labelText: {
    color: "#1F2937",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 14,
  },
  propertyMarkerIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  nearbyMarkerIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
});
