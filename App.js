import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { View, StyleSheet } from "react-native";
import { useEffect } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { store } from "./src/redux/store/store";
import CityDropdown from "./src/components/ui/CityDropDown";
import { AuthProvider } from "./src/context/AuthContext";
import { initializeMappls } from "./src/utils/mapplsConfig";


// / // "package": "com.anonymous.propenu"
export default function App() {
  useEffect(() => {
    initializeMappls();
  }, []);

  return (
    <Provider store={store}>
      <AuthProvider>
        <View style={styles.root}>
          <NavigationContainer>
            <CityDropdown />
            <AppNavigator />
          </NavigationContainer>
        </View>
      </AuthProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
