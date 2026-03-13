import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import LikedIconContainer from "../ui/LikedIconContainer";
import { useNavigation } from "@react-navigation/native";
import { AreaIcon, BedIcon, ReadyToMoveIcon } from "../../../assets/svg/Logo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import formatINR from "../../utils/FormatINR";
import AutoImageSlider from "../ui/AutoImageSlider";
import useDimensions from "../CustomHooks/UseDimension";
import { ToastInfo, ToastSuccess } from "../../utils/Toast";
import defaultImage from "../../../assets/defaultImage.png";
import { useAuth } from "../../context/AuthContext";

const OwnerPropertyCard = ({ details }) => {
  const navigation = useNavigation();
  const { width, height } = useDimensions();
  const { isLoggedIn } = useAuth();
  const cardWidth = width * 0.75;
  const imageSource =
    details?.gallery?.length > 0
      ? { uri: details.gallery[0].url }
      : defaultImage;

  const formatPrice = (price) => {
    if (!price) return "";

    if (price >= 10000000) {
      return `₹ ${(price / 10000000).toFixed(1)} Cr`;
    }

    if (price >= 100000) {
      return `₹ ${(price / 100000).toFixed(0)} L`;
    }

    return `₹ ${price.toLocaleString("en-IN")}`;
  };

  const handleContact = async () => {
    if (isLoggedIn) {
      ToastSuccess("Owner will contact you shortly");
    } else {
      ToastInfo("User not authenticated");
    }
  };

  const handleClick = () => {
    const screenMap = {
      residential: "MoreResidentialDetails",
      commercial: "MoreCommercialDetails",
      land: "MoreLandDetails",
      agricultural: "MoreAgriculturalDetails",
    };

    const screenName = screenMap[details?.type];

    if (screenName) {
      navigation.navigate(screenName, { slug: details?.slug });
    } else {
      console.log("Invalid category");
    }
  };

  const MetaItem = ({ label, value, Icon }) => (
    <View style={styles.metaItemRow}>
      {Icon}
      <View>
        <Text style={styles.metaLabel}>{label}</Text>
        <Text style={styles.metaValue}>{value}</Text>
      </View>
    </View>
  );
  return (
    <Pressable
      onPress={handleClick}
      style={[styles.card, { width: cardWidth }]}
    >
      <View style={styles.imageWrapper}>
        {details?.gallery?.length === 0 ? (
          <Image
            source={defaultImage}
            style={{ height: 160, width: cardWidth - 20, borderRadius: 10 }}
          />
        ) : (
          <AutoImageSlider
            images={details?.gallery?.map((img) => ({ uri: img.url }))}
            height={160}
            width={cardWidth - 20}
          />
        )}
        <View style={styles.likeIcon}>
          <LikedIconContainer id={details?._id} slug={details?.slug} type={details?.type} />
        </View>
      </View>
      <View style={styles.detailsSection}>
        <Text style={styles.propertyTitle} numberOfLines={1}>
          {details.title}
        </Text>
        <Text style={styles.propertyLocation}>{details.city}</Text>

        {/* <Text style={styles.propertyPrice}>{formatPrice(details.price)}</Text> */}

        {/* Meta */}
        <View style={styles.metaRow}>
          <View style={{ gap: 7 }}>
            <MetaItem
              Icon={<AreaIcon width={20} height={20} />}
              label="Area"
              value={`${details.superBuiltUpArea ?? "—"} sqft`}
            />
            <MetaItem
              Icon={<BedIcon width={20} height={20} />}
              label="Furnishing"
              value={details?.furnishing || "Unfurnished"}
            />
          </View>
          <View style={{ gap: 7 }}>
            <MetaItem
              Icon={<ReadyToMoveIcon width={20} height={20} />}
              label="Availability"
              value={`Available`}
            />

            <MetaItem
              Icon={<FontAwesome5 name="car" size={19} color="#8BEAB2" />}
              label="Parking"
              value={`${details?.parkingDetails?.twoWheeler || 0} + ${
                details?.parkingDetails?.fourWheeler || 0
              }`}
            />
          </View>
        </View>

        <View style={styles.priceBox}>
          <View>
            <Text style={styles.price}>{formatINR(details?.price)}</Text>
            <Text style={styles.priceSub}>₹ {details?.pricePerSqft}/sqft</Text>
          </View>

          <Pressable style={styles.button} onPress={handleContact}>
            {/* <PhoneIcon width={18} height={18} /> */}
            <Text style={styles.buttonText}>Contact Owner</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    // width: 250,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginRight: 15,
    marginLeft: 2,
  },
  detailsSection: {
    // paddingHorizontal: 10,
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  imageWrapper: {
    position: "relative",
  },
  area: {
    fontSize: 12,
    color: "#666",
  },
  likeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  image: {
    width: "100%",
    height: 250,
    marginRight: 12,
    borderRadius: 8,
  },
  propertyLocation: {
    fontSize: 12,
    color: "#000",
    marginBottom: 2,
    paddingHorizontal: 10,
  },
  propertyPrice: {
    fontSize: 12,
    fontWeight: "500",
    color: "#27AE60",
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
    paddingHorizontal: 10,
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
  priceBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#EAF8F0",
    marginTop: 10,
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
  button: {
    flexDirection: "row",
    paddingHorizontal: 20,
    backgroundColor: "#27AE60",
    paddingVertical: 7,
    borderRadius: 6,
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
export default OwnerPropertyCard;
