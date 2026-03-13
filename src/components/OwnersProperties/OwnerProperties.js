import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { apiService } from "../../services/apiService";
import OwnerPropertyCard from "./OwnerPropertyCard";
import { useQuery } from "@tanstack/react-query";
import useCity from "../CustomHooks/useCity";
import { useNavigation } from "@react-navigation/native";

const OwnerProperties = () => {
  const [properties, setProperties] = useState([]);
  const { selectedCity } = useCity();
  const navigation = useNavigation();

  const fetchOwnerProperties = async () => {
    const res = await apiService.ownersProperties();
    return res.data.items;
  };

  // const { data, isError, error, isLoading } = useQuery(
  //   ["owners"],
  //   fetchOwnerProperties,
  // );
  // if (isError) console.log(error, "error");

  useEffect(() => {
    const fetchOwnerProperties = async () => {
      try {
        const response = await apiService.ownersProperties();
        if (response.status === 200) {
          const data = response.data.items;

          const filteredData = selectedCity?.city
            ? data.filter(
                (item) =>
                  item.city?.toLowerCase() === selectedCity.city.toLowerCase(),
              )
            : data;
          setProperties(filteredData);
        }
      } catch (error) {
        console.log("Owners Properties Error:", error);
      }
    };
    fetchOwnerProperties();
  }, [selectedCity]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Owner Properties</Text>
      <View style={styles.flex}>
        <Text style={styles.subTitle}>
          Simplify your home search in {selectedCity?.city ?? "Hyderabad"}
        </Text>
        <Pressable
          onPress={() => navigation.navigate("ViewAllOwnerProperties")}
        >
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>
      {properties?.length > 0 ? (
        <FlatList
          data={properties}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <OwnerPropertyCard details={item} />}
        />
      ) : (
        <Text style={styles.emptyText}>
          {selectedCity?.city
            ? `No properties available in ${selectedCity.city}`
            : "No properties available right now"}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    // backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  subTitle: {
    fontSize: 12,
    color: "#8f8d87ff",
    // marginBottom: 10,
    // marginTop: 2,
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    color: "#666",
    fontSize: 14,
  },
  flex: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 2,
  },
  viewAll: {
    fontSize: 13,
    color: "#27AE60",
    fontWeight: 500,
  },
});
export default OwnerProperties;
