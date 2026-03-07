import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation } from "@react-navigation/native";
import {
  setProfileField,
  prevStep,
  setPercentage,
  resetPostProperty,
} from "../../../redux/slice/PostPropertySlice";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ImageListIcon } from "../../../../assets/svg/Logo";
import { useAppDispatch } from "../../../redux/store/store";
import { submitVerificationThunk } from "../../../redux/thunk/SubmitPropertyThunk";
import { validatePropertyVerify } from "../../../zod/verificationZod/propertyVerifyZod";
import { ToastSuccess, ToastInfo, ToastError } from "../../../utils/Toast";
import Feather from "@expo/vector-icons/Feather";
import LottieView from "lottie-react-native";
import TrackPropertyStatus from "./TrackPropertyStatus ";

const VerificationStep = () => {
  const dispatch = useAppDispatch();
  const [submissionMeta, setSubmissionMeta] = useState(null);
  const [showTracker, setShowTracker ]= useState(false)

  const VERIFICATION_DOCS = [
    {
      key: "sale-deed",
      label: "Sale Deed",
      verificationType: "SALE_DEED",
      title: "sale-deed",
      showInfo: true,
    },
    {
      key: "ec",
      label: "Encumbrance Certificate (EC)",
      verificationType: "ENCUMBRANCE_CERTIFICATE",
      title: "encumbrance-certificate",
      showInfo: true,
    },
    {
      key: "municipal-tax",
      label: "Municipal Tax (Receipt)",
      verificationType: "MUNICIPAL_TAX",
      title: "municipal-tax",
      showInfo: false,
    },
    {
      key: "utility-bill",
      label: "Water or Electricity Bill",
      verificationType: "UTILITY_BILL",
      title: "utility-bill",
      showInfo: false,
    },
  ];

  const {
    residential,
    base,
    draftId,
    propertyType,
    commercial,
    land,
    agricultural,
  } = useSelector((state) => state.postProperty);
  const propertyProfile =
    propertyType === "residential"
      ? residential
      : propertyType === "commercial"
        ? commercial
        : propertyType === "land"
          ? land
          : agricultural;

  const navigation = useNavigation();

  const [file, setFiles] = useState(null);
  const [showErrors, setShowErrors] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
      multiple: false,
    });

    if (result.canceled) return;

    const f = result.assets?.[0];
    if (!f) return;

    console.log("MMMMMMMMMMMM", f.uri, f.name, f.mimeType);

    setFiles({
      uri: f.uri,
      name: f.name,
      type: f.mimeType || "application/octet-stream",
    });
  };

  const validationResult = validatePropertyVerify({
    verificationDocuments: file ? [file] : [],
  });

  const fieldErrors =
    showErrors && !validationResult.success
      ? validationResult.error.flatten().fieldErrors
      : {};

  const handleSubmit = () => {
    setShowErrors(true);

    if (!file) {
      ToastError("Please upload a document");
      return;
    }

    const selectedDoc = VERIFICATION_DOCS.find(
      (d) => d.key === propertyProfile?.verificationDocument,
    );

    if (!selectedDoc) {
      ToastError("Select document type");
      return;
    }

    const formData = new FormData();
    formData.append("verificationType", selectedDoc.verificationType);
    formData.append("title", selectedDoc.title);
    formData.append("verificationDocuments", file);

    dispatch(
      submitVerificationThunk({
        category: propertyType,
        id: draftId,
        payload: formData,
      }),
    )
      // .unwrap()
      // .then((res) => {
      //   setShowConfetti(true);
      //   console.log("RESPONSE :::", res)

      //   dispatch(setPercentage(res?.data?.completion?.percent));
      //   ToastSuccess("Property posted successfully");
      //   dispatch(resetPostProperty());
      //   setTimeout(() => {
      //     setShowConfetti(false);
      //     navigation.navigate("Home");
      //   }, 3000);
      // })
      // .catch((error) => {
      //   console.log("error when submitting:", error);
      // });
      .unwrap()
      .then((res) => {
        console.log("RESPONSE :::", res)
        ToastSuccess("Property is under review");

        const data = res?.data;
        const approved = Boolean(res?.verified);
        const updatedAt = data?.updatedAt || new Date().toISOString();
        if(res?.success && !res?.verified){
          setShowTracker(true)
        }

        setSubmissionMeta({
          isSubmitted: true,
          isApproved: approved,
          submittedAt: data?.createdAt || base?.createdAt || updatedAt,
          reviewAt: updatedAt,
          approvedAt: approved ? updatedAt : undefined,
        });
        setShowConfetti(true);

        dispatch(setPercentage(res?.data?.completion?.percent));
        // dispatch(resetPostProperty());
        // setTimeout(() => {
        //   setShowConfetti(false);
        //   navigation.navigate("Home");
        // }, 3000);
      })
      .catch((error) => {
        console.log("ERROR :", error);
        const errObj =
          error?.response?.data ??
          (typeof error === "string" ? { message: error } : error);

        if (errObj?.code === "NO_VALID_PLAN") {
          ToastError(errObj.message || "Please subscribe to a plan");

          const listingType = propertyProfile?.listingType || "sale";

          const redirectScreen =
            listingType === "sale" ? "OwnerSellPlans" : "OwnerRentPlans";

          navigation.navigate(redirectScreen);

          return;
        }

        if (errObj?.code === "PLAN_LIMIT_REACHED") {
          const listingType = propertyProfile?.listingType || "sale";

          const redirectScreen =
            listingType === "sale" ? "OwnerSellPlans" : "OwnerRentPlans";

          navigation.navigate(redirectScreen);

          ToastError("Your plan limit is reached");
          return;
        }

        // 🔴 Fallback
       ToastError(errObj?.message || "Verification failed");
      });
  };
  // const existingDoc = propertyProfile?.verificationDocuments?.[0];
  console.log("propertyProfile?.verificationDocuments?.[0]", propertyProfile?.verificationDocuments?.[0])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {showTracker ? 
      <TrackPropertyStatus  submissionMeta={submissionMeta}/>
      : <>
      <View style={styles.card}>
        <Text style={styles.cardText}>
          Ownership proof verifies properties and prevents duplicates. Buyers
          and tenants are verified too.
        </Text>
      </View>

      <Text style={styles.heading}>
        Select any one of the required documents below to verify your property
      </Text>

      {/* RADIO LIST */}

      {VERIFICATION_DOCS.map((doc) => {
        const selected = propertyProfile?.verificationDocument === doc.key;

        return (
          <Pressable
            key={doc.key}
            style={styles.radioRow}
            onPress={() => {
              const newValue = selected ? null : doc.key;

              dispatch(
                setProfileField({
                  propertyType: propertyType,
                  key: "verificationDocument",
                  value: newValue,
                }),
              );
            }}
          >
            {/* Radio */}
            <View style={[styles.radio, selected && styles.radioSelected]}>
              {selected && <View style={styles.dot} />}
            </View>

            {/* Label */}
            <Text style={styles.label}>{doc.label}</Text>
            {/* {doc?.showInfo ? (
              <Pressable
                style={{ marginRight: 5 }}
                onPress={ToastInfo("Please Upload in PDF format only")}
              >
                <Feather name="info" size={12} color="gray" />
              </Pressable>
            ) : null} */}
          </Pressable>
        );
      })}

      {/* FILE PICKER */}

      {file?.uri && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: file.uri }} style={styles.previewImage} />
        </View>
      )}

      <Pressable style={styles.uploadBox} onPress={pickFile}>
        <ImageListIcon width={50} height={40} color="#82D1A3" />

        <View style={styles.uploadContent}>
          <Text style={styles.uploadText}>
            Tap here to upload your document.
          </Text>

          <Text style={styles.uploadText}>Max 1 image : upto 5 MB</Text>
        </View>

        <Text style={styles.uploadButton}>Upload document</Text>
      </Pressable>

      {fieldErrors?.verificationDocuments?.[0] && (
        <Text style={styles.error}>{fieldErrors.verificationDocuments[0]}</Text>
      )}

      {/* Continue */}
      <View style={styles.btnOptions}>
        <Pressable
          style={styles.backButton}
          onPress={() => dispatch(prevStep())}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={handleSubmit}
          // if (isFormValid) {
          //   console.log("Location Data:", base);
          //   dispatch(nextStep());
          // }
        >
          <Text style={styles.buttonText}>Publish</Text>
        </Pressable>
      </View>
      {showConfetti && (
        <View style={styles.overlay}>
          <LottieView
            source={require("../../../../assets/animations/confetti.json")}
            autoPlay
            loop={false}
            style={styles.animation}
          />
        </View>
      )}
      </>} 
    </ScrollView>
  );
};
export default VerificationStep;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },
  overlay: {
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 300,
    height: 300,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginVertical: 20,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Android shadow
    elevation: 3,
  },

  cardText: {
    fontSize: 14,
    color: "#27AE60",
    fontWeight: 500,
    lineHeight: 25,
  },
  heading: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: 500,
    marginBottom: 20,
    color: "#333",
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#9CA3AF", // gray
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  radioSelected: {
    borderColor: "#27AE60", // green
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#27AE60",
  },

  label: {
    fontSize: 14,
    flex: 1,
  },
  label: {
    fontSize: 13,
    flex: 1,
  },
  info: {
    fontSize: 12,
    color: "#777",
  },
  uploadBtn: {
    marginTop: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
  },
  uploadText: {
    fontSize: 14,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 6,
  },
  previewContainer: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent:"flex-start",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  previewImage: {
    width: "30%",
    height: 100,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  uploadBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#82D1A3",
    backgroundColor: "#F1FCF5",
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    // minHeight: 140,
    alignItems: "center",
    justifyContent: "center",
    // marginBottom: 15,
  },
  uploadText: {
    fontSize: 12,
    textAlign: "center",
    color: "#6B7280",
  },
  uploadButton: {
    alignSelf: "center",
    color: "white",
    paddingHorizontal: 25,
    alignItems: "center",
    textAlign: "center",
    padding: 5,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: "#22C55E",
  },
  errorText: {
    color: "#DC2626",
    marginLeft: 3,
    marginTop: 2,
    fontSize: 12,
  },
  btnOptions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    alignItems: "center",
    marginRight: 10,
    marginVertical: 20,
  },
  backButton: {
    width: "40%",
    alignSelf: "center",
    backgroundColor: "white",
    borderColor: "#22C55E",
    borderWidth: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    // marginVertical: 15,
    // marginBottom: 40,
  },
  backButtonText: {
    color: "#22C55E",
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    width: "40%",
    alignSelf: "center",
    backgroundColor: "#22C55E",
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: "center",
    // marginVertical: 15,
    // marginBottom: 40,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
