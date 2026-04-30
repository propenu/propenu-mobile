import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

const CardDetails = ({ details, onPress }) => {
  const navigation = useNavigation();
  const { title, city, heroImage, priceFrom, priceTo } = details;

  const formatPrice = (price) => {
    if (!price) return "";
    if (price >= 10000000) return `₹ ${(price / 10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `₹ ${(price / 100000).toFixed(0)} L`;
    return `₹ ${price.toLocaleString("en-IN")}`;
  };

  const handleClick = () => {
    // console.log("getting id when select", details._id,details.slug, details);
    navigation.navigate("PropertyDetails", { propertyId: details._id });
  };


  return (
    <Pressable onPress={handleClick} style={styles.card}>
      <Image source={{ uri: heroImage }} style={styles.image} />

      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.city}>2,3 BHK Flats</Text>
        </View>

        <View style={styles.nameContainer}>
          <Text style={styles.city} numberOfLines={1}>
            {city}
          </Text>

          <Text style={styles.price}>
            {priceFrom && `${formatPrice(priceFrom)}`}{" "}
            <Text style={{ color: "gray", fontWeight: 400, fontSize: 11 }}>
              Onwards
            </Text>
            {/* {priceFrom && priceTo
              ? `${formatPrice(priceFrom)} – ${formatPrice(priceTo)}`
              : priceFrom
                ? formatPrice(priceFrom)
                : priceTo
                  ? formatPrice(priceTo)
                  : "-"} */}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 250,
    height: 200,
    marginLeft: 2,
    marginRight: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: 140,
    borderRadius: 10,

    backgroundColor: "#eee",
  },

  infoContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  title: {
    width: "50%",
    fontSize: 12,
    color: "#000",
    fontWeight: 500,
  },

  city: {
    fontSize: 12,
    marginTop: 4,
    color: "#666",
  },

  price: {
    fontSize: 12,
    fontWeight: 500,
    color: "#27AE60",
  },
});

export default CardDetails;
