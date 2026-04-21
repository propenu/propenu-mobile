import { View, Text, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";

const TopViewedProjects = ({ data }) => {
  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <View style={styles.leftSection}>
        <View style={styles.indexCircle}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>

        <View>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.title}</Text>

            {item.isFeatured && (
              <View style={styles.featuredBadge}>
                <Entypo name="star-outlined" size={13} color="orange" />
                <Text style={styles.featuredText}> Featured</Text>
              </View>
            )}
          </View>

          <Text style={styles.city}>{item.city}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.views}>
          {item?.meta?.views?.toLocaleString() ?? 0}
        </Text>
        <Text style={styles.viewsLabel}>views</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="trending-up" size={17} color="#06933a" />
        <Text style={styles.headerTitle}>  Top Viewed Projects</Text>
      </View>

      <View>
        {data?.map((item, index) => (
          <View key={item._id} style={{ marginBottom: 20 }}>
            {renderItem({ item, index })}
          </View>
        ))}
      </View>
    </View>
  );
};

export default TopViewedProjects;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    marginTop: 7,
    shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    // marginLeft: 8,
    color: "#111827",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  indexCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  indexText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  title: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111827",
    marginRight: 6,
  },
  featuredBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  featuredText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#15803D",
  },
  city: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  views: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  viewsLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
});
