import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Linking,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { userServices } from "../../services/userServices";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EditAgentModal from "./ui/EditAgentModal";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import * as Keychain from "react-native-keychain";
import { clearStorage } from "../../utils/Storage";

const AgentAccountSettings = () => {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const { isLoggedIn, updateUserDetails, userDetails, refreshAuth } = useAuth();
  const navigation = useNavigation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-agent-profile"],
    queryFn: userServices.getMyAgentProfile,
  });

  const { data: membership } = useQuery({
    queryKey: ["membershipHistory"],
    queryFn: userServices.getMembershipHistory,
  });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const handleOpenInvoice = async (url) => {
    try {
      if (!url) {
        console.log("Invoice not available");
        return;
      }

      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log("Cannot open this invoice");
      }
    } catch (error) {
      console.error("Invoice open error:", error);
    }
  };

  const handleLogout = async () => {
    if (userDetails != null) {
      await clearStorage();
      await Keychain.resetGenericPassword();
      await new Promise((resolve) => setTimeout(resolve, 100));
      await refreshAuth();
      // setUserData(null);
      ToastSuccess("Logged out successfully");
      navigation.navigate("Home");
    } else {
      ToastSuccess("You are already logged out");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#27AE60" />
      </View>
    );
  }

  if (isError || !data?.agent) {
    return (
      <View style={styles.center}>
        <Text>Failed to load profile</Text>
      </View>
    );
  }

  const agent = data.agent;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: insets.bottom,
      }}
    >
      {/* COVER */}
      <View>
        <View style={styles.coverContainer}>
          {agent?.coverImage?.url && (
            <Image
              source={{ uri: agent.coverImage.url }}
              style={styles.cover}
              resizeMode="cover"
            />
          )}
        </View>

        {/* AVATAR */}
        <View style={styles.avatarWrapper}>
          <Image
            source={{
              uri: agent.avatar?.url || "https://via.placeholder.com/100",
            }}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* HEADER */}
      <View style={styles.headerCard}>
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{agent.user?.name}</Text>

            {agent.rera?.isVerified && (
              <View style={styles.verifiedBadge}>
                <Icon name="verified-user" size={14} color="#fff" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>

          <Text style={styles.subText}>
            {agent.agencyName} · {agent.city}
          </Text>

          {/* <Text style={styles.bio}>{agent.bio}</Text> */}
        </View>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="edit" size={16} color="#27AE60" />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <EditAgentModal
        visible={modalVisible}
        agent={agent}
        onClose={() => setModalVisible(false)}
      />

      {/* DETAILS */}
      <Card title="Professional Details">
        <DetailRow label="License" value={agent.licenseNumber} />
        <DetailRow
          label="Valid Till"
          value={new Date(agent.licenseValidTill).toDateString()}
        />
        <DetailRow label="Verification" value={agent.verificationStatus} />
        <Text style={[styles.cardTitle, { paddingTop: 5 }]}>
          Service Information
        </Text>
        <DetailRow label="Verification" value={agent.areasServed} />
        <DetailRow label="Verification" value={agent.languages} />
        <View style={styles.hrLine} />
        <View style={styles.statsContainer}>
          <StatBox label="Total" value={agent.stats?.totalProperties || 0} />
          <StatBox label="Published" value={agent.stats?.publishedCount || 0} />
          <StatBox label="Deals closed" value={agent.dealsClosed} />
          <StatBox label="Exp" value={`${agent.experienceYears} yrs`} />
        </View>
      </Card>
      {/* <Pressable
        onPress={handleLogout}
        style={[styles.menuItem, styles.logoutItem]}
      >
        <AntDesign name="logout" size={19} color="#E53935" />
        <Text style={[styles.label, styles.logoutLabel]}>Logout</Text>
      </Pressable> */}

      {/* MEMBERSHIP */}

      <ScrollView style={styles.membership}>
        <Text style={[styles.cardTitle, { paddingTop: 5, paddingLeft: 5 }]}>
          Subscription History
        </Text>
        {membership?.history?.map((item, index) => (
          <View key={index} style={styles.membershipRow}>
            <View style={styles.history}>
              <Text style={styles.planName}>
                {item.planName}
                <Text style={styles.smallText}> ({item.category})</Text>
              </Text>
              <StatusBadge status={item.status} />
            </View>
            <View style={[styles.history, { paddingTop: 5 }]}>
              <Text style={styles.date}>
                Acivated on : {formatDate(item.startDate)} -{" "}
                {formatDate(item.endDate)}{" "}
              </Text>
              <Text style={styles.detailValue}>₹{item.price}/-</Text>
            </View>
            <Pressable
              style={styles.download}
              onPress={() => handleOpenInvoice(item?.invoiceUrl)}
            >
              <AntDesign name="cloud-download" size={16} color="#27AE60" />
              <Text style={styles.invoiceText}>Invoice</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

const StatBox = ({ label, value }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);
const Card = ({ title, children }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);
const DetailRow = ({ label, value }) => {
  const formattedValue = Array.isArray(value) ? value.join(", ") : value || "-";

  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label} : </Text>
      <Text style={styles.detailValue}>{formattedValue}</Text>
    </View>
  );
};

const StatusBadge = ({ status }) => {
  const isActive = status === "active";

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: isActive ? "#f4f9f6" : "#EBEDEF" },
      ]}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: isActive ? "#27AE60" : "#DD3355" },
        ]}
      />
      <Text
        style={{
          color: isActive ? "#1E7F4B" : "#DD3355",
          fontSize: 12,
        }}
      >
        {isActive ? "Active" : "Expired"}
      </Text>
    </View>
  );
};

