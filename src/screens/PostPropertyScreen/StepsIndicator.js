import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { PhoneIcon } from "../../../assets/svg/Logo";
import { prevStep } from "../../redux/slice/PostPropertySlice";
import { useAppDispatch } from "../../redux/store/store";

const StepIndicator = ({ steps = [], currentStep = 0 }) => {
  const { propertyType, percentage } = useSelector(
    (state) => state.postProperty,
  );
  const dispatch = useAppDispatch();
  if (!steps.length) return null;

  const totalSteps = steps.length;
  const currentLabel = steps[currentStep] || "";
  const isDisabled = currentStep === 0;
  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {/* {currentStep > 0 && ( */}
        {currentStep !== 0 &&
        <Pressable
          // disabled={isDisabled}
          onPress={() => dispatch(prevStep())}
          hitSlop={10}
        >
          <Ionicons
            name="arrow-back-outline"
            size={20}
            color={isDisabled ? "#9CA3AF" : "#000"}
          />
        </Pressable>}
        {/* )} */}
        <View style={styles.help}>
          <Text style={styles.helpText}>Need Help? </Text>
          <FontAwesome name="phone" size={14} color="#27AE60" />
          <Text style={[styles.helpText, { color: "#27AE60" }]}>
            {" "}
            Get a callback
          </Text>
        </View>
      </View>
      {/* Top Row */}
      <View style={[{ paddingVertical: 8 }]}>
        <Text style={styles.title}>{currentLabel}</Text>
        <Text style={styles.stepText}>
          Step {currentStep + 1} of {totalSteps}
        </Text>
      </View>

      <View style={styles.bar}>
        <View style={styles.progressContainer}>
          <View
            style={[styles.progressFill, { width: `${percentage ?? 0}%` }]}
          />
        </View>
        <Text style={styles.percentText}>{percentage ?? 0}%</Text>
      </View>
    </View>

    // <View style={styles.container}>
    //   {steps.map((step, index) => {
    //     const isCompleted = index < currentStep;
    //     const isCurrent = index === currentStep;
    //     const isUpcoming = index > currentStep;

    //     return (
    //       <View key={index} style={styles.stepWrapper}>
    //         {/* Circle */}
    //         <View
    //           style={[
    //             styles.outerCircle,
    //             isCompleted && styles.completedOuter,
    //             isCurrent && styles.currentOuter,
    //             isUpcoming && styles.upcomingOuter,
    //           ]}
    //         >
    //           <View
    //             style={[
    //               styles.innerCircle,
    //               isCompleted && styles.completedInner,
    //               isCurrent && styles.currentInner,
    //               isUpcoming && styles.upcomingInner,
    //             ]}
    //           />
    //         </View>

    //         {/* Label */}
    //         <Text
    //           style={[
    //             styles.label,
    //             isCompleted && styles.completedText,
    //             isCurrent && styles.currentText,
    //             isUpcoming && styles.upcomingText,
    //           ]}
    //           numberOfLines={2}
    //         >
    //           {step}
    //         </Text>

    //         {/* Line */}
    //         {index !== steps.length - 1 && (
    //           <View
    //             style={[
    //               styles.line,
    //               index < currentStep && styles.completedLine,
    //             ]}
    //           />
    //         )}
    //       </View>
    //     );
    //   })}
    // </View>
  );
};

export default StepIndicator;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  help: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  helpText: {
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },

  stepText: {
    paddingTop: 7,
    fontSize: 12,
    color: "#666",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  progressContainer: {
    width: "85%",
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 6,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#27AE60",
    borderRadius: 6,
  },

  percentText: {
    marginRight: 8,
    fontSize: 13,
    color: "#27AE60",
    fontWeight: 600,
    alignSelf: "flex-end",
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 20,
//     paddingHorizontal: 10,
//   },

//   stepWrapper: {
//     alignItems: "center",
//     flex: 1,
//   },

//   /* OUTER CIRCLE */
//   outerCircle: {
//     width: 22,
//     height: 22,
//     borderRadius: 11,
//     borderWidth: 2,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "white",
//     borderColor: "#000",
//   },

//   completedOuter: {
//     borderColor: "#27AE60",
//   },

//   currentOuter: {
//     borderColor: "#F39C12",
//   },

//   upcomingOuter: {
//     borderColor: "#999",
//   },

//   /* INNER CIRCLE */
//   innerCircle: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: "#000",
//   },

//   completedInner: {
//     backgroundColor: "#27AE60",
//   },

//   currentInner: {
//     backgroundColor: "#F39C12",
//   },

//   upcomingInner: {
//     backgroundColor: "#999",
//   },

//   /* LABEL */
//   label: {
//     fontSize: 11,
//     marginTop: 6,
//     textAlign: "center",
//     color: "#999",
//   },

//   completedText: {
//     color: "#27AE60",
//     fontWeight: "600",
//   },

//   currentText: {
//     color: "#F39C12",
//     fontWeight: "600",
//   },

//   upcomingText: {
//     color: "#999",
//   },

//   /* LINE */
//   line: {
//     position: "absolute",
//     top: 11,
//     right: "-50%",
//     width: "100%",
//     height: 2,
//     backgroundColor: "#999",
//     // backgroundColor:"red",
//     zIndex: -1,
//   },

//   completedLine: {
//     backgroundColor: "#27AE60",
//   },
// });
