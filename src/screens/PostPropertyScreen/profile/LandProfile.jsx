import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  StyleSheet,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import Entypo from "@expo/vector-icons/Entypo";
import { postPropertyServices } from "../../../services/postPropertyServices";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch } from "../../../redux/store/store";
import { submitDetailsThunk } from "../../../redux/thunk/SubmitPropertyThunk";
import Toggle from "../../../components/ui/ToggleSwitch";
import InputField from "../../../components/ui/InputField";
import TextArea from "../../../components/ui/TextArea";
import Dropdownui from "../../../components/ui/DropDownUI";
import AmenitiesSelect from "./AmenitiesSelect";
import { LAND_AMENITIES } from "../constants/amenities";
import InputWithUnit from "../../../components/ui/InputWithUnit";
import { ToastError, ToastSuccess, ToastInfo } from "../../../utils/Toast";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { setFiles as setFileStoreFiles } from "../../../lib/FileStore";
import { ImageListIcon } from "../../../../assets/svg/Logo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { validateLandProfile } from "../../../zod/detailsZod/landProfileZod";
import * as ImagePicker from "expo-image-picker";
import {
  setBaseField,
  setProfileField,
  nextStep,
  prevStep,
  setPercentage,
} from "../../../redux/slice/PostPropertySlice";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const AREA_UNITS = ["sqft"];
const FACING_OPTIONS = [
  "East",
  "West",
  "North",
  "South",
  "North-East",
  "North-West",
  "South-East",
  "South-West",
];

const LAND_APPROVAL_AUTHORITIES = ["dtcp", "hmda", "cmda", "bda", "panchayat"];

