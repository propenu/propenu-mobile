import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { builderServices } from "../../services/builderServices";
import { useNavigation } from "@react-navigation/native";
import formatINR from "../../utils/FormatINR";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import defaultImage from "../../../assets/defaultImage.png";
import { SvgUri } from "react-native-svg";


 {/*--------------------Sub Component-------------------------*/}
const Myproperties = ({ item }) => {
  const navigation = useNavigation();

  const logoUrl = item?.logo?.url;

  {/*---------------------Card UI--------------------------*/}
  return (
    <View style={styles.container}>
      <View key={item._id} style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate("PropertyDetails", { propertyId: item._id })
          }
          style={styles.heroContainer}
        >
          <Image
            source={item?.heroImage ? { uri: item?.heroImage } : defaultImage}
            style={styles.heroImage}
          />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.logoWrapper}>

             {/*---------------------Logo Based on type--------------------------*/}
            <View style={styles.logoWrapper}>
              {logoUrl ? (
                logoUrl.endsWith(".svg") ? (
                  <SvgUri uri={logoUrl} width={70} height={70} />
                ) : (
                  <Image source={{ uri: logoUrl }} style={styles.logo} />
                )
              ) : (
                <Image source={defaultImage} style={styles.logo} />
              )}
            </View>
          </View>

          <View style={styles.middleSection}>
            <Text numberOfLines={1} style={styles.title}>
              {item.title}
            </Text>

            {item.address && (
              <Text numberOfLines={1} style={styles.address}>
                {item.address}
              </Text>
            )}
          </View>

          <View style={styles.priceSection}>
            <Text style={styles.bhkText}>2,3 BHK</Text>
            <Text style={styles.priceText}>
              {formatINR(item?.priceFrom)} +
              {/* <Text style={styles.onwards}> onwards</Text> */}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const BuilderProperties = () => {

  const insets = useSafeAreaInsets();

  {/*---------------------Calling API--------------------------*/}
  const { data, isLoading, isError } = useQuery({
    queryKey: ["highlight-projects-builder"],
    queryFn: builderServices.getBuilderProperties,
    select: (res) => res?.data ?? res,
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#27AE60" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Something went wrong</Text>
      </View>
    );
  }

    {/*---------------------UI--------------------------*/}
  return (
    <View style={[styles.mainContainer, { paddingBottom: insets.bottom }]}>
      {data && data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <Myproperties item={item} />}
        />
      ) : (
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            You have not added any projects yet.
          </Text>
        </View>
      )}
    </View>
  );
};

export default BuilderProperties;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 10,ss
    marginBottom: 20,
    marginTop: 2,
    marginHorizontal: 3,
    backgroundColor: "#fff",
  },
  mainContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 14,
  },

  scrollContainer: {
    paddingHorizontal: 4,
  },
  card: {
    width: "100%",
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  },
  heroContainer: {
    height: 180,
    width: "100%",
  },
  heroImage: {
    height: "100%",
    width: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  logoWrapper: {
    marginRight: 2,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 8,
    resizeMode: "cover",
  },
  middleSection: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  address: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  priceSection: {
    alignItems: "flex-end",
  },
  bhkText: {
    fontSize: 12,
    color: "#6B7280",
  },
  priceText: {
    fontSize: 13,
    marginTop: 3,
    fontWeight: "500",
  },
  onwards: {
    fontSize: 11,
    color: "#9CA3AF",
  },
});
