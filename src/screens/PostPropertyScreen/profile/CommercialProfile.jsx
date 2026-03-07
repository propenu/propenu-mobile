import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Switch,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import { postPropertyServices } from "../../../services/postPropertyServices";

import DateInputField from "../../../components/ui/DateInputField";
import { submitPropertyThunk } from "../../../redux/thunk/SubmitPropertyThunk";
import { useAppDispatch } from "../../../redux/store/store";
import { useNavigation } from "@react-navigation/native";
import InputField from "../../../components/ui/InputField";
import CounterField from "../../../components/ui/CounterField";
import Dropdownui from "../../../components/ui/DropDownUI";
import Toggle from "../../../components/ui/ToggleSwitch";
import TextArea from "../../../components/ui/TextArea";
import AmenitiesSelect from "./AmenitiesSelect";
import { COMMERCIAL_AMENITIES } from "../constants/amenities";
import { ToastError, ToastSuccess } from "../../../utils/Toast";
import Entypo from "@expo/vector-icons/Entypo";
import { ImageListIcon } from "../../../../assets/svg/Logo";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { submitDetailsThunk } from "../../../redux/thunk/SubmitPropertyThunk";
import { setFiles as setFileStoreFiles } from "../../../lib/FileStore";
import {
  setProfileField,
  setBaseField,
  nextStep,
  prevStep,
  setPercentage,
} from "../../../redux/slice/PostPropertySlice";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { validateCommercialProfile } from "../../../zod/detailsZod/commercialProfileZod";

export const WALL_FINISH_STATUS = [
  "no-partitions",
  "brick-walls",
  "cement-block-walls",
  "plastered-walls",
];
export const PANTRY_TYPES = ["none", "shared", "no-shared"];
export const FLOORING_TYPES = [
  "bare-cement",
  "vitrified-tiles",
  "ceramic-tiles",
  "marble",
  "granite",
  "carpet",
  "epoxy",
  "wooden-laminate",
];

const FIRE_DATA = [
  { key: "fireExtinguisher", label: "Fire Extinguisher" },
  { key: "fireSprinklerSystem", label: "Sprinkler System" },
  { key: "fireHoseReel", label: "Fire Hose Reel" },
  { key: "fireHydrant", label: "Fire Hydrant" },
  { key: "smokeDetector", label: "Smoke Detector" },
  { key: "fireAlarmSystem", label: "Fire Alarm System" },
  { key: "fireControlPanel", label: "Fire Control Panel" },
  { key: "emergencyExitSignage", label: "Fire Exit Signs" },
];

