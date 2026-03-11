import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import {
  HomeCare,
  HomeLoans,
  HomeInterior,
  TopRightArrow,
} from "../../../assets/svg/Logo";
import useCity from "../CustomHooks/useCity";
import upcomingPage from "../../../assets/upcomingPage.png";
import { useNavigation } from "@react-navigation/native";

const ServiceHub = () => {
  const { selectedCity } = useCity();
  const navigation = useNavigation();

  const handleClick = () => {
    navigation.navigate("upComingScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Our Services</Text>
      <Text style={styles.subtitle}>
        Services tailored for {selectedCity?.city ?? "Hyderabad"} residents
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Home Loans */}
        <Pressable style={styles.card} onPress={handleClick}>
          <View style={styles.row}>
            <HomeLoans width={32} height={32} />

            <View
              style={[styles.arrowContainer, { backgroundColor: "#FCE6F1" }]}
            >
              <TopRightArrow
                width={10}
                height={10}
                color="#AE276B"
                style={{ alignSelf: "center" }}
              />
            </View>
          </View>
          <Text style={styles.bodyTitle} numberOfLines={1}>
            Easy Home Loans with Expert Support
          </Text>
          <Text style={styles.bodyText}>
            Quick approvals, low interest, zero hassle.
          </Text>
        </Pressable>

        {/* Home Care */}
        <Pressable
          style={[
            styles.card,
            // { backgroundColor: "#fafbf6" }
          ]}
          onPress={handleClick}
        >
          <View style={styles.row}>
            <HomeCare width={32} height={32} />
            <View
              style={[styles.arrowContainer, { backgroundColor: "#FFF6E3" }]}
            >
              <TopRightArrow
                width={10}
                height={10}
                style={{ alignSelf: "center" }}
              />
            </View>
          </View>

          <Text style={styles.bodyTitle}>Professional Home Care</Text>
          <Text style={styles.bodyText}>
            Reliable cleaning, repairs and maintenance
          </Text>
        </Pressable>

        {/* Interior */}
        <Pressable
          style={[
            styles.card,
            // { backgroundColor: "#fbf8fb" }
          ]}
          onPress={handleClick}
        >
          <View style={styles.row}>
            <HomeInterior width={30} height={30} />
            <View
              style={[styles.arrowContainer, { backgroundColor: "#F6EFFF" }]}
            >
              <TopRightArrow width={10} height={10} color="#8F3AFF" />
            </View>
          </View>

          <Text style={styles.bodyTitle}>Modern Interior Designers</Text>
          <Text style={styles.bodyText}>
            Transforming your space with expert creativity.
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default ServiceHub;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    marginBottom: 30,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
  },

  subtitle: {
    fontSize: 12,
    color: "#8f8d87ff",
    marginBottom: 10,
    marginTop: 4,
  },

  scrollContainer: {
    paddingVertical: 10,
  },

  card: {
    width: 250,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginLeft: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },

    elevation: 2,
  },
  // card: {
  //   width: 250,
  //   marginRight: 12,
  //   backgroundColor: "#FFFEFC",
  //   borderRadius: 8,
  //   padding: 12,
  //   marginLeft: 3,
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   elevation: 1,
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowColor: "#000",
  // },

  bodyTitle: {
    paddingVertical: 7,
    color: "#000",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "600",
    minHeight: 30, // keeps spacing same
  },
  arrowContainer: {
    height: 24,
    width: 24,
    borderRadius: 12,
    // backgroundColor: "#FCE6F1",
    alignItems: "center",
    justifyContent: "center",
  },

  bodyText: {
    color: "#8C8989",
    fontSize: 12,
    lineHeight: 18,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
