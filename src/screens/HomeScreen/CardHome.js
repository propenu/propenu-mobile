import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import useDimensions from "../../components/CustomHooks/UseDimension";
import { apiService } from "../../services/apiService";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../../redux/slice/FilterSlice";

const CardHome = ({ title, icon, id }) => {
  const navigation = useNavigation();
  const { width, height, isLandscape } = useDimensions();
  const dispatch = useDispatch();

  const handlePress = async () => {
    console.log("Sending... ", id, title);
    navigation.navigate("PropertyList");
    dispatch(setCategory(title));
  };

  return (
    <TouchableOpacity
      style={[styles.card, { width: width * 0.21 }]}
      onPress={handlePress}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.cardTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: 12,
    padding: 2,
    marginVertical: 10,
    marginHorizontal: 2,
    marginRight: 10,
    borderRadius: 7,
    // elevation:1,
    borderWidth: 1,
    borderColor: "#b8f5d1",
    backgroundColor: "#F1FCF5",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
        // backgroundColor: "#F1FCF5",

  },
  cardTitle: {
    fontSize: 12,
    // color:"#27AE60",
    fontWeight: "400",
    textAlign: "center",
  },
});
export default CardHome;