const LandProfile = () => {
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const { land, propertyType, draftId, base } = useSelector(
    (state) => state.postProperty,
  );
  const [showErrors, setShowErrors] = useState(false);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [files, setFiles] = useState([]);
  const [fieldErrors, setFieldErrors] = useState(null);

  // const handleSubmitProperty = () => {
  //   dispatch(submitPropertyThunk("land"))
  //     .unwrap()
  //     .then((response) => {
  //       if (response?.success) {
  //         ToastSuccess("Property posted successfully");

  //         console.log(
  //           "Property Submission Successful:",
  //           response.status,
  //           response.success,
  //         );

  //         navigation.navigate("Drawer");
  //       } else {
  //         ToastError("Failed to post property");
  //       }
  //     })
  //     .catch((error) => {
  //       ToastError("Failed to post property");
  //       console.error("Property submission failed:", error);
  //     });
  // };

  const pickImages = async () => {
    // Need user permission to get images
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      if (!permission.canAskAgain) {
        ToastInfo("Please enable photo permission in app settings");
        Linking.openSettings();
        return;
      }
  
      ToastError("Permission required to access images");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (result.canceled) return;

    const assets = result.assets || [];

    setFileStoreFiles("postProperty", assets);
    console.log("SETTING FILES");
    setFiles([...assets]);

    dispatch(
      setBaseField({
        key: "galleryFiles",
        value: assets.map((img) => ({
          uri: img.uri,
          name: img.fileName || "image.jpg",
          type: img.type,
        })),
      }),
    );
  };

  const handleRemoveImage = async (img, index) => {
    if (img?.uri) {
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      return;
    }

    if (!draftId) {
      ToastError("Please refresh and try again.");
      return;
    }

    const serverIndex =
      land.gallery.slice(0, index + 1).filter((f) => f.source === "server")
        .length - 1;

    if (serverIndex < 0) {
      ToastError("Invalid image index.");
      return;
    }

    try {
      const res = await postPropertyServices.deleteGalleryImageApi(
        "land",
        draftId,
        serverIndex,
      );

      const updatedGallery = land.gallery.filter((_, i) => i !== serverIndex);

      console.log(updatedGallery.length, "updatedGallery");

      if (res?.success) {
        dispatch(
          setProfileField({
            propertyType: "land",
            key: "gallery",
            value: updatedGallery,
          }),
        );
      }
    } catch (err) {
      const message =
        err?.message ||
        err?.response?.data?.message ||
        "Failed to delete image from server";
      console.log("Error when deleting image :", err);

      // ToastError(message);
    }
  };

  const handleLandSubmitDetails = () => {
    setShowErrors(true);

    // Convert amenities → string[] ONLY for validation
    const payloadForValidation = {
      ...land,
      amenities: Array.isArray(land?.amenities)
        ? land.amenities
            .map((a) => (typeof a === "string" ? a : a?.title))
            .filter(Boolean)
        : [],
    };

    const allImages = [...(land?.gallery || []), ...(files || [])];

    const normalizedImages = allImages.map((img) => ({
      uri: img.uri,
      name: img.name || img.fileName,
      type: img.type || img.mimeType,
      url: img.url,
    }));

    const validationResult = validateLandProfile(
      payloadForValidation,
      normalizedImages,
    );

    const ZodErrors = !validationResult.success
      ? validationResult.error.flatten().fieldErrors
      : {};
    setFieldErrors(ZodErrors);

    const isFormValid = validationResult.success;

    console.log("validation result land", validationResult);

    if (isFormValid) {
      dispatch(
        setProfileField({
          propertyType: "land",
          key: "gallery",
          value: normalizedImages,
        }),
      );
      dispatch(
        submitDetailsThunk({
          category: propertyType,
          id: draftId,
          payload: land,
        }),
      )
        .unwrap()
        .then((res) => {
          //  console.log("Result :", res);
          dispatch(setPercentage(res?.data?.completion?.percent));
          ToastSuccess("Property details submitted successfully");
          dispatch(nextStep());
        })
        .catch((error) => {
          console.log("🔥 FULL ERROR FROM API:", error);
        });
    }
  };

  useEffect(() => {
    dispatch(
      setProfileField({
        propertyType: "land",
        key: "dimensions",
        value: {
          length: land?.dimensions?.length || "",
          width: land?.dimensions?.width || "",
        },
      }),
    );
  }, []);
  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardOpen(true),
    );
    const hide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardOpen(false),
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const allImages = [...(land?.gallery || []), ...(files || [])];

  const SwitchRow = ({ label, value, onChange }) => (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
    >
      <Switch value={!!value} onValueChange={onChange} />
      <Text style={{ marginLeft: 8 }}>{label}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        style={[styles.container]}
        // contentContainerStyle={{ paddingBottom: keyboardOpen ? 135 : 40 }}
        //  contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 1. PLOT DETAILS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plot Details</Text>
          <Text style={styles.sectionSubTitle}>
            Provide essential information about the plot.
          </Text>

          {/* Layout Type */}
          <View style={styles.block}>
            <Text style={styles.label}>Layout Type</Text>

            <View style={styles.wrapRow}>
              {[
                { label: "Approved Layout", value: "approved-layout" },
                { label: "Un-approved Layout", value: "unapproved-layout" },
                { label: "Gated Layout", value: "gated-layout" },
                { label: "Individual Plot", value: "individual-plot" },
              ].map((item) => {
                const active = land.layoutType === item.value;

                return (
                  <Pressable
                    key={item.value}
                    onPress={() =>
                      dispatch(
                        setProfileField({
                          propertyType: "land",
                          key: "layoutType",
                          value: item.value,
                        }),
                      )
                    }
                    style={[styles.choiceBtn, active && styles.choiceBtnActive]}
                  >
                    <Text
                      style={[
                        styles.choiceText,
                        active && styles.choiceTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {showErrors && fieldErrors?.layoutType?.[0] && (
              <Text style={styles.errorText}>{fieldErrors.layoutType[0]}</Text>
            )}
          </View>

          {/* Facing & Approval */}
          <View style={styles.column}>
            <Dropdownui
              label="Facing"
              value={land.facing || null}
              onChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType: "land",
                    key: "facing",
                    value,
                  }),
                )
              }
              options={FACING_OPTIONS.map((t) => ({
                value: t,
                label: t.replace(/-/g, " "),
              }))}
            />

            {/* <Dropdownui
              label="Approved By Authority"
              value={land.approvedByAuthority || null}
              onChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType: "land",
                    key: "approvedByAuthority",
                    value,
                  }),
                )
              }
              options={LAND_APPROVAL_AUTHORITIES.map((a) => ({
                value: a,
                label: a.replace(/-/g, " ").toUpperCase(),
              }))}
            /> */}
          </View>
        </View>

        {/* AMENITIES */}
        <AmenitiesSelect
          label="Amenities"
          options={LAND_AMENITIES}
          value={land.amenities || []}
          onChange={(value) =>
            dispatch(
              setProfileField({
                propertyType: "land",
                key: "amenities",
                value,
              }),
            )
          }
        />

        <View>
          <Text style={styles.sectionTitle}>Legal & Survey Details</Text>
          <Text style={styles.sectionSubTitle}>
            Survey and zoning information
          </Text>
          <View style={styles.section}>
            <InputField
              label="Survey Number"
              // type="number"
              value={land.surveyNumber || ""}
              placeholder="e.g. 123/45/B"
              onChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType: "land",
                    key: "surveyNumber",
                    value,
                  }),
                )
              }
            />
            <InputField
              label="Land Use Zone"
              value={land.landUseZone || ""}
              placeholder="e.g. Residential Zone A"
              onChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType: "land",
                    key: "landUseZone",
                    value,
                  }),
                )
              }
            />
          </View>
        </View>

        {/* FEATURES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plot Features & Utilities</Text>
          <Text style={styles.sectionSubTitle}>
            Select all features available for this plot
          </Text>

          {[
            { key: "readyToConstruct", label: "Ready to Construct" },
            { key: "waterConnection", label: "Water Connection" },
            { key: "electricityConnection", label: "Electricity Connection" },
            { key: "cornerPlot", label: "Corner Plot" },
            { key: "fencing", label: "Fencing" },
          ].map((item) => {
            const enabled = Boolean(land[item.key]);

            return (
              <Pressable
                key={item.key}
                onPress={() =>
                  dispatch(
                    setProfileField({
                      propertyType: "land",
                      key: item.key,
                      value: !enabled,
                    }),
                  )
                }
                style={[styles.featureRow, enabled && styles.featureRowActive]}
              >
                <Text
                  style={[
                    styles.featureText,
                    enabled && styles.featureTextActive,
                  ]}
                >
                  {item.label}
                </Text>

                <Toggle
                  enabled={enabled}
                  onChange={(val) =>
                    dispatch(
                      setProfileField({
                        propertyType: "land",
                        key: item.key,
                        value: val,
                      }),
                    )
                  }
                />
              </Pressable>
            );
          })}
        </View>

        {/* Preview images after upload */}
        <Text style={styles.label}>Add photos of your property</Text>
        <View style={styles.previewContainer}>
          {/* Existing gallery images */}
          {allImages.map((img, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image
                key={index}
                source={{ uri: img.url || img.uri }}
                style={styles.previewImage}
              />
              <Pressable
                style={styles.removeIcon}
                onPress={() => handleRemoveImage(img, index)}
              >
                <Entypo name="cross" size={17} color="black" />
              </Pressable>
            </View>
          ))}
        </View>
        {/* Image Upload */}
        <Pressable style={styles.uploadBox} onPress={pickImages}>
          <ImageListIcon width={50} height={40} color="#82D1A3" />

          {files.length > 0 ? (
            <Text style={styles.uploadText}>
              {files.length} image(s) selected
            </Text>
          ) : (
            <View style={styles.uploadContent}>
              <Text style={styles.uploadText}>
                Tap to upload property images
              </Text>

              <Text style={styles.uploadText}>
                Max 5 photos upto size 10 MB • png, jpg
              </Text>
            </View>
          )}
          <Text style={styles.uploadButton}>Upload photos</Text>
        </Pressable>
        {showErrors && fieldErrors?.images ? (
          <Text style={styles.errorText}>{fieldErrors?.images}</Text>
        ) : null}
        <View style={[styles.warning]}>
          <Ionicons name="warning" size={17} color="orange" />
          <Text style={[styles.smallText]}>
            Postings with no photos attract less attention
          </Text>
        </View>

        <View style={styles.negotiableContainer}>
          <View>
            <Text style={styles.label}>Is the price negotiable?</Text>
            <Text style={styles.smallText}>
              Enable this if you are open to offers from buyers
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text
              style={{
                color: land.isPriceNegotiable ? "green" : "gray",
              }}
            >
              {land.isPriceNegotiable ? "YES" : "NO"}
            </Text>
            <Toggle
              enabled={land.isPriceNegotiable || false}
              onChange={(val) =>
                dispatch(
                  setProfileField({
                    propertyType: "land",
                    key: "isPriceNegotiable",
                    value: val,
                  }),
                )
              }
            />
          </View>
        </View>

        <TextArea
          label="Additional Description"
          value={land.description || ""}
          placeholder="e.g. This plot is located in a prime area with easy access to main roads..."
          maxLength={500}
          onChange={(value) =>
            dispatch(
              setProfileField({
                propertyType: "land",
                key: "description",
                value,
              }),
            )
          }
        />
        {showErrors && fieldErrors?.description && (
          <Text style={styles.errorText}>{fieldErrors.description}</Text>
        )}

        {/* Buttons */}
        <View style={styles.btnOptions}>
          <Pressable
            style={styles.backButton}
            onPress={() => dispatch(prevStep())}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={handleLandSubmitDetails}
            // if (isFormValid) {
            //   console.log("Location Data:", base);
            //   dispatch(nextStep());
            // }
          >
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LandProfile;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  sectionSubTitle: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#ecfdf5",
    borderColor: "#22c55e",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  cardSubTitle: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  sectionRow: {
    width: "48%",
  },
  subrow: {
    width: "45%",
  },

  label: {
    fontSize: 14,
    fontWeight: 500,
    color: "#374151",
    marginBottom: 8,
  },
  multiplyContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  multiply: {
    // alignSelf: "center",
    fontSize: 22,
    marginBottom: 10,
    opacity: 0.5,
  },
  block: {
    marginBottom: 12,
  },
  wrapRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  choiceBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
  },
  choiceBtnActive: {
    borderColor: "#22c55e",
    backgroundColor: "#dcfce7",
  },
  choiceText: {
    fontSize: 13,
    color: "#374151",
  },
  choiceTextActive: {
    color: "#15803d",
    fontWeight: 500,
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    marginBottom: 12,
  },
  featureRowActive: {
    borderColor: "#22c55e",
    backgroundColor: "#dcfce7",
  },
  featureText: {
    fontSize: 14,
  },
  featureTextActive: {
    color: "#15803d",
    fontWeight: "600",
  },
  previewImage: {
    width: "100%",
    borderRadius: 8,
    height: "100%",
  },

  previewContainer: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent:"flex-start",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  imageWrapper: {
    width: "30%",
    height: 100,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    position: "relative",
  },
  removeIcon: {
    position: "absolute",
    top: 3,
    right: 3,
    // backgroundColor: "rgba(133, 57, 57, 0.7)",
    // borderRadius: 12,
    // padding: 4,
  },
  uploadBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#82D1A3",
    backgroundColor: "#F1FCF5",
    borderRadius: 8,
    padding: 16,
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
    width: 150,
    alignItems: "center",
    textAlign: "center",
    padding: 5,
    marginTop: 8,
    borderRadius: 5,
    backgroundColor: "#22C55E",
  },
  warning: {
    backgroundColor: "#F1FCF5",
    paddingVertical: 8,
    borderRadius: 10,
    paddingHorizontal: 7,
    flexDirection: "row",
    gap: 8,
    marginTop: 15,
  },
  negotiableContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginVertical: 20,
    borderStyle: "dashed",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 7,
    color: "#374151",
  },
  errorText: {
    color: "#DC2626",
    marginLeft: 3,
    marginTop: 2,
    fontSize: 12,
  },

  smallText: {
    fontSize: 12,
    color: "#555",
  },
  btnOptions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    alignItems: "center",
    marginRight: 10,
    marginVertical: 15,
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
