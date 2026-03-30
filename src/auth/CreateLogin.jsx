import React, { useState, useRef, useEffect } from "react";
import {
  Pressable,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import InputField from "../components/ui/InputField";
import CountryPicker from "react-native-country-picker-modal";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { apiService } from "../services/apiService";
import Toast from "react-native-toast-message";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { BigLogo } from "../../assets/svg/LogoPropenu";
import * as Keychain from "react-native-keychain";
import { ToastInfo, ToastSuccess } from "../utils/Toast";
import { useAuth } from "../context/AuthContext";
import { setItem } from "../utils/Storage";
import { Linking } from "react-native";
import { search } from "india-pincode-search";

const OTP_LENGTH = 6;

const tabs = [
  { id: "personal", label: "Personal Details" },
  { id: "location", label: "Location" },
  { id: "kyc", label: "KYC Verification" },
];
const Roles = [
  { value: "Buyer/Seller", key: "User", icon: "user-o" },
  { value: "Builder", key: "Builder", icon: "building-o" },
  { value: "Agent", key: "Agent", icon: "vcard-o" },
];

export default function CreateLogin({
  open,
  onClose,
  onSwitchToLoginn,
  navigation,
}) {
  const { refreshAuth } = useAuth();

  const [step, setStep] = useState("personal");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "User",
    pincode: "",
    locality: "",
    city: "",
    state: "",
    otp: "",
    phone: "",
  });
  const [countryCode, setCountryCode] = useState("IN");
  const [callingCode, setCallingCode] = useState("91");
  const [phone, setPhone] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [apiCalled, setApiCalled] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isLookingUpPincode, setIsLookingUpPincode] = useState(false);

  const inputs = useRef([]);

  const onSelect = (country) => {
    setIsOpen(!isOpen);
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
  };

  const handlePhoneChange = async (text) => {
    let cleaned = text.replace(/\D/g, "");

    if (cleaned.length > 10) {
      cleaned = cleaned.slice(0, 10);
    }

    setPhone(cleaned);

    if (cleaned.length < 10) {
      setApiCalled(false);
      return;
    }

    if (cleaned.length === 10 && !apiCalled) {
      setApiCalled(true);

      const formattedPhone = `+91${cleaned}`;
      setFormData((prev) => ({
        ...prev,
        phone: formattedPhone,
      }));

      try {
        const response = await apiService.createAccount({
          phone: formattedPhone,
        });

        if (response?.status === 200) {
          ToastSuccess(response?.data?.message || "OTP sent successfully");
        }

        console.log("RESPONSE:", response);
      } catch (error) {
        console.log("API ERROR:", error);
      }
    }
  };

  const handleDetailsStep = async () => {
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
        otp: formData.otp,
      };

      console.log("OPT PAYLOAD :", payload);
      const res = await apiService.requestOTP(payload);

      console.log("RESPOMSE FROM the api", res);

      // verifiedPhoneRef.current = phoneValidation.data.phone;
      if (res?.status === 201 || res?.status === 200) {
        setStep("location");
        ToastSuccess(res?.data?.message || "OTP verified successfully");
      }

      const token = res?.data?.token;
      if (!token) {
        throw new Error("Token not received");
      }
      if (token) {
        await Keychain.setGenericPassword("token", token);
        await new Promise((resolve) => setTimeout(resolve, 100));
        await refreshAuth();
      }

      //   const tokenResult = await apiService.verifyToken(token);
      //   console.log("tokenResulttokenResult:", tokenResult)

      //   if (tokenResult?.status !== 200) {
      //     throw new Error("Token verification failed");
      //   }

      //   console.log("token result :", tokenResult, tokenResult.data)
      //   let data = tokenResult?.data;

      //   // await setItem("user", tokenResult?.data);
      //   // Store token securely
      //   if (data?.token) {
      //     await Keychain.setGenericPassword("token", tokenResult.data?.token);
      //     await new Promise((resolve) => setTimeout(resolve, 100));
      //     await refreshAuth();
      //   }

      //   // Store user info in AsyncStorage
      //   await setItem(
      //     "user",
      //     JSON.stringify({
      //       id: data?.user?.id,
      //       name: data?.user?.name,
      //       phone: data?.user?.phone,
      //       roleName: data?.user?.roleName,
      //     }),
      //   );
      //   await new Promise((resolve) => setTimeout(resolve, 100));
      //   await refreshAuth();
      //   ToastSuccess( res?.data?.message || "Account created, continue signup")
      // }

      // console.log("OTP verified successfully");

      // 👉 Optional Toast / Alert
      // Toast.show({ type: "success", text1: "OTP verified successfully" });
      // Alert.alert("Success", "OTP verified successfully");
    } catch (err) {
      console.log("OTP verification failed:", err);
      ToastInfo(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];

    // allow only numbers
    const digit = value.replace(/\D/g, "").slice(0, 1);

    newOtp[index] = digit;
    setOtp(newOtp);

    // auto focus next input
    if (digit && index < otp.length - 1) {
      inputs.current[index + 1]?.focus();
    }

    const otpString = newOtp.join("");

    if (otpString.length < 4) {
      setOtpVerified(false);
    }

    // ✅ Call API when 4 digits entered
    if (otpString.length === 4 && !otpVerified) {
      setOtpVerified(true);
      setFormData((prev) => ({
        ...prev,
        otp: otpString,
      }));
    }
  };

  const getToken = async () => {
    const credentials = await Keychain.getGenericPassword();

    if (!credentials) {
      console.log("No token found in keychain");
      return;
    }

    const token = credentials.password;
    return token;
  };

  useEffect(() => {
    const handleDeepLink = async (url) => {
      console.log("URL IM CREATE LOGIN :", url)
      if (!url) return;


    if (url.includes("kyc")) {
        const token = await getToken();
        if (!token) return;

        const tokenResult = await apiService.verifyToken(token);

        if (tokenResult?.status === 200) {
          const data = tokenResult?.data;

          if (data?.token) {
            await Keychain.setGenericPassword("token", data.token);
            await refreshAuth();
          }

          await setItem("user", JSON.stringify(data.user));

          // ToastSuccess("Login Successfully");
          navigation.navigate("Home");
        }
      }

      if (url.includes("kyc-failed")) {
        // ToastError("KYC Failed ❌");
        console.log("verification failed");
      }
    };

    const sub = Linking.addEventListener("url", (event) => {
      console.log("KKKKKKKKKKK", event)
      handleDeepLink(event.url);
    });

    Linking.getInitialURL().then(handleDeepLink);

    return () => sub.remove();
  }, []);

  const handlePincodeChange = (value) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 6);

    // ✅ Always update pincode
    setFormData((prev) => ({
      ...prev,
      pincode: numericValue,
    }));

    // ❌ Only return AFTER updating
    if (numericValue.length !== 6) {
      setFormData((prev) => ({
        ...prev,
        locality: "",
        city: "",
        state: "",
      }));
      return;
    }

    const data = search(numericValue);

    if (!data || !data.length) {
      setFormData((prev) => ({
        ...prev,
        locality: "",
        city: "",
        state: "",
      }));
      return;
    }

    const pin = data[0];

    setFormData((prev) => ({
      ...prev,
      locality: pin.village || pin.office,
      city: pin.city,
      state: pin.state,
    }));
  };

  const handleCompleteLocation = async () => {
    // const validation = locationSchema.safeParse(formData);

    // // ❌ Validation failed
    // if (!validation.success) {
    //   setErrors(mapAuthZodErrors(validation.error));
    //   return;
    // }

    setLoading(true);

    try {
      const payload = {
        locality: formData?.locality,
        city: formData?.city,
        state: formData?.state,
        pincode: formData?.pincode,
      };

      const response = await apiService.updateLocation(payload);

      console.log("location api called :", response);
      if (response?.status === 200) {
        ToastSuccess("Location updated");
        setStep("kyc");
      }
    } catch (error) {
      console.log("Error updating location:", error);

      // 👉 if using toast
      // ToastError("Failed to update location");
    } finally {
      setLoading(false);
    }
  };

  const handleDeepLink = async () => {
    // if (!url) return;

    // if (url.includes("kyc-success")) {
    const token = await getToken();
    if (!token) return;

    const tokenResult = await apiService.verifyToken(token);

    if (tokenResult?.status === 200) {
      const data = tokenResult?.data;

      if (data?.token) {
        await Keychain.setGenericPassword("token", data.token);
        await refreshAuth();
      }

      await setItem("user", JSON.stringify(data.user));

      // ToastSuccess("Login Successfully");
      navigation.navigate("Home");
    }
    // }

    // if (url.includes("kyc-failed")) {
    // ToastError("KYC Failed ❌");
    console.log("verification failed");
    // }
  };

  const handleKYC = async () => {
    try {
      const response = await apiService.startKyc();

      const kycUrl = response?.data?.url;

      if (kycUrl) {
        // await handleDeepLink();
        await Linking.openURL(kycUrl);
      } else {
        console.log("No KYC URL found");
      }
    } catch (error) {
      console.log("KYC Error:", error);
    }
  };

  // const handleVerifyOtp = async () => {
  //     const otpValue = otp.join("");
  //     let otpResult = null;

  //     if (!/^\d{4}$/.test(otpValue)) {
  //       ToastError("Enter a valid 4-digit OTP");
  //       return;
  //     }

  //     try {
  //       setLoading(true);
  //       if (phone?.length === 10) {
  //         otpResult = await apiService.requestOTP({
  //           phone: phone,
  //           otp: otpValue,
  //         });

  //         // console.log("otp Result :", otpValue, otpResult);

  //         if (otpResult?.status !== 201) {
  //           throw new Error("OTP verification failed");
  //         }
  //       }

  //       // if (!role) {
  //       //   otpResult = await apiService.verifyOtp({
  //       //     phone: phone,
  //       //     otp: otpValue,
  //       //   });
  //       //   console.log("otp Result :", phone, otpValue, otpResult);
  //       //   if (otpResult?.status !== 200) {
  //       //     throw new Error("OTP verification failed");
  //       //   }
  //       // }

  //       const token = otpResult?.data?.token;
  //       if (!token) {
  //         throw new Error("Token not received");
  //       }

  //       const tokenResult = await apiService.verifyToken(token);

  //       if (tokenResult?.status !== 200) {
  //         throw new Error("Token verification failed");
  //       }

  //       // console.log("token result :", tokenResult, tokenResult.data)
  //       let data = tokenResult?.data;

  //       // await setItem("user", tokenResult?.data);
  //       // Store token securely
  //       if (data?.token) {
  //         await Keychain.setGenericPassword("token", tokenResult.data?.token);
  //         await new Promise((resolve) => setTimeout(resolve, 100));
  //         await refreshAuth();
  //       }

  //       // Store user info in AsyncStorage
  //       await setItem(
  //         "user",
  //         JSON.stringify({
  //           id: data?.user?.id,
  //           name: data?.user?.name,
  //           phone: data?.user?.phone,
  //           roleName: data?.user?.roleName,
  //         }),
  //       );
  //       await new Promise((resolve) => setTimeout(resolve, 100));
  //       await refreshAuth();
  //       ToastSuccess("OTP verified successfully");
  //       console.log("Login successful......");
  //       navigation.pop(2);

  //       //  To get the token
  //       // const credentials = await Keychain.getGenericPassword();
  //       // if (credentials) {
  //       //   console.log('Token:', credentials.password);
  //       // }
  //     } catch (error) {
  //       console.log("OTP verification error:", error);
  //       ToastInfo(error.message || "Failed to verify OTP");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  // function handleClose() {
  //   setStep("personal");
  //   setPhoneNumber("");
  //   setFormData({
  //     name: "",
  //     email: "",
  //     role: "user",
  //     pincode: "",
  //     locality: "",
  //     city: "",
  //     state: "",
  //   });
  //   setOtpDigits(Array(OTP_LENGTH).fill(""));
  //   setErrors({});
  //   onClose();
  // }

  const isFormValid =
    formData.name.trim().length >= 3 && phone.length == 10 && formData.role;

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
          <View style={styles.dialog}>
            {/* Header */}
            <View style={{ alignItems: "center" }}>
              <BigLogo width={180} height={90} />
            </View>
            <Text style={styles.title}>Create an Account</Text>
            <Text style={styles.subTitle}>
              Provide your personal details to create your account
            </Text>

            {/* Tabs */}
            <View style={styles.tabContainer}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  // onPress={() => setStep(tab.id)}
                  style={[styles.tab, step === tab.id && styles.tabActive]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      step === tab.id && styles.tabTextActive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Step Content */}
            <View style={styles.content}>
              {step === "personal" && (
                <View>
                  <InputField
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(text) =>
                      setFormData((prev) => ({ ...prev, name: text }))
                    }
                  />
                  {errors.name && (
                    <Text style={styles.error}>{errors.name}</Text>
                  )}

                  <Text style={[styles.whatsappText]}>
                    Enter Whatsapp Number
                  </Text>
                  <View style={styles.phoneRow}>
                    <View style={styles.sheet}>
                      <CountryPicker
                        // disableNativeModal
                        countryCode={countryCode}
                        withFilter
                        withCallingCode
                        withFlag
                        onSelect={onSelect}
                        modalProps={{
                          statusBarTranslucent: true,
                        }}
                        // containerButtonStyle
                      />
                    </View>

                    <Text style={styles.codeText}>+{callingCode}</Text>

                    <TextInput
                      placeholder="Phone Number"
                      keyboardType="phone-pad"
                      value={phone}
                      onChangeText={handlePhoneChange}
                      style={styles.phoneinput}
                      maxLength={10}
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                  {phone?.length === 10 && (
                    <>
                      <Text style={[styles.whatsappText]}>
                        Enter Whatsapp OTP
                      </Text>
                      <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                          <TextInput
                            key={index}
                            ref={(ref) => (inputs.current[index] = ref)}
                            style={styles.otpInput}
                            value={digit}
                            onChangeText={(value) =>
                              handleOtpChange(value, index)
                            }
                            keyboardType="number-pad"
                            maxLength={1}
                          />
                        ))}
                      </View>
                    </>
                  )}
                  <InputField
                    label="Email Address"
                    placeholder="Enter Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.email}
                    onChange={(text) =>
                      setFormData((prev) => ({ ...prev, email: text }))
                    }
                  />
                  <Text style={[styles.whatsappText]}>Select Role</Text>
                  <View style={styles.roles}>
                    {Roles.map((option) => {
                      const isActive = formData.role === option.key;

                      return (
                        <Pressable
                          key={option.key}
                          style={[
                            styles.optionBtn,
                            isActive && styles.optionBtnActive,
                          ]}
                          onPress={() =>
                            setFormData((prev) => ({
                              ...prev,
                              role: option.key,
                            }))
                          }
                        >
                          <FontAwesome
                            name={option.icon}
                            size={15}
                            color={isActive ? "#27AE60" : "#374151"}
                          />
                          <Text
                            style={[
                              styles.optionText,
                              isActive && styles.optionTextActive,
                            ]}
                          >
                            {option.value}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <Pressable
                    style={[
                      styles.loginButton,
                      // !isFormValid && styles.disabledButton,
                    ]}
                    // disabled={!isFormValid}s
                    onPress={handleDetailsStep}
                  >
                    <FontAwesome name="whatsapp" size={20} color="white" />
                    <Text style={[styles.loginText]}>
                      {loading ? "Verifying..." : "Continue"}
                    </Text>
                  </Pressable>
                  <View style={{ paddingTop: 15, alignItems: "center" }}>
                    <Text style={styles.subTitle}>
                      Already have an account?{" "}
                      <Text
                        style={{
                          color: "#27AE60",
                          fontSize: 12,
                          fontWeight: "500",
                        }}
                        onPress={() => navigation.navigate("Login")}
                      >
                        Login
                      </Text>
                    </Text>
                  </View>
                </View>
              )}
              {step === "location" && (
                <View style={{ gap: 16 }}>
                  {/* Pincode */}
                  <View>
                    <Text style={styles.label}>Pincode</Text>
                    <View style={styles.inputBox}>
                      <TextInput
                        keyboardType="numeric"
                        value={formData.pincode}
                        onChangeText={handlePincodeChange}
                        // onChangeText={(text) => {
                        //   const nextPincode = text
                        //     .replace(/\D/g, "")
                        //     .slice(0, 6);

                        //   setFormData((prev) => ({
                        //     ...prev,
                        //     pincode: nextPincode,
                        //     ...(nextPincode.length < 6
                        //       ? { locality: "", city: "", state: "" }
                        //       : {}),
                        //   }));

                        //   // Call function when pincode is complete
                        //   if (nextPincode.length === 6) {
                        //     fetchLocationFromPincode(nextPincode);
                        //   }

                        //   setErrors((prev) => ({
                        //     ...prev,
                        //     pincode: undefined,
                        //   }));
                        // }}
                        placeholderTextColor="gray"
                        placeholder="Enter pincode"
                        style={styles.input}
                      />
                    </View>

                    {errors.pincode && (
                      <Text style={styles.error}>{errors.pincode}</Text>
                    )}

                    {!errors.pincode && isLookingUpPincode && (
                      <Text style={styles.helper}>
                        Fetching locality, city, and state...
                      </Text>
                    )}
                  </View>

                  {/* Locality */}
                  <View>
                    <Text style={styles.label}>Locality</Text>
                    <View style={styles.inputBox}>
                      <TextInput
                        value={formData.locality}
                        onChangeText={(text) => {
                          setFormData((prev) => ({ ...prev, locality: text }));
                          setErrors((prev) => ({
                            ...prev,
                            locality: undefined,
                          }));
                        }}
                        placeholderTextColor="gray"
                        placeholder="Enter locality"
                        style={styles.input}
                      />
                    </View>
                    {errors.locality && (
                      <Text style={styles.error}>{errors.locality}</Text>
                    )}
                  </View>

                  {/* City */}
                  <View>
                    <Text style={styles.label}>City</Text>
                    <View style={styles.inputBox}>
                      <TextInput
                        value={formData.city}
                        onChangeText={(text) => {
                          setFormData((prev) => ({ ...prev, city: text }));
                          setErrors((prev) => ({ ...prev, city: undefined }));
                        }}
                        placeholderTextColor="gray"
                        placeholder="Enter city"
                        style={styles.input}
                      />
                    </View>
                    {errors.city && (
                      <Text style={styles.error}>{errors.city}</Text>
                    )}
                  </View>

                  {/* State */}
                  <View>
                    <Text style={styles.label}>State</Text>
                    <View style={styles.inputBox}>
                      <TextInput
                        value={formData.state}
                        onChangeText={(text) => {
                          setFormData((prev) => ({ ...prev, state: text }));
                          setErrors((prev) => ({ ...prev, state: undefined }));
                        }}
                        placeholderTextColor="gray"
                        placeholder="Enter state"
                        style={styles.input}
                      />
                    </View>
                    {errors.state && (
                      <Text style={styles.error}>{errors.state}</Text>
                    )}
                  </View>

                  {/* Buttons */}
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <TouchableOpacity
                      onPress={() => setStep("personal")}
                      style={styles.backBtn}
                    >
                      <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleCompleteLocation}
                      style={styles.continueBtn}
                    >
                      <Text style={styles.continueText}>Continue</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {step === "kyc" && (
                <View style={{ gap: 17 }}>
                  <View>
                    <Text style={styles.digiheading}>
                      Verify with DigiLocker
                    </Text>

                    <View style={styles.card}>
                      <View style={styles.row}>
                        <Text style={styles.phoneText}>
                          {formData.phone || "-"}
                        </Text>
                        <FontAwesome5
                          name="check-circle"
                          size={16}
                          color="#27AE60"
                        />
                      </View>
                    </View>

                    <Text style={styles.helper}>
                      This number will be used for KYC verification
                    </Text>
                  </View>

                  <View style={{ gap: 12 }}>
                    {[
                      "Real users, verified identities",
                      "One-time KYC verification",
                      "Safe & secure platform",
                      "Zero spam & fake accounts",
                      "Connect with genuine leads",
                    ].map((item) => (
                      <View key={item} style={styles.row}>
                        <FontAwesome5
                          name="check-circle"
                          size={15}
                          color="#27AE60"
                        />
                        <Text style={styles.listText}>{item}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.row}>
                    <Text>🔒</Text>
                    <Text style={styles.helper}>
                      secure & government approved DigiLocker verification
                    </Text>
                  </View>

                  <TouchableOpacity style={styles.kycBtn} onPress={handleKYC}>
                    <Text
                      style={{
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: 600,
                      }}
                    >
                      Continue KYC
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
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
  dialog: {
    backgroundColor: "#f2fcf6",
    borderRadius: 16,
    paddingHorizontal: 20,
  },

  backOption: {
    marginTop: 20,
    marginLeft: 20,
  },
  closeBtn: { position: "absolute", top: 10, right: 10, zIndex: 10 },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 12,
    color: "gray",
    marginBottom: 10,
    textAlign: "center",
  },
  whatsappText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
    fontWeight: "500",
    alignSelf: "flex-start",
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderColor: "#ccc",
    backgroundColor: "white",
    marginBottom: 10,
  },
  roles: {
    flexDirection: "row",
    alignSelf: "flex-start",
    justifyContent: "space-around",
    gap: 12,
    marginBottom: 10,
  },
  sheet: {
    // borderWidth:1,
    padding: 0,
  },
  codeText: {
    fontSize: 15,
    marginLeft: 5,
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "white",
  },
  optionBtnActive: {
    borderColor: "#22C55E",
    backgroundColor: "#DCFCE7",
  },
  optionText: {
    fontSize: 13,
    color: "#374151",
  },
  optionTextActive: {
    color: "#16A34A",
    fontWeight: "600",
  },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 7,
  },
  tab: { borderBottomWidth: 1, paddingBottom: 6, borderColor: "#ccc" },
  tabActive: { borderBottomColor: "#28b463" },
  tabText: { color: "#8d908e", fontSize: 13 },
  tabTextActive: { color: "#28b463", fontWeight: 500 },
  content: {
    // padding: 16
  },
  label: { fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 },
  input: {
    backgroundColor: "#f2fcf6",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  error: { color: "red", fontSize: 12, marginBottom: 6 },
  phoneContainer: { width: "100%", borderRadius: 8, marginBottom: 10 },
  // phoneInput: { backgroundColor: "#f2fcf6" },
  phoneinput: {
    flex: 1,
    marginTop: 3,
    // height: 50,
  },
  otpContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
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
  // otpContainer: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   marginBottom: 12,
  // },

  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  roleBtn: {
    flex: 1,
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "#f2fcf6",
  },
  roleActive: { borderWidth: 1, borderColor: "#28b463" },
  roleText: { textAlign: "center", color: "#8a8d8b" },
  roleTextActive: { color: "#28b463", fontWeight: "600" },
  loginButton: {
    width: "60%",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    alignSelf: "center",
    backgroundColor: "#27AE60",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#6aca92",
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

  inputBox: {
    backgroundColor: "#fff",
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    // paddingVertical: 7,
  },

  input: {
    fontSize: 14,
  },
  digiheading: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "left",
    // paddingTop:5
  },

  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },

  helper: {
    fontSize: 12,
    color: "#7f8481",
    marginTop: 4,
  },

  backBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#c8ceca",
    padding: 12,
    borderRadius: 8,
  },

  backText: {
    textAlign: "center",
    color: "#6b706d",
    fontWeight: "600",
  },

  continueBtn: {
    flex: 1,
    backgroundColor: "#28b463",
    padding: 12,
    borderRadius: 8,
  },

  continueText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  phoneText: {
    fontSize: 14,
    flex: 1,
  },

  listText: {
    fontSize: 13,
  },

  kycBtn: {
    width: "70%",
    alignSelf: "center",
    backgroundColor: "#28b463",
    padding: 12,
    borderRadius: 8,
    // marginTop: 10,
  },
});
