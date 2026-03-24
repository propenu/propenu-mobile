import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { agentServices } from "../../../services/agentServices";
import { ToastError, ToastSuccess } from "../../../utils/Toast";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../../../components/ui/InputField";
import { Verified } from "../../../../assets/svg/Logo";
import DateInputField from "../../../components/ui/DateInputField";
const AgentRegistrationModal = ({ open, onCompleted, userId }) => {
  const [loading, setLoading] = useState(false);

  const [files, setFiles] = useState({
    avatar: null,
    coverImage: null,
  });

  const [form, setForm] = useState({
    name: "",
    bio: "",
    agencyName: "",
    licenseNumber: "",
    licenseValidTill: "",
    city: "",
    experienceYears: "0",
    dealsClosed: "0",
    areasServed: "",
    languages: "",
    reraAgentId: "",
  });

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 📸 Image Picker
  const pickImage = async (field) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.assets && result.assets.length > 0) {
      setFiles((prev) => ({
        ...prev,
        [field]: result.assets[0],
      }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await agentServices.registerAgency(
        {
          name: form.name,
          bio: form.bio,
          agencyName: form.agencyName,
          licenseNumber: form.licenseNumber,
          licenseValidTill: form.licenseValidTill,
          city: form.city,
          experienceYears: Number(form.experienceYears),
          dealsClosed: Number(form.dealsClosed),
          areasServed: form.areasServed.split(","),
          languages: form.languages.split(","),
          verificationStatus: "pending",
          rera: {
            reraAgentId: form.reraAgentId,
            isVerified: false,
          },
          stats: {
            totalProperties: 0,
            publishedCount: 0,
          },
          user: userId,
        },
        files,
      );
      console.log("resresresresres", res)
      if(res.success){
      ToastSuccess("Agent registration submitted");
      onCompleted();

      }



    } catch (err) {
      ToastError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={open} animationType="slide">
      <SafeAreaView style={{ flex: 1, padding:10 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>
            Complete Agent Registration
          </Text>
          <Text style={styles.subheading}>
            Please provide these additional details.
          </Text>
          <ScrollView style={{ flex: 1 , paddingTop:5,padding:2}}>
            {/* Inputs */}
            <InputField
              label="Full Name"
              placeholder="Name"
              value={form.name}
              onChange={(v) => update("name", v)}
            />
            <InputField
              label="Agency Name"
              placeholder="Agency"
              value={form.agencyName}
              onChange={(v) => update("agencyName", v)}
            />
            <InputField
              label="City"
              placeholder="City"
              value={form.city}
              onChange={(v) => update("city", v)}
            />
            <InputField
              placeholder="License Number"
              label="License Number"
              value={form.licenseNumber}
              onChange={(v) => update("licenseNumber", v)}
            />
            <DateInputField
              label="License Valid Till"
              value={form.licenseValidTill}
              // required
              minimumDate={new Date()}
              onChange={(v) => update("licenseValidTill", v)}
            />
            {/* <InputField
            placeholder="Name"
            label="License Valid Till"
            value={form.licenseValidTill}
            onChange={(v) => update("licenseValidTill", v)}
          /> */}
            <InputField
              placeholder="Experience"
              label="Experience (Years)"
              keyboardType="numeric"
              value={form.experienceYears}
              onChange={(v) => update("experienceYears", v)}
            />
            <InputField
              label="Deals Closed"
              placeholder="Deals"
              keyboardType="numeric"
              value={form.dealsClosed}
              onChange={(v) => update("dealsClosed", v)}
            />
            <InputField
              placeholder="Areas"
              label="Areas Served (comma-separated)"
              value={form.areasServed}
              onChange={(v) => update("areasServed", v)}
            />
            <InputField
              placeholder="Languages"
              label="Languages (comma-separated)"
              value={form.languages}
              onChange={(v) => update("languages", v)}
            />
            <InputField
              placeholder="Agent ID"
              label="RERA Agent ID"
              value={form.reraAgentId}
              onChange={(v) => update("reraAgentId", v)}
            />

            {/* Bio */}
            <InputField
              placeholder="Bio"
              label="Short Bio"
              value={form.bio}
              onChange={(v) => update("bio", v)}
              multiline
              style={{ height: 80 }}
            />

            <View style={styles.row}>
              {/* Avatar */}
              <View
                style={{
                  width: "49%",
                  heaight: 150,
                  justifyContent: "space-between",
                }}
              >
                {files.avatar ? (
                  <Image
                    source={{ uri: files.avatar.uri }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 10,
                      alignSelf: "center",
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 10,
                      backgroundColor: "#eee",
                      alignSelf: "center",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>+</Text>
                  </View>
                )}

                <Pressable
                  style={styles.btn}
                  onPress={() => pickImage("avatar")}
                >
                  <Text
                    style={{
                      color: "#27AE60",
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    Add Profile Photo
                  </Text>
                </Pressable>
              </View>

              {/* Cover */}
              <View
                style={{
                  width: "49%",
                  height: 150,
                  justifyContent: "space-between",
                }}
              >
                {files.coverImage ? (
                  <Image
                    source={{ uri: files.coverImage.uri }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 10,
                      alignSelf: "center",
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 10,
                      backgroundColor: "#eee",
                      alignSelf: "center",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>+</Text>
                  </View>
                )}

                <Pressable
                  style={styles.btn}
                  onPress={() => pickImage("coverImage")}
                >
                  <Text
                    style={{
                      color: "#27AE60",
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    Add Cover Photo
                  </Text>
                </Pressable>
              </View>
            </View>
            {/* Submit */}
            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              style={styles.submit}
            >
              <Text style={{ color: "white", fontWeight: 600 }}>
                {loading ? "Submitting..." : "Complete & Continue"}
              </Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default AgentRegistrationModal;
const styles = StyleSheet.create({
  subheading: {
    fontSize: 13,
    color: "gray",
    marginVertical: 5,
    paddingBottom: 5,
  },
  btn: {
    padding: 8,
    backgroundColor: "#e5faed",
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 10,
    // justifyContent:""
  },
  submit: {
    backgroundColor: "#27AE60",
    padding: 7,
    borderRadius: 7,
    alignItems: "center",
    marginVertical: 5,
  },
});
