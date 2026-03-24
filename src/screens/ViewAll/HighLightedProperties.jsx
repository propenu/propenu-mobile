import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  selectCityWithLocalities,
  selectLocalitiesByCity,
} from "../../redux/slice/CitySlice";
import { useDispatch, useSelector } from "react-redux";
import { LocationIcon } from "../../../assets/svg/Logo";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../services/apiService";
import defaultImage from "../../../assets/defaultImage.png";
import { useNavigation } from "@react-navigation/native";
import { Celebration,Building, PhoneIcon } from "../../../assets/svg/Logo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ContactOwnerButton from "../../components/ui/ContactOwnerButton";

const ItemCard = ({ item }) => {
  const navigation = useNavigation();


    const listingSourceRaw = (
    item?.listingSource ||
    item?.createdBy?.roleName ||
    item?.createdBy?.role ||
    "user"
  )?.toLowerCase();

  const resolvedListingSource =
    listingSourceRaw === "agent"
      ? "Agent"
      : listingSourceRaw === "builder"
        ? "builder"
        : "Owner";
  return (
    <Pressable
      style={styles.itemCard}
      onPress={() =>
        navigation.navigate("PropertyDetails", { propertyId: item?._id })
      }
    >
      <Image
        source={item.heroImage ? { uri: item.heroImage } : defaultImage}
        style={styles.imageBackground}
      />
      <View style={{ margin: 7 }}>
        <Text style={styles.itemTitle}>
          {item?.title}, {item?.address}
        </Text>
        <Text style={styles.status}>2,3 bhk | Ready to move</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <View style={styles.btn}>
            <Building width="20" height="19" />
            <Text style={styles.btnText}>
              {item?.bhkSummary?.length || 0} Floor Plans
            </Text>
            <View style={styles.icon}>
              <AntDesign name="right" size={10} color="#27AE60" />
            </View>
          </View>

          <View style={styles.btn}>
            <Celebration width="20" height="20" />
            <Text style={styles.btnText}>
              {item?.amenities?.length || 0} Amenities
            </Text>
            <View style={styles.icon}>
              <AntDesign name="right" size={10} color="#27AE60" />
            </View>
          </View>
        </View>

         <View style={styles.button}>

         <ContactOwnerButton
            projectId={item?._id}
            propertyType={item?.type}
            listingType={item?.listingType}
            listingSource={resolvedListingSource}
            ownerName={item?.createdBy?.name}
            ownerPhone={item?.createdBy?.contact ?? item?.phone}
            ownerEmail={item?.createdBy?.email ?? item?.email}
            postedOn={item?.createdAt}
            price={item?.price}
            propertyLabel={item?.title}
          />       
          </View>

        {/* <Pressable style={styles.button}>
          <View style={{ marginTop: 3 }}>
            <PhoneIcon width="16" height="16" color="white" />
          </View>
          <Text style={styles.buttonText}>Contact</Text>
        </Pressable> */}
      </View>
    </Pressable>
  );
};

const HighLightedProperties = () => {
  const cityData = useSelector(selectCityWithLocalities);
  const localities = useSelector(selectLocalitiesByCity);
  const [selectedArea, setSelectedArea] = useState(null);
  const insets = useSafeAreaInsets();

  const { data, isLoading, error } = useQuery({
    queryKey: ["viewAllTopProperties"],
    queryFn: apiService.HighlightProjects,
  });
  useEffect(() => {
    if (data?.data?.items?.length && !selectedArea) {
      setSelectedArea(data.data.items[0]?.address); // preselect first locality
    }
  }, [data]);

  const filteredData = selectedArea
    ? data?.data?.items?.filter(
        (item) => item?.address?.toLowerCase() === selectedArea?.toLowerCase(),
      )
    : data?.data?.items;

  const handleSelect = (name) => {
    if (selectedArea === name) {
      setSelectedArea(null);
    } else {
      setSelectedArea(name);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#27AE60" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.mainContainer}
      contentContainerStyle={{ paddingBottom: insets.bottom + 12 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>
        {cityData ? `Hotspots in ${cityData.city}` : "Select city first"}
      </Text>

      <Text style={styles.subText}>
        Popular localities with high demand and growth potential
      </Text>

      {/* Horizontal areas */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 17, marginLeft: 3 }}
      >
        {localities?.map((item) => {
          const active = selectedArea === item?.name;

          return (
            <Pressable
              key={item?.name}
              style={[styles.card, active && styles.activeCard]}
              onPress={() => handleSelect(item?.name)}
            >
              <LocationIcon
                width={16}
                height={15}
                color={active ? "#27AE60" : "#000"}
              />
              <Text style={[styles.cardText, active && styles.activeText]}>
                {item?.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {filteredData?.length > 0 && (
        <Text style={styles.title}>
          {filteredData?.length} Projects in {cityData?.city}
        </Text>
      )}

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item?._id}
        renderItem={({ item }) => <ItemCard item={item} />}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

export default HighLightedProperties;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 14,
    fontWeight: 500,
  },
  subText: {
    marginTop: 7,
    fontSize: 12,
    color: "gray",
  },
  card: {
    // height: 40,
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    // elevation: 2,
  },

  cardText: {
    marginLeft: 4,
    fontSize: 13,
    color: "#333",
  },
  activeCard: {
    borderColor: "#27AE60",
    backgroundColor: "#effaf3",
  },
  activeText: {
    color: "#27AE60",
    fontWeight: "500",
  },
  itemCard: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 6,
    borderRadius: 8,
  },
  imageBackground: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 500,
    marginTop: 5,
    marginBottom: 8,
  },
  status: {
    fontSize: 13,
    color: "gray",
    marginBottom: 4,
  },
  button: {
    // width:"100%",
    // flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "center",
    gap: 4,
    // backgroundColor: "#27AE60",
    marginTop: 12,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: 600,
    textAlign: "center",
  },
  btn: {
    flexDirection: "row",
    alignItems:"center",
    justifyContent: "center",
    backgroundColor: "#F1FCF5",
    paddingVertical: 5,
    width: "48%",
    textAlign: "center",
    borderRadius: 8,
    marginTop: 10,
    color: "#27AE60",
  },
  btnText: {
    fontSize: 12,
    color: "#27AE60",
    fontWeight: "500",
    marginLeft: 6,
  },
  icon: {
    marginTop: 4,
    marginLeft: 3,
  },
});
