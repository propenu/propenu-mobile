import { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  Image,
  ScrollView,
  Modal,
  Button,
} from "react-native";
import { useDispatch } from "react-redux";
import { userServices } from "../../services/userServices";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import defaultImage from "../../../assets/defaultImage.png";
import { LocationIcon } from "../../../assets/svg/Logo";
import formatINR from "../../utils/FormatINR";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { setPropertyType } from "../../redux/slice/PostPropertySlice";
// import ResponsesModal from "./ResponseModal";
import DropdownUI from "../../components/ui/DropDownUI";
import { agentServices } from "../../services/agentServices";
import { useAuth } from "../../context/AuthContext";
const TAB_KEY_MAP = {
  Residential: "residential",
  Commercial: "commercial",
  Plot: "land",
  Agriculture: "agricultural",
};

const categories = ["Residential", "Commercial", "Plot", "Agriculture"];
const filterBase = ["All", "Active", "Draft"];
const listingOptions = [
  { label: "Sale", value: "sale" },
  { label: "Rent", value: "rent" },
];

const AgentProperties = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const {userDetails} =useAuth()

  const [activeTab, setActiveTab] = useState("Residential");
  const [search, setSearch] = useState("");
  const [listingType, setListingType] = useState("sale");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [dateRange, setDateRange] = useState("30");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["myProperties"],
    queryFn: userServices.getMyProperties,
  });


  /* ================= FILTER ================= */

  const filteredProperties = useMemo(() => {
    if (!data) return [];

    let list = data[TAB_KEY_MAP[activeTab]] ?? [];

    if (listingType) {
      list = list.filter((p) => p.listingType === listingType);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q),
      );
    }

    if (selectedFilter !== "All") {
      list = list.filter((p) => p.status === selectedFilter.toLowerCase());
    }

    return list;
  }, [data, activeTab, search, selectedFilter, listingType]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading your properties…</Text>
      </View>
    );
  }

  const handleEdit = () => {
    dispatch(setPropertyType(activeTab.toLowerCase()));
    navigation.navigate("PostProperty");
  };

  const handleResponse = (projectId) => {
    setSelectedProjectId(projectId);
    setIsModalOpen(true);
  };

  const handleNavigate = (item) => {
    const screenMap = {
      Residential: "MoreResidentialDetails",
      Commercial: "MoreCommercialDetails",
      Plot: "MoreLandDetails",
      Agriculture: "MoreAgriculturalDetails",
    };

    const screenName = screenMap[activeTab];

    if (screenName) {
      navigation.navigate(screenName, { id: item?._id });
    } else {
      console.log("Invalid category");
    }
  };

  const count =
    activeTab === "Residential"
      ? data?.byType?.residentialCount
      : activeTab === "Commercial"
        ? data?.byType?.commercialCount
        : activeTab === "Land"
          ? data?.byType?.landCount
          : data?.byType?.agriculturalCount;
  /* ================= RENDER CARD ================= */

  const renderItem = ({ item }) => {
    const imageSource = item?.gallery?.[0]?.url
      ? { uri: item.gallery[0].url }
      : defaultImage;

    return (
      <Pressable style={styles.card} onPress={() => handleNavigate(item)}>
        <Image source={imageSource} style={styles.image} />
        <Text style={styles.menu}>
          {" "}
          {item.price ? formatINR(item.price) : "—"}
        </Text>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {item?.title}
          </Text>
          <View style={styles.location}>
            <LocationIcon width={17} height={17} color="green" />
            <Text style={styles.address} numberOfLines={1}>
              {item?.address ? item?.address : "Location not specified"}
            </Text>
          </View>
          {/* <View style={styles.hrLine} /> */}
          <View style={styles.row}>
            <Text style={[styles.price]}>
              Posted On:{" "}
              <Text style={styles.value}>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}{" "}
              </Text>
              {/* <Text style={{ color: "#27AE60" }}>({item.status})</Text> */}
            </Text>

            <Text style={styles.price}>
              {item.carpetArea ? `${item.carpetArea} sq.ft.` : "—"}
            </Text>
          </View>
          {/* <View>
            <Text style={[styles.price, { paddingTop: 7 }]}>
              Property ID :{" "}
              <Text style={styles.value}>
                {item._id.slice(-8).toUpperCase()}
              </Text>
            </Text>
          </View> */}
          <View style={styles.meta}>
            <Text>
              Views:{" "}
              <Text style={styles.value}>{item.meta?.views ?? 0}</Text>{" "}
            </Text>
            <Text>
              Enquiries:{" "}
              <Text style={styles.value}>{item.meta?.enquiries ?? 0}</Text>
            </Text>
          </View>
        </View>

        {/* <View style={styles.buttonsContainer}> */}
        {/* <Pressable
            style={styles.responseOption}
            onPress={() => handleResponse(item._id)}
          >
            <Ionicons name="chatbox-outline" size={16} color="black" />
            <Text style={{ fontSize: 12, fontWeight: 500 }}>Responses</Text>
          </Pressable> */}

        <Pressable style={styles.editOption} onPress={handleEdit}>
          <MaterialIcons name="mode-edit" size={17} color="white" />
          <Text style={{ color: "white", fontSize: 13, fontWeight: 500 }}>
            Manage Property
          </Text>
        </Pressable>

        {/* <ResponsesModal
            open={isModalOpen}
            projectId={selectedProjectId}
            onClose={() => setIsModalOpen(false)}
          /> */}
        {/* </View> */}
      </Pressable>
    );
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "#fff", paddingBottom: insets.bottom }}
    >
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
      <FlatList
        data={filteredProperties}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 10 }}>
            {/* Search */}
            <TextInput
              placeholder="'Search locality'"
              value={search}
              onChangeText={setSearch}
              style={styles.search}
              placeholderTextColor="gray"
            />

            {/* Horizontal Filters */}
            <View style={styles.meta}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterContainer}
              >
                {filterBase.map((item, index) => {
                  const isSelected = selectedFilter === item;

                  return (
                    <Pressable
                      key={index}
                      onPress={() => setSelectedFilter(item)}
                      style={[
                        styles.filterButton,
                        isSelected && styles.activeFilter,
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterText,
                          isSelected && styles.activeFilterText,
                        ]}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
              <View style={styles.dropDown}>
                <DropdownUI
                  value={listingType}
                  onChange={setListingType}
                  options={listingOptions}
                />
              </View>
            </View>
            {/* {count ? (
              <Text style={styles.totalCount}>{count} Properties found</Text>
            ) : null} */}
            {filteredProperties?.length ? (
              <Text style={styles.totalCount}>
                {filteredProperties.length} Properties found
              </Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>No properties found in {activeTab}</Text>
          </View>
        }
      />
    </View>
  );
};
export default AgentProperties;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
  },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  tabText: { color: "#000", fontSize: 14, fontWeight: 500 },
  activeTab: {
    color: "#27AE60",
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderColor: "#27AE60",
    paddingBottom: 5,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    gap: 5,
  },

  menu: {
    position: "absolute",
    top: 145,
    right: 15,
    alignItems: "center",
    backgroundColor: "#fff",
    color: "#27AE60",
    fontWeight: 500,
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 5,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 6,
    fontSize: 14,
  },
  totalCount: {
    fontSize: 15,
    fontWeight: 500,
    marginBottom: 10,
    marginTop: 5,
    paddingLeft: 3,
  },
  search: {
    borderWidth: 1,
    borderColor: "#ddd",
    marginVertical: 10,
    padding: 8,
    borderRadius: 6,
  },

  count: { marginHorizontal: 12, marginBottom: 10, color: "#666" },

  card: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginHorizontal: 12,
    marginBottom: 12,
    overflow: "hidden",
    padding: 8,
    elevation: 2,
  },
  hrLine: {
    borderTopWidth: 1,
    borderColor: "#e3e3e3",
    marginVertical: 5,
  },

  image: {
    width: "100%",
    height: 170,
    borderRadius: 8,
    position: "relative",
  },

  content: { flex: 1, paddingHorizontal: 10, paddingVertical: 15 },

  title: { fontWeight: "bold", fontSize: 15 },
  address: { color: "gray", width: "93%" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 7,
    // paddingHorizontal: 5,
  },

  price: { fontSize: 13, fontWeight: 400, color: "#000" },
  value: {
    color: "#000",
    fontSize: 13,
    fontWeight: 500,
  },

  badge: {
    paddingHorizontal: 8,
    // paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
  },

  meta: {
    // marginTop: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    marginHorizontal: 8,
  },
  editOption: {
    flexDirection: "row",
    backgroundColor: "#27AE60",
    width: "48%",
    alignItems: "center",
    alignSelf: "flex-end",
    justifyContent: "center",
    paddingVertical: 7,
    borderRadius: 8,
    gap: 5,
  },
  responseOption: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    borderRadius: 8,
    gap: 5,
  },

  filterContainer: {
    marginVertical: 8,
    alignItems: "center",
    // paddingHorizontal:10
  },
  dropDown: {
    width: "40%",
  },

  filterButton: {
    paddingVertical: 6,
    textAlign: "center",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
    marginRight: 8,
    marginBottom: 5,
  },

  activeFilter: {
    backgroundColor: "#DEFAEA",
  },

  filterText: {
    fontSize: 13,
  },

  activeFilterText: {
    fontWeight: "500",
  },
});
