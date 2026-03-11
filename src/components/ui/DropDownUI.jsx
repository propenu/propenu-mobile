import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";

const Dropdownui = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options?.find(
  (o) => String(o?.value).toLowerCase() === String(value).toLowerCase()
);
  return (
    <View style={styles.container}>
      {/* Label */}
      {label ? <Text style={styles.label}>{label}</Text> : null}

      {/* Button */}
      <Pressable
        onPress={() => setIsOpen(true)}
        style={[
          styles.button,
          isOpen && styles.focused,
          error && styles.errorBorder,
        ]}
      >
        <Text
          style={[styles.buttonText, !selectedOption && styles.placeholder]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>

        <Feather
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color={isOpen ? "#059669" : "#6B7280"}
        />
      </Pressable>

      {/* Dropdown Modal */}
      <Modal transparent visible={isOpen} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <View style={styles.dropdown}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === value;

                return (
                  <Pressable
                    onPress={() => {
                      onChange(item.value);
                      setIsOpen(false);
                    }}
                    style={[styles.option, isSelected && styles.selectedOption]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedText,
                      ]}
                    >
                      {item.label}
                    </Text>

                    {isSelected && (
                      <AntDesign name="check" size={16} color="#059669" />
                    )}
                  </Pressable>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>

      {/* Error */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default Dropdownui;
const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "#FFFFFF",
  },

  focused: {
    borderColor: "#059669",
  },

  errorBorder: {
    borderColor: "#EF4444",
  },

  buttonText: {
    fontSize: 13,
    color: "#111827",
  },

  placeholder: {
    color: "#9CA3AF",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },

  dropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    maxHeight: 300,
    paddingVertical: 6,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  selectedOption: {
    backgroundColor: "#ECFDF5",
  },

  optionText: {
    fontSize: 14,
    color: "#4B5563",
  },

  selectedText: {
    color: "#047857",
    fontWeight: "500",
  },

  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: "#EF4444",
  },
});