export default AgentAccountSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 7,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cover: {
    height: 170,
    width: "100%",
  },
  coverContainer: {
    width: "100%",
    height: 170,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },

  cover: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },

  avatarWrapper: {
    position: "absolute",
    bottom: -35,
    left: 20,
  },
  avatar: {
    height: 70,
    width: 70,
    borderRadius: 12,
  },
  headerCard: {
    backgroundColor: "#fff",
    marginTop: 50,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 12,
    elevation: 1,
    marginHorizontal: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginLeft: 5,
    paddingVertical: 10,
    borderRadius: 14,
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: 400,
    // color: "#82868d",
  },
  logoutLabel: {
    color: "#E53935",
    fontWeight: "500",
  },
  name: {
    fontSize: 17,
    fontWeight: "bold",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    // gap: 6,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#27AE60",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedText: {
    color: "#fff",
    fontSize: 10,
    marginLeft: 4,
  },
  subText: {
    color: "gray",
    marginTop: 4,
  },
  bio: {
    marginTop: 6,
    fontStyle: "italic",
    color: "#555",
  },
  editBtn: {
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#27AE60",
    paddingHorizontal: 10,
    // paddingVertical: 6,
    borderRadius: 6,
  },
  editText: {
    marginLeft: 4,
    color: "#27AE60",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 7,
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 14,
    fontWeight: 500,
  },
  statLabel: {
    fontSize: 12,
    color: "gray",
  },

  history: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 12,
    color: "#000",
  },
  hrLine: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 15,
  },
  download: {
    backgroundColor: "#F1FCF5",
    flexDirection: "row",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    paddingVertical: 4,
  },
  invoiceText: {
    fontSize: 13,
    // fontWeight:500,
    paddingLeft: 5,
    color: "#27AE60",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 5,
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
    elevation: 1,
    shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.2,
  shadowRadius: 1,
  },
  cardTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    // justifyContent: "space-between",
    marginBottom: 6,
    marginLeft: 15,
    paddingVertical: 2,
  },
  detailLabel: {
    fontSize: 12,
    color: "black",
  },
  detailValue: {
    fontSize: 12,
    fontWeight: "500",
  },
  membership: {
    marginHorizontal: 5,
    // padding: 10,
    borderRadius: 12,
  },
  membershipRow: {
    borderRadius: 8,
    paddingVertical: 10,
    borderWidth: 1,
    backgroundColor: "#fff",
    borderColor: "#eee",
    padding: 13,
    marginBottom: 12,
  },
  planName: {
    fontWeight: "600",
  },
  smallText: {
    fontSize: 12,
    fontWeight: 400,
    color: "gray",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginTop: 6,
  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  cancelBtn: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
  },

  saveBtn: {
    backgroundColor: "#27AE60",
    padding: 10,
    borderRadius: 5,
  },
});