const CommercialProfile = () => {
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const { commercial, propertyType, draftId } = useSelector(
    (state) => state.postProperty,
  );
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const [files, setFiles] = useState([]);
  const [showErrors, setShowErrors] = useState(false);
  const [fieldErrors, setFieldErrors] = useState(null);

  const insets = useSafeAreaInsets();
  /** Auto calculate price per sqft */
  useEffect(() => {
    const price = Number(commercial.price || commercial.expectedPrice);
    const area = Number(commercial.carpetArea);

    if (price > 0 && area > 0) {
      dispatch(
        setProfileField({
          propertyType: "commercial",
          key: "pricePerSqft",
          value: String(Math.round(price / area)),
        }),
      );
    }
  }, [commercial.price, commercial.expectedPrice, commercial.carpetArea]);

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
  const isInsidePremises = commercial?.pantry?.insidePremises ?? false;
  const isSharedPantry = commercial?.pantry?.shared ?? false;

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
        commercial.gallery
          .slice(0, index + 1)
          .filter((f) => f.source === "server").length - 1;
  
      if (serverIndex < 0) {
        ToastError("Invalid image index.");
        return;
      }
  
      try {
        const res = await postPropertyServices.deleteGalleryImageApi(
          "commercial",
          draftId,
          serverIndex,
        );
      
        const updatedGallery = commercial.gallery.filter(
        (_, i) => i !== serverIndex
      );
  
      console.log(updatedGallery.length,"updatedGallery")
  
        if (res?.success) {
          dispatch(
            setProfileField({
              propertyType: "commercial",
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
          console.log("Error when deleting image :", err)
  
        // ToastError(message);
      }
    };

  const handleCommercialDetials = () => {
    setShowErrors(true);

    // Convert amenities → string[] ONLY for validation
    const payloadForValidation = {
      ...commercial,
      amenities: Array.isArray(commercial?.amenities)
        ? commercial.amenities
            .map((a) => (typeof a === "string" ? a : a?.title))
            .filter(Boolean)
        : [],
    };


            const allImages = [...(commercial?.gallery || []), ...(files || [])]
            

    const validationResult = validateCommercialProfile(
      payloadForValidation,
      allImages.map((f) => f),
    );

    const ZodErrors = !validationResult.success
      ? validationResult.error.flatten().fieldErrors
      : {};
    setFieldErrors(ZodErrors);

    const isFormValid = validationResult.success;

    console.log("validation result commercial", validationResult);

    if (isFormValid) {
      dispatch(
        submitDetailsThunk({
          category: propertyType,
          id: draftId,
          payload: commercial,
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
  useEffect(() => {}, [files]);

   const allImages = [...(commercial?.gallery || []), ...(files || [])];

  const OptionButtons = ({ title, options, value, onSelect }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.optionRow}>
        {options.map((item) => {
          const active = value === item.value;
          return (
            <Pressable
              key={item.value}
              onPress={() => onSelect(item.value)}
              style={[styles.optionBtn, active && styles.optionBtnActive]}
            >
              <Text
                style={active ? styles.optionTextActive : styles.optionText}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
  const ToggleRow = ({ label, value, onChange }) => (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={!!value}
        onValueChange={onChange}
        trackColor={{ false: "#d1d5db", true: "#16a34a" }}
        thumbColor={value ? "#A7F3D0" : "#D1D5DB"}
      />
    </View>
  );

  return (
    // <ScrollView contentContainerStyle={styles.container}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        style={[styles.container]}
        // contentContainerStyle={{ paddingBottom: keyboardOpen ? 135 : 40 }}
        // contentContainerStyle={{ paddingBottom: insets.bottom }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Amenities */}
        <AmenitiesSelect
          label="Amenities"
          options={COMMERCIAL_AMENITIES}
          value={commercial.amenities || []}
          onChange={(value) =>
            dispatch(
              setProfileField({
                propertyType: "commercial",
                key: "amenities",
                value,
              }),
            )
          }
        />
        {showErrors && fieldErrors?.amenities ? (
          <Text style={styles.errorText}>{fieldErrors?.amenities}</Text>
        ) : null}
        {/* Parking */}
        <Text style={styles.sectionTitle}>Parking Details (Optional)</Text>
        <View style={styles.row}>
          <View style={styles.counteItem}>
            <CounterField
              label="Two Wheeler"
              value={commercial.parkingDetails?.twoWheeler || 0}
              onChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType: "commercial",
                    key: "parkingDetails",
                    value: { ...commercial.parkingDetails, twoWheeler: value },
                  }),
                )
              }
            />
          </View>
          <View style={styles.counteItem}>
            <CounterField
              label="Four Wheeler"
              value={commercial.parkingDetails?.fourWheeler || 0}
              onChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType: "commercial",
                    key: "parkingDetails",
                    value: { ...commercial.parkingDetails, fourWheeler: value },
                  }),
                )
              }
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Floor Details</Text>
          <Dropdownui
            label="Flooring Type"
            value={commercial.flooringType}
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "commercial",
                  key: "flooringType",
                  value,
                }),
              )
            }
            options={FLOORING_TYPES.map((t) => ({
              label: t.replace("-", " "),
              value: t,
            }))}
          />

          <View style={styles.row}>
            <View style={styles.counteItem}>
              <CounterField
                label="Floor Number"
                min={0}
                value={commercial.floorNumber ?? 0}
                onChange={(value) =>
                  dispatch(
                    setProfileField({
                      propertyType: "commercial",
                      key: "floorNumber",
                      value,
                    }),
                  )
                }
              />
            </View>
            <View style={styles.counteItem}>
              <CounterField
                label="Total Floors"
                min={0}
                value={commercial.totalFloors ?? 0}
                onChange={(value) =>
                  dispatch(
                    setProfileField({
                      propertyType: "commercial",
                      key: "totalFloors",
                      value,
                    }),
                  )
                }
              />
            </View>
          </View>
        </View>
        <View style={styles.rowWrap}>
          <Dropdownui
            label="Pantry Type"
            value={commercial.pantry?.type}
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "commercial",
                  key: "pantry",
                  value: { ...commercial.pantry, type: value },
                }),
              )
            }
            options={PANTRY_TYPES.map((t) => ({
              label: t.toUpperCase(),
              value: t,
            }))}
          />
          <View style={styles.row}>
            <View style={styles.counteItem}>
              <View style={styles.modularKitchen}>
                <Text style={styles.modularKitchenText}>Inside Premises</Text>

                <Pressable
                  onPress={() =>
                    dispatch(
                      setProfileField({
                        propertyType: "commercial",
                        key: "pantry",
                        value: {
                          ...commercial?.pantry,
                          insidePremises: !isInsidePremises, // 🔥 toggle
                        },
                      }),
                    )
                  }
                >
                  <View style={styles.modular}>
                    <Text style={styles.smallText}>Available</Text>

                    <View
                      style={[
                        styles.checkbox,
                        isInsidePremises && styles.checked,
                      ]}
                    >
                      {isInsidePremises && (
                        <Entypo name="check" size={14} color="white" />
                      )}
                    </View>
                  </View>
                </Pressable>
              </View>
            </View>
            <View style={styles.counteItem}>
              <View style={styles.modularKitchen}>
                <Text style={styles.modularKitchenText}>Shared Pantry</Text>

                <Pressable
                  onPress={() =>
                    dispatch(
                      setProfileField({
                        propertyType: "commercial",
                        key: "pantry",
                        value: {
                          ...commercial?.pantry,
                          shared: !isSharedPantry,
                        },
                      }),
                    )
                  }
                >
                  <View style={styles.modular}>
                    <Text style={styles.smallText}>Available</Text>

                    <View
                      style={[
                        styles.checkbox,
                        isSharedPantry && styles.checked,
                      ]}
                    >
                      {isSharedPantry && (
                        <Entypo name="check" size={14} color="white" />
                      )}
                    </View>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        {/* ========== BUILDING MANAGEMENT ========== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Building Management</Text>
          <Text style={styles.sectionSubtitle}>
            Provide building management details
          </Text>

          <InputField
            label="Management Company"
            value={commercial.buildingManagement?.managedBy || ""}
            placeholder="e.g. ABC Property Management"
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "commercial",
                  key: "buildingManagement",
                  value: {
                    ...commercial.buildingManagement,
                    managedBy: value,
                  },
                }),
              )
            }
          />

          <InputField
            label="Management Contact"
            value={commercial.buildingManagement?.contact || ""}
            placeholder="e.g. +91-XXXXXXXXXX"
            keyboardType="phone-pad"
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "commercial",
                  key: "buildingManagement",
                  value: {
                    ...commercial.buildingManagement,
                    contact: value,
                  },
                }),
              )
            }
          />
        </View>
        {/* ========== ZONING ========== */}
        <View style={styles.section}>
          <InputField
            label="Zoning Information"
            value={commercial.zoning || ""}
            placeholder="e.g. Commercial Zone B2"
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "commercial",
                  key: "zoning",
                  value,
                }),
              )
            }
          />
        </View>
        {/* ========== TENANT INFORMATION ========== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tenant Information</Text>
          <Text style={styles.sectionSubtitle}>
            Add details about current or previous tenants
          </Text>

          {(commercial.tenantInfo || []).map((tenant, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Tenant #{index + 1}</Text>
                <Pressable
                  onPress={() => {
                    const updated = commercial.tenantInfo.filter(
                      (_, i) => i !== index,
                    );
                    dispatch(
                      setProfileField({
                        propertyType: "commercial",
                        key: "tenantInfo",
                        value: updated,
                      }),
                    );
                  }}
                >
                  <Text style={styles.remove}>Remove</Text>
                </Pressable>
              </View>

              <InputField
                label="Tenant Name"
                value={tenant.currentTenant || ""}
                placeholder="e.g. ABC Corporation"
                onChange={(value) => {
                  const updated = [...commercial.tenantInfo];
                  updated[index] = { ...tenant, currentTenant: value };
                  dispatch(
                    setProfileField({
                      propertyType: "commercial",
                      key: "tenantInfo",
                      value: updated,
                    }),
                  );
                }}
              />

              <InputField
                label="Monthly Rent"
                value={tenant.rent || ""}
                placeholder="e.g. 50,000"
                keyboardType="numeric"
                onChange={(value) => {
                  const updated = [...commercial.tenantInfo];
                  updated[index] = {
                    ...tenant,
                    rent: value.replace(/\D/g, ""),
                  };
                  dispatch(
                    setProfileField({
                      propertyType: "commercial",
                      key: "tenantInfo",
                      value: updated,
                    }),
                  );
                }}
              />

              <DateInputField
                label="Lease Start Date"
                value={tenant.leaseStart}
                onChange={(value) => {
                  const updated = [...commercial.tenantInfo];
                  updated[index] = { ...tenant, leaseStart: value };
                  dispatch(
                    setProfileField({
                      propertyType: "commercial",
                      key: "tenantInfo",
                      value: updated,
                    }),
                  );
                }}
              />

              <DateInputField
                label="Lease End Date"
                value={tenant.leaseEnd}
                onChange={(value) => {
                  const updated = [...commercial.tenantInfo];
                  updated[index] = { ...tenant, leaseEnd: value };
                  dispatch(
                    setProfileField({
                      propertyType: "commercial",
                      key: "tenantInfo",
                      value: updated,
                    }),
                  );
                }}
              />
            </View>
          ))}

          <Pressable
            style={styles.addButton}
            onPress={() =>
              dispatch(
                setProfileField({
                  propertyType: "commercial",
                  key: "tenantInfo",
                  value: [
                    ...(commercial.tenantInfo || []),
                    {
                      currentTenant: "",
                      rent: "",
                      leaseStart: "",
                      leaseEnd: "",
                    },
                  ],
                }),
              )
            }
          >
            <Text style={styles.addButtonText}>+ Add Tenant</Text>
          </Pressable>
        </View>
        {/* ========== FIRE SAFETY ========== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fire Safety & Compliance</Text>
          <Text style={styles.sectionSubtitle}>
            Select all fire safety measures available
          </Text>

          {FIRE_DATA.map((item) => {
            const enabled = !!commercial.fireSafety?.[item.key];

            return (
              <ToggleRow
                key={item.key}
                label={item.label}
                value={enabled}
                onChange={(val) =>
                  dispatch(
                    setProfileField({
                      propertyType: "commercial",
                      key: "fireSafety",
                      value: {
                        ...commercial.fireSafety,
                        [item.key]: val,
                      },
                    }),
                  )
                }
              />
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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Text
              style={{
                color: commercial.isPriceNegotiable ? "#27AE60" : "gray",
              }}
            >
              {commercial.isPriceNegotiable ? "YES" : "NO"}
            </Text>
            <Toggle
              enabled={commercial.isPriceNegotiable || false}
              onChange={(val) =>
                dispatch(
                  setProfileField({
                    propertyType: "commercial",
                    key: "isPriceNegotiable",
                    value: val,
                  }),
                )
              }
            />
          </View>
        </View>
        {/* Description */}
        <TextArea
          label="Property Description"
          placeholder="e.g. Well-maintained commercial space with ample natural light, power backup, and easy access to main road."
          value={commercial.description}
          maxLength={500}
          onChange={(value) =>
            dispatch(
              setProfileField({
                propertyType: "commercial",
                key: "description",
                value,
              }),
            )
          }
        />
        <View>
          {showErrors && fieldErrors?.description ? (
            <Text style={styles.errorText}>{fieldErrors?.description}</Text>
          ) : null}
        </View>
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
            onPress={handleCommercialDetials}
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

