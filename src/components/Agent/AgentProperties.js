import { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { apiService } from "../../services/apiService";
import AgentCard from "./AgentCard";
import { useQuery } from "@tanstack/react-query";
import useCity from "../CustomHooks/useCity";
import { useNavigation } from "@react-navigation/native";

export const fetchAgents = async () => {
  const res = await apiService.agent();
  return res.data.items;
};
const AgentProperties = () => {
  const { selectedCity } = useCity();
  const { data, isLoading, isError, error } = useQuery(["agents"], fetchAgents);
  const navigation = useNavigation();

  const filteredData = useMemo(() => {
    if (!data) return [];

    if (!selectedCity?.city) return data;

    return data.filter(
      (item) => item.city?.toLowerCase() === selectedCity.city.toLowerCase(),
    );
  }, [data, selectedCity]);
  if (isError) console.log("Agent api error :", error);

  // const [details, setDetails] = useState([]);
  // useEffect(() => {
  //   const fetchAgentData = async () => {
  //     try {
  //       const response = await apiService.agent();
  //       if (response.status === 200) {
  //         setDetails(response.data.items);
  //       }
  //     } catch (error) {
  //       console.log("Error occured in agent api", error);
  //     }
  //   };
  //   fetchAgentData();
  // }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agent Connect</Text>
      <View style={styles.flex}>
        <Text style={styles.subtitle}>
          Expert help, simplified
          {/* Trusted professionals guiding your property journey */}
        </Text>
        <Pressable onPress={() => navigation.navigate("AllAgents")}>
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>

      {filteredData?.length > 0 ? (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <AgentCard details={item} />}
        />
      ) : (
        <Text style={styles.emptyText}>
          No agent properties available at the moment
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
  },
  subtitle: {
    fontSize: 12,
    color: "#8f8d87ff",
  },
  flex: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    marginTop: 2,
  },
  viewAll: {
    color: "#27AE60",
    fontWeight: 500,
    fontSize: 13,
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    color: "#666",
    fontSize: 14,
  },
});
export default AgentProperties;
