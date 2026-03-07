import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  TextInput,
} from "react-native";
import useCity from "../../components/CustomHooks/useCity";
import ResidentialCard from "./Cards/ResidentialCard";
import CommercialCard from "./Cards/CommercialCard";
import LandCard from "./Cards/LandCard";
import AgriculturalCard from "./Cards/AgriculturalCard";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { apiService } from "../../services/apiService";
import SearchBar from "../../components/ui/SearchBar";
import { useAppSelector } from "../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const PropertyListScreen = ({ navigation }) => {
  // const { id, title } = route.params;
  const insets = useSafeAreaInsets();
  const { category } = useAppSelector((s) => s.filters);
  const filtersState = useSelector((state) => state.filters);
  const { residential, commercial, land, agricultural,listingTypeValue } = filtersState;

  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedCity } = useCity();
  const [value, setValue] = useState("");
  const [type, setType] =  useState("sale")
  

  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     const result = await apiService.category_search({
  //       category: category,
  //     });
  //     setDetails(Array.isArray(result) ? result : []);
  //   } catch (error) {
  //     console.log("Error occurred:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const buildSearchParams = (category, filters) => {
    const params = { category };

    if(listingTypeValue === "buy"){
      params.listingType = "sale"
    }
    else params.listingType = "rent";

    if (filters && Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          !(Array.isArray(value) && value.length === 0)
        ) {
          params[key] = Array.isArray(value) ? value.join(",") : value;
        }
      });
    }

    return params;
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      // filters can be residential / commercial / land / agricultural
      const filters =
        category === "Residential"
          ? residential
          : category === "Commercial"
            ? commercial
            : category === "Land"
              ? land
              : category === "Agricultural"
                ? agricultural
                : {};

      const params = buildSearchParams(category, filters);
      console.log("Search Params :", params, filters);
      setType(params?.listingType)

      const result = await apiService.category_search(params);
      setDetails(Array.isArray(result) ? result : []);
    } catch (error) {
      console.log("Error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  const total = details?.[0]?.__meta?.total;
  const properties = details?.filter(item => !item.__meta);
  console.log("properties :",total, properties)

  useEffect(() => {
    fetchData();
  }, [category]);

  const renderPropertyCard = useCallback(
    ({ item }) => {
      switch (category.toLowerCase()) {
        case "residential":
          return <ResidentialCard item={item} />;
        case "commercial":
          return <CommercialCard item={item} />;
        case "land":
          return <LandCard item={item} />;
        case "agricultural":
          return <AgriculturalCard item={item} />;
        default:
          return null;
      }
    },
    [category],
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading... </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Pressable onPress={() => navigation.navigate("CategoryFilter")}>
        <View pointerEvents="none" style={styles.search}>
          <EvilIcons
            style={{ width: 20 }}
            name="search"
            size={24}
            color="gray"
          />
          <TextInput
            style={styles.input}
            value={value}
            placeholder={`Search in ${selectedCity?.city ?? "City"} `}
            placeholderTextColor="gray"
            onChange={setValue}
          />
        </View>
      </Pressable>

      {total === 0 && (
        <View style={styles.loadingContainer}>
          <Text style={styles.empty}>No properties available.</Text>
        </View>
      )}

      {total > 0 && (
        <Text style={styles.lengthText} numberOfLines={1}>
          {total} Properties for {type}{" "}
          {selectedCity?.city ? `in ${selectedCity.city}` : ""}
        </Text>
      )}
      {total > 0 && (
        <FlatList
          data={properties}
          keyExtractor={(item, index) => String(item.id || item._id || index)}
          renderItem={renderPropertyCard}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default PropertyListScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    //  backgroundColor: "rgba(243, 255, 245, 0.5)",
    backgroundColor: "#fff",
  },
  loading: {
    textAlign: "center",
    marginTop: 20,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  list: {
    paddingBottom: 20,
  },
  search: {
    // flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#ADADAD",
    borderRadius: 10,
    // paddingVertical: 2,
    paddingHorizontal: 5,
    backgroundColor: "white",
    marginBottom: 8,
  },
  input: {
    // width: "100%",
    borderWidth: 0,
    // paddingLeft: 10,
    paddingVertical: 7,
    borderColor: "red",
  },
  lengthText: {
    fontSize: 15,
    fontWeight: 500,
    paddingVertical: 10,
    paddingLeft: 5,
  },
});
