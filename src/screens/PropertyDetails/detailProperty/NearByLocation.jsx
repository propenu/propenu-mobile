import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapplsGL from "mappls-map-react-native";

export default function NearByLocations({
  nearbyPlaces = [],
  location = null,
}) {
  console.log("nearbyPlacesnearbyPlaces", nearbyPlaces, location);
  const cameraRef = useRef(null);
  const [selectedPlaceName, setSelectedPlaceName] = useState("");

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
        msg.includes("Failed to load tile") &&
        msg.includes("HTTP status code 412");

      return mutedProvisionMessages.includes(msg) || shouldMuteTile412;
    });
  }, []);

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
  const hasAnyPoint = allPoints.length > 0;
  return (
    <View style={styles.container}>
      <MapplsGL.MapView
        style={styles.map}
        logoEnabled={false}
        attributionEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        onPress={() => setSelectedPlaceName("")}
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
                nearbyIcon: require("../../../../assets/redLocation.png"),
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
                propertyLocationIcon: require("../../../../assets/location.png"),
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
});
