import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  nextStep,
  setBaseField,
  setProfileField,
  setPropertyType,
  setPercentage,
} from "../../../redux/slice/PostPropertySlice";
import { getItem } from "../../../utils/Storage";
import { setFiles as setFileStoreFiles } from "../../../lib/FileStore";
import InputField from "../../../components/ui/InputField";
import {
  RESIDENTIAL_PROPERTY_OPTIONS,
  COMMERCIAL_PROPERTY_OPTIONS,
  COMMERCIAL_SUBTYPE_MAP,
  LAND_PROPERTY_KEYS,
  LAND_PROPERTY_OPTIONS,
  LAND_PROPERTY_SUBTYPES,
  AGRICULTURAL_PROPERTY_OPTIONS,
  AGRICULTURAL_PROPERTY_SUBTYPES,
} from "../../PostPropertyScreen/constants/subTypes";
import { validateBasicDetails } from "../../../zod/basicDetailsZod";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../../context/AuthContext";
import CounterField from "../../../components/ui/CounterField";
import Dropdownui from "../../../components/ui/DropDownUI";
import DateInputField from "../../../components/ui/DateInputField";
import PricingDetails from "../../../components/ui/PricingDetails";
import { submitBasicThunk } from "../../../redux/thunk/SubmitPropertyThunk";
import { ToastSuccess } from "../../../utils/Toast";

