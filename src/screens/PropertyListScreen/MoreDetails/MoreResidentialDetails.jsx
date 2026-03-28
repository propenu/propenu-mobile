import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import AutoImageSlider from "../../../components/ui/AutoImageSlider";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiService } from "../../../services/apiService";
import formatINR from "../../../utils/FormatINR";
import useDimensions from "../../../components/CustomHooks/UseDimension";
import NearByLocations from "../../PropertyDetails/detailProperty/NearByLocation";
import AmenitiesWithModal from "../../PropertyDetails/detailProperty/AmenitiesWithModal";
import { PhoneIcon, LocationIcon } from "../../../../assets/svg/Logo";
import { ToastSuccess, ToastInfo } from "../../../utils/Toast";
import { useAuth } from "../../../context/AuthContext";

const MoreResidentialDetails = ({ route }) => {
  const { width, height } = useDimensions();
  const { slug } = route.params;
  const { isLoggedIn, userDetails } = useAuth();
  console.log("Checking slug :", slug)

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiService.residential_category_search(slug);
      const data = res?.[0]?.data;
      if (!data) {
        ToastInfo("Property details not found");
        return;
      }
      setDetails(data);
    } catch (error) {
      console.log("Error when getting more details :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactOwner = async () => {
    if (!isLoggedIn) {
      ToastInfo("User not authenticated");
    } else ToastSuccess("We will contact you shortly");
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading... </Text>
      </SafeAreaView>
    );
  }

  const MetaItem = ({ Icon, label, value }) => (
    <View style={styles.metaItem}>
      {/* {Icon} */}
      <Text style={styles.metaLabel}>{value}</Text>
      <Text style={styles.metaValue}>{label}</Text>
    </View>
  );

  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text numberOfLines={1} style={styles.detailValue}>
        {label} :{" "}
      </Text>
      <Text numberOfLines={1}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* IMAGE GALLERY */}
        <AutoImageSlider
          images={details?.gallery?.map((img) => ({ uri: img.url })) || []}
          height={height * 0.3}
          width={width}
        />

        {/* PRICE + TITLE */}
        <View style={styles.header}>
          <Text style={styles.title}>{details?.title}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.price}>{formatINR(details?.price)}</Text>
            <Text style={styles.pricePer}>
              / ₹ {details?.pricePerSqft} per sq.ft.
            </Text>
          </View>
        </View>

        {/* META INFO */}
        <View style={styles.metaRow}>
          <View style={styles.infoRow}>
            {details?.builtUpArea !== undefined && (
              <MetaItem
                label="Built Up Area"
                value={`${details.builtUpArea} sqft`}
              />
            )}
            {details?.furnishing !== undefined && (
              <MetaItem
                // Icon={<MaterialIcons name="balcony" size={23} color="#8BEAB2" />}
                label="Furnishing Status"
                value={`${details?.furnishing}`}
              />
            )}
            {details?.constructionStatus !== undefined && (
              <MetaItem
                // Icon={<MaterialIcons name="balcony" size={23} color="#8BEAB2" />}
                label="Availability Status"
                value={`${details?.constructionStatus}`}
              />
            )}
          </View>
          <View style={styles.infoRow}>
            {details?.carpetArea !== undefined && (
              <MetaItem
                label="Carpet Area"
                value={`${details.carpetArea} sqft`}
              />
            )}
            {details?.transactionType !== undefined && (
              <MetaItem
                // Icon={<MaterialIcons name="balcony" size={23} color="#8BEAB2" />}
                label="Sale Type"
                value={`${details?.transactionType}`}
              />
            )}

            {details?.bathrooms !== undefined && (
              <MetaItem
                // Icon={<MaterialIcons name="bathtub" size={23} color="#8BEAB2" />}
                label="Bathrooms"
                value={`${details.bathrooms}`}
              />
            )}
          </View>
          <View style={styles.infoRow}>
            {details?.bhk !== undefined && (
              <MetaItem
                // Icon={<MaterialIcons name="balcony" size={23} color="#8BEAB2" />}
                label="Bed Rooms"
                value={`${details?.bhk}`}
              />
            )}
            {details?.constructionStatus !== undefined && (
              <MetaItem
                // Icon={<MaterialIcons name="balcony" size={23} color="#8BEAB2" />}
                label="Floors"
                value={`${details?.floorNumber}/${details?.totalFloors}`}
              />
            )}
            {details?.balconies !== undefined && (
              <MetaItem
                // Icon={<MaterialIcons name="balcony" size={23} color="#8BEAB2" />}
                label="Balconies"
                value={`${details?.balconies}`}
              />
            )}
          </View>
        </View>

        {/* DETAILS */}
        <Section title="More Details">
          <DetailRow label="Facing" value={details?.facing} />
          <DetailRow label="Kitchen Type" value={details?.kitchenType} />
          <DetailRow label="Property Age" value={details?.propertyAge} />
          <DetailRow
            label="Property Ownership"
            value={details?.listingSource}
          />
          <DetailRow label="Flooring" value={details?.flooringType} />
        </Section>

        <AmenitiesWithModal amenities={details?.amenities} />

        {details?.nearbyPlaces && (
          <View style={styles.gallery}>
            <Text style={styles.aboutUs}>Location & Landmarks</Text>

            <FlatList
              data={details?.nearbyPlaces}
              horizontal
              keyExtractor={(item) => item.order.toString()}
              renderItem={({ item }) => (
                <View style={styles.placeRow}>
                  <LocationIcon color="#FFAC1D" width={16} height={16} />
                  <Text style={styles.placeName}>
                    {item.name} : {item.distanceText}
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
                                    nearbyPlaces={details?.nearbyPlaces}
                                    location={details?.location}
                                  />
                // <NearByLocations nearbyPlaces={details?.nearbyPlaces} />
              )}
            </View>
          </View>
        )}

        {/* ADDRESS */}
        <Section title="Address">
          <Text style={styles.text}>{details?.address}</Text>
        </Section>

        {/* DESCRIPTION */}
        <Section title="Description">
          <Text style={styles.text}>{details?.description}</Text>
        </Section>

        {/* CONTACT OWNER */}
        <Pressable style={styles.contactBtn} onPress={handleContactOwner}>
          <PhoneIcon width={18} height={18} color="white" />
          <Text style={styles.contactText}>Contact</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  header: { padding: 16, gap: 6 },
  price: { fontSize: 16, fontWeight: "700", color: "#27AE60" },
  pricePer: { fontSize: 16, fontWeight: "500" },
  title: { fontSize: 16, fontWeight: "600", marginTop: 4 },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
    marginHorizontal: 7,
    paddingVertical: 18,
    // paddingHorizontal: 10,
    backgroundColor: "rgb(238, 238, 238)",
    borderRadius: 8,
  },

  infoRow: {
    // flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  col: {
    flex: 1,
    alignItems: "center",
  },

  // metaItem: { alignItems: "center" },
  metaLabel: { fontSize: 12 },
  metaValue: { fontSize: 13, fontWeight: "500" },

  section: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },

  text: { fontSize: 14, color: "#555", lineHeight: 20 },

  detailRow: {
    flexDirection: "row",
    // justifyContent: "space-between",
    gap: 5,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  //   detailLabel: { color: "#777" },
  detailValue: { fontWeight: "500" },

  amenities: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  amenityItem: {
    backgroundColor: "#EAF8F0",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 6,
  },

  contactBtn: {
    width: "60%",
    alignSelf: "center",
    flexDirection: "row",
    margin: 16,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#27AE60",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  contactText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  placeRow: {
    flexDirection: "row",
    paddingHorizontal: 5,
    alignItems: "center",
    gap: 4,
    // justifyContent: "space-between",
    // paddingVertical: 8,
    // borderBottomWidth: 0.5,
    // borderColor: "#eee",
    marginRight: 17,
    marginVertical: 8,
  },

  placeName: {
    fontSize: 13,
    color: "#333",
    flexShrink: 1,
    fontWeight: 500,
  },
  gallery: {
    marginHorizontal: 12,
  },
  aboutUs: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
  },
  mapBox: {
    height: 180,
    marginHorizontal: 2,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },

  // center: { flex: 1, alignItems: "center", justifyContent: "center" },
});

export default MoreResidentialDetails;
