import React, { useMemo } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Linking,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import WhatsappIcon from "react-native-vector-icons/FontAwesome";
import { useQuery } from "@tanstack/react-query";
import { userServices } from "../../services/userServices";

const ResponsesModal = ({ open, onClose, projectId }) => {
  const { data, isLoading, isError, error, } = useQuery({
    queryKey: ["project-leads", projectId],
    queryFn: () => userServices.getProjectLeads(projectId),
    enabled: open && !!projectId,
  });

  const leads = useMemo(() => {
    return (data?.data ?? []).slice().sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [data]);

  const openWhatsApp = (phone) => {
    const cleanNumber = phone.replace(/\D/g, "");
    Linking.openURL(`https://wa.me/${cleanNumber}`);
  };

  return (
    <Modal
      visible={open}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      {/* Drawer Content */}
      <View style={styles.drawer}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{leads.length} Inquiries</Text>
            <Text style={styles.subTitle}>
              Property ID: {projectId?.slice(-8)?.toUpperCase() ?? "N/A"}
            </Text>
          </View>

          <TouchableOpacity onPress={onClose}>
            <Icon name="x" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : leads.length === 0 ? (
          <Text style={styles.emptyText}>No inquiries found</Text>
        ) : (
          <FlatList
            data={leads}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                {/* Status */}
                <Text style={styles.status}>{item.status}</Text>

                {/* Profile Row */}
                <View style={styles.profileRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {item.name?.charAt(0)?.toUpperCase() ?? "U"}
                    </Text>
                  </View>
                  <Text style={styles.name}>{item.name ?? "Unknown"}</Text>
                </View>

                {/* Remarks */}
                <Text style={styles.remarks}>
                  {item.remarks || "No remarks provided"}
                </Text>

                {/* Date */}
                <Text style={styles.date}>
                  Viewed on{" "}
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}
                </Text>

                {/* Contact Row */}
                <View style={styles.contactRow}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.phone}>{item.phone ?? "-"}</Text>
                    {item.phone && (
                      <TouchableOpacity
                        onPress={() => openWhatsApp(item.phone)}
                        style={{ marginLeft: 8 }}
                      >
                        <WhatsappIcon
                          name="whatsapp"
                          size={20}
                          color="#25D366"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.email}>{item.email ?? "-"}</Text>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </Modal>
  );
};

export default ResponsesModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  drawer: {
    height: "75%",
    width: "100%",
    backgroundColor: "#f1f9f4",
    padding: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  subTitle: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginTop: 3,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  },
  status: {
    position: "absolute",
    right: 16,
    top: 16,
    fontSize: 12,
    color: "#4CAF50",
    textTransform: "capitalize",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#27Ae60",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  remarks: {
    color: "#666",
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  phone: {
    fontWeight: "500",
  },
  email: {
    color: "#666",
    fontSize: 12,
  },
});
