import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { apiService } from "../../services/apiService";
import { ToastInfo } from "../../utils/Toast";
import { useQuery } from "@tanstack/react-query";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import ResidentialCard from "../../screens/PropertyListScreen/Cards/ResidentialCard";
import CommercialCard from "../../screens/PropertyListScreen/Cards/CommercialCard";
import LandCard from "../../screens/PropertyListScreen/Cards/LandCard";
import AgriculturalCard from "../../screens/PropertyListScreen/Cards/AgriculturalCard";
import defaultImage from "../../../assets/defaultImage.png";
import { LocationIcon, PhoneIcon } from "../../../assets/svg/Logo";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const MoreAgentDetails = ({ route }) => {
  const { slug } = route.params;
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("residential");
  console.log("SLIGsss", slug);

  const categories = ["residential", "commercial", "agricultural", "land"];

  const cardComponents = {
    residential: ResidentialCard,
    commercial: CommercialCard,
    agricultural: AgriculturalCard,
    land: LandCard,
  };

  const {
    data: details,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["agentDetails", slug],
    queryFn: async () => {
      const res = await apiService.agentDetailsBySlug(slug);
      return res?.data;
    },
    enabled: !!slug,
  });
  // console.log("details", details);

  const agentDetails = details?.agent;
  const agentProperties = details?.properties;

  const activeProperties = details?.properties?.[activeTab] || [];

  const ActiveCard = cardComponents[activeTab];

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" style={{ color: "#27AE60" }} />
      </View>
    );
  }
  if (error) {
    console.log("Error when get agent details:", error);
  }

  const ProfileImage = agentDetails?.avatar?.url
    ? { uri: agentDetails?.avatar?.url }
    : defaultImage;

  return (
    <SafeAreaView style={styles.mainContainer}>
        <View style={{ paddingHorizontal: 12 }}>
          <View style={[styles.metaItemRow, { margin: 7 }]}>
            <Image
              source={ProfileImage}
              style={{ height: 70, width: 70, borderRadius: 35 }}
            />
            <View style={styles.container}>
              <Text style={styles.itemTitle} numberOfLines={2}>
                {agentDetails?.name}
              </Text>
              <Text style={styles.status} numberOfLines={1}>
                {agentDetails?.agencyName}
              </Text>
              <Text style={styles.rera} numberOfLines={1}>
                RERA ID : {agentDetails?.rera?.reraAgentId}
              </Text>
            </View>
          </View>
          <Text style={styles.deals}>
            {agentDetails?.experienceYears}+ Years Experience •{" "}
            {agentDetails?.dealsClosed}+ Deals Closed
          </Text>

          <View style={styles.hrline} />
          <View
            style={[
              styles.metaItemRow,
              {
                justifyContent: "space-between",
                paddingHorizontal: 5,
                marginBottom: 4,
              },
            ]}
          >
            <View style={styles.metaItemRow}>
              <LocationIcon width="16" height="16" />
              <Text style={styles.areas}>
                {agentDetails?.areasServed?.join(", ")}
              </Text>
            </View>
            <View style={styles.metaItemRow}>
              <Pressable onPress={() => openWhatsApp(agentDetails?.phone)}>
                <FontAwesome name="whatsapp" size={22} color="#27AE60" />
              </Pressable>
              <Pressable
                style={{ marginTop: 5, marginLeft: 10 }}
                onPress={() => makeCall(agentDetails?.phone)}
              >
                <PhoneIcon width="20" height="20" />
              </Pressable>
            </View>
          </View>
        </View>
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ backgroundColor: "#fff",flex :1, padding: 12 }}>
          {/* <View style={styles.statsContainer}>
            <View style={[styles.statBox, { backgroundColor: "#f7fcf5" }]}>
              <Text style={styles.statNumber}>
                {agentDetails?.dealsClosed} +
              </Text>
              <Text style={styles.statLabel}>Deals Closed</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: "#f9eeec" }]}>
              <Text style={styles.statNumber}>
                {agentDetails?.experienceYears} +
              </Text>
              <Text style={styles.statLabel}>Years Experience</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: "#ecf2fb" }]}>
              <Text style={styles.statNumber}>
                {agentDetails?.stats?.publishedCount}
              </Text>
              <Text style={styles.statLabel}>Published</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: "#f8edf7" }]}>
              <Text style={styles.statNumber}>
                {agentDetails?.stats?.totalProperties}
              </Text>
              <Text style={styles.statLabel}>Total Properties</Text>
            </View>
          </View> */}

          {/* About Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>About</Text>
                        <Text style={styles.sectionText}>{agentDetails?.bio}</Text>
            <Text style={styles.city} numberOfLines={1}>
              Languages :
              <Text style={{ fontWeight: 500 }}>
                {" "}
                {agentDetails?.languages?.join(", ")}
              </Text>
            </Text>
            <Text style={styles.city} numberOfLines={1}>
              Coverage :
              <Text style={{ fontWeight: 500 }}>
                {" "}
                {agentDetails?.areasServed?.join(", ")}
              </Text>
            </Text>

          </View>

          <View style={styles.sectionCard}>
            {/* Tabs */}
            <View style={styles.tabs}>
              {categories.map((tab) => (
                <Pressable key={tab} onPress={() => setActiveTab(tab)}>
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab && styles.activeTab,
                    ]}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { paddingVertical: 3 }]}>
              Properties in{" "}
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </Text>

            {activeProperties.length === 0 ? (
              <View
                style={{
                  height: 400,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "gray", marginTop: 10 }}>
                  No properties available
                </Text>
              </View>
            ) : (
              activeProperties.map((item, index) => (
                <ActiveCard key={index} item={item} />
              ))
            )}
          </View>
          
        </View>
              </ScrollView>

        {/* <Pressable style={styles.whatsappButton}>
        <Text style={styles.buttonText}>Contact Agent</Text>
      </Pressable> */}
    </SafeAreaView>
  );
};
export default MoreAgentDetails;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F1FCF5",
    // paddingHorizontal: 12,
    // paddingVertical:5
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    // paddingVertical: 10,
    // marginBottom: 5,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
  },

  profileCard: {
    flexDirection: "row",
    // backgroundColor: "#fff",
    padding: 8,
    marginBottom: 20,
    // elevation: 2,
    alignItems: "center",
  },
  metaItemRow: {
    flexDirection: "row",
    gap: 10,
  },
  rera: {
    color: "#27AE60",
    fontSize: 12,
    fontWeight: 500,
  },
   status: {
    fontSize: 13,
    color: "gray",
    marginBottom: 4,
  },
  deals: {
    paddingHorizontal: 15,
    paddingTop: 7,
    fontSize: 12,
  },
  hrline: {
    height: 1,
    backgroundColor: "#eee",
    marginHorizontal: 8,
    marginVertical: 10,
  },
  areas: {
    fontSize: 12,
  },

  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },

  name: {
    fontSize: 17,
    fontWeight: "600",
  },

  company: {
    fontSize: 14,
    fontWeight: 500,
    // color: "#27AE60",
    marginTop: 4,
  },

  city: {
    fontSize: 13,
    marginTop: 4,
  },

  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  statBox: {
    width: "48%",
    // backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
    elevation: 2,
  },

  statNumber: {
    fontSize: 13,
    fontWeight: "bold",
  },

  statLabel: {
    marginTop: 5,
    fontSize: 12,
    color: "#000",
  },
  tabText: { fontSize: 14, color: "#333" },

  activeTab: {
    color: "#27AE60",
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderColor: "#27AE60",
    paddingBottom: 5,
  },

  sectionCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 6,
    marginBottom: 2,
  },

  sectionText: {
    // color: "gray",
    marginVertical: 5,
    textAlign: "justify",
    fontSize: 12,
    lineHeight: 20,
  },

  propertyImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
  },

  propertyPrice: {
    fontWeight: "bold",
    fontSize: 16,
  },

  propertyDetails: {
    color: "gray",
    marginTop: 4,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginBottom: 10,
  },

  callButton: {
    backgroundColor: "#1E88E5",
    padding: 14,
    borderRadius: 12,
    width: "48%",
    alignItems: "center",
  },

  whatsappButton: {
    alignSelf: "center",
    backgroundColor: "#27AE60",
    padding: 10,
    borderRadius: 12,
    width: "60%",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
