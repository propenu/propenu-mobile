import { Pressable, View, Text, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PostProperty from "../screens/PostPropertyScreen/PostProperty";
import PropertyDetailsScreen from "../screens/PropertyDetails/PropertyDetailsScreen";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import DrawerNavigator from "./DrawerNavigator";
import PropertyListScreen from "../screens/PropertyListScreen/PropertyListScreen";
import MoreResidentialDetails from "../screens/PropertyListScreen/MoreDetails/MoreResidentialDetails";
import CategoryFilterScreen from "../screens/SearchFilter/CategoryFilterScreen";
import SettingsScreen from "../screens/UserAccount/SettingsScreen";
import LoginModal from "../auth/LoginModal";
import CreateLogin from "../auth/CreateLogin";
import OTPLoginModal from "../auth/OTPLoginScreen";
import MoreCommercialDetails from "../screens/PropertyListScreen/MoreDetails/MoreCommercialDetails";
import MoreLandDetails from "../screens/PropertyListScreen/MoreDetails/MoreLandDetails";
import MoreAgriculturalDetails from "../screens/PropertyListScreen/MoreDetails/MoreAgriculturalDetails";
import ContactedProperties from "../screens/UserAccount/ContactedProperties";
import { LocationIcon } from "../../assets/svg/Logo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSelector, useDispatch } from "react-redux";
import { toggleDropdown, setCity } from "../redux/slice/DropDownSlice";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import ShortListedScreen from "../screens/UserAccount/ShortListedScreen";
import MyProperties from "../screens/UserAccount/MyProperties";
import Membership from "../screens/UserAccount/Membership";
import UpcomingScreen from "../components/ui/UpComingPage";
import useCity from "../components/CustomHooks/useCity";
import MoreAgentDetails from "../components/Agent/MoreAgentDetails";
import AgentDashBoard from "../screens/AgentAccount/AgentDashBoard";
import AgentProperties from "../screens/AgentAccount/AgentProperties";
import AgentLeads from "../screens/AgentAccount/AgentLeads";
import AgentAccountSettings from "../screens/AgentAccount/AgentAccountSettings";
import AboutUs from "../screens/MoreDetails/AboutUs";
import BuilderDashBoard from "../screens/BuilderAccount/BuilderDashBoard";
import BuilderProperties from "../screens/BuilderAccount/BuiderProperties";
import BuilderLeads from "../screens/BuilderAccount/BuilderLeads";
import TermsAndConditions from "../screens/MoreDetails/TermsAndConditions";
import PrivacyPolicy from "../screens/MoreDetails/PrivacyPolicy";
import SafetyGuide from "../screens/MoreDetails/SafetyGuide";
import HelpCenter from "../screens/MoreDetails/HelpCenter";
import BuilderFeaturedProperties from "../screens/BuilderAccount/BuilderFeaturedProperties";
import AgentPlans from "../screens/AgentAccount/AgentPlans";
import BuyPlans from "../screens/Plans/BuyPlans";
import OwnerSellPlans from "../screens/Plans/OwnerSellPlans";
import OwnerRentPlans from "../screens/Plans/OwnerRentPlans";
import RentViewPlans from "../screens/Plans/RentViewPlans";
import BuyViewPlans from "../screens/Plans/BuyViewPlans";
import HighLightedProperties from "../screens/ViewAll/HighLightedProperties";
import ViewAllOwnerProperties from "../screens/ViewAll/ViewAllOwnerProperties";
import AllAgents from "../screens/ViewAll/AllAgents";
import MapScreen from "../components/location/MapScreen";
const Stack = createNativeStackNavigator();

const HEADER_TYPES = {
  HOME: "HOME",
  INNER: "INNER",
  NONE: "NONE",
};
export default function StackNavigator() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.dropdown.isOpen);
  const { selectedCity } = useCity();

  const handleCity = () => {
    dispatch(toggleDropdown());
  };

  const renderMenuButton = (navigation) => (
    <View style={styles.locationBar}>
      <Pressable onPress={navigation.openDrawer} hitSlop={10}>
        <MaterialIcons name="menu" size={26} color="#000" />
      </Pressable>

      <Pressable style={styles.select} onPress={handleCity}>
        <LocationIcon width={20} height={20} />
        <Text>
          {selectedCity?.city
            ? selectedCity.city.length > 13
              ? selectedCity.city.slice(0, 13) + "..."
              : selectedCity.city
            : "Hyderabad"}
        </Text>
        <AntDesign name={isOpen ? "up" : "down"} size={10} />
      </Pressable>
    </View>
  );

  const renderPostPropertyButton = (navigation) => (
    <Pressable
      onPress={() => navigation.navigate("PostProperty")}
      style={styles.postBtn}
    >
      <Text style={styles.postText}>Post Property</Text>
      <Text style={styles.freeBadge}>Free</Text>
    </Pressable>
  );

  const baseHeader = {
    headerShadowVisible: false,
    headerStyle: {
      elevation: 0,
      shadowColor: "transparent",
      borderBottomWidth: 0,
      backgroundColor: "#fff",
    },
    headerTitleStyle: {
      fontSize: 16,
      fontWeight: "600",
    },
  };

  const buildHeaderOptions = (type, navigation, title) => {
    switch (type) {
      case "HOME":
        return {
          ...baseHeader,
          headerTitle: () => null,
          headerLeft: () => renderMenuButton(navigation),
          headerRight: () => renderPostPropertyButton(navigation),
        };

      case "INNER":
        return {
          ...baseHeader,
          headerTitle: title,
          headerBackTitleVisible: false,
          headerLeft: undefined,
          headerRight: undefined,
        };

      case "NONE":
        return {
          headerShown: false,
        };

      default:
        return baseHeader;
    }
  };

  const stackScreens = [

    { name: "Home", component: HomeScreen, headerType: HEADER_TYPES.HOME },

    {
      name: "ShortListedProperties",
      component: ShortListedScreen,
      headerType: HEADER_TYPES.INNER,
      title: "ShortListed Properties",
    },

    {
      name: "MyProperties",
      component: MyProperties,
      headerType: HEADER_TYPES.INNER,
      title: "My Properties",
    },

    {
      name: "Membership",
      component: Membership,
      headerType: HEADER_TYPES.INNER,
      title: "Membership",
    },

    {
      name: "PostProperty",
      component: PostProperty,
      headerType: HEADER_TYPES.NONE,
    },

    { name: "Login", component: LoginModal, headerType: HEADER_TYPES.NONE },

    {
      name: "CreateLogin",
      component: CreateLogin,
      headerType: HEADER_TYPES.NONE,
    },

    {
      name: "OTPLogin",
      component: OTPLoginModal,
      headerType: HEADER_TYPES.NONE,
    },
    {
      name: "HighLightedProperties",
      component: HighLightedProperties,
      headerType: HEADER_TYPES.HOME,
    },
    {
      name: "ViewAllOwnerProperties",
      component: ViewAllOwnerProperties,
      headerType: HEADER_TYPES.HOME,
    },
    {
      name: "AllAgents",
      component: AllAgents,
      headerType: HEADER_TYPES.HOME,
    },

    {
      name: "PropertyDetails",
      component: PropertyDetailsScreen,
      headerType: HEADER_TYPES.NONE,
    },

    {
      name: "PropertyList",
      component: PropertyListScreen,
      headerType: HEADER_TYPES.HOME,
      title: "Property List",
    },

    {
      name: "MoreResidentialDetails",
      component: MoreResidentialDetails,
      headerType: HEADER_TYPES.NONE,
    },

    {
      name: "MoreCommercialDetails",
      component: MoreCommercialDetails,
      headerType: HEADER_TYPES.NONE,
    },

    {
      name: "MoreLandDetails",
      component: MoreLandDetails,
      headerType: HEADER_TYPES.NONE,
    },

    {
      name: "MoreAgriculturalDetails",
      component: MoreAgriculturalDetails,
      headerType: HEADER_TYPES.NONE,
    },

    {
      name: "MoreAgentDetails",
      component: MoreAgentDetails,
      headerType: HEADER_TYPES.NONE,
      title: "Agent Details",
    },

    {
      name: "CategoryFilter",
      component: CategoryFilterScreen,
      headerType: HEADER_TYPES.HOME,
      title: "Category Filter",
    },

    {
      name: "Settings",
      component: SettingsScreen,
      headerType: HEADER_TYPES.INNER,
      title: "Settings",
    },

    {
      name: "ContactedProperties",
      component: ContactedProperties,
      headerType: HEADER_TYPES.INNER,
      title: "Contacted Properties",
    },
    {
      name: "OwnerSellPlans",
      component: OwnerSellPlans,
      headerType: HEADER_TYPES.NONE,
    },
    {
      name: "OwnerRentPlans",
      component: OwnerRentPlans,
      headerType: HEADER_TYPES.NONE,
    },
    {
      name: "BuyViewPlans",
      component: BuyViewPlans,
      headerType: HEADER_TYPES.NONE,
    },
    {
      name: "RentViewPlans",
      component: RentViewPlans,
      headerType: HEADER_TYPES.NONE,
    },

    {
      name: "upComingScreen",
      component: UpcomingScreen,
      headerType: HEADER_TYPES.INNER,
      title: "Services",
    },

    {
      name: "AgentDashBoard",
      component: AgentDashBoard,
      headerType: HEADER_TYPES.INNER,
      title: "Dashboard",
    },

    {
      name: "AgentProperties",
      component: AgentProperties,
      headerType: HEADER_TYPES.INNER,
      title: "My Properties",
    },

    {
      name: "AgentLeads",
      component: AgentLeads,
      headerType: HEADER_TYPES.INNER,
      title: "Leads",
    },

    {
      name: "AgentAccountSettings",
      component: AgentAccountSettings,
      headerType: HEADER_TYPES.INNER,
      title: "Account & Settings",
    },
    {
      name: "AgentPlans",
      component: AgentPlans,
      headerType: HEADER_TYPES.INNER,
      title: "My Plans",
    },
    {
      name: "BuyPlans",
      component: BuyPlans,
      headerType: HEADER_TYPES.NONE,
      title: "Plans",
    },

    {
      name: "AboutUs",
      component: AboutUs,
      headerType: HEADER_TYPES.INNER,
      title: "About Us",
    },
    {
      name: "TermsAndConditions",
      component: TermsAndConditions,
      headerType: HEADER_TYPES.INNER,
      title: "Terms & Conditions",
    },
    {
      name: "PrivacyPolicy",
      component: PrivacyPolicy,
      headerType: HEADER_TYPES.INNER,
      title: "Privacy Policy",
    },
    {
      name: "SafetyGuide",
      component: SafetyGuide,
      headerType: HEADER_TYPES.INNER,
      title: "Safety Guide",
    },
    {
      name: "HelpCenter",
      component: HelpCenter,
      headerType: HEADER_TYPES.INNER,
      title: "Help Center",
    },

    {
      name: "BuilderDashBoard",
      component: BuilderDashBoard,
      headerType: HEADER_TYPES.INNER,
      title: "Dashboard",
    },

    {
      name: "BuilderProperties",
      component: BuilderProperties,
      headerType: HEADER_TYPES.INNER,
      title: "My Projects",
    },

    {
      name: "BuilderLeads",
      component: BuilderLeads,
      headerType: HEADER_TYPES.INNER,
      title: "My Leads",
    },
    {
      name: "BuilderFeaturedProperties",
      component: BuilderFeaturedProperties,
      headerType: HEADER_TYPES.INNER,
      title: "Featured Projects",
    },
  ];
  return (
    <Stack.Navigator>
      {stackScreens.map((screen, index) => (
        <Stack.Screen
          key={index}
          name={screen.name}
          component={screen.component}
          options={({ navigation }) =>
            buildHeaderOptions(screen.headerType, navigation, screen.title)
          }
        />
      ))}
    </Stack.Navigator>
  );
}
const styles = StyleSheet.create({
  headerLeft: {
    paddingLeft: 15,
  },

  dropdownWrapper: {
    position: "absolute",
    top: 35,
    zIndex: 1,
    elevation: 10,
  },

  selectCitySpace: {
    width: 220,
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 16,
  },

  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },

  locationBar: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    zIndex: 3,
    elevation: 3,
  },
  select: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },

  postBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#27AE60",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },

  postText: {
    color: "#27AE60",
    fontSize: 13,
    fontWeight: "500",
  },
  stateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingVertical: 5,
  },

  arrow: {
    fontSize: 14,
    paddingLeft: 10,
  },

  stateBlock: {
    width: "100%",
    marginTop: 12,
  },
  stateTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
    // marginTop: 10,
  },
  cityItem: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    // alignItems: "center",
  },
  cityText: {
    fontSize: 12,
    color: "#000",
  },

  freeBadge: {
    backgroundColor: "#27AE60",
    paddingHorizontal: 4,
    borderRadius: 3,
    color: "#fff",
    fontSize: 12,
  },
});
