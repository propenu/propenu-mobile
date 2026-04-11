import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { userServices } from "../../services/userServices";
import ResidentialCard from "../PropertyListScreen/Cards/ResidentialCard";
import LandCard from "../PropertyListScreen/Cards/LandCard";
import AgriculturalCard from "../PropertyListScreen/Cards/AgriculturalCard";
import CommercialCard from "../PropertyListScreen/Cards/CommercialCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

const type = [
  { label: "Residential", value: "Residential" },
  { label: "Commercial", value: "Commercial" },
  { label: "Land", value: "Land" },
  { label: "Agricultural", value: "Agricultural" },
];

const AgentShortListedScreen = () => {
  // const [likedProperties, setLikedProperties] = useState(null);
  const [selected, setSelected] = useState("Residential");
  const insets = useSafeAreaInsets();

  const handleSelect = (item) => {
    setSelected(item.value);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["shortlistedProperties"],
    queryFn: userServices.getShortlistedProperties,
  });

  // console.log("Shortlisted properties checking :", data);

  if (isLoading)
    return <ActivityIndicator size="large" style={{ color: "#27AE60" }} />;

if (error) {
  console.log("failed to get shortlisted :", error);
  return null;
}
  const likedProperties = data?.data ?? [];

  const CARD_COMPONENT = {
    Residential: ResidentialCard,
    Commercial: CommercialCard,
    Land: LandCard,
    Agricultural: AgriculturalCard,
  };

  const filteredProperties =
    likedProperties?.filter((item) => item?.propertyType === selected) || [];

  console.log("SHORTLISTED LENGTH :::::",likedProperties.length, filteredProperties?.length);

  return (
    <ScrollView style={[styles.mainContainer]} contentContainerStyle={{paddingBottom:insets.bottom +5}}>
      <>
        <Text style={styles.label}>Property Type</Text>
        <View style={styles.container}>
          {type.map((item) => {
            const active = selected === item.value;

            return (
              <Pressable
                key={item.value}
                onPress={() => handleSelect(item)}
                style={[styles.chip, active && styles.activeChip]}
              >
                <Text style={[styles.text, active && styles.activeText]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {filteredProperties.length > 0 ? (
          filteredProperties.map((item) => {
            const Card = CARD_COMPONENT[selected];
            return <Card key={item?._id} item={item?.property} />;
          })
        ) : (
          <View style={styles.noDataText}>
            <Text>No properties shortlisted</Text>
          </View>
        )}
      </>
    </ScrollView>
  );
};

export default AgentShortListedScreen;

const styles = StyleSheet.create({
  mainContainer: { flex: 1, paddingHorizontal: 10, backgroundColor: "white" },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  label: {
    marginBottom: 8,
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
  },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 8,
    // borderRadius: 10,
    // borderBottomWidth: 1,
    // borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  activeChip: {
    borderColor: "#27AE60",
  },
  text: {
    fontSize: 13,
    // fontWeight:500
  },
  activeText: {
    borderBottomWidth: 1,
    borderColor: "#27AE60",
    color: "#27AE60",
    fontSize: 14,
    fontWeight: "500",
    paddingBottom: 5,
  },
  noDataText: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
