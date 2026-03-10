import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { builderServices } from "../../services/builderServices";
import { ToastError, ToastSuccess } from "../../utils/Toast";

const EnquiryModal = ({ showEnquiry, setShowEnquiry, propertyId }) => {
  const [form, setForm] = useState({
    projectId: propertyId,
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await builderServices.PostLeads(form);
      if (response?.success) {
        ToastSuccess(response.message || "Lead submitted Successfully");
      }
    } catch (error) {
      console.log("Error occured :", error);
      ToastError("Something went wrong. Please try again.");
    }
    setShowEnquiry(false);
  };

  return (
    <Modal
      visible={showEnquiry}
      transparent
      animationType="slide"
      onRequestClose={() => setShowEnquiry(false)}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            setShowEnquiry(false);
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Enquiry Now</Text>

              <TextInput
                placeholder="Your Name"
                placeholderTextColor="#aaa"
                value={form.name}
                onChangeText={(text) => handleChange("name", text)}
                style={styles.input}
              />

              <TextInput
                placeholder="Your Mobile Number"
                placeholderTextColor="#aaa"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(text) => handleChange("phone", text)}
                style={styles.input}
              />

              <TextInput
                placeholder="Your Email"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                value={form.email}
                onChangeText={(text) => handleChange("email", text)}
                style={styles.input}
              />

              <TextInput
                placeholder="Message"
                placeholderTextColor="#aaa"
                value={form.message}
                onChangeText={(text) => handleChange("message", text)}
                style={[styles.input, { height: 80 }]}
                multiline
              />
              <View style={styles.btncontainer}>
                <Pressable
                  onPress={() => setShowEnquiry(false)}
                  style={styles.closeBtn}
                >
                  <Text style={{ color: "#27AE60", fontWeight: 500 }}>
                    Cancel
                  </Text>
                </Pressable>

                <Pressable style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Submit</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};
export default EnquiryModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },
  btncontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
  },
  title: {
    color: "#27AE60",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    width: "40%",
    backgroundColor: "#27AE60",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  closeBtn: {
    width: "40%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#27AE60",
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: "center",
    marginTop: 5,
  },
});
