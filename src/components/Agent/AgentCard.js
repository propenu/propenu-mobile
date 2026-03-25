import { View, Text, StyleSheet, Image, Pressable } from "react-native";
// import HomePageImage from "../../../assets/HomePageImage.png";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Logo, LocationIcon } from "../../../assets/svg/Logo";
import { useNavigation } from "@react-navigation/native";
import defaultImage from "../../../assets/defaultImage.png";

const AgentCard = ({ details }) => {
  const navigation = useNavigation();
  const imageSource = details?.coverImage?.url
    ? { uri: details.coverImage.url }
    : defaultImage;
;

  const handlePress = () => {
    navigation.navigate("MoreAgentDetails", { slug: details?.slug });
  };

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      {details?.rera?.isVerified && (
        <View style={styles.VerifiedBadge}>
          <MaterialIcons name="verified-user" size={16} color="white" />
          <Text style={{ color: "white", fontSize: 12 }}>Verified</Text>
        </View>
      )}
      <View style={styles.imageWrapper}>
        <Image source={imageSource} style={styles.image} />

        <Image source={{ uri: details?.avatar?.url }} style={styles.avatar} />
      </View>
      <View style={styles.propertyDetails}>
        <Text style={styles.name}>{details.name}</Text>
        <Text
          style={{
            color: "#27AE60",
            fontSize: 13,
            fontWeight: 500,
            paddingVertical: 2,
          }}
        >
          {details.agencyName}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {details.bio}
        </Text>

        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}
        >
          <LocationIcon width={15} height={15} />
          <Text style={styles.area}> {details?.areasServed?.join(", ")}</Text>
        </View>
      </View>
      <View style={styles.divider} />

      <View style={styles.content}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.color}>{details.stats.publishedCount}</Text>
          <Text style={styles.info}>For Sale</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.color}>{details.stats.totalProperties}</Text>
          <Text style={styles.info}>Total Properties</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.color}>{details.dealsClosed}</Text>
          <Text style={styles.info}>Closed</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 270,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginRight: 15,
    marginLeft: 2,
    paddingBottom: 13,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  color: {
    color: "#27AE60",
    fontWeight: 500,
  },
  info: { fontSize: 12, color: "#000" },
  area: {
    fontSize: 13,
    fontWeight: 500,
    color: "#363535ff",
  },
  name: {
    fontSize: 14,
    fontWeight: 500,
  },
  divider: {
    height: 1,
    // marginTop:5,
    alignSelf: "center",
    backgroundColor: "#eee",
    width: 250,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  VerifiedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: "#27AE60",
    paddingVertical: 2,
    paddingHorizontal: 15,
    borderRadius: 5,
    flexDirection: "row",
    gap: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 12,
    marginVertical: 5,
    // color: "#000",
    // marginBottom: 7,
    // marginTop: 5,
    lineHeight: 18,
  },
  imageWrapper: {
    position: "relative",
  },
  propertyDetails: {
    paddingHorizontal: 12,
    paddingTop: 35,
    marginBottom: 5,
  },
  image: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  avatar: {
    position: "absolute",
    left: 12,
    top: "100%",
    transform: [{ translateY: -30 }],
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#eee",
  },
});
export default AgentCard;
