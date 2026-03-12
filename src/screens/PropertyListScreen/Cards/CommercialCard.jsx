import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ToastSuccess, ToastInfo } from "../../../utils/Toast";
import useDimensions from "../../../components/CustomHooks/UseDimension";
import formatINR from "../../../utils/FormatINR";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  AreaIcon,
  ReadyToMoveIcon,
  PhoneIcon,
} from "../../../../assets/svg/Logo";
import LikedIconContainer from "../../../components/ui/LikedIconContainer";
import AutoImageSlider from "../../../components/ui/AutoImageSlider";
import { useAuth } from "../../../context/AuthContext";

const CommercialCard = ({ item }) => {
  const { width } = useDimensions();
  const navigation = useNavigation();
  const { isLoggedIn, userDetails } = useAuth();

  const handlePress = async () => {
    console.log("Checking property id : ", item?.slug);
    navigation.navigate("MoreCommercialDetails", {
      slug: item?.slug,
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
    <Pressable style={styles.card} onPress={handlePress}>
      {/* Image slider */}
      <View style={styles.imageWrapper}>
        <AutoImageSlider
          // images={item.gallery.map((img) => ({ uri: img.url }))}
          images={item?.gallery?.map((img) => ({ uri: img.url }))}
          height={180}
          width={width - horizontalSpace}
        />
        {/* Top-right like icon */}
        <View style={styles.likeIcon}>
          <LikedIconContainer
            id={item?.id}
            slug={item?.slug}
            type={item?.type}
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          {/* <Text style={styles.price}>{formatINR(item.price)}</Text> */}
        </View>

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
      </View>

      {/* Footer */}
      <View style={styles.priceBox}>
        <View>
          <Text style={styles.price}>{formatINR(item?.price)}</Text>
          {item?.pricePerSqft ? (
            <Text style={styles.priceSub}>₹ {item?.pricePerSqft} / sqft</Text>
          ) : null}
        </View>

        <Pressable style={styles.button} onPress={handleContact}>
          <PhoneIcon width={18} height={18} color="white" />
          <Text style={styles.buttonText}>Contact</Text>
        </Pressable>
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

export default React.memo(CommercialCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 2,
    padding: 10,
    overflow: "hidden",
    elevation: 3,
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
    justifyContent: "space-around",
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
    fontSize: 13,
    fontWeight: 500,
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
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },

  badge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: "#27AE60",
    fontWeight: "400",
  },
});
