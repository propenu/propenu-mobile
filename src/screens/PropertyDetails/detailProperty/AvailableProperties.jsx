// components/AvailableProperties.js
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import defaultImage from "../../../../assets/defaultImage.png";

/** INR formatter */
function formatINR(v) {
  if (!v) return "--";
  return v.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

const AvailableProperties = ({ bhk, bookAppointment }) => {
  const items = Array.isArray(bhk?.bhkSummary) ? bhk.bhkSummary : [];
  const color = bhk?.color || "#F59E0B";

  const { width } = useWindowDimensions();

  const [activeBhkIndex, setActiveBhkIndex] = useState(0);
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);

  useEffect(() => {
    if (activeBhkIndex >= items.length) {
      setActiveBhkIndex(0);
    }
  }, [items.length]);

  useEffect(() => {
    setActiveUnitIndex(0);
  }, [activeBhkIndex]);

  const activeBhk = items[activeBhkIndex];
  const units = Array.isArray(activeBhk?.units) ? activeBhk.units : [];

  const sqftLabels = useMemo(
    () =>
      units.map((u) =>
        u.minSqft ? `${u.minSqft} sqft` : u.plan?.url ? "Plan" : "—",
      ),
    [units],
  );

  const activeUnit = units[activeUnitIndex];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}

      <View>
        <Text
          style={[styles.title, { color: bhk?.color ? bhk?.color : "#000" }]}
        >
          Available Properties
        </Text>
        <Text style={styles.subtitle}>Your next property could be here</Text>
      </View>

      {/* Card */}
      <View style={[styles.card, { backgroundColor: bhk?.color  ?`${bhk?.color}0A` : "#f7f4f4"}]}>
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
                    {b.bhkLabel || `${b.bhk} BHK`}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* Sqft Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.row}>
            {sqftLabels.map((label, idx) => {
              const active = idx === activeUnitIndex;
              return (
                <Pressable
                  key={idx}
                  onPress={() => setActiveUnitIndex(idx)}
                  style={[
                    styles.chip,
                    {
                      borderColor: active ? color : "#e5e7eb",
                    },
                  ]}
                >
                  <Text style={{ color: active ? color : "#374151" }}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* Main Content */}
        <View>
          {/* Image */}
          <View style={styles.imageBox}>
            <Image
              source={
                activeUnit?.plan?.url
                  ? { uri: activeUnit.plan.url }
                  : defaultImage
              }
              style={styles.image}
              //   resizeMode="cover"
            />
          </View>

          {/* Details */}
          <View style={styles.details}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Starting Price :</Text>
              <Text style={styles.price}>
                {formatINR(activeUnit?.maxPrice)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Unit</Text>
              <Text style={styles.infoValue}>
                {activeBhk?.bhkLabel || `${activeBhk?.bhk} BHK`}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Area</Text>
              <Text style={styles.infoValue}>
                {activeUnit?.minSqft ? `${activeUnit.minSqft} sqft` : "—"}
              </Text>
            </View>

            <Pressable
              style={[styles.cta, { backgroundColor: color }]}
              onPress={bookAppointment}
            >
              <Text style={styles.ctaText}>Book a Consultation</Text>
            </Pressable>
          </View>
        </View>
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
  card: {
    marginTop: 10,
    borderRadius: 12,
    padding: 12,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth:1,
    borderColor:"#ccc"
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

export default AvailableProperties;
