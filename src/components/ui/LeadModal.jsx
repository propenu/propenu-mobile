import React from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
const formatINR = (price) => {
  if (!price) return "";
  return `₹${Number(price).toLocaleString("en-IN")}`;
};

const formatPostedOn = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitial = (value) => value?.trim()?.charAt(0)?.toUpperCase() || "P";

const joinSummary = (price, propertyLabel) => {
  const items = [formatINR(price), propertyLabel]?.filter(Boolean);
  return items.join(" | ");
};

const LeadDialog = ({
  open,
  onClose,
  ownerName,
  ownerRole = "Owner",
  phone,
  email,
  postedOn,
  price,
  propertyLabel,
}) => {
  const formattedPostedOn = formatPostedOn(postedOn);
  const summary = joinSummary(price, propertyLabel);

  return (
    <Modal visible={open} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Entypo name="cross" size={24} color="black" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.profileRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitial(ownerName)}</Text>
              </View>

              <View>
                <Text style={styles.name}>{ownerName || "Property owner"}</Text>
                <Text style={styles.role}>{ownerRole}</Text>
              </View>
            </View>

            <View style={styles.rightSection}>
              {formattedPostedOn && (
                <Text style={styles.posted}>
                  Posted on: {formattedPostedOn}
                </Text>
              )}
              {summary && <Text style={styles.summary}>{summary}</Text>}
            </View>
          </View>

          {/* Contact */}
          <View style={styles.contactSection}>
            {phone && <Text style={styles.contactText}>📞 {phone}</Text>}
            {email && <Text style={styles.contactText}>✉️ {email}</Text>}
          </View>

          {/* Warning */}
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ Do not make any payment before visiting the property.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LeadDialog;
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
  },
  closeBtn: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  closeText: {
    fontSize: 18,
    color: "#555",
  },
  header: {
    marginBottom: 12,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 10,
    backgroundColor: "#2DB463",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
  },
  role: {
    fontSize: 13,
    fontWeight: 500,
    color: "#777",
  },
  rightSection: {
    marginTop: 10,
  },
  posted: {
    fontSize: 13,
    color: "#666",
  },
  summary: {
    fontWeight: 500,
    marginTop: 10,
    fontSize: 13,
    lineHeight: 22,
  },
  contactSection: {
    // borderTopWidth: 1,
    // borderColor: "#eee",
    // paddingTop: 10,
    // marginTop: 10,
  },
  contactText: {
    fontSize: 15,
    marginBottom: 5,
  },
  warningBox: {
    // marginTop: 12,
    backgroundColor: "#EEF7F1",
    padding: 10,
    borderRadius: 8,
  },
  warningText: {
    fontSize: 13,
    lineHeight: 22,
    color: "#2F4736",
  },
});
