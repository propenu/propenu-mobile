import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { AMENITY_ICONS } from "../constants/amenityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from '@expo/vector-icons/Entypo';
const AmenitiesSelect = ({
  label = "Amenities",
  value = [],
  options = [],
  onChange,
  error,
}) => {
  const [open, setOpen] = useState(false);

  const groupedAmenities = useMemo(() => {
    const grouped = {};
    options.forEach((item) => {
      const category = item.category || "Other";
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(item);
    });
    return grouped;
  }, [options]);

  const toggleAmenity = (amenity) => {
    const exists = value.some((a) => a.key === amenity.key);

    if (exists) {
      onChange(value.filter((a) => a.key !== amenity.key));
    } else {
      onChange([...value, amenity]);
    }
  };

  const renderAmenity = ({ item }) => {
    const checked = value.some((a) => a.key === item.key);
    const Icon = AMENITY_ICONS[item.key];
    const AlternateImage = AMENITY_ICONS["security"]

    return (
      <Pressable
        onPress={() => toggleAmenity(item)}
        style={[
          styles.amenityCard,
          checked ? styles.selectedAmenity : styles.unselectedAmenity,
        ]}
      >
        {Icon ? (
          // <Image source={{ uri: item?.icon }} style={styles.icon} />
          <Icon width={24} height={24} />
        ) :  <AlternateImage width={24} height={24} />}

        <Text style={[styles.amenityText, checked && styles.selectedText]}>
          {item.title}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        style={[styles.selector, error && { borderColor: "red" }]}
        onPress={() => setOpen(true)}
      >
        {value.length === 0 ? (
          <Text style={styles.placeholder}>Select amenities</Text>
        ) : (
          <View style={styles.selectedContainer}>
            {value.map((amenity) => (
              <View key={amenity.key} style={styles.selectedChip}>
                <Text style={styles.chipText}>{amenity.title}</Text>
              </View>
            ))}
          </View>
        )}
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalWrapper}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Add property amenities</Text>
                  <Text style={styles.selectedCount}>
                    {value.length} selected
                  </Text>
                </View>

                <Pressable onPress={() => setOpen(false)} hitSlop={10}>
                 <Entypo name="cross" size={25} color="black" />
                </Pressable>
              </View>

              <ScrollView>
                {Object.entries(groupedAmenities).map(([category, items]) => (
                  <View key={category} style={{ marginBottom: 15 }}>
                    <Text style={styles.category}>{category}</Text>

                    <FlatList
                      data={items}
                      renderItem={renderAmenity}
                      keyExtractor={(item) => item.key}
                      numColumns={3}
                      scrollEnabled={false}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default AmenitiesSelect;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },

  selector: {
    // minHeight: 50,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },

  placeholder: {
    color: "#999",
  },
  row:{
    flexDirection:"row",
   flexWrap:"wrap"
  },


  selectedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  selectedChip: {
    backgroundColor: "#e2f1e4",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },

  chipText: {
    fontSize: 13,
    fontWeight:500,
    color: "#27AE60",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", 
    justifyContent: "center",
    paddingHorizontal:7,
  },

  modalWrapper: {
    flex: 1,
    justifyContent: "center",
  },

  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    maxHeight: "85%",
    padding: 12,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  selectedCount: {
    color: "#666",
    marginTop: 2,
  },

  close: {
    fontSize: 22,
    color: "#777",
  },

  category: {
    fontWeight: "600",
    marginBottom: 10,
  },

  amenityCard: {
    width: 100,
    height: 80,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight:10 ,
    marginBottom:10,
    paddingVertical: 4,
    paddingHorizontal: 5,
  },

  selectedAmenity: {
    borderColor: "#27AE60",
    backgroundColor: "#ecfdf5",
  },

  unselectedAmenity: {
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },

  amenityText: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 8,
  },

  selectedText: {
    color: "green",
  },

  error: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});
