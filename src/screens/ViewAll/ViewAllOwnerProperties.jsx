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
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { LocationIcon } from "../../../assets/svg/Logo";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../services/apiService";
import { useNavigation } from "@react-navigation/native";
import {
  Celebration,
  Building,
  PhoneIcon,
  AreaIcon,
  BedIcon,
  ReadyToMoveIcon,
} from "../../../assets/svg/Logo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import defaultImage from "../../../assets/defaultImage.png";
import AutoImageSlider from "../../components/ui/AutoImageSlider";
import useDimensions from "../../components/CustomHooks/UseDimension";
import formatINR from "../../utils/FormatINR";
import { FontAwesome5 } from "@expo/vector-icons";

const ItemCard = ({ item }) => {
  const navigation = useNavigation();
  const { width, height } = useDimensions();

  // const cardWidth = width * 0.75;
  const displayName =
    item?.type === "residential" || item?.type === "commercial"
      ? item?.buildingName
      : item?.landName;

  const MetaItem = ({ label, value, Icon, iconProps = {} }) => (
    <View style={styles.metaItemRow}>
      <Icon size={20} color="#8BEAB2" {...iconProps} />
      <View style={{ gap: 3 }}>
        <Text style={styles.metaLabel}>{label}</Text>
        <Text style={styles.metaValue}>{value}</Text>
      </View>
    </View>
  );
  return (
    <Pressable
      style={styles.itemCard}
      onPress={() =>
        navigation.navigate("PropertyDetails", { propertyId: item?._id })
      }
    >
      {item?.gallery?.length === 0 ? (
        <Image
          source={defaultImage}
          style={{ height: 200, width: width - 34, borderRadius: 10 }}
        />
      ) : (
        <AutoImageSlider
          images={item?.gallery?.map((img) => ({ uri: img.url }))}
          height={180}
          width={width - 34} //34 means paddingHorizontal:10, padding:6 and borderwidth:1 * 2  = 34
        />
      )}
      <View style={{ margin: 7 }}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item?.title}, {item?.address}
        </Text>
        <Text style={styles.status} numberOfLines={1}>
          {displayName || item?.title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 5,
          }}
        >
          <Text style={styles.text}>RERA Approved</Text>
          <Text style={styles.text}>Premium</Text>
          <Text style={styles.text}>Zero Brokerage</Text>
        </View>
        {item?.type === "residential" && (
          <View style={styles.metaRow}>
            <MetaItem
              Icon={AreaIcon}
              label="Area"
              value={`${item?.builtUpArea ?? "—"} sqft`}
            />
            <MetaItem
              Icon={BedIcon}
              label="Furnishing"
              value={item?.furnishing || "Unfurnished"}
            />
            <MetaItem
              Icon={ReadyToMoveIcon}
              label="Parking"
              value={`${item?.parkingDetails?.twoWheeler || 0} + ${
                item?.parkingDetails?.fourWheeler || 0
              }`}
            />
          </View>
        )}

        {item?.type === "commercial" && (
          <View style={styles.metaRow}>
            <MetaItem
              Icon={AreaIcon}
              label="Area"
              value={`${item.builtUpArea ?? "—"} sqft`}
            />
            <MetaItem
              Icon={MaterialCommunityIcons}
              iconProps={{ name: "chair-rolling" }}
              label="Furnishing"
              value={item.furnishing || "Unfurnished"}
            />
            <MetaItem
              Icon={ReadyToMoveIcon}
              label="Floors"
              value={`${item?.floorNumber || "-"} / ${item?.totalFloors || "-"}`}
            />
          </View>
        )}

        {item?.type === "land" && (
          <View style={styles.metaRow}>
            <MetaItem
              Icon={AreaIcon}
              label="Area"
              value={`${item.plotArea ?? "—"} sqft`}
            />
            <MetaItem
              Icon={ReadyToMoveIcon}
              label="Dimensions"
              value={`${item?.dimensions?.length || 0} x ${
                item?.dimensions?.width || 0
              }`}
            />
            <MetaItem
              Icon={FontAwesome5}
              iconProps={{ name: "road" }}
              label="Road Width"
              value={item?.roadWidthFt || "Unfurnished"}
            />
          </View>
        )}

        {item?.type === "agricultural" && (
          <View style={styles.metaRow}>
            <MetaItem
              Icon={AreaIcon}
              label="Area"
              value={`${item.plotArea ?? "—"} sqft`}
            />
            <MetaItem
              Icon={MaterialCommunityIcons}
              iconProps={{ name: "sprout" }}
              label="Soil Type"
              value={item?.soilType}
            />
            <MetaItem
              Icon={MaterialCommunityIcons}
              iconProps={{ name: "water" }}
              label="Water Source"
              value={item?.waterSource || "—"}
            />
          </View>
        )}

        <View style={styles.btnContainer}>
          <View>
            <Text style={styles.price}>{formatINR(item?.price)}</Text>
            <Text style={styles.priceSub}>₹ {item?.pricePerSqft}/sqft</Text>
          </View>
          <Pressable style={styles.button}>
            <View style={{ marginTop: 3 }}>
              <PhoneIcon width="16" height="16" color="white" />
            </View>
            <Text style={styles.buttonText}>Contact Owner</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const ViewAllOwnerProperties = () => {
  const cityData = useSelector(selectCityWithLocalities);
  const localities = useSelector(selectLocalitiesByCity);
  const [selectedArea, setSelectedArea] = useState(null);
  const insets = useSafeAreaInsets();

  const { data, isLoading, error } = useQuery({
    queryKey: ["allOwnersProperties"],
    queryFn: apiService.ownersProperties,
  });
  useEffect(() => {
    if (data?.data?.items?.length && !selectedArea) {
      setSelectedArea(data.data.items[0]?.address);
    }
  }, [data]);

  const filteredData = data?.data?.items;
  // selectedArea
  //   ? data?.data?.items?.filter(
  //       (item) => item?.address?.toLowerCase() === selectedArea?.toLowerCase(),
  //     )
  //   : data?.data?.items;

  console.log("filteredDatafilteredData", filteredData);

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
      {/* <Text style={styles.title}>
        {cityData ? `Hotspots in ${cityData.city}` : "Select city first"}
      </Text>

      <Text style={styles.subText}>
        Popular localities with high demand and growth potential
      </Text> */}

      {/* Horizontal areas */}
      {/* <ScrollView
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
      </ScrollView> */}

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

export default ViewAllOwnerProperties;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  title: {
    marginTop: 8,
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
    lineHeight: 23,
    marginBottom: 5,
  },
  status: {
    fontSize: 13,
    color: "gray",
    marginBottom: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: 500,
    color: "#27Ae60",
  },
  button: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#27AE60",
    // marginTop: 12,
    borderRadius: 8,
    // paddingVertical:3 ,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F1FCF5",
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: 600,
    textAlign: "center",
  },
  btn: {
    flexDirection: "row",
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
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#27AE60",
  },
  priceSub: {
    fontSize: 12,
    // fontWeight: 500,
    // color: "#555",
  },
  metaItemRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    gap: 7,
  },
  metaItem: {
    // alignItems: "center",
    gap: 3,
  },
  metaLabel: {
    fontSize: 11,
    color: "#777",
  },
  metaValue: {
    fontSize: 12,
    fontWeight: "500",
  },
});
