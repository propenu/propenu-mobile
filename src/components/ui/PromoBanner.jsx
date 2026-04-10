import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomerSupport from "../../../assets/svg/customer-support.svg";
import { useAuth } from "../../context/AuthContext";

const { width } = Dimensions.get("window");

const PromoBanner = () => {
  const navigation = useNavigation();
  const { useDetails } = useAuth();

  const handleNavigate = () => {
    if (useDetails?.roleName === "agent") {
      navigation.navigate("BuyPlans");
    } else {
      navigation.navigate("BuyViewPlans");
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <CustomerSupport height="130" width="130" />

        <Text style={styles.title}>
          Haven’t subscribed yet? Upgrade now to unlock more leads and grow your
          property reach.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleNavigate}>
          <Text style={styles.buttonText}>Upgrade your Plan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PromoBanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  leftSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: width > 768 ? "left" : "center",
    marginVertical: 20,
    paddingHorizontal: 20,
    lineHeight: 23,
  },
  button: {
    backgroundColor: "#27AE60",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  imageContainer: {
    // marginTop: width > 768 ? 0 : 12,
    height: 100,
  },
  image: {
    height: "90%",
    width: 120,
  },
});