export default function BasicDetailsStep() {
  const {
    propertyType,
    base,
    residential,
    commercial,
    land,
    draftId,
    agricultural,
  } = useSelector((state) => state.postProperty);

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { isLoggedIn, userDetails, isChecking } = useAuth();

  const [files, setFiles] = useState([]);
  const [showErrors, setShowErrors] = useState(false);
  const [isShowPhoneNumber, setIsPhoneNumber] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [showFurnishingFacing, setShowFurnishingFacing] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const dispatch = useDispatch();

  const listingOptions = [
    { label: "Sale", value: "sale" },
    { label: "Rent / Lease", value: "rent" },
  ];
  const WALL_FINISH_STATUS = [
    "no-partitions",
    "brick-walls",
    "cement-block-walls",
    "plastered-walls",
  ];
  const property = ["residential", "commercial", "land", "agricultural"];
  const FACING_TYPES = ["North", "South", "East", "West"];
  const categoryState =
    propertyType === "residential"
      ? residential
      : propertyType === "commercial"
        ? commercial
        : propertyType === "land"
          ? land
          : propertyType === "agricultural"
            ? agricultural
            : null;

  const profileData =
    propertyType === "residential"
      ? residential
      : propertyType === "commercial"
        ? commercial
        : propertyType === "land"
          ? land
          : propertyType === "agricultural"
            ? agricultural
            : null;

  const validationResult = validateBasicDetails(
    {
      ...base,
      ...profileData,
      propertyType: profileData?.propertyType || base.propertyType,
    },
    propertyType,
  );
  // console.log(validationResult, "PPPP");
  const isFormValid = validationResult.success;

  const fieldErrors =
    showErrors && !validationResult.success
      ? validationResult.error.flatten().fieldErrors
      : {};

  const handleSelect = (type) => {
    dispatch(setPropertyType(type));
  };

  useEffect(() => {
    const userData = async () => {
      try {
        const data = await getItem("user");

        if (!data) {
          setIsPhoneNumber(true);
          return;
        }

        const parsedData = JSON.parse(data);

        if (!parsedData?.name) {
          setIsPhoneNumber(true);
        }
      } catch (error) {
        console.log("Error reading user from storage:", error);
        setIsPhoneNumber(false);
      }
    };

    userData();
  }, []);
  useEffect(() => {
    if (propertyType === "residential") {
      if (residential.propertyType) setShowRoomDetails(true);
      if (
        (residential.bedrooms && residential.bedrooms > 1) ||
        (residential.bathrooms && residential.bathrooms > 1) ||
        (residential.balconies && residential.balconies > 0) ||
        residential.furnishing ||
        residential.facing
      ) {
        setShowFurnishingFacing(true);
      }
      if (residential.facing) setShowPricing(true);
    } else {
      // Reset when switching away from residential
      setShowRoomDetails(false);
      setShowFurnishingFacing(false);
      setShowPricing(false);
    }
  }, [propertyType, residential]);

  const pickImages = async () => {
    // Ask permission
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission required to access images");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      // selectionLimit: 5, // iOS 14+ & Android supported
      quality: 0.8,
    });

    if (!result.canceled) {
      setFiles(result.assets);
      console.log("result assets", result.assets);
      // OPTIONAL: save metadata to redux
      dispatch(
        setBaseField({
          key: "galleryFiles",
          value: result.assets.map((img) => ({
            uri: img.uri,
            name: img.fileName || "image.jpg",
            type: img.type,
          })),
        }),
      );
      setFileStoreFiles("postProperty", result.assets);
    }
  };

  const subTypes =
    propertyType === "residential"
      ? RESIDENTIAL_PROPERTY_OPTIONS
      : propertyType === "commercial"
        ? COMMERCIAL_PROPERTY_OPTIONS
        : propertyType === "land"
          ? LAND_PROPERTY_OPTIONS
          : propertyType === "agricultural"
            ? AGRICULTURAL_PROPERTY_OPTIONS
            : [];

  const selectedCommercialType = commercial.propertyType;

  const commercialSubTypes =
    propertyType === "commercial" &&
    selectedCommercialType &&
    COMMERCIAL_SUBTYPE_MAP[selectedCommercialType]
      ? COMMERCIAL_SUBTYPE_MAP[selectedCommercialType]
      : [];

  const landSubTypes = propertyType === "land" ? LAND_PROPERTY_SUBTYPES : [];
  const agriculturalSubTypes =
    propertyType === "agricultural" ? AGRICULTURAL_PROPERTY_SUBTYPES : [];

  const handleSubmitBasic = () => {
    setShowErrors(true);
    console.log("isformvalid and draft id checking :", isFormValid, draftId);

    if (!isFormValid || !draftId) {
      console.log("Validation failed", fieldErrors);
      return;
    }

    dispatch(
      submitBasicThunk({
        category: propertyType,
        id: draftId,
        data: {
          ...base,
          ...profileData,
        },
      }),
    )
      .unwrap()
      .then((result) => {
        console.log("Thunk result:", result, result.data.completion.percent);
        dispatch(setPercentage(result?.data?.completion?.percent));

        ToastSuccess("Basic details submitted successfully");
        dispatch(nextStep());
      })
      .catch((err) => {
        console.error("Basic step failed", err);
      });
  };

  const OptionButton = ({ label, active, onPress }) => (
    <>
      <Pressable
        onPress={onPress}
        style={[styles.optionButton, active && styles.optionActive]}
      >
        <Text style={[styles.optionText, active && styles.optionTextActive]}>
          {label}
        </Text>
      </Pressable>
    </>
  );

  console.log("RESIDENTIAL  :0", residential.facing);
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid
      extraScrollHeight={20}
      keyboardShouldPersistTaps="handled"
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.container,
          // { paddingBottom: insets.bottom  },
        ]}
      >
        {/* Listing Type */}
        <Text style={styles.label}>Listing Type</Text>

        <View style={styles.listngTypeRow}>
          {listingOptions.map((option) => {
            const isActive = base.listingType === option.value;

            return (
              <Pressable
                key={option.value}
                onPress={() =>
                  dispatch(
                    setBaseField({
                      key: "listingType",
                      value: option.value,
                    }),
                  )
                }
                style={[styles.optionBtn, isActive && styles.optionBtnActive]}
              >
                <Text
                  style={[
                    styles.optionText,
                    isActive && styles.optionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {showErrors && fieldErrors?.listingType && (
          <Text style={styles.errorText}>{fieldErrors.listingType}</Text>
        )}

        {/* Property Type */}
        <Text style={styles.label}>Select your property type</Text>

        <View style={styles.rowWrap}>
          {property.map((type) => {
            const selected = propertyType === type;

            return (
              <Pressable
                key={type}
                onPress={() => handleSelect(type)}
                style={styles.radioItem}
              >
                <View
                  style={[
                    styles.radioOuter,
                    selected && styles.radioOuterActive,
                  ]}
                >
                  {selected && <View style={styles.radioInner} />}
                </View>

                <Text style={styles.radioLabel}>
                  {type === "land" ? "Plot / Land" : type}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Property Sub-Type */}
        {subTypes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Property Sub-Type</Text>

            <View style={styles.grid}>
              {subTypes.map((sub) => {
                const isSelected = categoryState?.propertyType === sub.key;

                return (
                  <Pressable
                    key={sub.key}
                    onPress={() => {
                      if (propertyType) {
                        dispatch(
                          setProfileField({
                            propertyType: propertyType,
                            key: "propertyType",
                            value: sub.key,
                          }),
                        );
                        if (propertyType === "residential") {
                          setShowRoomDetails(true);
                        }
                      }
                    }}
                    style={[styles.card, isSelected && styles.cardActive]}
                  >
                    <Text style={styles.cardIcon}>{sub.icon}</Text>
                    <Text
                      style={[
                        styles.cardText,
                        isSelected && styles.cardTextActive,
                      ]}
                    >
                      {sub.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {fieldErrors?.propertyType ? (
              <Text style={styles.errorText}>{fieldErrors?.propertyType}</Text>
            ) : null}
          </View>
        )}

        {/* Commercial Sub Types */}
        {commercialSubTypes.length > 0 && (
          <View style={styles.specificType}>
            <Text style={styles.label}>
              Specific Type for {selectedCommercialType?.replace("-", " ")}
            </Text>

            <View style={styles.rowWrap}>
              {commercialSubTypes.map((subType) => {
                const isSelected = commercial.commercialSubType === subType;

                return (
                  <Pressable
                    key={subType}
                    onPress={() =>
                      dispatch(
                        setProfileField({
                          propertyType: "commercial",
                          key: "commercialSubType",
                          value: subType,
                        }),
                      )
                    }
                    style={[
                      styles.optionBtn,
                      isSelected && styles.optionBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextActive,
                      ]}
                    >
                      {subType.replace("-", " ").toUpperCase()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {fieldErrors?.commercialSubType ? (
              <Text style={styles.errorText}>
                {fieldErrors?.commercialSubType}
              </Text>
            ) : null}
          </View>
        )}

        {/* Land Sub Types */}
        {landSubTypes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Land Characteristics</Text>

            <View style={styles.rowWrap}>
              {landSubTypes.map((subType) => {
                const isSelected = land.landSubType === subType;

                return (
                  <Pressable
                    key={subType}
                    onPress={() =>
                      dispatch(
                        setProfileField({
                          propertyType: "land",
                          key: "landSubType",
                          value: subType,
                        }),
                      )
                    }
                    style={[
                      styles.optionBtn,
                      isSelected && styles.optionBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextActive,
                      ]}
                    >
                      {subType.replace(/-/g, " ").toUpperCase()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {agriculturalSubTypes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Agricultural Characteristics</Text>

            <View style={styles.rowWrap}>
              {agriculturalSubTypes.map((subType) => {
                const isSelected = agricultural.agriculturalSubType === subType;

                return (
                  <Pressable
                    key={subType}
                    onPress={() =>
                      dispatch(
                        setProfileField({
                          propertyType: "agricultural",
                          key: "agriculturalSubType",
                          value: subType,
                        }),
                      )
                    }
                    style={[
                      styles.optionBtn,
                      isSelected && styles.optionBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextActive,
                      ]}
                    >
                      {subType.replace(/-/g, " ").toUpperCase()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {fieldErrors?.agriculturalSubType ? (
              <Text style={styles.errorText}>
                {fieldErrors?.agriculturalSubType}
              </Text>
            ) : null}
          </View>
        )}

        <View style={styles.section}>
          {/* Counter Fields */}

          {propertyType === "residential" && showRoomDetails && (
            <View style={styles.counterGrid}>
              <View style={styles.counterItem}>
                <CounterField
                  label="Bedrooms"
                  value={residential.bedrooms || residential.bhk || 1}
                  min={1}
                  onChange={(value) => {
                    (dispatch(
                      setProfileField({
                        propertyType: "residential",
                        key: "bedrooms",
                        value,
                      }),
                    ),
                      setShowFurnishingFacing(true));
                  }}
                />
              </View>

              <View style={styles.counterItem}>
                <CounterField
                  label="Bathrooms"
                  value={residential.bathrooms || 1}
                  min={1}
                  onChange={(value) => {
                    (dispatch(
                      setProfileField({
                        propertyType: "residential",
                        key: "bathrooms",
                        value,
                      }),
                    ),
                      setShowFurnishingFacing(true));
                  }}
                />
              </View>

              <View style={styles.counterItem}>
                <CounterField
                  label="Balconies"
                  value={residential.balconies || 0}
                  min={0}
                  onChange={(value) => {
                    (dispatch(
                      setProfileField({
                        propertyType: "residential",
                        key: "balconies",
                        value,
                      }),
                    ),
                      setShowFurnishingFacing(true));
                  }}
                />
              </View>
            </View>
          )}

          {showFurnishingFacing && (
            <>
              <Text style={styles.furnish}>Furnishing</Text>
              <View style={styles.row}>
                {[
                  { label: "Furnished", value: "fully-furnished" },
                  { label: "Semi Furnished", value: "semi-furnished" },
                  { label: "Unfurnished", value: "unfurnished" },
                ].map((item) => (
                  <OptionButton
                    key={item.value}
                    label={item.label}
                    active={residential.furnishing === item.value}
                    onPress={() => {
                      dispatch(
                        setProfileField({
                          propertyType: "residential",
                          key: "furnishing",
                          value: item.value,
                        }),
                      );
                    }}
                  />
                ))}
              </View>
              {fieldErrors?.furnishing ? (
                <Text style={styles.errorText}>{fieldErrors.furnishing}</Text>
              ) : null}

              <View style={styles.facingDropDown}>
                <Dropdownui
                  label="Facing"
                  value={residential?.facing || null}
                  onChange={(value) => {
                    dispatch(
                      setProfileField({
                        propertyType: "residential",
                        key: "facing",
                        value,
                      }),
                    );

                    setShowPricing(true);
                  }}
                  options={FACING_TYPES.map((t) => ({ value: t, label: t }))}
                  placeholder="Select"
                />
              </View>
            </>
          )}

          {propertyType === "commercial" && commercial.commercialSubType && (
            <>
              <View style={styles.counterGrid}>
                <View style={styles.counterItems2}>
                  <CounterField
                    label="Cabins"
                    value={commercial.cabins || 0}
                    onChange={(value) =>
                      dispatch(
                        setProfileField({
                          propertyType: "commercial",
                          key: "cabins",
                          value,
                        }),
                      )
                    }
                  />
                </View>

                <View style={styles.counterItems2}>
                  <CounterField
                    label="Seats"
                    value={commercial.seats || 0}
                    onChange={(value) =>
                      dispatch(
                        setProfileField({
                          propertyType: "commercial",
                          key: "seats",
                          value,
                        }),
                      )
                    }
                  />
                </View>
              </View>
              {fieldErrors?.cabins ? (
                <Text style={styles.errorText}>{fieldErrors?.cabins}</Text>
              ) : null}
            </>
          )}

          {/* Furnishing */}
          {propertyType === "commercial" &&
            (commercial.cabins > 0 || commercial.seats > 0) && (
              <>
                <>
                  <Text style={styles.furnish}>Furnishing</Text>
                  <View style={styles.row}>
                    {[
                      { label: "Furnished", value: "fully-furnished" },
                      { label: "Semi Furnished", value: "semi-furnished" },
                      { label: "Unfurnished", value: "unfurnished" },
                    ].map((item) => (
                      <OptionButton
                        key={item.value}
                        label={item.label}
                        active={commercial.furnishing === item.value}
                        onPress={() =>
                          dispatch(
                            setProfileField({
                              propertyType: "commercial",
                              key: "furnishing",
                              value: item.value,
                            }),
                          )
                        }
                      />
                    ))}
                  </View>
                  {fieldErrors?.furnishing ? (
                    <Text style={styles.errorText}>
                      {fieldErrors?.furnishing}
                    </Text>
                  ) : null}
                  <View style={styles.facingDropDown}>
                    <Dropdownui
                      label="Wall Finish"
                      value={commercial.wallFinishStatus}
                      options={WALL_FINISH_STATUS.map((v) => ({
                        label: v.replace("-", " "),
                        value: v,
                      }))}
                      onChange={(value) =>
                        dispatch(
                          setProfileField({
                            propertyType: "commercial",
                            key: "wallFinishStatus",
                            value,
                          }),
                        )
                      }
                      placeholder="Select"
                      error={fieldErrors.wallFinishStatus?.[0]}
                    />
                  </View>

                  {propertyType === "commercial" &&
                    commercial.wallFinishStatus && (
                      <PricingDetails
                        propertyType="commercial"
                        data={commercial}
                        fieldErrors={fieldErrors}
                      />
                    )}
                </>
              </>
            )}

          {propertyType === "land" && land.landSubType && (
            <View style={styles.section}>
              {/* Plot Dimensions */}
              <View style={styles.plotcard}>
                <Text style={styles.cardTitle}>Plot Dimensions (Optional)</Text>
                <Text style={styles.cardSubTitle}>
                  Enter length and width in feet
                </Text>

                <View style={styles.counterGrid}>
                  <View style={styles.counterItems2}>
                    <InputField
                      label="Length"
                      type="number"
                      placeholder="e.g. 40"
                      value={land.dimensions?.length ?? ""}
                      onChange={(value) =>
                        dispatch(
                          setProfileField({
                            propertyType: "land",
                            key: "dimensions",
                            value: {
                              length: value,
                              width: land.dimensions?.width || "",
                            },
                          }),
                        )
                      }
                    />
                  </View>
                  <View style={styles.multiplyContainer}>
                    <Text style={styles.multiply}>×</Text>
                  </View>
                  <View style={styles.counterItems2}>
                    <InputField
                      label="Width"
                      type="number"
                      placeholder="e.g. 60"
                      value={land.dimensions?.width ?? ""}
                      onChange={(value) =>
                        dispatch(
                          setProfileField({
                            propertyType: "land",
                            key: "dimensions",
                            value: {
                              length: land.dimensions?.length || "",
                              width: value,
                            },
                          }),
                        )
                      }
                    />
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Price Details */}
          {propertyType === "residential" && showPricing && (
            <PricingDetails
              propertyType="residential"
              data={residential}
              fieldErrors={fieldErrors}
            />
          )}

          {propertyType === "land" && land.landSubType && (
            <PricingDetails
              propertyType="land"
              data={land}
              fieldErrors={fieldErrors}
            />
          )}

          {propertyType === "agricultural" &&
            agricultural.agriculturalSubType && (
              <PricingDetails
                propertyType="agricultural"
                data={agricultural}
                fieldErrors={fieldErrors}
              />
            )}

          {/* Availability Status */}
          {isLoggedIn &&
            ["residential", "commercial"].includes(propertyType) && (
              <>
                <Text style={styles.label}>Availability Status</Text>
                <View style={styles.side}>
                  {[
                    { label: "Ready to Move", value: "ready-to-move" },
                    {
                      label: "Under Construction",
                      value: "under-construction",
                    },
                  ].map((item) => (
                    <OptionButton
                      key={item.value}
                      label={item.label}
                      active={profileData.constructionStatus === item.value}
                      onPress={() =>
                        dispatch(
                          setProfileField({
                            propertyType,
                            key: "constructionStatus",
                            value: item.value,
                          }),
                        )
                      }
                    />
                  ))}
                </View>
                {fieldErrors?.constructionStatus ? (
                  <Text style={styles.errorText}>
                    {fieldErrors?.constructionStatus}
                  </Text>
                ) : null}

                {/* Property Age */}
                {profileData.constructionStatus === "ready-to-move" && (
                  <View style={styles.section}>
                    <Text style={styles.label}>Property Age</Text>
                    <View style={styles.row}>
                      {[
                        { label: "0-1 Year", value: "0-1-year" },
                        { label: "1-5 Years", value: "1-5-years" },
                        { label: "5-10 Years", value: "5-10-years" },
                        { label: "10+ Years", value: "10-plus-years" },
                      ].map((item) => (
                        <OptionButton
                          key={item.value}
                          label={item.label}
                          active={profileData.propertyAge === item.value}
                          onPress={() =>
                            dispatch(
                              setProfileField({
                                propertyType,
                                key: "propertyAge",
                                value: item.value,
                              }),
                            )
                          }
                        />
                      ))}
                    </View>
                    {fieldErrors?.propertyAge ? (
                      <Text style={styles.errorText}>
                        {fieldErrors?.propertyAge}
                      </Text>
                    ) : null}
                  </View>
                )}

                {/* Possession Date using datetimepicker */}
                {profileData.constructionStatus === "under-construction" && (
                  <View style={{ marginTop: 10 }}>
                    <DateInputField
                      label="Expected Possession Date"
                      value={profileData.possessionDate}
                      required
                      minimumDate={new Date()}
                      onChange={(value) =>
                        dispatch(
                          setProfileField({
                            propertyType,
                            key: "possessionDate",
                            value,
                          }),
                        )
                      }
                    />
                  </View>
                )}

                <Text style={[styles.label, { marginTop: 10 }]}>
                  Transaction Type
                </Text>
                <View style={styles.side}>
                  {[
                    { label: "New Sale", value: "new-sale" },
                    { label: "Resale", value: "resale" },
                  ].map((item) => (
                    <OptionButton
                      key={item.value}
                      label={item.label}
                      active={profileData.transactionType === item.value}
                      onPress={() =>
                        dispatch(
                          setProfileField({
                            propertyType,
                            key: "transactionType",
                            value: item.value,
                          }),
                        )
                      }
                    />
                  ))}
                </View>
                {fieldErrors?.transactionType ? (
                  <Text style={styles.errorText}>
                    {fieldErrors?.transactionType}
                  </Text>
                ) : null}
              </>
            )}
        </View>

        {!isLoggedIn && (
          <Pressable onPress={() => navigation.navigate("Login")}>
            <View pointerEvents="none" style={{ flex: 1 }}>
              <InputField
                label="Phone Number"
                placeholder="+91 Phone Number"
                value={phoneNumber}
                onChange={setPhoneNumber}
              />
            </View>
          </Pressable>
        )}

        {/* Continue Button */}
        <Pressable
          style={[styles.continueBtn, !isFormValid && showErrors]}
          onPress={handleSubmitBasic}
          // onPress={() => {
          //   setShowErrors(true);
          //   if (isFormValid) {
          //     dispatch(nextStep());
          //   }
          // }}
        >
          <Text style={styles.continueText}>Continue</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginTop: 15,
  },

  listngTypeRow: {
    flexDirection: "row",
    gap: 12,
    // marginBottom: 16,
  },
  rowWrap: {
    marginTop: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginBottom: 8,
  },
  heading: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 8,
  },
  optionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 4,
    marginBottom: 4,
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
  },
  optionBtnActive: {
    borderColor: "#22C55E",
    backgroundColor: "#DCFCE7",
  },
  optionText: {
    fontSize: 13,
    color: "#374151",
  },
  facingDropDown: {
    width: "50%",
    marginTop: 10,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 10,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  radioOuterActive: {
    borderColor: "#22C55E",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#22C55E",
  },
  radioLabel: {
    fontSize: 14,
    color: "#374151",
    textTransform: "capitalize",
  },
  section: {
    // marginBottom: 10,
  },
  counterGrid: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    // gap:5
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    // justifyContent: "space-between",
    // alignItems: "center",
    // marginBottom: 10,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  optionActive: {
    borderColor: "#22c55e",
    backgroundColor: "#dcfce7",
  },

  optionTextActive: {
    color: "#16a34a",
    fontWeight: "600",
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

  counterItems2: {
    width: "45%",
  },

  counterItem: {
    width: "31%",
    // marginBottom: 16,
  },
  furnish: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 8,
    color: "#374151",
  },
  side: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
    // marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  specificType: {
    marginTop: 8,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 5,
  },
  card: {
    width: "30%",
    minWidth: 100,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#c0c3c7ff",
    alignItems: "center",
  },
  cardActive: {
    borderColor: "#22C55E",
    backgroundColor: "#ECFDF5",
  },
  cardIcon: {
    fontSize: 26,
    marginBottom: 6,
  },
  cardText: {
    textAlign: "center",
    fontSize: 12,
    color: "#474a52ff",
  },
  cardTextActive: {
    color: "#16A34A",
    fontWeight: "600",
  },

  plotcard: {
    backgroundColor: "#E9F7EF",
    borderColor: "#22c55e",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  cardSubTitle: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 10,
    marginTop: 3,
  },

  errorText: {
    color: "#DC2626",
    marginTop: 4,
    fontSize: 12,
    // alignSelf: "center",
  },
  continueBtn: {
    width: "60%",
    alignSelf: "center",
    backgroundColor: "#22C55E",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 15,
  },
  continueText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
