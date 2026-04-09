import { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { userServices } from "../../services/userServices";
import { LocationIcon } from "../../../assets/svg/Logo";
import defaultImage from "../../../assets/defaultImage.png";
import formatINR from "../../utils/FormatINR";

const categories = ["Residential", "Commercial", "Plot", "Agriculture"];

const LEAD_STATUSES = [
  "All",
  "New",
  "Contacted",
  "Follow-up",
  "Site Visit",
  "Closed",
  "Not interested",
];

const TAB_KEY_MAP = {
  Residential: "residential",
  Commercial: "commercial",
  Plot: "land",
  Agriculture: "agricultural",
};

const AgentLeads = () => {
  const [activeTab, setActiveTab] = useState("Residential");
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [activeStatus, setActiveStatus] = useState("All");

  /* ================= PROPERTIES ================= */
  const { data: propertiesData, isLoading: propertiesLoading } = useQuery({
    queryKey: ["myProperties"],
    queryFn: userServices.getMyProperties,
  });

  const properties = useMemo(() => {
    if (!propertiesData) return [];

    const list = propertiesData[TAB_KEY_MAP[activeTab]] ?? [];

    return list.filter((item) => item.status?.toLowerCase() === "active");
  }, [propertiesData, activeTab]);

  /* Auto select first property */
  useEffect(() => {
    if (!properties.length) {
      setSelectedPropertyId(null);
      return;
    }

    const isValid = properties.some((p) => p._id === selectedPropertyId);

    if (!isValid) {
      setSelectedPropertyId(properties[0]._id);
    }
  }, [properties, selectedPropertyId]);

  /* ================= LEADS ================= */
  const { data: leadsData = [], isLoading: leadsLoading } = useQuery({
    queryKey: ["projectLeads", selectedPropertyId],
    queryFn: () => userServices.getProjectLeads(selectedPropertyId),
    enabled: !!selectedPropertyId,
  });

  console.log("leadsLoadingleadsLoading", leadsLoading, leadsData)

  useEffect(() => {
    setActiveStatus("All");
  }, [selectedPropertyId]);

  const filteredLeads = useMemo(() => {
    if (!Array.isArray(leadsData)) return [];

    if (activeStatus === "All") return leadsData;

    return leadsData.filter(
      (lead) => lead.status?.toLowerCase() === activeStatus.toLowerCase(),
    );
  }, [leadsData, activeStatus]);

  /* ================= RENDER PROPERTY CARD ================= */
  const renderProperty = ({ item }) => {
    const imageSource = item?.gallery?.[0]?.url
      ? { uri: item.gallery[0].url }
      : defaultImage;

    const active = item._id === selectedPropertyId;

    return (
      <Pressable
        style={[styles.card, active && styles.activeCard]}
        onPress={() => setSelectedPropertyId(item._id)}
      >
        <Image source={imageSource} style={styles.image} />

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {item.title}
          </Text>

          <View style={styles.location}>
            <LocationIcon width={14} height={14} color="green" />
            <Text style={styles.address} numberOfLines={1} ellipsizeMode="tail">
              {item.locality}, {item.city}
            </Text>
          </View>
          <Text style={styles.address}>
            Carpet Area :{" "}
            <Text style={styles.value}>
              {" "}
              {item?.carpetArea ? `${item.carpetArea} sq.ft.` : "—"}{" "}
            </Text>{" "}
          </Text>

          <Text style={styles.price}>{formatINR(item.price)}</Text>
        </View>
      </Pressable>
    );
  };

  /* ================= RENDER LEAD ================= */
  const renderLead = ({ item }) => (
    <View style={styles.leadCard}>
      <Text style={styles.leadName}>{item.name}</Text>
      <Text style={styles.leadPhone}>{item.phone}</Text>
      <Text style={styles.leadStatus}>{item.status}</Text>
    </View>
  );

  if (propertiesLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#27AE60" />
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* CATEGORY TABS */}
      <View style={styles.tabs}>
        {categories.map((tab) => (
          <Pressable key={tab} onPress={() => setActiveTab(tab)}>
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTab]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* PROPERTY LIST */}
      {properties.length > 0 && (
        <View style={{ height: 110 }}>
          <FlatList
            data={properties}
            renderItem={renderProperty}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12 }}
          />
        </View>
      )}

      {/* STATUS FILTER */}
      <FlatList
        data={LEAD_STATUSES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        renderItem={({ item }) => {
          const active = activeStatus === item;
          return (
            <Pressable
              style={[styles.statusBtn, active && styles.activeStatusBtn]}
              onPress={() => setActiveStatus(item)}
            >
              <Text
                style={[styles.statusText, active && styles.activeStatusText]}
              >
                {item}
              </Text>
            </Pressable>
          );
        }}
      />
      {properties.length < 1 && (
        <Text style={[styles.center, { textAlign: "center" }]}>
          No properties found
        </Text>
      )}

      {/* LEADS LIST */}
      {leadsLoading ? (
        <ActivityIndicator
          style={{ marginTop: 20 }}
          size="small"
          // color="#27AE60"
          color="#fff"
        />
      ) : (
        <FlatList
          data={filteredLeads}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderLead}
          //   contentContainerStyle={{ padding: 12 }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center" }}>
              No enquiries received yet
            </Text>
          }
        />
      )}
    </View>
  );
};

export default AgentLeads;
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    marginBottom: 5,
  },

  tabText: { fontSize: 14, color: "#333" },

  activeTab: {
    color: "#27AE60",
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderColor: "#27AE60",
    paddingBottom: 5,
  },

  card: {
    width: 260,
    height: 100,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 5,
    marginRight: 12,
  },

  activeCard: {
    borderColor: "#92e8b6",
    backgroundColor: "#f7fdf9",
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 10,
  },

  content: { flex: 1 },

  title: { fontSize: 13, fontWeight: "500" },

  location: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },

  address: {
    fontSize: 12,
    color: "gray",
    marginLeft: 4,
    flexShrink: 1,
  },

  price: {
    color: "#27AE60",
    marginLeft: 4,
    fontWeight: 500,
    fontSize: 13,
    paddingTop: 3,
  },
  value: { color: "#000", fontSize: 12, fontWeight: 500 },
  statusBtn: {
    height: 30,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#f1f1f1",
    marginRight: 8,
    marginVertical: 10,
  },

  activeStatusBtn: {
    backgroundColor: "#DFF5E7",
  },

  statusText: { fontSize: 12 },

  activeStatusText: {
    color: "#27AE60",
    fontWeight: "600",
  },

  leadCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },

  leadName: { fontWeight: "600" },
  leadPhone: { color: "gray", marginVertical: 2 },
  leadStatus: { color: "#27AE60" },
});
