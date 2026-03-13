import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  Switch,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import { postPropertyServices } from "../../../services/postPropertyServices";
import { useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import { submitDetailsThunk } from "../../../redux/thunk/SubmitPropertyThunk";
import { useAppDispatch } from "../../../redux/store/store";
import { AGRICULTURE_AMENITIES } from "../constants/amenities";
import InputWithUnit from "../../../components/ui/InputWithUnit";
import { ToastError, ToastSuccess } from "../../../utils/Toast";
import InputField from "../../../components/ui/InputField";
import CounterField from "../../../components/ui/CounterField";
import Dropdownui from "../../../components/ui/DropDownUI";
import Toggle from "../../../components/ui/ToggleSwitch";
import TextArea from "../../../components/ui/TextArea";
import AmenitiesSelect from "./AmenitiesSelect";
import { setFiles as setFileStoreFiles } from "../../../lib/FileStore";
import { ImageListIcon } from "../../../../assets/svg/Logo";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {
  setBaseField,
  setProfileField,
  nextStep,
  prevStep,
  setPercentage,
} from "../../../redux/slice/PostPropertySlice";
import { validateAgriculturalProfile } from "../../../zod/detailsZod/agriculturalProfileZod";
const AREA_UNITS = ["sqft", "sqmt", "acre", "guntha", "cent", "hectare"];
const ROAD_WIDTH_UNITS = ["ft", "meter"];

const PROPERTY_TYPES = [
  "agricultural-land",
  "farm-land",
  "orchard-land",
  "plantation",
  "wet-land",
  "dry-land",
  "ranch",
  "dairy-farm",
];

const PROPERTY_SUB_TYPES = [
  "irrigated",
  "non-irrigated",
  "fenced",
  "unfenced",
  "with-well",
  "with-borewell",
  "with-electricity",
  "near-road",
  "inside-village",
  "farmhouse-permission",
];

const SOIL_TYPES = [
  "clay",
  "sandy",
  "loamy",
  "red-soil",
  "black-soil",
  "alluvial",
];
const IRRIGATION_TYPES = [
  "canal",
  "bore-well",
  "tube-well",
  "open-well",
  "sprinkler",
  "drip",
  "rain-fed",
];
const WATER_SOURCES = [
  "bore-well",
  "open-well",
  "tube-well",
  "canal",
  "river",
  "tank",
  "pond",
];
const ACCESS_ROAD_TYPES = ["paved", "unpaved", "gravel", "concrete", "earthen"];
const AGRICULTURAL_FEATURES = [
  {
    key: "boundaryWall",
    label: "Boundary Wall",
  },
  {
    key: "electricityConnection",
    label: "Electricity Connection",
  },
];
const AgriculturalProfile = () => {
  const dispatch = useAppDispatch();
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const { agricultural, propertyType, draftId, base } = useSelector(
    (state) => state.postProperty,
  );
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [files, setFiles] = useState([]);
  const [fieldErrors, setFieldErrors] = useState(null);
  const [showErrors, setShowErrors] = useState(false);

  const setField = (key, value) => {
    dispatch(
      setProfileField({
        propertyType: "agricultural",
        key,
        value,
      }),
    );
  };

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

  const pickImages = async () => {
    // Need user permission to get images
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
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
      agricultural.gallery
        .slice(0, index + 1)
        .filter((f) => f.source === "server").length - 1;

    if (serverIndex < 0) {
      ToastError("Invalid image index.");
      return;
    }

    try {
      const res = await postPropertyServices.deleteGalleryImageApi(
        "agricultural",
        draftId,
        serverIndex,
      );

      const updatedGallery = agricultural.gallery.filter(
        (_, i) => i !== serverIndex,
      );

      console.log(updatedGallery.length, "updatedGallery");

      if (res?.success) {
        dispatch(
          setProfileField({
            propertyType: "agricultural",
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

  const handleAgriculturalSubmitDetails = () => {
    setShowErrors(true);

    const allImages = [...(agricultural?.gallery || []), ...(files || [])];

    const normalizedImages = allImages.map((img) => ({
      uri: img.uri,
      name: img.name || img.fileName,
      type: img.type || img.mimeType,
      url: img.url,
    }));
    const validationResult = validateAgriculturalProfile(
      agricultural,
      normalizedImages,
    );

    const ZodErrors = !validationResult.success
      ? validationResult.error.flatten().fieldErrors
      : {};
    setFieldErrors(ZodErrors);

    const isFormValid = validationResult.success;

    // console.log("validation result agricultural", validationResult);

    if (!isFormValid && !draftId) {
      ToastError("Something went wrong");
      return;
    }

    if (isFormValid) {
      dispatch(
        setProfileField({
          propertyType: "agricultural",
          key: "gallery",
          value: normalizedImages,
        }),
      );
      dispatch(
        submitDetailsThunk({
          category: propertyType,
          id: draftId,
          payload: agricultural,
        }),
      )
        .unwrap()
        .then((res) => {
          // console.log("Result :", res);
          dispatch(setPercentage(res?.data?.completion?.percent));
          ToastSuccess("Profile details submitted successfully");
          dispatch(nextStep());
        })
        .catch((error) => {
          console.log("🔥 FULL ERROR FROM API:", error);
        });
    }
  };

  const allImages = [...(agricultural?.gallery || []), ...(files || [])];
  console.log(allImages, "allImages");

  const Section = ({ title, subtitle, children }) => (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
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
        // contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={[styles.sectionTitle]}>Property Basics</Text>
          <Text style={styles.sectionSubTitle}>
            Enter the size, road access, and plantation age of the land
          </Text>
          <View style={styles.column}>
            <View style={styles.plantation}>
              <CounterField
                label="Plantation Age (years)"
                value={agricultural.plantationAge || 0}
                min={0}
                onChange={(value) =>
                  dispatch(
                    setProfileField({
                      propertyType: "agricultural",
                      key: "plantationAge",
                      value,
                    }),
                  )
                }
              />
            </View>
          </View>
        </View>
        {/* Amenities */}
        <AmenitiesSelect
          label="Amenities"
          options={AGRICULTURE_AMENITIES}
          value={agricultural.amenities || []}
          onChange={(value) =>
            dispatch(
              setProfileField({
                propertyType: "agricultural",
                key: "amenities",
                value,
              }),
            )
          }
        />

        <View>
          <Text style={styles.sectionTitle}>Soil & Irrigation</Text>
          <Text style={styles.sectionSubTitle}>
            Select soil type, irrigation method, and available water sources
          </Text>
        </View>
        <View style={styles.columnStart}>
          <Dropdownui
            label="Soil Type"
            value={agricultural.soilType}
            options={SOIL_TYPES.map((t) => ({
              label: t.replace("-", " ").toUpperCase(),
              value: t,
            }))}
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "agricultural",
                  key: "soilType",
                  value,
                }),
              )
            }
          />

          <Dropdownui
            label="Irrigation Type"
            value={agricultural.irrigationType}
            options={IRRIGATION_TYPES.map((t) => ({
              label: t.replace("-", " ").toUpperCase(),
              value: t,
            }))}
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "agricultural",
                  key: "irrigationType",
                  value,
                }),
              )
            }
          />

          <Dropdownui
            label="Water Source"
            value={agricultural.waterSource}
            options={WATER_SOURCES.map((t) => ({
              label: t.replace("-", " ").toUpperCase(),
              value: t,
            }))}
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "agricultural",
                  key: "waterSource",
                  value,
                }),
              )
            }
          />
        </View>

        <View>
          <Text style={styles.sectionTitle}>Borewell Details</Text>
          <Text style={styles.sectionSubTitle}>
            Provide borewell count, depth, yield, and drilling year
          </Text>
        </View>
        <View style={styles.columnStart}>
          <View style={styles.plantation}>
            <CounterField
              label="Number of Borewells"
              value={agricultural.numberOfBorewells || 0}
              min={0}
              onChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType: "agricultural",
                    key: "numberOfBorewells",
                    value,
                  }),
                )
              }
            />
          </View>

          {agricultural?.numberOfBorewells > 0 && (
            <View>
              <InputField
                label="Borewell Depth (meters)"
                type="number"
                value={agricultural.borewellDetails?.depthMeters || ""}
                placeholder="e.g. 100"
                onChange={(value) =>
                  dispatch(
                    setProfileField({
                      propertyType: "agricultural",
                      key: "borewellDetails",
                      value: {
                        ...agricultural.borewellDetails,
                        depthMeters: Number(value) || 0,
                      },
                    }),
                  )
                }
              />
              {showErrors &&
                fieldErrors?.borewellErrors?.depthMeters?._errors?.[0] && (
                  <Text style={styles.errorText}>
                    {fieldErrors?.borewellErrors.depthMeters._errors[0]}
                  </Text>
                )}
              <InputField
                label="Yield (LPM)"
                type="number"
                value={agricultural.borewellDetails?.yieldLpm || ""}
                placeholder="e.g. 5000"
                onChange={(value) =>
                  dispatch(
                    setProfileField({
                      propertyType: "agricultural",
                      key: "borewellDetails",
                      value: {
                        ...agricultural.borewellDetails,
                        yieldLpm: Number(value) || 0,
                      },
                    }),
                  )
                }
              />
              {showErrors &&
                fieldErrors?.borewellErrors?.yieldLpm?._errors?.[0] && (
                  <Text style={styles.errorText}>
                    {fieldErrors?.borewellErrors.yieldLpm._errors[0]}
                  </Text>
                )}
              <InputField
                label="Drilled Year"
                type="number"
                value={agricultural.borewellDetails?.drilledYear || ""}
                placeholder="e.g. 2020"
                onChange={(value) =>
                  dispatch(
                    setProfileField({
                      propertyType: "agricultural",
                      key: "borewellDetails",
                      value: {
                        ...agricultural.borewellDetails,
                        drilledYear: Number(value) || 0,
                      },
                    }),
                  )
                }
              />
              {showErrors &&
                fieldErrors?.borewellErrors?.drilledYear?._errors?.[0] && (
                  <Text style={styles.errorText}>
                    {borewellErrors.drilledYear._errors[0]}
                  </Text>
                )}
            </View>
          )}
        </View>

        <View>
          <Text style={styles.sectionTitle}>Crop Details</Text>
          <Text style={styles.sectionSubTitle}>
            Mention current crops, land usage, and suitable cultivation types
          </Text>
        </View>
        <View style={styles.columnStart}>
          <InputField
            label="Current Crop"
            value={agricultural.currentCrop || ""}
            placeholder="e.g. Sugarcane"
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "agricultural",
                  key: "currentCrop",
                  value,
                }),
              )
            }
          />
          <InputField
            label="Suitable For"
            value={agricultural.suitableFor || ""}
            placeholder="e.g. Cotton, Wheat"
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "agricultural",
                  key: "suitableFor",
                  value,
                }),
              )
            }
          />
          <InputField
            label="Land Shape"
            value={agricultural.landShape || ""}
            placeholder="e.g. Square, Rectangular"
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "agricultural",
                  key: "landShape",
                  value,
                }),
              )
            }
          />
        </View>
        <View>
          <Text style={styles.sectionTitle}>Legal & Accessibility</Text>
          <Text style={styles.sectionSubTitle}>
            Provide information about purchase restrictions and access road type
          </Text>
        </View>
        <View style={styles.columnStart}>
          <InputField
            label="State Purchase Restrictions"
            value={agricultural.statePurchaseRestrictions || ""}
            placeholder="e.g. None, Restricted"
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "agricultural",
                  key: "statePurchaseRestrictions",
                  value,
                }),
              )
            }
          />
          {showErrors && fieldErrors?.statePurchaseRestrictions && (
            <Text style={styles.errorText}>
              {fieldErrors.statePurchaseRestrictions}
            </Text>
          )}
          <InputField
            label="Access Road Type"
            value={agricultural.accessRoadType || ""}
            placeholder="e.g. Paved, Unpaved"
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "agricultural",
                  key: "accessRoadType",
                  value,
                }),
              )
            }
          />
          {showErrors && fieldErrors?.accessRoadType && (
            <Text style={styles.errorText}>{fieldErrors.accessRoadType}</Text>
          )}
        </View>
        <View>
          <Text style={styles.sectionTitle}>Site Features</Text>
          <Text style={styles.sectionSubTitle}>
            Specify available infrastructure and on-site facilities
          </Text>
        </View>
        <View style={styles.columnStart}>
          {AGRICULTURAL_FEATURES.map((item) => {
            const enabled = agricultural[item.key] || false;

            return (
              <Pressable
                key={item.key}
                style={[styles.featureRow, enabled && styles.featureRowActive]}
                onPress={() =>
                  dispatch(
                    setProfileField({
                      propertyType: "agricultural",
                      key: item.key,
                      value: !enabled,
                    }),
                  )
                }
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
                  onChange={(value) =>
                    dispatch(
                      setProfileField({
                        propertyType: "agricultural",
                        key: item.key,
                        value,
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

          {allImages.length > 0 ? (
            <Text style={styles.uploadText}>
              {allImages.length} image(s) selected
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
                color: agricultural.isPriceNegotiable ? "green" : "gray",
              }}
            >
              {agricultural.isPriceNegotiable ? "YES" : "NO"}
            </Text>
            <Toggle
              enabled={agricultural.isPriceNegotiable || false}
              onChange={(val) =>
                dispatch(
                  setProfileField({
                    propertyType: "agricultural",
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
          value={agricultural.description || ""}
          placeholder="e.g. This plot is located in a prime area with easy access to main roads..."
          maxLength={500}
          onChange={(value) =>
            dispatch(
              setProfileField({
                propertyType: "agricultural",
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
            onPress={handleAgriculturalSubmitDetails}
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
export default AgriculturalProfile;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingBottom: 40,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
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
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 12,
  },
  column: {
    gap: 10,
    marginBottom: 5,
  },
  columnStart: {
    marginBottom: 10,
  },
  plantation: {
    width: "40%",
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
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderColor: "#d1d5db", // gray-300
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },

  cardActive: {
    borderColor: "#22c55e", // green-500
    backgroundColor: "#ecfdf5", // green-50
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Android shadow
  },
  toggleHolder: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  pressed: {
    opacity: 0.85,
  },

  cardText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151", // gray-700
  },

  cardTextActive: {
    color: "#166534", // green-800
  },
  negotiableBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#d1d5db",
    borderRadius: 8,
    marginTop: 12,
  },
  activeBox: {
    borderColor: "#16a34a",
    backgroundColor: "#ecfdf5",
  },
  negotiableText: {
    fontSize: 14,
    fontWeight: "500",
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