export default CommercialProfile;
const styles = StyleSheet.create({
  container: {
    padding: 10,
    // paddingBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 10,
  },
  furnishing: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginBottom: 15,
  },
  counteItem: {
    width: "48%",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginVertical: 8,
    color: "#374151",
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

  smallText: {
    fontSize: 12,
    color: "#555",
  },

  optionActive: {
    borderColor: "#22C55E",
    backgroundColor: "#e8f5e9",
  },
  optionActiveText: {
    fontSize: 14,
    fontWeight: 500,
  },
  modularKitchen: {
    // paddingVertical: 7,
    borderRadius: 10,
    marginBottom: 15,
  },
  modularKitchenText: {
    fontSize: 14,
    fontWeight: 500,
    color: "#374151",
  },
  modular: {
    marginTop: 7,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#999",
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },
  tick: {
    width: 10,
    height: 10,
    backgroundColor: "#fff",
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
  section: { marginBottom: 10 },

  sectionSubtitle: { fontSize: 12, color: "#6b7280", marginBottom: 12 },

  card: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  cardTitle: { fontSize: 13, fontWeight: "500" },

  addButton: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#d1d5db",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "#4b5563", fontSize: 14 },

  fireCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  fireCardActive: {
    borderColor: "#16a34a",
    backgroundColor: "#dcfce7",
  },
  fireText: { fontSize: 14, color: "#374151" },
  fireTextActive: { color: "#15803d", fontWeight: "600" },
  rowWrap: { gap: 12 },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 13,
  },
  toggleLabel: {
    color: "#374151",
  },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  optionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#fff",
  },

  optionBtnActive: {
    borderColor: "#16a34a",
    backgroundColor: "#dcfce7",
  },
  optionText: { color: "#374151" },
  optionTextActive: { color: "#16a34a", fontWeight: "600" },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  remove: { color: "#dc2626", fontSize: 12 },

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
