import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { userServices } from "../../services/userServices";
import { LocationIcon } from "../../../assets/svg/Logo";
import formatINR from "../../utils/FormatINR";
import { useQuery } from "@tanstack/react-query";

const ContactedProperties = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["contactedProperties"],
    queryFn: userServices.getContactedProperties,
  });

  const contactedProperties = data?.properties ?? [];
  const total = data?.total ?? 0;

  if (isLoading)
    return <ActivityIndicator size="large" style={{ color: "#27AE60" }} />;
  if (error) return console.log("failed to get contacted properties :", error);
  
  const PropertyCard = ({ item }) => {
    return (
      <View style={styles.propertyCard}>
        {item?.gallery && (
          <Image source={{ uri: item.gallery }} style={styles.image} />
        )}

        <Text style={styles.sale}>{item.listingType}</Text>

        <View style={styles.content}>
          <Text style={styles.propertyTitle} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={styles.price}>
            <View>
              <View style={styles.locations}>
                <LocationIcon width={14} height={14} />
                <Text style={styles.propertyDetails}>
                  {item.locality}, {item.city}
                </Text>
              </View>

              <Text style={styles.ownerName}>Owner : {item?.owner?.name}</Text>
            </View>

            {item?.price ? (
              <Text style={styles.priceText}>{formatINR(item.price)}</Text>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Contacted Properties</Text>
      <Text style={styles.subTitle}>
        Properties you have contacted {total ? (total) : null}
      </Text>
      {contactedProperties?.length > 0 ? (
        <FlatList
          data={contactedProperties}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <PropertyCard item={item} />}
        />
      ) : (
        <View style={styles.noContent}>

        <Text>No contacted properties</Text>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 3,
    backgroundColor: "white",
  },
  propertyCard: {
    position: "relative",
    width: "98%",
    backgroundColor: "white",
    alignSelf: "center",
    marginHorizontal: 2,
    borderRadius: 8,
    marginVertical: 12,
    elevation: 2,
    shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.2,
  shadowRadius: 2,
    padding: 8,
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 8,
  },
  sale: {
    backgroundColor: "#27AE60",
    paddingHorizontal: 8,
    paddingVertical: 3,
    position: "absolute",
    top: 18,
    left: 18,
    borderRadius: 8,
    color: "white",
  },
  propertyDetails: {
    fontSize: 12,
    color: "#555",
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
  },
  subTitle: {
    fontSize: 12,
    color: "gray",
    paddingTop: 4,
  },
  image: {
    height: 150,
    padding: 10,
    width: "100%",
    alignSelf: "center",
    borderRadius: 8,
  },
  noContent:{
 flex:1,
 justifyContent:"center",
 alignItems:"center"
  },
  content: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  ownerName: {
    fontSize: 12,
    marginTop: 5,
  },
  locations: {
    flexDirection: "row",
    gap: 5,
  },
  price: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceText: {
    fontSize: 14,
    color: "#27AE60",
    fontWeight: 600,
    backgroundColor: "#d7f0e1",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 7,
  },
});
export default ContactedProperties;
