import { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { userServices } from "../../services/userServices";
import { useQuery } from "@tanstack/react-query";
import defaultImage from "../../../assets/defaultImage.png";
import { LocationIcon } from "../../../assets/svg/Logo";
import DateInputField from "../../components/ui/DateInputField";
import AntDesign from "@expo/vector-icons/AntDesign";
import DropdownUI from "../../components//ui/DropDownUI";

import { Picker } from "@react-native-picker/picker";

{
  /*------------------Static Data-------------------- */
}
const TAB_KEY_MAP = {
  Featured: "featured",
  Residential: "residential",
  Commercial: "commercial",
  Plot: "land",
  Agriculture: "agricultural",
};

const categories = [
  "Featured",
  "Residential",
  "Commercial",
  "Plot",
  "Agriculture",
];
const LEAD_STATUSES = [
  "All",
  "New",
  "Contacted",
  "Follow-up",
  "Approved",
  "Rejected",
  "Closed",
];

const STATUS = [
  "new",
  "contacted",
  "follow_up",
  "approved",
  "rejected",
  "closed",
];

const LeadItem = ({ item, updateStatus }) => {
  const [status, setStatus] = useState(item?.status);

  return (
    <View style={styles.leadCard}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          // alignItems: "center",
        }}
      >
        <View>
          <Text style={styles.leadName}>{item.name}</Text>
          <Text style={styles.leadtitle}>
            Contact Number : <Text style={styles.leadPhone}>{item.phone}</Text>
          </Text>
          <Text style={styles.leadtitle}>
            Date :
            <Text style={styles.leadPhone}>
              {new Date(item.updatedAt).toLocaleDateString("en-IN")}
            </Text>
          </Text>
        </View>

        <View style={styles.dropdown}>
          <DropdownUI
            value={status}
            onChange={(val) => {
              setStatus(val);
              updateStatus(item._id, val);
            }}
            options={STATUS.map((t) => ({
              label: t.replace("_", " "),
              value: t,
            }))}
          />
        </View>
      </View>
    </View>
  );
};

