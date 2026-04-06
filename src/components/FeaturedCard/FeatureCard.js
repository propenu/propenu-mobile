import { View, Text, StyleSheet, FlatList } from "react-native";
import CardDetails from "./CardDetails";
import { apiService } from "../../services/apiService";
import React, { useEffect, useState } from "react";
import useCity from "../CustomHooks/useCity";

const FeaturedCard = ({ navigation }) => {
  const [details, setDetails] = useState([]);
  const { selectedCity } = useCity();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await apiService.featuredProjects();

        if (response.status === 200) {
          const items = response.data.items || [];

          const filteredData = selectedCity?.city
            ? items.filter(
                (item) =>
                  item.city?.toLowerCase() === selectedCity.city.toLowerCase(),
              )
            : items;

          setDetails(filteredData);
        }
      } catch (error) {
        console.log("Featured Card Error:", error);
      }
    };

    fetchDetails();
  }, [selectedCity]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Prime Projects</Text>
      <Text style={styles.subtitle}>
        Stand out for the lifestyle they offer in {selectedCity?.city ?? "Hyderabad"}
      </Text>

      {details?.length > 0 ? (
        <FlatList
          data={details}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <CardDetails details={item} />}
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
  card: {
    marginHorizontal: 10,
    // paddingVertical: 10,
  },
  title: { fontSize: 16, fontWeight: "600" },
  subtitle: {
    fontSize: 12,
    color: "#8f8d87ff",
    marginBottom: 8,
    marginTop: 2,
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    color: "#666",
    fontSize: 14,
  },
});
export default FeaturedCard;
