import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import defaultImage from "../../../../assets/defaultImage.png";

const getPerformance = (views) => {
  if (views > 1000) return { label: "High", bg: "#DCFCE7", text: "#15803D" };
  if (views > 700) return { label: "Medium", bg: "#FEF9C3", text: "#A16207" };
  return { label: "Low", bg: "#FEE2E2", text: "#B91C1C" };
};

const TopPropertiesTable = ({ properties = [] }) => {
  const [sortBy, setSortBy] = useState("views");

  const sorted = useMemo(() => {
    return [...properties].sort((a, b) =>
      sortBy === "views" ? b.views - a.views : b.inquiries - a.inquiries,
    );
  }, [properties, sortBy]);

  if (!properties.length) {
    return null;
  }

  const renderItem = ({ item }) => {
    const perf = getPerformance(item.views);

    return (
      <View style={styles.card}>
        {/* Left */}
        <View style={styles.leftSection}>
          <Image
            source={item.image ? { uri: item.image } : defaultImage}
            style={styles.image}
          />

          {/* Right */}
          <View style={styles.rightSection}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Views : {" "}</Text>
              <Text style={styles.metricValue}>
                {item.views.toLocaleString()}
              </Text>
            </View>

            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Enquiries : {" "}</Text>
              <Text style={styles.metricValue}>{item.inquiries}</Text>
            </View>

            {/* <View style={[styles.badge, { backgroundColor: perf.bg }]}>
              <Text style={[styles.badgeText, { color: perf.text }]}>
                {perf.label}
              </Text>
            </View> */}
          </View>
        </View>
        <Text style={styles.title}>{item.title}</Text>
             {item.city ? 
        <Text style={styles.city}>{item.city}</Text>  :null }
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Top Performing Properties</Text>
          <Text style={styles.headerSub}>Your best performing listings</Text>
        </View>

        {/* Sort Buttons */}
        <View style={styles.sortContainer}>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === "views" && styles.activeSort]}
            onPress={() => setSortBy("views")}
          >
            <Text
              style={[
                styles.sortText,
                sortBy === "views" && styles.activeSortText,
              ]}
            >
              Views
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === "inquiries" && styles.activeSort,
            ]}
            onPress={() => setSortBy("inquiries")}
          >
            <Text
              style={[
                styles.sortText,
                sortBy === "inquiries" && styles.activeSortText,
              ]}
            >
              Enquiries
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={sorted}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 10 }}
      />
    </View>
  );
};

export default TopPropertiesTable;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    marginTop: 17,
    shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  headerSub: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  sortContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  sortButton: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#f3f6f4",
    marginRight: 8,
  },
  activeSort: {
    // backgroundColor: "#16A34A",
    borderWidth: 1,
    borderColor: "#27AE60",
  },
  sortText: {
    fontSize: 12,
    color: "#374151",
  },
  activeSortText: {
    fontWeight: 500,
    color: "#27AE60",
  },
  emptyContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#9CA3AF",
  },
  card: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",z
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom:10,
    borderWidth:1,
    borderColor:"#eee"
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"space-around",
    flex: 1,
    gap:15
  },
  image: {
    width: "50%",
    height: 75,
    borderRadius: 10,
    marginRight: 12,
  },
  title: {
    marginTop:15,
    fontSize: 13,
    fontWeight: "500",
    color: "#111827",
    marginBottom:2
  },
  city: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  rightSection: {
    width:"45%",
},
  metric: {
   flexDirection:"row"
  },
  metricLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  metricValue: {
    fontSize: 12,
    fontWeight: "500",
    color: "#111827",
  },
  badge: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