const BuilderLeads = () => {
  const [activeTab] = useState("Featured");
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [activeStatus, setActiveStatus] = useState("All");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  {
    /*------------------Calling API-------------------- */
  }
  const { data: propertiesData, isLoading: propertiesLoading } = useQuery({
    queryKey: ["myProperties"],
    queryFn: userServices.getMyProperties,
  });

  const properties = useMemo(() => {
    if (!propertiesData) return [];
    return propertiesData[TAB_KEY_MAP[activeTab]] ?? [];
  }, [propertiesData, activeTab]);

  {
    /*------------------Auto select First Property-------------------- */
  }
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

  {
    /*------------------Calling Leads API-------------------- */
  }
  const { data: leadsData = [], isLoading: leadsLoading } = useQuery({
    queryKey: ["projectLeadsbuilder", selectedPropertyId, fromDate, toDate],
    queryFn: () =>
      userServices.getProjectLeads(
        selectedPropertyId,
        fromDate ?? undefined,
        toDate ?? undefined,
      ),
    enabled: !!selectedPropertyId,
  });
  console.log("LEADS DATA", activeStatus.toLowerCase(), leadsData);

  useEffect(() => {
    setActiveStatus("All");
  }, [selectedPropertyId]);

  const clearFilters = () => {
    setFromDate(null);
    setToDate(null);
    setActiveStatus("All");
  };

  {
    /*------------------Filter the data-------------------- */
  }
  const filteredLeads = useMemo(() => {
    const leads = leadsData?.data ?? [];
    if (activeStatus === "All") return leads;

    return leads.filter(
      (lead) => lead.status?.toLowerCase() === activeStatus.toLowerCase(),
    );
  }, [leadsData, activeStatus]);

  const formatPrice = (price) => {
    if (!price) return "—";
    if (price >= 10000000) return `₹ ${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹ ${(price / 100000).toFixed(2)} L`;
    return `₹ ${price.toLocaleString("en-IN")}`;
  };

  const getPropertyPriceLabel = (property) => {
    const price = Number(property?.price);
    const priceFrom = Number(property?.priceFrom);
    const priceTo = Number(property?.priceTo);

    if (Number.isFinite(price) && price > 0) {
      return formatPrice(price);
    }

    if (
      Number.isFinite(priceFrom) &&
      priceFrom > 0 &&
      Number.isFinite(priceTo) &&
      priceTo > 0
    ) {
      return `${formatPrice(priceFrom)} - ${formatPrice(priceTo)}`;
    }

    if (Number.isFinite(priceFrom) && priceFrom > 0) {
      return `From ${formatPrice(priceFrom)}`;
    }

    if (Number.isFinite(priceTo) && priceTo > 0) {
      return `Up to ${formatPrice(priceTo)}`;
    }

    return "—";
  };

  const handleDownloadCSV = () => {
    if (!selectedPropertyId) return alert("Select property first");

    const from = fromDate?.toISOString().split("T")[0];
    const to = toDate?.toISOString().split("T")[0];

    userServices.downloadLeadsCSV(selectedPropertyId, from, to);
  };

  {
    /*------------------Property card-------------------- */
  }
  const renderProperty = ({ item }) => {
    const imageSource = item?.heroImage
      ? { uri: item.heroImage }
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
              {item?.carpetArea ? `${item.carpetArea} sq.ft.` : "—"}
            </Text>
          </Text>

          <Text style={styles.price}>
            {getPropertyPriceLabel(item)}
            {/* {item?.price ? formatINR(item.price) : "—"} */}
          </Text>
        </View>
      </Pressable>
    );
  };

  {
    /*------------------Lead Card-------------------- */
  }
  const renderLead = ({ item }) => {
    console.log(item, "KKKKKKKKKKKKKKKKKKKKKKK");
    return (
      <View style={styles.leadCard}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.leadName}>{item.name}</Text>
          <Text style={styles.leadStatus}>{item?.status}</Text>
        </View>
        <Text style={styles.leadtitle}>
          Contact Number : <Text style={styles.leadPhone}>{item.phone}</Text>
        </Text>
        <Text style={styles.leadtitle}>
          Date :
          <Text style={styles.leadPhone}>
            {new Date(item.updatedAt).toLocaleDateString("en-IN")}
          </Text>
        </Text>
      </View>
    );
  };

  if (propertiesLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#27AE60" />
      </View>
    );
  }

  {
    /*------------------Main UI-------------------- */
  }
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Text style={styles.heading}>
        View enquiries received on your properties
      </Text>
      <Text style={styles.number}>Showing {properties?.length} Properties</Text>

      {/*------------------Toggle Tabs-------------------- */}
      {/* <View style={styles.tabs}>
        {categories.map((tab) => (
          <Pressable key={tab} onPress={() => setActiveTab(tab)}>
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTab]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View> */}

      {/*------------------Property Card horizontal scroll-------------------- */}
      <View style={{ height: 110 }}>
        <FlatList
          data={properties}
          renderItem={renderProperty}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        />
      </View>

      {/*------------------Status filter (Horizontal)-------------------- */}
      <FlatList
        data={LEAD_STATUSES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        style={{ flexGrow: 0 }}
        contentContainerStyle={{ paddingHorizontal: 12, marginBottom: 5 }}
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
      <ScrollView
        horizontal
        style={{ flexGrow: 0 }}
        contentContainerStyle={styles.dateContainer}
      >
        <View style={styles.datePicker}>
          <DateInputField
            onChange={(date) => setFromDate(date)}
            placeholder="From date"
            value={fromDate}
          />
        </View>
        <View style={styles.datePicker}>
          <DateInputField
            onChange={(date) => setToDate(date)}
            placeholder="To date"
            value={toDate}
          />
        </View>
        <Pressable style={styles.download} onPress={handleDownloadCSV}>
          <AntDesign name="cloud-download" size={14} color="white" />
          <Text style={{ color: "#fff", fontSize: 13 }}>Download</Text>
        </Pressable>
        {(fromDate || toDate || activeStatus !== "All") && (
          <Pressable onPress={clearFilters} style={styles.clearBtn}>
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        )}
      </ScrollView>

      {/*------------------Lead from the API-------------------- */}
      {filteredLeads?.length > 0 && (
        <Text style={styles.response}>{filteredLeads.length} Responses </Text>
      )}
      {leadsLoading ? (
        <ActivityIndicator
          style={{ marginTop: 20 }}
          size="small"
          color="#27AE60"
        />
      ) : (
        <FlatList
          data={filteredLeads}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <LeadItem
              item={item}
              updateStatus={userServices.updateLeadStatus}
            />
          )}
          // renderItem={renderLead}
          contentContainerStyle={{ paddingVertical: 12 }}
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

export default BuilderLeads;

{
  /*------------------Styles-------------------- */
}
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    marginBottom: 5,
  },
  number: {
    paddingHorizontal: 10,
    fontSize: 13,
    // color:"gray",
    // fontWeight:500,
    marginBottom: 10,
  },
  heading: {
    fontSize: 15,
    // color:"gray",
    fontWeight: 500,
    paddingLeft: 10,
    marginVertical: 5,
    // marginBottom: 15,
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
  dateContainer: {
    // alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    // paddingVertical: 10,
  },
  datePicker: {
    width: 100,
    // height: 50,
    marginRight: 10,
  },
  download: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#27AE60",
    paddingHorizontal: 12,
    height: 30,
    borderRadius: 8,
    marginRight: 8,
    marginTop: 3,
    gap: 5,
  },
  clearBtn: {
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2e6e6",
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 3,
  },
  clearText: {
    fontSize: 12,
    color: "red",
  },

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
  dropdown: {
    width: 120,
    // height: ,
    // borderWidth: 1,
    // borderColor: "#f3f1f1",
    // borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
  },

  picker: {
    height: 50,
    transform: [{ scaleY: 0.8 }],
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
    marginHorizontal: 10,
    backgroundColor: "#fff",
    padding: 8,
    elevation: 1,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#fcf7f7",
    marginBottom: 13,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  },

  response: {
    color: "#27AE60",
    marginLeft: 12,
    fontWeight: 600,
    marginVertical: 2,
  },

  leadName: { fontWeight: "500", fontSize: 14, marginBottom: 2 },
  leadPhone: { color: "#000" },
  leadtitle: { color: "gray", marginVertical: 4, fontSize: 12 },
  leadStatus: { color: "#27AE60", fontSize: 13, fontWeight: 500 },
});
