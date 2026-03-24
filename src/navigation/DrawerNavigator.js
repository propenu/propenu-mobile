// src/navigation/DrawerNavigator.js
import React, { useState, useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import StackNavigator from "./StackNavigator";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Platform,
  ScrollView,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import { getItem, clearStorage } from "../utils/Storage";
import Octicons from "@expo/vector-icons/Octicons";
import {
  Logo,
  BellIcon,
  LocationIcon,
  TabBarHome,
  TabBarProfile,
  TabBarFavourite,
  TabBarDomain,
  PhoneIcon,
} from "../../assets/svg/Logo";
import HomeExterior from "../../assets/images/HomeExterior.png";
import HouseSearch from "../../assets/images/HouseSearch.png";
import HouseSell from "../../assets/images/HouseSell.png";
import {
  calling,
  PrivacyPolicy,
  TermsAndConditions,
  ReportIssue,
  SafetyGuide,
  AboutUs,
  ShortList,
  Dollar,
  Leads,
  MyProperties,
} from "../../assets/svg/UserProfile";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { ToastSuccess } from "../utils/Toast";
import * as Keychain from "react-native-keychain";
import { useAuth } from "../context/AuthContext";
import { Image } from "react-native";

{
  /*--------------------Static menu items---------------------- */
}
const userMenuItems = [
  {
    label: "My Properties",
    route: "MyProperties",
    icon: MyProperties,
  },
  {
    label: "Shortlisted Properties",
    route: "ShortListedProperties",
    icon: ShortList,
  },
  {
    label: "Contacted Properties",
    route: "ContactedProperties",
    icon: calling,
  },
  {
    label: "Membership",
    route: "Membership",
    icon: Dollar,
  },
];

const agentMenuItems = [
  {
    label: "DashBoard   ",
    route: "AgentDashBoard",
    icon: Dollar,
  },
  {
    label: "My Properties",
    route: "AgentProperties",
    icon: MyProperties,
  },
  {
    label: "Leads",
    route: "AgentLeads",
    icon: Leads,
  },
  {
    label: "My Plans",
    route: "AgentPlans",
    icon: Dollar,
  },
];

const builderMenuItems = [
  {
    label: "Dashboard",
    route: "BuilderDashBoard",
    icon: Dollar,
  },
  {
    label: "My Properties",
    route: "BuilderProperties",
    icon: MyProperties,
  },
  {
    label: "Leads",
    route: "BuilderLeads",
    icon: Leads,
  },
  {
    label: "Featured Properties",
    route: "BuilderFeaturedProperties",
    icon: Leads,
  },
];

const More_Details = [
  {
    label: "About Us",
    route: "AboutUs",
    icon: AboutUs,
  },
  {
    label: "Privacy Policy",
    route: "PrivacyPolicy",
    icon: PrivacyPolicy,
  },
  {
    label: "Terms & Conditions",
    route: "TermsAndConditions",
    icon: TermsAndConditions,
  },
  {
    label: "Safety Guide",
    route: "SafetyGuide",
    icon: SafetyGuide,
  },
  {
    label: "Help Line",
    route: "HelpCenter",
    icon: calling,
  },
  // {
  //   label: "Report an Issue",
  //   route: "ShortListedProperties",
  //   icon: ReportIssue,
  // },
];

const Drawer = createDrawerNavigator();

{
  /*--------------------Custom Left Menu Component---------------------- */
}
const CustomDrawerContent = ({ navigation, state }) => {
  const { isLoggedIn, userDetails, refreshAuth } = useAuth();
  const [selectedRoute, setSelectedRoute] = useState(null);
  console.log("Checking Login ", isLoggedIn, userDetails)

  const capitalize = (str) =>
    str
      ?.split("_")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ") || "";

  const handleNavigate = (route) => {
    console.log("Route in left menu : ", route);
    if (userDetails != null) {
      navigation.navigate("HomeStack", { screen: route });
    } else {
      navigation.navigate("HomeStack", { screen: "Login" });
    }
  };

  const navigateByRole = () => {
    switch (userDetails?.roleName) {
      case "agent":
        return "AgentAccountSettings";
      case "user":
        return "Settings";
      default:
        return null;
    }
  };

  const handleLogout = async () => {
    if (userDetails != null) {
      await clearStorage();
      await Keychain.resetGenericPassword();
      await new Promise((resolve) => setTimeout(resolve, 100));
      await refreshAuth();
      // setUserData(null);
      ToastSuccess("Logged out successfully");
      navigation.navigate("HomeStack", { screen: "Home" });
    } else {
      ToastSuccess("You are already logged out");
    }
  };

  return (
    <SafeAreaView style={styles.drawerContent}>
      {userDetails ? (
        <Pressable
          onPress={() =>
            navigation.navigate("HomeStack", {
              screen: navigateByRole(),
            })
          }
        >
          <View
            style={[
              styles.drawerHeader,
              // { height: height * 0.15 }
            ]}
          >
            <View style={styles.nameContainer}>
              <View style={styles.icon}>
                <Text style={styles.nameIcon}>
                  {capitalize(userDetails?.name[0])}
                </Text>
              </View>
              <View>
                <View style={styles.nameContainer}>
                  <Text style={styles.userName}>
                    {capitalize(userDetails?.name)}
                  </Text>
                  {userDetails?.roleName !== "builder" ? (
                    <Octicons name="pencil" size={15} color="black" />
                  ) : null}
                </View>
                <Text style={styles.role}>
                  {capitalize(userDetails?.roleName)}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      ) : (
        <View style={styles.loginContainer}>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <FontAwesome name="user-circle" size={30} color="#585858" />
            <Text style={[styles.userName]}>
              Sign up to explore more {"\n"}on Propenu
            </Text>
          </View>

          <Pressable
            onPress={() =>
              navigation.navigate("HomeStack", { screen: "Login" })
            }
            style={[styles.loginButton]}
          >
            <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>
              Login
            </Text>
          </Pressable>
        </View>
      )}

      {/*--------------------Based on the role rendering menu items---------------------- */}
      {/* <View style={styles.hrline} /> */}
      <ScrollView style={styles.dataContainer}>
        {userDetails?.roleName === "agent" && (
          <View style={styles.userDataContainer}>
            <Text style={[styles.headingData, { paddingVertical: 8 }]}>
              Agent Workspace
            </Text>
            {agentMenuItems.map((item, index) => {
              const Icon = item.icon;
              // const isActive = route.name === item.route;

              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    setSelectedRoute(item.route);
                    handleNavigate(item.route);
                  }}
                  style={[
                    styles.menuItem,
                    selectedRoute === item.route && styles.activeMenuItem,
                  ]}
                >
                  <Icon />

                  <Text
                    style={[
                      styles.label,
                      selectedRoute === item.route && styles.activeLabel,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {userDetails?.roleName === "builder" && (
          <View style={styles.userDataContainer}>
            <Text style={[styles.headingData, { paddingVertical: 8 }]}>
              Builder Workspace
            </Text>
            {builderMenuItems.map((item, index) => {
              const Icon = item.icon;
              // const isActive = route.name === item.route;

              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    setSelectedRoute(item.route);
                    handleNavigate(item.route);
                  }}
                  style={[
                    styles.menuItem,
                    selectedRoute === item.route && styles.activeMenuItem,
                  ]}
                >
                  <Icon />

                  <Text
                    style={[
                      styles.label,
                      selectedRoute === item.route && styles.activeLabel,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {userDetails == null || userDetails?.roleName === "user" ? (
          <View style={styles.userDataContainer}>
            <Text style={[styles.headingData, { paddingVertical: 8 }]}>
              Profile & Activity
            </Text>
            {userMenuItems.map((item, index) => {
              const Icon = item.icon;
              // const isActive = route.name === item.route;

              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    setSelectedRoute(item.route);
                    handleNavigate(item.route);
                  }}
                  style={[
                    styles.menuItem,
                    selectedRoute === item.route && styles.activeMenuItem,
                  ]}
                >
                  <Icon />

                  <Text
                    style={[
                      styles.label,
                      selectedRoute === item.route && styles.activeLabel,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        {/*--------------------More Details section---------------------- */}
        <View style={styles.userDataContainer}>
          <Text style={[styles.headingData, { paddingBottom: 7 }]}>
            More Details
          </Text>
          {More_Details.map((item, index) => {
            const Icon = item.icon;
            // const isActive = route.name === item.route;

            return (
              <Pressable
                key={index}
                onPress={() => {
                  setSelectedRoute(item.route);
                  handleNavigate(item.route);
                }}
                style={[
                  styles.menuItem,
                  selectedRoute === item.route && styles.activeMenuItem,
                ]}
              >
                <Icon />

                <Text
                  style={[
                    styles.label,
                    selectedRoute === item.route && styles.activeLabel,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
          {/* {userDetails?.roleName !== "user" && ( */}
          {isLoggedIn && userDetails?.name && (
            <Pressable
              onPress={handleLogout}
              style={[styles.menuItem, styles.logoutItem]}
            >
              <AntDesign name="logout" size={19} color="#E53935" />
              <Text style={[styles.label, styles.logoutLabel]}>Logout</Text>
            </Pressable>
          )}
          {/* )} */}

          {/*--------------------Bottom card---------------------- */}
          <Pressable
            style={[styles.card, { marginTop: 10 }]}
            onPress={() =>
              navigation.navigate("HomeStack", { screen: "PostProperty" })
            }
          >
            <View style={{ paddingLeft: 5 }}>
              <Text style={styles.textPost}>Post Property</Text>
              <Text style={styles.subTitle}>
                Sell / Rent Faster with Propenu
              </Text>
            </View>

            <Image source={HouseSell} style={{ width: 40, height: 40 }} />
          </Pressable>
          {/* <View style={styles.card}>
            <View style={{ paddingLeft: 5 }}>
              <Text style={styles.textPost}>Search Property</Text>
              <Text style={styles.subTitle}>
                Explore Properties & find your home
              </Text>
            </View>

            <Image source={HouseSearch} style={{ width: 40, height: 40 }} />
          </View> */}
          {/* <View style={styles.card}>
            <View style={{paddingLeft:5}}>
              <Text style={styles.textPost}>Owner Property</Text>
              <Text style={styles.subTitle}>Connect directly & simplify home</Text>
            </View>

            <Image
              source={HomeExterior}
              style={{ width: 40, height: 40 }}
            />
          </View> */}
          {/* <View style={styles.hrline} /> */}
        </View>

        {/* ) : null} */}
      </ScrollView>
    </SafeAreaView>
  );
};

{
  /*--------------------Main menu---------------------- */
}
export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          // backgroundColor:"red",
          // top: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          borderTopRightRadius: 10,
          borderBottomRightRadius: 0,
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="HomeStack"
        component={StackNavigator}
        options={{ headerShown: false }}
      />
      {/* <Drawer.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      /> */}
    </Drawer.Navigator>
  );
}
const styles = StyleSheet.create({
  drawerContent: { flex: 1, backgroundColor: "#DEFAEA" },
  drawerHeader: {
    justifyContent: "center",
    width: "100%",
    paddingLeft: 35,
    // padding: 20,
    paddingTop: 15,
    paddingBottom: 7,
    gap: 10,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#27AE60",
  },
  nameIcon: {
    color: "#27AE60",
    fontWeight: 500,
    fontSize: 15,
  },
  userName: {
    // color: "#27AE60",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 20,
  },

  role: {
    marginTop: 3,
    fontSize: 12,
    color: "gray",
  },
  userDataContainer: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  headingData: {
    fontSize: 15,
    fontWeight: 500,
    paddingLeft: 10,
    // paddingTop: 5,
    // color:"#6e6e6e"
  },
  textPost: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 12,
    color: "gray",
  },
  loginButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "#27AE60",
    borderRadius: 8,
  },
  categories: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  hrline: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 0.4,
    marginHorizontal: 15,
    marginVertical: 3,
  },
  dataContainer: {
    // paddingHorizontal: 16,
    backgroundColor: "white",
    marginTop: 10,
    height: "100%",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 23,
    // marginTop: 5,
    paddingVertical: 12,
    borderRadius: 14,
  },
  activeItem: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2, // Android
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: 400,
    // color: "#82868d",
  },

  activeLabel: {
    color: "#27AE60",
    fontWeight: "500",
  },

  activeMenuItem: {
    // backgroundColor: "#ecf9f1",
    borderRadius: 8,
  },

  card: {
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    // backgroundColor: "#f6faf6",
    backgroundColor: "white",
    shadowColor: "#333232",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,

    flexDirection: "row",
    justifyContent: "space-between",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#27A361",
  },

  logoutLabel: {
    color: "#E53935",
    fontWeight: "500",
  },
});
