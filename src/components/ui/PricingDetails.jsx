import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { setProfileField } from "../../redux/slice/PostPropertySlice";
import InputField from "../ui/InputField";
import InputWithUnit from "../ui/InputWithUnit";

export default function PricingDetails({ propertyType, data, fieldErrors }) {
  const dispatch = useDispatch();

  const isAgricultural = propertyType === "agricultural";
  const isLand = propertyType === "land";
  console.log("DATAAAAA:", data)

  /* ================= AREA KEYS ================= */
  const areaValue = isAgricultural
    ? data.totalArea?.value
    : isLand
      ? data.plotArea
      : data.carpetArea;

  /* ================= AUTO PRICE / SQ FT ================= */
  useEffect(() => {
    const price = Number(data.price);
    const area = Number(areaValue);

    if (price > 0 && area > 0) {
      const pps = Math.round(price / area).toString();

      if (pps !== data.pricePerSqft) {
        dispatch(
          setProfileField({
            propertyType,
            key: "pricePerSqft",
            value: pps,
          }),
        );
      }
    }
  }, [data.price, areaValue]);

  return (
    <View style={styles.container}>
      <View style={styles.flex}>
        <View style={styles.field}>
          <InputField
            label="Total Price"
            value={data.price || ""}
            placeholder="e.g. 75,00,000"
            error={fieldErrors?.price?.[0]}
            keyboardType="numeric"
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType,
                  key: "price",
                  value: value.replace(/\D/g, ""),
                }),
              )
            }
          />
        </View>
        <View style={styles.field}>
          {isAgricultural ? (
            <InputWithUnit
              label="Total Area"
              placeholder="e.g. 5"
              value={data.totalArea?.value ?? ""}
              unit={data.totalArea?.unit ?? "acre"}
              units={[
                { label: "SQ.FT", value: "sqft" },
                { label: "SQ.MT", value: "sqmt" },
                { label: "ACRE", value: "acre" },
                { label: "GUNTHA", value: "guntha" },
                { label: "CENT", value: "cent" },
                { label: "HECTARE", value: "hectare" },
              ]}
              error={fieldErrors?.totalArea?.[0]}
              onValueChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType,
                    key: "totalArea",
                    value: {
                      value,
                      unit: data.totalArea?.unit || "acre",
                    },
                  }),
                )
              }
              onUnitChange={(unit) =>
                dispatch(
                  setProfileField({
                    propertyType,
                    key: "totalArea",
                    value: {
                      value: data.totalArea?.value || "",
                      unit,
                    },
                  }),
                )
              }
            />
          ) : (
            <InputField
              label={isLand ? "Plot Area (sq ft)" : "Carpet Area (sq ft)"}
              placeholder={isLand ? "e.g. 2400" : "e.g. 1200"}
              value={areaValue ?? ""}
              error={fieldErrors?.[isLand ? "plotArea" : "carpetArea"]?.[0]}
               keyboardType="numeric"
              onChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType,
                    key: isLand ? "plotArea" : "carpetArea",
                    value: value.replace(/\D/g, ""),
                  }),
                )
              }
            />
          )}
        </View>
      </View>
      <View style={styles.flex}>
        <View style={styles.field}>
          <InputField
            label="Price / sq ft"
            value={data.pricePerSqft || ""}
            placeholder="Auto calculated"
            disabled
          />
        </View>
        <View style={styles.field}>
          {isAgricultural ? (
            <InputWithUnit
              label="Road Width"
              placeholder="e.g. 30"
              value={data.roadWidth?.value ?? ""}
              unit={data.roadWidth?.unit ?? "ft"}
              units={[
                { label: "FT", value: "ft" },
                { label: "METER", value: "meter" },
              ]}
              error={fieldErrors?.roadWidth?.[0]}
              onValueChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType,
                    key: "roadWidth",
                    value: {
                      value,
                      unit: data.roadWidth?.unit || "ft",
                    },
                  }),
                )
              }
              onUnitChange={(unit) =>
                dispatch(
                  setProfileField({
                    propertyType,
                    key: "roadWidth",
                    value: {
                      value: data.roadWidth?.value || "",
                      unit,
                    },
                  }),
                )
              }
            />
          ) : (
            <InputField
              label={isLand ? "Road Width (ft)" : "Built-up Area (sq ft)"}
              placeholder={isLand ? "e.g. 30" : "Optional"}
              value={isLand ? (data.roadWidth ?? "") : (data.builtUpArea ?? "")}
              error={fieldErrors?.[isLand ? "roadWidth" : "builtUpArea"]?.[0]}
              keyboardType="numeric"
              onChange={(value) =>
                
                dispatch(
                  setProfileField({
                    propertyType,
                    key: isLand ? "roadWidth" : "builtUpArea",
                    value: value.replace(/\D/g, ""),
                  }),
                )
              }
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // gap: 14,
  },
  field: {
    width: "48%",
    // marginBottom: 6,
  },
  hint: {
    marginTop: 4,
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
  },
  flex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
