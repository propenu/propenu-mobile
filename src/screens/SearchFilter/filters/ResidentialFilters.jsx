import React, { useEffect, useRef, useState } from "react";
import {
  Switch,
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  selectCityWithLocalities,
  selectLocalitiesByCity,
} from "../../../redux/slice/CitySlice";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import useCity from "../../../components/CustomHooks/useCity";
import {
  budgetOptions,
  CARPET_MAX,
  CARPET_MIN,
  carpetOptions,
  formatBudget,
  moreFilterSections,
} from "../../../data/constants";
import {
  setResidentialFilter,
  resetResidentialFilters,
} from "../../../redux/slice/FilterSlice";
import Dropdownui from "../../../components/ui/DropDownUI";
import { ToastInfo } from "../../../utils/Toast";
import filterStyles from "./filterStyles";

const ResidentialFilters = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [locationInput, setLocationInput] = useState("");
  const [selectedOptions, setSelectedOptions] = useState({});
  const [locations, setLocations] = useState([]);
  const [isOpenMore, setIsOpenMore] = useState(false);
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const cityData = useSelector(selectCityWithLocalities);
  const localities = useSelector(selectLocalitiesByCity);
  const filtersState = useSelector((state) => state.filters);

  const { selectedCity } = useCity();

  const { minBudget, maxBudget, residential, listingTypeValue } = filtersState;

  const { locality, bedrooms, listingSource } = residential;
  console.log("residential filters :", bedrooms, residential);

  const inputRef = useRef(null);
  const TOTAL_STEPS = 3;
  const localityNames = [
    ...new Set(cityData.localities.map((item) => item.name)),
  ];

  const rightPanelRef = useRef(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [carpetRange, setCarpetRange] = useState([CARPET_MIN, CARPET_MAX]);

  // Map display labels to camelCase property names
  const keyMapping = {
    "Property Type": "propertyType",
    "Sales Type": "salesType",
    "Possession Status": "possessionStatus",
    "Covered Area": "coveredArea",
    Bathroom: "bathroom",
    Balcony: "balcony",
    Parking: "parking",
    Furnishing: "furnishing",
    Amenities: "amenities",
    Facing: "facing",
    "Verified Properties": "verifiedProperties",
    "Posted Since": "postedSince",
    "Posted By": "listingSource",
  };

  const bhkOptions = [
    "1 BHK",
    "2 BHK",
    "3 BHK",
    "4 BHK",
    "5 BHK",
    "6 BHK",
    // "6+ BHK",
  ];

  const CategoryTypes = [
    { label: "Residential", value: "residential" },
    { label: "Commercial", value: "commercial" },
    { label: "Agricultural", value: "agricultural" },
    { label: "Land", value: "land" },
  ];

  const getBhkNumber = (b) => {
    return b === "6+ BHK" ? 6 : Number(b.split(" ")[0]);
  };

  // const bhkLabel = bhk ? `${bhk}${bhk === 6 ? "+" : ""} BHK` : "BHK";

  /* -------------------- BUDGET -------------------- */

  const BUDGET_MIN = 0;
  const BUDGET_MAX = 100000000;

  const [budgetRange, setBudgetRange] = useState([
    minBudget || BUDGET_MIN,
    maxBudget || BUDGET_MAX,
  ]);

  const budgetLabel =
    minBudget === BUDGET_MIN && maxBudget === BUDGET_MAX
      ? "Budget"
      : `${formatBudget(minBudget)} - ${formatBudget(maxBudget)}`;

  /* -------------------- POSTED BY -------------------- */

  const postedByOptions = [
    { label: "Owners", value: "user" },
    { label: "Agents", value: "agent" },
    { label: "Builders", value: "builder" },
  ];

  const getSelectedMoreFiltersCount = () => {
    let count = 0;

    Object.values(residential).forEach((value) => {
      console.log(value, "LLLLLLLL");

      if (Array.isArray(value)) {
        count += value.length;
      } else if (typeof value === "boolean") {
        if (value) count += 1;
      } else if (value !== undefined && value !== null && value !== "") {
        count += 1;
      }
    });

    return count;
  };
  const selectedMoreFiltersCount = getSelectedMoreFiltersCount();
  const localityCount = locality ? 1 : 0;
  const listingTypeCount = listingTypeValue ? 1 : 0;
  const moreFiltersBadgeCount =
    selectedMoreFiltersCount + localityCount + listingTypeCount;
  const displayedMoreFiltersBadgeCount = moreFiltersBadgeCount || 2;
  console.log("displayedMoreFiltersBadgeCount", displayedMoreFiltersBadgeCount);

  const handleSubmit = () => {
    const trimmed = locationInput.trim();
    if (!trimmed) return;
    console.log("Submitting location:", trimmed);

    // prevent duplicates
    if (!locations.includes(trimmed)) {
      setLocations([...locations, trimmed]);
      dispatch(
        setResidentialFilter({
          key: "locality",
          value: trimmed,
        }),
      );
    }
    setLocationInput("");
  };

  const handleSwitch = (val) => {
    setVerifiedOnly(val);
    // if (val) ToastSuccess("Verified properties enabled");
    // else ToastSuccess("Verified properties disabled");
  };

  const removeLocation = (loc) => {
    setLocations((prev) => prev.filter((l) => l !== loc));
    dispatch(
      setResidentialFilter({
        key: "locality",
        value: loc,
      }),
    );
  };

  const [activeFilter, setActiveFilter] = useState(moreFilterSections[0]?.key);

  const sectionRefs = useRef({});

  const handleSectionClick = (key) => {
    setActiveFilter(key);

    sectionRefs.current[key]?.measureLayout(rightPanelRef.current, (x, y) => {
      rightPanelRef.current.scrollTo({ y, animated: true });
    });
  };

  const toggleArrayValue = (arr, value) => {
    const safeArr = Array.isArray(arr) ? arr : [];
    return safeArr.includes(value)
      ? safeArr.filter((v) => v !== value)
      : [...safeArr, value];
  };

  const toggleOption = (sectionKey, option, selectionType) => {
    const mappedKey = keyMapping[sectionKey];
    const currentValue = residential[mappedKey];

    setSelectedOptions((prev) => {
      const sectionValues = prev[sectionKey] || [];

      if (selectionType === "single") {
        return {
          ...prev,
          [sectionKey]: [option],
        };
      }
      console.log("section key :", sectionKey, option);
      return {
        ...prev,
        [sectionKey]: sectionValues.includes(option)
          ? sectionValues.filter((v) => v !== option)
          : [...sectionValues, option],
      };
    });

    dispatch(
      setResidentialFilter({
        key: mappedKey,
        value:
          selectionType === "multiple"
            ? toggleArrayValue(currentValue || [], option)
            : option,
      }),
    );
  };

  const handleSearch = async () => {
    console.log("Searching with residential filters...");
    navigation.navigate("PropertyList");
  };
  const handleClearButton = () => {
    setLocations([]);
    setLocationInput("");
    setBudgetRange([BUDGET_MIN, BUDGET_MAX]);
    setSelectedOptions({});
    setVerifiedOnly(false);
    setCarpetRange([CARPET_MIN, CARPET_MAX]);
    dispatch(resetResidentialFilters());
    ToastInfo("All filters have been cleared.");
  };

  const activeSection = moreFilterSections.find(
    (section) => section.key === activeFilter,
  );

  //  To automatic keyboard focus on input
  // useEffect(() => {
  //   // small delay helps on Android
  //   setTimeout(() => {
  //     inputRef.current?.focus();
  //   }, 100);
  // }, []);

  return (
    <View style={filterStyles.container}>
      {/* STEP 1 */}
      {/* {step === 1 && ( */}
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View style={filterStyles.content}>
          <Text style={filterStyles.label}>City / Locality</Text>

          {/* SEARCH INPUT */}
          <View style={filterStyles.inputWrapper}>
            <EvilIcons
              name="search"
              size={24}
              color="gray"
              style={filterStyles.searchIcon}
            />
            <TextInput
              // ref={inputRef}
              value={locationInput}
              onChangeText={setLocationInput}
              placeholder={`Search in ${selectedCity?.city ?? "City"} `}
              placeholderTextColor="gray"
              style={filterStyles.input}
              returnKeyType="search"
              onSubmitEditing={handleSubmit}
            />
          </View>

          {/* SELECTED LOCATION CHIPS */}

          <View style={filterStyles.selectedLoc}>
            {locations.map((loc) => (
              <View key={loc} style={[filterStyles.chip]}>
                <Text style={filterStyles.chipText}>{loc}</Text>
                <Pressable onPress={() => removeLocation(loc)}>
                  <Ionicons name="close" size={16} color="#1E8449" />
                </Pressable>
              </View>
            ))}
          </View>

          <Text style={filterStyles.localitiesHeading}>
            {cityData ? `Localities in ${cityData.city}` : "Select city first"}
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {[...new Set(localities.map((l) => l.name))].map((name) => (
              <Pressable
                key={name}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  backgroundColor: "#E9F7EF",
                  borderRadius: 8,
                }}
                onPress={() => {
                  if (!locations.includes(name)) {
                    setLocations([...locations, name]);
                    dispatch(
                      setResidentialFilter({
                        key: "locality",
                        value: name,
                      }),
                    );
                  }
                }}
              >
                <Text style={filterStyles.localitiesText}>+ {name}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Pressable>
      {/* // )} */}

      {/* STEP 2 */}
      {/* {step === 2 && ( */}
      {/*<View style={filterStyles.content}>
           <View style={filterStyles.row}>
            {/* Fixed Add button
            <Pressable
              style={filterStyles.addButton}
              onPress={() => setStep(1)}
            >
              <Text style={{ fontSize: 13 }}>Add +</Text>
            </Pressable>

            {/* Scrollable locations
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={filterStyles.locationScroll}
            >
              {locations.map((loc) => (
                <View key={loc} style={[filterStyles.chip, { marginRight: 6 }]}>
                  <Text style={filterStyles.chipText}>{loc}</Text>
                  <Pressable
                    onPress={() => removeLocation(loc)}
                    style={{ paddingLeft: 5 }}
                  >
                    <Ionicons name="close" size={17} color="#1E8449" />
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          </View> */}
      <View style={filterStyles.contentBar}>
        <Text style={filterStyles.subTitle}>Budget</Text>
        <View style={filterStyles.budget}>
          <View style={filterStyles.minMaxBudget}>
            <Dropdownui
              label="Minimum"
              value={budgetRange[0]}
              options={budgetOptions.map((t) => ({
                label: formatBudget(t),
                value: t,
              }))}
              onChange={(value) => setBudgetRange([value, budgetRange[1]])}
            />
          </View>

          <View style={filterStyles.minMaxBudget}>
            <Dropdownui
              label="Maximum"
              value={budgetRange[1]}
              options={budgetOptions.map((t) => ({
                label: formatBudget(t),
                value: t,
              }))}
              onChange={(value) => setBudgetRange([budgetRange[0], value])}
            />
          </View>
        </View>

        <Text style={filterStyles.subTitle}>BHK</Text>
        <View style={filterStyles.toggleContainer}>
          {bhkOptions.map((opt) => {
            const value = getBhkNumber(opt);
            // const isSelected = bhk?.includes(value);
            return (
              <Pressable
                key={opt}
                onPress={() => {
                  dispatch(
                    setResidentialFilter({
                      key: "bedrooms",
                      value,
                    }),
                  );
                }}
                style={[
                  filterStyles.bhkData,
                  bedrooms === value && filterStyles.activeChip,
                ]}
              >
                <Text
                  style={[
                    filterStyles.labelText,
                    bedrooms === value && filterStyles.activeChipText,
                  ]}
                >
                  {opt}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={filterStyles.subTitle}>Posted By</Text>
        <View style={filterStyles.toggleContainer}>
          {postedByOptions.map((item) => {
            // console.log("item, posted by", item, postedBy);
            //  const isSelected = postedBy?.includes(item)
            return (
              <Pressable
                key={item.value}
                onPress={() => {
                  dispatch(
                    setResidentialFilter({
                      key: "listingSource",
                      value: item.value,
                    }),
                  );
                }}
                style={[
                  filterStyles.bhkData,
                  listingSource === item.value && filterStyles.activeChip,
                ]}
              >
                <Text
                  style={[
                    filterStyles.labelText,
                    listingSource === item.value && filterStyles.activeChipText,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          style={filterStyles.moreFilterHeader}
          onPress={() => {
            setIsOpenMore(!isOpenMore);
          }}
        >
          {/* <View style={filterStyles.badge}>
                    <Text style={filterStyles.badgeText}>{selectedMoreFiltersCount}</Text>
                  </View> */}

          <Text style={filterStyles.moreFilterText}>
            Advanced Filters (Optional)
          </Text>

          <AntDesign name={isOpenMore ? "up" : "down"} size={12} color="#000" />
        </Pressable>
      </View>

      {/* )} */}
      {/* {step === 3 && ( */}

      {isOpenMore && (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <View style={filterStyles.sectionContainer}>
            {/* LEFT PANEL */}
            <View style={filterStyles.leftPanel}>
              {moreFilterSections.map((section) => (
                <Pressable
                  key={section.key}
                  onPress={() => handleSectionClick(section.key)}
                  style={[
                    filterStyles.leftItem,
                    activeFilter === section.key && filterStyles.leftItemActive,
                  ]}
                >
                  <Text
                    style={[
                      filterStyles.leftText,
                      activeFilter === section.key &&
                        filterStyles.leftTextActive,
                    ]}
                  >
                    {section.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* RIGHT PANEL */}
            <ScrollView
              ref={rightPanelRef}
              style={filterStyles.rightPanel}
              contentContainerStyle={{ paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            >
              {activeSection && (
                <View key={activeSection.key} style={filterStyles.section}>
                  <Text style={filterStyles.sectionTitle}>
                    {activeSection.label}
                  </Text>

                  {activeSection.key === "Verified Properties" ? (
                    <View style={filterStyles.verifiedRow}>
                      <Text>Verified</Text>
                      <Switch
                        style={{
                          transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                        }}
                        value={verifiedOnly}
                        onValueChange={(val) => handleSwitch(val)}
                        trackColor={{ false: "#bdbdbd", true: "#A9DFBF" }}
                        thumbColor={verifiedOnly ? "#27AE60" : "#f0eeee"}
                        ios_backgroundColor="#E0E0E0"
                      />
                    </View>
                  ) : activeSection.key === "Covered Area" ? (
                    <View style={filterStyles.budgetArea}>
                      <View style={filterStyles.minMaxBudget}>
                        <Dropdownui
                          label="Minimum"
                          value={carpetRange[0]}
                          options={carpetOptions.map((t) => ({
                            label: `${t} Sqft`,
                            value: t,
                          }))}
                          onChange={(value) =>
                            setCarpetRange([value, carpetRange[1]])
                          }
                        />
                      </View>

                      <View style={filterStyles.minMaxBudget}>
                        <Dropdownui
                          label="Maximum"
                          value={carpetRange[1]}
                          options={carpetOptions.map((t) => ({
                            label: `${t} Sqft`,
                            value: t,
                          }))}
                          onChange={(value) =>
                            setCarpetRange([carpetRange[0], value])
                          }
                        />
                      </View>
                    </View>
                  ) : (
                    <View>
                      {activeSection.options?.map((opt) => {
                        const isChecked =
                          selectedOptions[activeSection.key]?.includes(opt);

                        const isSingle =
                          activeSection.selectionType === "single";

                        return (
                          <Pressable
                            key={opt}
                            style={filterStyles.optionRow}
                            onPress={() =>
                              toggleOption(
                                activeSection.key,
                                opt,
                                activeSection.selectionType,
                              )
                            }
                          >
                            {isSingle ? (
                              <View
                                style={[
                                  filterStyles.radioOuter,
                                  isChecked && filterStyles.radioOuterSelected,
                                ]}
                              >
                                {isChecked && (
                                  <View style={filterStyles.radioInner} />
                                )}
                              </View>
                            ) : (
                              <View
                                style={[
                                  filterStyles.checkbox,
                                  isChecked && filterStyles.checkedBox,
                                ]}
                              >
                                {isChecked && (
                                  <Entypo name="check" size={12} color="#fff" />
                                )}
                              </View>
                            )}

                            <Text style={filterStyles.optionText}>{opt}</Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}
      {/* )} */}

      {/* BOTTOM BAR */}
      <View
        style={[filterStyles.buttonBar, { marginBottom: insets.bottom + 10 }]}
      >
        <Pressable style={filterStyles.clearButton} onPress={handleClearButton}>
          <Text style={filterStyles.clearText}>Clear</Text>
        </Pressable>
        <Pressable style={[filterStyles.nextButton]} onPress={handleSearch}>
          {/* <Text style={filterStyles.filterCount}>{displayedMoreFiltersBadgeCount}</Text> */}

          <View style={filterStyles.filterCount}>
            <Text style={filterStyles.filterCountText}>
              {displayedMoreFiltersBadgeCount}
            </Text>
          </View>
          <Text style={filterStyles.nextText}>
            Search
            {/* {step === TOTAL_STEPS ? "Search" : "Next"} */}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ResidentialFilters;
