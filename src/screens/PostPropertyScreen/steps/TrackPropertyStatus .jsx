import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const TrackPropertyStatus = ({ submissionMeta }) => {
  const navigation = useNavigation();
  console.log("submissionMetasubmissionMeta", submissionMeta);
  const { isSubmitted, isApproved, submittedAt, reviewAt, approvedAt } =
    submissionMeta;
  const steps = [
    { id: 1, label: "Submitted", date: submittedAt, active: true },
    { id: 2, label: "Under Review", date: reviewAt, active: true },
    { id: 3, label: "Approved & Live", date: approvedAt, active: isApproved },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Check the current status of your property submission
      </Text>

      <View style={styles.stepContainer}>
        {/* Circles + Lines */}
        <View style={styles.stepsRow}>
          {steps.map((step, index) => (
            <View key={step.id} style={styles.stepItem}>
              {/* Left line */}
              {index !== 0 && (
                <View
                  style={[
                    styles.line,
                    {
                      left: 0,
                      right: "50%",
                      borderColor: step.active ? "#27AE60" : "#BDBDBD",
                    },
                  ]}
                />
              )}

              {/* Right line */}
              {index !== steps.length - 1 && (
                <View
                  style={[
                    styles.line,
                    {
                      left: "50%",
                      right: 0,
                      borderColor: steps[index + 1].active
                        ? "#27AE60"
                        : "#BDBDBD",
                    },
                  ]}
                />
              )}

              {/* Circle */}
              <View
                style={[
                  styles.circle,
                  step.active ? styles.circleActive : styles.circleInactive,
                ]}
              >
                <Text
                  style={[
                    styles.circleText,
                    step.active ? { color: "#fff" } : { color: "#27AE60" },
                  ]}
                >
                  {step.id}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Labels */}
        <View style={styles.labelsRow}>
          {steps.map((step) => (
            <View key={`label-${step.id}`} style={styles.labelItem}>
              <Text
                style={[
                  styles.labelText,
                  { color: step.active ? "#27AE60" : "#BDBDBD" },
                ]}
              >
                {step.label}
              </Text>

              {step.active && (
                <Text style={styles.dateText}>
                  {formatDate(step.date) || " "}
                </Text>
              )}
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.description}>
        Your property has been submitted for review; you'll be notified within
        24 hours via Email, WhatsApp, and SMS once it's approved or if any
        action is required.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("MyProperties")}
      >
        <Text style={styles.buttonText}>Go to My Properties</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TrackPropertyStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    alignItems: "center",
  },

  subtitle: {
    fontSize: 13,
    // fontWeight:500,
    marginBottom: 40,
  },

  stepContainer: {
    width: "100%",
    alignItems: "center",
  },

  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    position: "relative",
  },

  stepItem: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },

  line: {
    position: "absolute",
    top: 15,
    borderTopWidth: 1,
    borderStyle: "dashed",
  },

  circle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    zIndex: 10,
  },

  circleActive: {
    backgroundColor: "#27AE60",
    borderColor: "#27AE60",
  },

  circleInactive: {
    backgroundColor: "#fff",
    borderColor: "#27AE60",
  },

  circleText: {
    fontWeight: "600",
  },

  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },

  labelItem: {
    flex: 1,
    alignItems: "center",
  },

  labelText: {
    fontSize: 13,
    fontWeight: "500",
  },

  dateText: {
    marginTop: 4,
    fontSize: 12,
    color: "#27AE60",
  },

  description: {
    marginTop: 40,
    fontSize: 12,
    lineHeight: 20,
    textAlign: "center",
  },

  button: {
    marginTop: 30,
    backgroundColor: "#27AE60",
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignSelf: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
