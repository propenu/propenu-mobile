import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";

const Specifications = ({ property }) => {
  const items = Array.isArray(property?.specifications)
    ? property.specifications
    : [];

  const color = property?.color || "#F59E0B";

  const [activeBhkIndex, setActiveBhkIndex] = useState(0);

  useEffect(() => {
    if (activeBhkIndex >= items.length) {
      setActiveBhkIndex(0);
    }
  }, [items.length]);

  const activeBhk = items[activeBhkIndex];

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View>
        <Text style={[styles.title, { color: color ? color : "#000" }]}>
          Specifications
        </Text>
        <Text style={styles.subtitle}>Key details of the property</Text>
      </View>

      {/* Card */}
      <View style={[styles.mainCard, { backgroundColor: `${color}1A` }]}>
        {/* BHK Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          {items.map((b, i) => {
            const active = i === activeBhkIndex;
            return (
              <Pressable
                key={i}
                onPress={() => setActiveBhkIndex(i)}
                style={[
                  styles.tab,
                  {
                    backgroundColor: active ? color : "#f3f4f6",
                  },
                ]}
              >
                <Text
                  style={{
                    color: active ? "#fff" : "#2c2c2c",
                    fontWeight: "500",
                    fontSize: 12,
                   
                  }}
                >
                  {b.category}
                </Text>
              </Pressable>
            );
          })}
        </View>
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}> 
          {activeBhk?.items?.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.smallText}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 10,
    // marginVertical: 6,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 5,
    marginBottom: 7,
  },
  smallText:{
fontSize: 14,
    fontWeight: "500",
    marginBottom:5
  },
  description:{
 fontSize:12,
 lineHeight:20,
 textAlign:"justify"

  },
  mainCard: {
    marginTop: 10,
    borderRadius: 12,
    padding: 12,
  },
  card: {
    width:280,
    backgroundColor: "white",
    marginTop: 10,
    marginRight:12,
    borderRadius: 12,
    padding: 12,
    borderRadius: 8,
    elevation: 1,
    marginBottom:2
  },
  row: {
    flexDirection: "row",
    // flexWrap: "wrap",
    marginBottom: 7,
  },
  tab: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight:8
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  imageBox: {
    flex: 2,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  priceData: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 10,
  },
  details: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 6,
    paddingHorizontal: 10,
  },
  label: {
    // color:"gray",
    fontSize: 13,
  },
  price: {
    fontSize: 15,
    fontWeight: "600",
    // marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoLabel: {
    // color: "#585d66ff",
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  cta: {
    width: "65%",
    alignSelf: "center",
    marginTop: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  ctaText: {
    color: "#fff",
    fontWeight: "700",
  },
});

export default Specifications;
