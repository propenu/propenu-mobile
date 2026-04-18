import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  FlatList,
  Platform,
  ActivityIndicator,
} from "react-native";
import { apiService } from "../../services/apiService";
import { SafeAreaView } from "react-native-safe-area-context";
import RemoteSvg from "../../lib/RemoteSVG";
import { LocationIcon, Logo } from "../../../assets/svg/Logo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AmenitiesWithModal from "./detailProperty/AmenitiesWithModal";
import NearByLocations from "./detailProperty/NearByLocation";
import AvailableProperties from "./detailProperty/AvailableProperties";
import Gallery from "./detailProperty/Gallary";
import EnquiryModal from "../../components/ui/EnquiryModal";
import Specifications from "./detailProperty/Specifications";
import RenderHTML from "react-native-render-html";
import useDimensions from "../../components/CustomHooks/UseDimension";
import { prop } from "ramda";
import formatINR from "../../utils/FormatINR";
const PropertyDetailsScreen = ({ route }) => {
  const { width } = useDimensions();
  const { propertyId } = route.params;
  const [property, setProperty] = useState(null);
  const [showNav, setShowNav] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [isLoading, setIsLoadiing] = useState(false);

  console.log("propertyIdpropertyIdpropertyId", propertyId);
  const scrollRef = useRef(null);
  const sectionPositions = useRef({
    properties: 0,
    gallery: 0,
    amenities: 0,
    location: 0,
    about: 0,
  });

  const handleScroll = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    if (y > 220 && !showNav) {
      setShowNav(true);
    }
    // else setShowNav(false)
  };

  useEffect(() => {
    fetchPropertyDetails();
  }, [propertyId]);

  useEffect(() => {
    return () => setShowNav(false);
  }, []);

  const fetchPropertyDetails = async () => {
    try {
      setIsLoadiing(true);
      const res = await apiService.featuredProjectById(propertyId);
      setProperty(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadiing(false);
    }
  };

  // if (!property) {
  //   return (
  //     <SafeAreaView style={styles.center}>
  //       <Text>No property found</Text>
  //     </SafeAreaView>
  //   );
  // }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" style={{ color: "#27AE60" }} />
        <Text>Loading...</Text>
      </View>
    );
  }

  const formatMonthYear = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getDistanceInKm = (coord2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const lon1 = property?.location?.coordinates[0];
    const lat1 = property?.location?.coordinates[1];
    const lon2 = coord2[0];
    const lat2 = coord2[1];

    const R = 6371; // Earth radius in KM

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  return (
    <SafeAreaView style={styles.safe}>
      {showNav && (
        <View style={styles.stickyNav}>
          <Pressable
            onPress={() =>
              scrollRef.current?.scrollTo({
                y: sectionPositions.current.properties - 60,
                animated: true,
              })
            }
          >
            <Text style={styles.sectionTitle}>Properties</Text>
          </Pressable>

          <Pressable
            onPress={() =>
              scrollRef.current?.scrollTo({
                y: sectionPositions.current.gallery - 60,
                animated: true,
              })
            }
          >
            <Text style={styles.sectionTitle}>Gallery</Text>
          </Pressable>

          <Pressable
            onPress={() =>
              scrollRef.current?.scrollTo({
                y: sectionPositions.current.amenities - 60,
                animated: true,
              })
            }
          >
            <Text style={styles.sectionTitle}>Amenities</Text>
          </Pressable>

          <Pressable
            onPress={() =>
              scrollRef.current?.scrollTo({
                y: sectionPositions.current.location - 60,
                animated: true,
              })
            }
          >
            <Text style={styles.sectionTitle}>Location</Text>
          </Pressable>

          <Pressable
            onPress={() =>
              scrollRef.current?.scrollTo({
                y: sectionPositions.current.about - 60,
                animated: true,
              })
            }
          >
            <Text style={styles.sectionTitle}>About</Text>
          </Pressable>
        </View>
      )}

      <ScrollView
        // contentContainerStyle={styles.container}
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageWrapper}>
          {property?.heroImage ? (
            <Image
              source={{ uri: property.heroImage }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Text>No Image</Text>
            </View>
          )}

          <Pressable
            style={[
              styles.enquirybtn,
              {
                backgroundColor: property?.color ? property?.color : "#27AE60",
              },
            ]}
            onPress={() => setShowEnquiryModal(true)}
          >
            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "500" }}>
              Enquiry Now
            </Text>
          </Pressable>
          <EnquiryModal
            propertyId={propertyId}
            showEnquiry={showEnquiryModal}
            setShowEnquiry={setShowEnquiryModal}
          />
        </View>
        <View style={styles.row}>
          <View
            style={{
              width: 100,
              height: 80,
              borderRadius: 10,
              // backgroundColor: "#eee",
            }}
          >
            {property?.logo?.url ? (
              (() => {
                const url = property.logo.url;
                const extension = url.split(".").pop().toLowerCase();

                if (extension === "svg") {
                  // Remote SVG
                  return <RemoteSvg url={url} width={100} height={70} />;
                } else {
                  // PNG, JPG, etc.
                  return (
                    <Image
                      source={{ uri: url }}
                      style={{
                        width: 100,
                        height: 70,
                        borderRadius: 10,
                        // backgroundColor: "#eee",
                      }}
                      resizeMode="contain"
                    />
                  );
                }
              })()
            ) : (
              <View
                style={{
                  width: 100,
                  height: 80,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  // backgroundColor: "#eee",
                }}
              >
                <Logo width={44} height={44} />
              </View>
            )}
          </View>
          <View style={styles.title}>
            <Text numberOfLines={1} style={styles.titleText}>
              {property?.title}
            </Text>
            <View
              style={{
                flexDirection: "row",
                // justifyContent: "center",
                alignItems: "center",
                gap: 2,
              }}
            >
              <LocationIcon width={14} height={14} color={"#545454"} />
              <Text numberOfLines={1} style={styles.location}>
                {property?.address}
              </Text>
            </View>
          </View>
        </View>

        <Text
          style={{
            color: "#FFAC1D",
            fontWeight: "600",
            marginLeft: 15,
            marginVertical: 8,
          }}
        >
          {property?.priceFrom && property?.priceTo
            ? `${formatINR(property.priceFrom)} - ${formatINR(property.priceTo)}`
            : property?.priceFrom
              ? formatINR(property.priceFrom)
              : "Price on request"}

          <Text style={{ color: "#000", fontWeight: "500" }}>
            {property?.pricePersqft ? ` / ${property.pricePersqft}` : ""}
          </Text>
        </Text>
        <View style={[styles.section, { backgroundColor: property?.color ?`${property.color}0A` : "#f7f4f4"}]}>
          <View style={styles.sectionRow}>
            <View style={styles.center}>
              <Text style={styles.sectionData}>
                {property?.bhkSummary?.[0]?.bhkLabel || "2, 3 BHK"}
                {/* 2 - {property?.bhkSummary?.length + 1} BHK */}
              </Text>
              <Text style={styles.sectionTitle}>Configuration</Text>
            </View>
            <View style={styles.center}>
              <Text style={styles.sectionData}>
                {property?.amenities?.length
                  ? `${property.amenities.length}+`
                  : "—"}
              </Text>
              <Text style={styles.sectionTitle}>Amenities</Text>
            </View>
            <View style={styles.center}>
              <Text style={styles.sectionData}>
                {property?.projectArea ? property.projectArea : "—"}
              </Text>
              <Text style={styles.sectionTitle}>Total Area</Text>
            </View>
          </View>
          <View style={styles.sectionRow}>
            <View style={styles.center}>
              <Text style={styles.sectionData}>
                {property?.possessionDate
                  ? formatMonthYear(property?.possessionDate)
                  : "—"}
              </Text>
              <Text style={styles.sectionTitle}>Ready To Move</Text>
            </View>
            <View style={styles.center}>
              <Text style={styles.sectionData}>
                {property?.totalUnits ? property?.totalUnits : "—"}
              </Text>
              <Text style={styles.sectionTitle}>Units</Text>
            </View>
            <View style={styles.center}>
              {/* <Text style={styles.sectionData}>2,3 BHK</Text> */}
              {property?.reraNumber ? (
                <View style={styles.rera}>
                  <MaterialIcons
                    name="check-circle"
                    size={13}
                    color="#545454"
                  />
                  <Text style={styles.reraText}>RERA</Text>
                </View>
              ) : (
                <Text style={styles.reraText}>RERA</Text>
              )}
              <Text style={styles.sectionTitle}>Approved</Text>
            </View>
          </View>
        </View>

        <View
          onLayout={(e) => {
            sectionPositions.current.properties = e.nativeEvent.layout.y;
          }}
        >
          <AvailableProperties
            bhk={property}
            bookAppointment={() => setShowEnquiryModal(true)}
          />
        </View>

        <View
          onLayout={(e) =>
            (sectionPositions.current.gallery = e.nativeEvent.layout.y)
          }
        >
          <Gallery property={property} />
        </View>

        <Specifications property={property} />

        <View
          onLayout={(e) =>
            (sectionPositions.current.amenities = e.nativeEvent.layout.y)
          }
        >
          <AmenitiesWithModal
            amenities={property?.amenities}
            color={property?.color}
          />
        </View>

        <View
          onLayout={(e) =>
            (sectionPositions.current.location = e.nativeEvent.layout.y)
          }
        >
          {property?.nearbyPlaces && (
            <View style={styles.gallery}>
              <Text
                style={[
                  styles.aboutUs,
                  { color: property?.color ? property.color : "#000" },
                ]}
              >
                Location & Landmarks
              </Text>
              <Text style={styles.subtitle}>
                Everything you need, just minutes away
              </Text>

              <FlatList
                data={property?.nearbyPlaces}
                horizontal
                keyExtractor={(item, index) => `${item.name}-${index}`}
                renderItem={({ item }) => (
                  <View style={styles.placeRow}>
                    <LocationIcon color="#FFAC1D" width={18} height={18} />
                    <Text style={styles.placeName}>
                      {item.name} :{" "}
                      {getDistanceInKm(item.coordinates).toFixed(2)} km
                    </Text>
                  </View>
                )}
                showsHorizontalScrollIndicator={false}
              />
              <View style={styles.mapBox}>
                {Platform.OS === "web" ? (
                  <Text>Map is available on mobile only</Text>
                ) : (
                  <NearByLocations
                    nearbyPlaces={property?.nearbyPlaces}
                    location={property?.location}
                  />
                )}
              </View>
            </View>
          )}
        </View>

        <View
          onLayout={(e) =>
            (sectionPositions.current.about = e.nativeEvent.layout.y)
          }
        >
          <Text
            style={[
              styles.aboutUs,
              { color: property?.color ? property.color : "#000" },
            ]}
          >
            About Us
          </Text>
          <Text style={styles.subtitle}>The story behind the project</Text>
          {property?.aboutSummary?.map((item, index) => (
            <View key={index} style={styles.homepage}>
              <Text style={styles.about}>{item?.aboutDescription}</Text>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: item?.url }}
                  style={styles.homePageImage}
                />
                {/* <Text style={styles.overlayText}>Why Choose Us</Text> */}
              </View>
              <View style={{ marginTop: 10, marginBottom: 5 }}>
                <RenderHTML
                  contentWidth={width * 0.9}
                  source={{ html: item?.rightContent }}
                  tagsStyles={{
                    ol: { marginLeft: 10, marginTop: 10 },
                    ul: { marginLeft: 10, marginTop: 10 },
                    li: { marginBottom: 8 },
                    p: {
                      fontSize: 12,
                      color: "#000",
                      lineHeight: 20,
                      paddingLeft: 5,
                      textAlign: "justify",
                    },
                    h1: {
                      fontSize: 12,
                      // fontWeight:500,
                      marginLeft: 10,
                      lineHeight: 20,
                      textAlign: "justify",
                    },
                    h2: {
                      fontSize: 12,
                      marginLeft: 10,
                      lineHeight: 20,
                      textAlign: "justify",
                    },
                    h3: {
                      fontSize: 12,
                      marginLeft: 10,
                      lineHeight: 20,
                      textAlign: "justify",
                    },
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PropertyDetailsScreen;
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    paddingBottom: 16,
  },
  imageWrapper: {
    position: "relative",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 5,
    marginBottom: 7,
    paddingLeft: 16,
  },

  image: {
    width: "100%",
    height: 220,
    // backgroundColor: "#eee",
  },

  enquirybtn: {
    position: "absolute",
    bottom: 12,
    right: 10,
    // backgroundColor: "#27AE60",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    elevation: 5,
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  stickyNav: {
    position: "absolute",
    top: 32,
    left: 0,
    right: 0,
    height: 56,
    zIndex: 1000,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navItem: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 7,
    gap: 10,
  },
  title: {
    justifyContent: "center",
    // alignItems:"center"
  },
  logo: {
    width: 200,
    // height: 200,
  },
  titleText: {
    fontSize: 14,
    fontWeight: 500,
  },
  location: {
    fontSize: 12,
    paddingTop: 5,
    color: "#545454",
  },
  price: {
    color: "#FFAC1D",
    fontWeight: 500,
  },
  rera: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingTop: 4,
  },
  reraText: {
    fontSize: 12,
    color: "#3d3d3dff",
  },
  section: {
    // margin:5,
    gap: 20,
    marginHorizontal: 10,
    // backgroundColor: "#ebebebff",
    height: 140,
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 10,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  center: {
    alignItems: "center",
    gap: 3,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 500,
  },
  sectionData: {
    fontSize: 12,
    color: "#3d3d3dff",
  },
  homePageImage: {
    width: "100%",
    height: 150,
    opacity: 0.8,
    borderRadius: 10,
  },

  homepage: {
    alignItems: "center",
    width: "93%",
    marginLeft: 10,
    // marginVertical: 18,
  },

  imageWrapper: {
    width: "100%",
    position: "relative",
  },

  overlayText: {
    position: "absolute",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    left: 16,
    top: 12,
  },
  about: {
    fontSize: 13,
    lineHeight: 22,
    color: "#444",
    marginBottom: 10,
    fontWeight: 500,
    paddingHorizontal: 7,
    textAlign: "justify",
  },
  aboutUs: {
    fontSize: 16,
    fontWeight: "600",
    // color:"green",
    marginTop: 15,
    marginLeft: 16,
  },
  placeRow: {
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
    gap: 4,
    // justifyContent: "space-between",
    // paddingVertical: 8,
    // borderBottomWidth: 0.5,
    // borderColor: "#eee",
    marginRight: 15,
    marginVertical: 10,
  },

  placeName: {
    fontSize: 13,
    color: "#333",
    flexShrink: 1,
    fontWeight: 500,
  },
  mapBox: {
    height: 200,
    marginHorizontal: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
});
