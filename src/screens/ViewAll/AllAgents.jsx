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
import FontAwesome from "@expo/vector-icons/FontAwesome";
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
import { Linking } from "react-native";

const ItemCard = ({ item }) => {
  const navigation = useNavigation();
  const { width, height } = useDimensions();

  const openWhatsApp = (phone) => {
    const message =
      "Hi, I would like to connect with you regarding property details.";
    const url = `https://wa.me/${"+919182759849"}?text=${encodeURIComponent(message)}`;

    Linking.openURL(url);
  };

  const makeCall = async (phone) => {
    const url = `tel:${"+919182759849"}`;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      Linking.openURL(url);
    } else {
      console.log("Calling is not supported on this device");
    }
  };

  const ProfileImage = item?.avatar?.url
    ? { uri: item.avatar.url }
    : defaultImage;

    console.log("SLIG", item.slug)

  return (
    <Pressable
      style={styles.itemCard}
      onPress={() =>
        navigation.navigate("MoreAgentDetails", { slug: item?.slug })
      }
    >
      <View style={[styles.metaItemRow, { margin: 7 }]}>
        <Image
          source={ProfileImage}
          style={{ height: 70, width: 70, borderRadius: 35 }}
        />
        <View style={styles.container}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item?.name}
          </Text>
          <Text style={styles.status} numberOfLines={1}>
            {item?.agencyName}
          </Text>
          <Text style={styles.rera} numberOfLines={1}>
            RERA ID : {item?.rera?.reraAgentId}
          </Text>
        </View>
      </View>
      <Text style={styles.deals}>
        {item?.experienceYears}+ Years Experience • {item?.dealsClosed}+ Deals
        Closed
      </Text>

      <View style={styles.hrline} />
      <View
        style={[
          styles.metaItemRow,
          {
            justifyContent: "space-between",
            paddingHorizontal: 5,
            marginBottom: 7,
          },
        ]}
      >
        <View style={styles.metaItemRow}>
          <LocationIcon width="16" height="16" />
          <Text style={styles.areas}>{item?.areasServed?.join(", ")}</Text>
        </View>
        <View style={styles.metaItemRow}>
          <Pressable onPress={() => openWhatsApp(item?.phone)}>
            <FontAwesome name="whatsapp" size={22} color="#27AE60" />
          </Pressable>
          <Pressable
            style={{ marginTop: 5, marginLeft: 10 }}
            onPress={() => makeCall(item?.phone)}
          >
            <PhoneIcon width="20" height="20" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const AllAgents = () => {
  const cityData = useSelector(selectCityWithLocalities);
  const localities = useSelector(selectLocalitiesByCity);
  const [selectedArea, setSelectedArea] = useState(null);
  const insets = useSafeAreaInsets();

  const { data, isLoading, error } = useQuery({
    queryKey: ["allOwnersProperties"],
    queryFn: apiService.agent,
  });
  //   useEffect(() => {
  //     if (data?.data?.items?.length && !selectedArea) {
  //       const firstArea = data?.data?.items?.[0]?.areasServed?.[0];
  //       if (firstArea) {
  //         setSelectedArea(firstArea);
  //       }
  //     }
  //   }, [data]);

  const filteredData = selectedArea
    ? data?.data?.items?.filter((item) =>
        item?.areasServed?.some(
          (area) => area?.toLowerCase() === selectedArea?.toLowerCase(),
        ),
      )
    : data?.data?.items;

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
      <Text style={styles.title}>
        {cityData ? `Agents in ${cityData.city}` : "Hyderabad"}
      </Text>

      <Text style={styles.subText}>
        Connect with trusted real estate agents in your area
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

export default AllAgents;

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
    borderRadius: 10,
  },
  container: {
    marginLeft: 10,
  },
  imageBackground: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 500,
    // marginTop: 5,
    // lineHeight: 23,
    marginBottom: 4,
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
  metaItemRow: {
    flexDirection: "row",
    gap: 5,
  },
  rera: {
    color: "#27AE60",
    fontSize: 12,
    fontWeight: 500,
  },
  deals: {
    paddingHorizontal: 15,
    paddingTop: 7,
    fontSize: 12,
  },
  hrline: {
    height: 1,
    backgroundColor: "#eee",
    marginHorizontal: 8,
    marginVertical: 10,
  },
  areas: {
    fontSize: 12,
  },
});
