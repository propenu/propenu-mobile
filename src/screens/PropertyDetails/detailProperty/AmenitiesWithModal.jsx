import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import {
  PartyIcon,
  SecurityIconn,
} from "../../../../assets/svg/AmenitiesIcons";
import { AMENITY_ICONS } from "../../PostPropertyScreen/constants/amenityIcons";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const AmenitiesWithModal = ({ amenities, color }) => {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const firstAmenities = Array.isArray(amenities) ? amenities.slice(0, 6) : [];

  return (
    <View style={styles.gallery}>
      <View style={styles.priceRow}>
        <Text style={[styles.galleryText, { color: color ? color : "#000" }]}>
          Amenities
        </Text>

        {amenities?.length > 6 && (
          <Pressable
            onPress={() => setShowAllAmenities(true)}
            style={styles.viewMoreBtn}
          >
            <Text style={[styles.viewMoreText, { color: color ? color : "#27AE60" }]}>View All</Text>
          </Pressable>
        )}
      </View>
              <Text style={styles.subtitle}>Facilities designed for comfortable living</Text>


      <View style={[styles.amenitiesGrid,{backgroundColor:color ? `${color}0A` : "#FFFCF6"}]}>
        {amenities?.length === 0 && (
          <Text style={styles.amenityText}>
            Amenities information not available
          </Text>
        )}
        <View style={styles.amenitiesContainer}>
          {firstAmenities.map((item, index) => {
            const IconComponent = AMENITY_ICONS?.[item?.key];
            const AlternateImage = AMENITY_ICONS?.default;

            return (
              <View key={`${item?.key}-${index}`} style={styles.amenityCard}>
                {IconComponent ? (
                  <IconComponent width={17} height={17} />
                ) : (
                  AlternateImage && <AlternateImage width={17} height={17} />
                )}
                <Text style={styles.amenityText} numberOfLines={1}>{item?.title}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={showAllAmenities}
        onRequestClose={() => setShowAllAmenities(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowAllAmenities(false)}
        />

        <View style={styles.modalContent}>
          <View style={styles.flex}>
            <Text style={styles.modalTitle}>Amenities</Text>
            <Pressable onPress={() => setShowAllAmenities(false)} hitSlop={10}>
              <Entypo name="cross" size={25} color="black" />
            </Pressable>
          </View>
          <FlatList
            data={amenities}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => {
              const IconComponent = AMENITY_ICONS?.[item?.key];
              const AlternateImage = AMENITY_ICONS?.default;
              
              return (
                <View style={styles.amenityCardModal}>
                  {IconComponent ? (
                    <IconComponent width={21} height={21} />
                  ) : (
                    <AlternateImage width={21} height={21} />
                  )}
                  <Text style={{ fontSize: 14 }}>{item.title}</Text>
                </View>
              );
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

export default AmenitiesWithModal;
const styles = StyleSheet.create({
  gallery: {
    marginTop: 15,
    marginBottom:5
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  flex: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  galleryText: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 5,
    marginBottom: 7,
    paddingLeft: 16,

  },
  viewMoreBtn: {
    padding: 4,
  },
  viewMoreText: {
    // color: "#27AE60",
    fontSize:13,
    fontWeight: "600",
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    // paddingVertical:3
  },

  amenityCard: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    // marginTop:3
  },
  amenitiesGrid: {
    // backgroundColor: "#FFFCF6",
    paddingHorizontal: 16,
    marginTop: 10,
    paddingVertical: 10,
    marginHorizontal: 12,
    borderRadius: 10,
  },
  // amenityCard: {
  //   flexDirection: "row",
  //   gap: 8,
  //   borderRadius: 10,
  //   paddingVertical: 5,
  // },
  amenityText: {
    fontSize: 13,
    // fontWeight:500
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(151, 147, 147, 0.5)",
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    height: SCREEN_HEIGHT * 0.75,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  amenityCardModal: {
    flexDirection: "row",
    borderRadius: 10,
    marginVertical: 10,
    marginLeft: 7,
    gap: 12,
  },
});
