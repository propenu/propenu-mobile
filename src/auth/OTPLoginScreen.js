import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { apiService } from "../services/apiService";
import useDimensions from "../components/CustomHooks/UseDimension";
import { setItem } from "../utils/Storage";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Keychain from "react-native-keychain";
import { ToastInfo, ToastSuccess } from "../utils/Toast";
import { BigLogo } from "../../assets/svg/LogoPropenu";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../context/AuthContext";

const OTPLoginModal = ({ route, navigation }) => {
  const { phone, name = "", role = "" } = route.params;
  const { refreshAuth } = useAuth();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const { width, isLandscape } = useDimensions();

  const inputs = useRef([]);

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    let otpResult = null;

    if (!/^\d{4}$/.test(otpValue)) {
      ToastError("Enter a valid 4-digit OTP");
      return;
    }

    try {
      setLoading(true);
      if (name && role) {
        otpResult = await apiService.requestOTP({
          name: name,
          phone: phone,
          role: role,
          otp: otpValue,
        });

        // console.log("otp Result :", otpValue, otpResult);

        if (otpResult?.status !== 201) {
          throw new Error("OTP verification failed");
        }
      }

      if (!role) {
        otpResult = await apiService.verifyOtp({
          phone: phone,
          otp: otpValue,
        });
        console.log("otp Result :", phone, otpValue, otpResult);
        if (otpResult?.status !== 200) {
          ToastInfo(
            otpResult?.data?.message ||
              "Please complete the verification steps",
          );
          return;
        }
      }

      const token = otpResult?.data?.token;
      if (!token) {
        throw new Error("Token not received");
      }

      const tokenResult = await apiService.verifyToken(token);

      if (tokenResult?.status !== 200) {
        throw new Error("Token verification failed");
      }

      // console.log("token result :", tokenResult, tokenResult.data)
      let data = tokenResult?.data;

      // await setItem("user", tokenResult?.data);
      // Store token securely
      if (data?.token) {
        await Keychain.setGenericPassword("token", tokenResult.data?.token);
        await new Promise((resolve) => setTimeout(resolve, 100));
        await refreshAuth();
      }

      // Store user info in AsyncStorage
      await setItem(
        "user",
        JSON.stringify({
          id: data?.user?.id,
          name: data?.user?.name,
          phone: data?.user?.phone,
          roleName: data?.user?.roleName,
          email: data?.user?.email,
        }),
      );
      await new Promise((resolve) => setTimeout(resolve, 100));
      await refreshAuth();
      ToastSuccess("Logged in successfully");
      console.log("Login successful......");
      navigation.pop(2);

      //  To get the token
      // const credentials = await Keychain.getGenericPassword();
      // if (credentials) {
      //   console.log('Token:', credentials.password);
      // }
    } catch (error) {
      console.log("OTP verification error:", error);
      ToastInfo(error.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
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
          <View style={styles.content}>
            <BigLogo width={180} height={90} />
            <Text style={styles.title}>Confirm OTP</Text>
            <Text style={styles.subtitle}>OTP sent to {phone}</Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputs.current[index] = ref)}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                />
              ))}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                { width: isLandscape ? width * 0.3 : width * 0.5 },
                pressed && { opacity: 0.8 },
              ]}
              onPress={handleVerifyOtp}
            >
              <Text style={styles.loginText}>
                {loading ? "Verifying..." : "Verify OTP"}
              </Text>
            </Pressable>

            {/* <Pressable style={styles.closeBtn} onPress={()=>navigation.navigate("Login")}>
              <Text style={styles.closeText}>Cancel</Text>
            </Pressable> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
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

  backOption: {
    marginTop: 20,
    marginLeft: 20,
  },
  content: {
    marginHorizontal: 30,
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    // color: "#0e49a1ff",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: "gray",
    marginBottom: 20,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  otpInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    backgroundColor: "white",
    textAlign: "center",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#27AE60",
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 10,
  },
  loginText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  closeBtn: {
    marginTop: 12,
  },
  closeText: {
    color: "#27AE60",
    fontWeight: "500",
  },
});

export default OTPLoginModal;
