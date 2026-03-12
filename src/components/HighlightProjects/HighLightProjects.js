import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { apiService } from "../../services/apiService";
import HighLightCard from "./HighLightCard";
import useCity from "../CustomHooks/useCity";
import { useNavigation } from "@react-navigation/native";

const HighLightProjects = () => {
  const [projects, setProjects] = useState([]);
  const { selectedCity } = useCity();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiService.HighlightProjects();
        if (response.status === 200) {
          const data = response.data.items;
          // console.log(
          //   data.length,
          //   data.map((item) => item.city),
          // );
          const filteredData = selectedCity?.city
            ? data.filter(
              (item) =>
                item.city?.toLowerCase() === selectedCity.city.toLowerCase(),
            )
            : data;
          setProjects(filteredData);
        }
      } catch (error) {
        console.log("Highlight Projects Error:", error);
      }
    };

    fetchProjects();
  }, [selectedCity]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Selling Properties</Text>
      <View style={styles.row}>
        <Text style={styles.subtitle}>Investment-worthy in {selectedCity?.city ?? "Hyderabad"}</Text>
        <Pressable onPress={()=> navigation.navigate("HighLightedProperties")}>
        <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>

      {projects?.length > 0 ? (
        <FlatList
          data={projects}
          keyExtractor={(item) => item?._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <HighLightCard details={item} />}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // borderWidth:1,
    marginTop: 4,
    marginBottom: 10
  },
  viewAll: {
    fontSize: 13,
    color: "#27AE60",
    fontWeight: 500
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    // marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: "#8f8d87ff",
    // marginBottom: 8,
    // marginTop: 2,
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    color: "#666",
    fontSize: 14,
  },
});
export default HighLightProjects;
