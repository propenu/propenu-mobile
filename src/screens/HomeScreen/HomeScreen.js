import {
  View,
  Image,
  FlatList,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import SearchBar from "../../components/ui/SearchBar";
import useDimensions from "../../components/CustomHooks/UseDimension";
import HomePage from "../../../assets/HomePage.png";
import CardHome from "./CardHome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FeaturedCard from "../../components/FeaturedCard/FeatureCard";
import HighLightProjects from "../../components/HighlightProjects/HighLightProjects";
import OwnerProperties from "../../components/OwnersProperties/OwnerProperties";
import AgentProperties from "../../components/Agent/AgentProperties";
import ServiceHub from "../../components/ServiceHub/ServiceHub";
import useCity from "../../components/CustomHooks/useCity";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BellIcon,
  Commercial,
  Residential,
  Land,
  Agriculture,
} from "../../../assets/svg/Logo";

const HomeScreen = ({ navigation }) => {
  const { width, height, isLandscape } = useDimensions();
  const insets = useSafeAreaInsets();
  const { selectedCity } = useCity();

  const HOME_CARDS = [
    {
      id: "residential",
      title: "Residential",
      icon: <Residential width={24} height={24} />,
    },
    {
      id: "commercial",
      title: "Commercial",
      icon: <Commercial width={24} height={24} />,
    },
    {
      id: "land",
      title: "Land",
      icon: <Land width={24} height={24} />,
    },
    {
      id: "agricultural",
      title: "Agricultural",
      icon: <Agriculture width={24} height={24} />,
    },
  ];
  const handlePress = () => {
    console.log("Navigating to filters......");
    navigation.navigate("CategoryFilter");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.searchWrapper}>
        {/* Search bar (full width) */}
        <Pressable onPress={handlePress} style={styles.searchPressable}>
          <View pointerEvents="none" style={{ flex: 1 }}>
            <SearchBar
              placeholder={`Search in ${selectedCity?.city ?? "City"} `}
              value=""
            />
          </View>
        </Pressable>

        {/* Bell icon */}
        <Pressable
          onPress={() => console.log("Pressed on Notifications...")}
          style={styles.bellIcon}
        >
          <BellIcon width={18} height={18} />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: "white", marginBottom: 20 }}
      >
        {/* */}
        <View style={styles.imageContainer}>
          <Image
            source={HomePage}
            style={[styles.homePageImage, { height: height * 0.2 }]}
          />
        </View>

        <View style={{ marginTop: 20, marginHorizontal: 10, marginBottom: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            Get Started with
          </Text>
          {/* <Text style={{ fontSize: 12, color: "#6b6965ff" }}>
          Explore real estate options 
           in top cities
        </Text> */}
          <FlatList
            data={HOME_CARDS}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            // contentContainerStyle={{ paddingHorizontal: 2 }}
            renderItem={({ item }) => (
              <CardHome id={item.id} title={item.title} icon={item.icon} />
            )}
          />
        </View>
        <FeaturedCard />
        <HighLightProjects />
        <OwnerProperties />
        <AgentProperties />
        <ServiceHub />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 12,
    marginBottom: 7,
  },

  searchPressable: {
    flex: 1,
  },

  bellIcon: {
    marginLeft: 7,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ADADAD",
  },
  imageContainer: {
    paddingTop: 5,
    paddingHorizontal: 10,
  },

  homePageImage: {
    width: "100%",
    borderRadius: 10,
  },
  // homePageImage: {
  //   width: "97%",
  //   // resizeMode: "cover",
  //   borderRadius: 10,
  //   marginHorizontal: 6,
  //   // opacity: 0.8
  // },
});

export default HomeScreen;
