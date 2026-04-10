import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { apiService } from "../services/apiService";
import useDimension from "../components/CustomHooks/UseDimension";
import { SafeAreaView } from "react-native-safe-area-context";
import { BigLogo } from "../../assets/svg/LogoPropenu";
import Ionicons from "@expo/vector-icons/Ionicons";
import CountryPicker from "react-native-country-picker-modal";
import { ToastError, ToastInfo, ToastSuccess } from "../utils/Toast";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { getItem, setItem } from "../utils/Storage";
import { userServices } from "../services/userServices";

export default function LoginModal({ navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState({});
  const { width, height, isLandscape } = useDimension();
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("IN");
  const [callingCode, setCallingCode] = useState("91");
  const [phone, setPhone] = useState("");
  const [withCountryNameButton, setWithCountryNameButton] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const Roles = ["User", "Builder", "Agent"];

  const validate = () => {
    let newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Minimum 3 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSelect = (country) => {
    setIsOpen(!isOpen);
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
  };

  const syncGuestShortlist = async () => {
    try {
      const stored = await getItem("guest_shortlist");
      const parsed = stored ? JSON.parse(stored) : [];

      if (!parsed.length) return;

      for (const item of parsed) {
        await userServices.postShortlistedProperties(item);
      }

      // clear guest shortlist
      await setItem("guest_shortlist", JSON.stringify([]));

      console.log("Guest shortlist synced successfully");
    } catch (error) {
      console.log("Error syncing guest shortlist:", error);
    }
  };

  const handleLogin = async () => {
    try {
      if (phone.length !== 10) {
        ToastError("Enter 10 digit Phone number");
        return;
      }

      setLoading(true); // ✅ start loader

      const fullNumber = `+${callingCode}${phone}`;
      console.log("Phone:", fullNumber);

      const res = await apiService.login({
        phone: fullNumber,
      });

      const status = res?.status;
      const message = res?.data?.message;

      if (status === 200) {
        await syncGuestShortlist();
        ToastSuccess("OTP sent successfully");
        navigation.navigate("OTPLogin", { phone: fullNumber });
        return;
      }

      if (status === 404) {
        ToastInfo(message || "Account not registered. Please sign up first.");
        return;
      }

      if (status === 403) {
        ToastInfo(message || "Please complete the account creation");
        return;
      }

      // 🔥 fallback (very important)
      ToastInfo(message || "Something went wrong. Please try again.");
    } catch (err) {
      console.log("Login error:", err);
    } finally {
      setLoading(false); // ✅ stop loader
    }
  };

  return (
    <SafeAreaView style={styles.overlay}>
      <Pressable
        style={styles.backOption}
        onPress={() => navigation.goBack()}
        hitSlop={10}
      >
        <Ionicons name="arrow-back-circle-outline" size={24} color="black" />
      </Pressable>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inputFields}>
            <BigLogo width={200} height={70} />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subTitle}>
              Enter your details to access your account
            </Text>

            {/* <InputField
              label="Email Address"
              placeholder="Enter Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChange={setEmail}
            /> */}
            {/* {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )} */}

            <Text style={[styles.whatsappText]}>Enter Whatsapp Number</Text>
            <View style={styles.phoneRow}>
              <View style={styles.sheet}>
                <CountryPicker
                  // disableNativeModal
                  countryCode={countryCode}
                  withFilter
                  withCallingCode
                  withFlag
                  onSelect={onSelect}
                />
              </View>
              {/* <AntDesign name={isOpen ? "down" : "up"} size={10} color="#000" /> */}

              <Text style={styles.codeText}>+{callingCode}</Text>

              <TextInput
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                style={styles.phoneinput}
                maxLength={10}
                placeholderTextColor="#9ca3af"
              />
            </View>

            <Pressable
              style={[styles.loginButton]}
              // disabled={!isFormValid}
              onPress={handleLogin}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <FontAwesome name="whatsapp" size={20} color="white" />
                  <Text style={styles.loginText}>Get OTP</Text>
                </>
              )}
            </Pressable>
            <View style={{ paddingTop: 15, alignItems: "center" }}>
              <Text style={styles.subTitle}>
                New to Propenu?
                <Text
                  style={{ color: "#27AE60", fontSize: 12, fontWeight: "500" }}
                  onPress={() => navigation.navigate("CreateLogin")}
                >
                  {" "}
                  Create an account
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(243, 255, 245, 0.5)",
    // justifyContent: "center",
    // alignItems: "center",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 999,
  },
  backOption: {
    marginTop: 20,
    marginLeft: 20,
  },
  title: {
    // marginTop: 5,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 12,
    color: "gray",
    marginBottom: 15,
    textAlign: "center",
  },
  inputFields: {
    marginHorizontal: 30,
    alignItems: "center",
  },
  input: {
    backgroundColor: "#0d385c11",
    borderRadius: 6,
    padding: 10,
    // marginBottom: 10,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderColor: "#ccc",
    backgroundColor: "white",
  },
  codeText: {
    fontSize: 16,
    marginHorizontal: 5,
  },
  phoneinput: {
    flex: 1,
    // height: 50,
  },
  cancelButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  whatsappText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
    fontWeight: "500",
    alignSelf: "flex-start",
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
    paddingLeft: 5,
  },
  loginButton: {
    width: "65%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    gap: 10,
    backgroundColor: "#27AE60",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#6db48b",
  },

  disabledText: {
    color: "#E0E0E0",
  },
  loginText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },
});
