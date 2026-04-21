import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ToastSuccess, ToastInfo } from "../../../utils/Toast";
import useDimensions from "../../../components/CustomHooks/UseDimension";
import formatINR from "../../../utils/FormatINR";
import {
  AreaIcon,
  ReadyToMoveIcon,
  PhoneIcon,
} from "../../../../assets/svg/Logo";
import AutoImageSlider from "../../../components/ui/AutoImageSlider";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useAuth } from "../../../context/AuthContext";
import LikedIconContainer from "../../../components/ui/LikedIconContainer";
import ContactOwnerButton from "../../../components/ui/ContactOwnerButton";
const LandCard = ({ item }) => {
  const { width } = useDimensions();
  const navigation = useNavigation();
  const { isLoggedIn, userDetails } = useAuth();

  const displayName =
    item?.type === "residential" || item?.type === "commercial"
      ? item?.buildingName
      : item?.landName;

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

  const handleNavigate = async () => {
    console.log("Checking property id : ", item.slug);
    navigation.navigate("MoreLandDetails", {
      slug: item.slug,
    });
  };

  const handleContact = async () => {
    if (!isLoggedIn) {
      ToastInfo("User not authenticated");
    } else {
      ToastSuccess("Owner will contact you shortly");
    }
  };

  const horizontalSpace = 2 * 2 + 10 * 4; //marginHorizontal is 2, padding is 10 here and parent component is 10, total : 44

  return (
    <Pressable style={styles.card} onPress={handleNavigate}>
      {/* Image slider */}
      <View style={styles.imageWrapper}>
        <AutoImageSlider
          images={item?.gallery?.map((img) => ({ uri: img.url }))}
          height={200}
          width={width - horizontalSpace}
        />
        <View style={styles.likeIcon}>
          <LikedIconContainer
            id={item?.id || item._id}
            slug={item?.slug}
            type={item?.type}
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        {/* <Text style={styles.price}>{formatINR(item.price)}</Text> */}

        {/* <Text style={styles.subTitle} numberOfLines={2}>
                  {item.title}
                </Text> */}

        <View style={styles.metaRow}>
          <Text style={styles.badge}>RERA Approved</Text>
          <Text style={styles.badge}>Premium</Text>
          <Text style={styles.badge}>Zero Brokerage</Text>
        </View>

        {/* Meta */}
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
            value={item?.roadWidthFt || "—"}
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.priceBox}>
        <View>
          <Text style={styles.price}>{formatINR(item?.price)}</Text>
          {item?.pricePerSqft ? (
            <Text style={styles.priceSub}>₹ {item?.pricePerSqft} / sqft</Text>
          ) : null}
        </View>
         <ContactOwnerButton
          projectId={item?.id ?? item?._id}
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

        {/* <Pressable style={styles.button} onPress={handleContact}>
          <PhoneIcon width={18} height={18} color="white" />
          <Text style={styles.buttonText}>Contact</Text>
        </Pressable> */}
      </View>
    </Pressable>
  );
};

const MetaItem = ({ label, value, Icon, iconProps = {} }) => (
  <View style={styles.metaItemRow}>
    <Icon size={20} color="#8BEAB2" {...iconProps} />
    <View style={{ gap: 3 }}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  </View>
);

export default React.memo(LandCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 2,
    padding: 10,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
  },
  imageWrapper: {
    position: "relative",
  },

  likeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
  },
  subTitle: {
    fontSize: 13,
    marginVertical: 5,
    // color: "#585757ff",
    // marginLeft: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    marginRight: 5,
  },
  metaItemRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap:"wrap",
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
  priceBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
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
    paddingHorizontal: 30,
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

  badge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: "#27AE60",
    fontWeight: "400",
  },
});
