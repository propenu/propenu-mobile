import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Pressable,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import defaultImage from "../../../assets/defaultImage.png"

const HighLightCard = ({ details }) => {
  const navigation = useNavigation();
  const { title, city, heroImage, address, priceFrom, priceTo, currency } =
    details;

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

  const handleClick = () => {
    console.log("getting id when select", details._id, details.slug);
    navigation.navigate("PropertyDetails", { propertyId: details._id });
  };

  return (
    <Pressable onPress={handleClick} style={styles.card}>
      <View style={styles.imageWrapper}>
        <ImageBackground
          source={heroImage ? { uri: heroImage } : defaultImage}
          style={styles.imageBackground}
          imageStyle={styles.image}
        />

        <View style={styles.lowerCard}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.city} numberOfLines={1}>
            {" "}
            {address}
          </Text>
          <Text style={styles.price} numberOfLines={1}>
            {formatPrice(priceFrom)} – {formatPrice(priceTo)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    marginRight: 15,
    height: 200,
  },

  imageWrapper: {
    position: "relative",
    paddingBottom: 0,
  },

  imageBackground: {
    width: 250,
    height: 150,
  },

  image: {
    borderRadius: 10,
  },

  lowerCard: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",

    width: 200,
    height: 80,
    transform: [{ translateY: 40 }],

    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,

    alignItems: "center",
    justifyContent: "center",

    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  title: {
    fontSize: 12,
    fontWeight: "600",
    color: "#222",
  },

  city: {
    fontSize: 11,
    color: "#000",
    marginTop: 2,
  },

  price: {
    fontSize: 12,
    fontWeight: "500",
    color: "#27AE60",
    marginTop: 4,
  },
});

export default HighLightCard;
