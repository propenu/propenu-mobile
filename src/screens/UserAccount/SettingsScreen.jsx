import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Linking,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { ToastInfo, ToastSuccess } from "../../utils/Toast";
import { useAuth } from "../../context/AuthContext";
import { setItem, getItem, clearStorage } from "../../utils/Storage";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { userServices } from "../../services/userServices";
import * as Keychain from "react-native-keychain";

const SettingsScreen = () => {
  const { isLoggedIn, updateUserDetails, userDetails, refreshAuth } = useAuth();
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: userDetails?.name || "",
    phone: userDetails?.phone || "",
    email: userDetails?.email || "",
    city: userDetails?.city || "",
  });

  // const [image, setImage] = useState("");
  const [image, setImage] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["membershipHistory"],
    queryFn: userServices.getMembershipHistory,
  });

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      ToastInfo("Allow photo access to continue");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      setImage(uri);
      await setItem("profileImage", uri);
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
      navigation.navigate("HomeStack", { screen: "Home" });
    } else {
      ToastSuccess("You are already logged out");
    }
  };

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

  useEffect(() => {
    const loadImage = async () => {
      const savedImage = await getItem("profileImage");
      if (savedImage) {
        setImage(savedImage);
      }
    };

    loadImage();
  }, []);

  useEffect(() => {
    if (userDetails) {
      setForm({
        name: userDetails?.name || "",
        phone: userDetails?.phone || "",
        email: userDetails?.email || "",
        city: userDetails?.city || "",
      });
    }
  }, [userDetails]);

  if (isLoading) {
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#27AE60" />
      <Text>Loading...</Text>
    </View>;
  }
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Pressable style={styles.avatarWrapper} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.avatar} />
          ) : (
            <FontAwesome name="user-circle" size={50} color="#585858" />
          )}
          <View style={styles.cameraIcon}>
            <MaterialIcons name="photo-camera" size={14} color="#666" />
          </View>
        </Pressable>

        <View>
          <Text style={styles.userName}>{userDetails?.name || "Guest"}</Text>

          <View style={styles.verified}>
            <MaterialIcons name="verified" size={16} color="#27A361" />
            <Text style={styles.verifiedText}>KYC Verified</Text>
          </View>

          <Text style={styles.userCity}>
            {userDetails?.city ? userDetails.city : "Hyderabad"}
          </Text>
        </View>
      </View>
      {/* KYC Verification */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>KYC Verification</Text>

        <View style={styles.kycCard}>
          <Text style={styles.kycLabel}>Driving License</Text>
          <View style={styles.verified}>
            <MaterialIcons name="verified" size={18} color="#27A361" />
            <Text style={styles.verifiedText}>Verification done</Text>
          </View>
        </View>
      </View> */}

      {/* Personal Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal information</Text>

          <Pressable style={styles.editBtn} onPress={() => setIsEditing(true)}>
            <Text style={styles.editText}>Edit</Text>
            <Feather name="edit-2" size={14} color="#666" />
          </Pressable>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoGrid}>
            <InfoField
              label="Name"
              value={form.name}
              editing={isEditing}
              onChange={(v) => setForm({ ...form, name: v })}
            />

            <InfoField
              label="Phone Number"
              value={form.phone}
              editing={isEditing}
              onChange={(v) => setForm({ ...form, phone: v })}
            />

            <InfoField
              label="Email Address"
              value={form.email}
              editing={isEditing}
              onChange={(v) => setForm({ ...form, email: v })}
            />

            <InfoField
              label="Address"
              value={form.city}
              editing={isEditing}
              onChange={(v) => setForm({ ...form, city: v })}
            />
            {isEditing && (
              <View style={styles.actions}>
                <Pressable
                  style={styles.cancelBtn}
                  onPress={() => {
                    setIsEditing(false);

                    // reset
                    setForm({
                      name: userDetails?.name || "",
                      phone: userDetails?.phone || "",
                      email: userDetails?.email || "",
                      city: userDetails?.city || "",
                    });
                  }}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={styles.saveBtn}
                  onPress={async () => {
                    await updateUserDetails(form);
                    setIsEditing(false);
                  }}
                >
                  <Text style={styles.saveText}>Save</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </View>

      <ScrollView style={styles.membership}>
        <Text style={[styles.cardTitle, { paddingTop: 5, paddingLeft: 5 }]}>
          Membership History
        </Text>
        {data?.history?.map((item, index) => (
          <View key={index} style={styles.membershipRow}>
            <View style={styles.history}>
              <Text style={styles.planName}>
                {item.planName}
                <Text style={styles.smallText}> ({item.category})</Text>
              </Text>
              <StatusBadge status={item.status} />
            </View>
            <View style={[styles.history, { paddingTop: 3 }]}>
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
      {/* LOGOUT BUTTON */}
      {/* <Pressable onPress={handleLogout} style={[styles.menuItem]}>
        <AntDesign name="logout" size={19} color="#E53935" />
        <Text style={[styles.label, styles.logoutLabel]}>Logout</Text>
      </Pressable> */}

      {/* Footer */}
      {/* <Pressable>
        <Text style={styles.deactivate}>Deactivate Account</Text>
      </Pressable> */}
    </ScrollView>
  );
};

const InfoField = ({ label, value, editing, onChange }) => (
  <View style={styles.infoField}>
    <Text style={styles.infoLabel}>{label}</Text>

    {editing ? (
      <TextInput
        value={value}
        onChangeText={onChange}
        style={styles.input}
        placeholder={`Enter ${label}`}
        placeholderTextColor="gray"
      />
    ) : (
      <Text style={styles.infoValue}>{value || "--"}</Text>
    )}
  </View>
);

export default SettingsScreen;
const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: "#fff",
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    // borderWidth:1,
    borderColor: "#ccc",
    backgroundColor: "#eeeeee",
  },

  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFF",
    padding: 3,
    borderRadius: 20,
    elevation: 2,
  },

  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  userCity: {
    fontSize: 12,
    color: "#999",
    marginTop: 3,
  },

  section: {
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#DDD",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  editText: {
    fontSize: 13,
    color: "#666",
  },

  infoCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    elevation: 1,
  },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 20,
  },

  infoField: {
    width: "48%",
  },

  infoLabel: {
    fontSize: 12,
    color: "#818181",
    letterSpacing: 0.5,
  },

  infoValue: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
  },

  kycCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginTop: 10,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
  },

  verified: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 5,
  },

  verifiedText: {
    color: "#27A361",
    fontSize: 12,
    fontWeight: "500",
  },

  deactivate: {
    color: "#D32F2F",
    textDecorationLine: "underline",
    fontSize: 13,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 4,
    fontSize: 12,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    // marginTop: 16,
    alignItems: "center",
    gap: 10,
    width: "100%",
  },

  cancelBtn: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  saveBtn: {
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#27A361",
  },

  cancelText: {
    color: "#333",
    fontWeight: "500",
  },

  saveText: {
    color: "#fff",
    fontWeight: "600",
  },
  cardTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 23,
    marginTop: 25,
    // paddingVertical: 14,
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
  membership: {
    marginHorizontal: 5,
    // padding: 10,
    borderRadius: 12,
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
  detailValue: {
    fontSize: 12,
    fontWeight: "500",
  },
  download: {
    backgroundColor: "#F1FCF5",
    flexDirection: "row",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    paddingVertical: 5,
  },
  invoiceText: {
    fontSize: 13,
    fontWeight: 500,
    paddingLeft: 5,
    color: "#27AE60",
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
});
