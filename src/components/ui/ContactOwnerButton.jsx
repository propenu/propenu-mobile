import React, { useState } from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

// import APIs
import LeadModal from "./LeadModal";
import { useAuth } from "../../context/AuthContext";
import { userServices } from "../../services/userServices";
import { ToastInfo } from "../../utils/Toast";

const ContactOwnerButton = ({
  listingType,
  listingSource,
  projectId,
  propertyType,
  ownerName,
  ownerPhone,
  ownerEmail,
  postedOn,
  price,
  propertyLabel,
  children,
}) => {
  const navigation = useNavigation();
  const { isLoggedIn, userDetails } = useAuth();
  const [showLeadDialog, setShowLeadDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const normalizeListingType = (value) => {
    const normalized = value?.toLowerCase()?.trim();
    if (!normalized) return undefined;

    if (["sale", "sell", "buy"].includes(normalized)) return "sale";
    if (["rent", "rental", "lease"].includes(normalized)) return "rent";

    return undefined;
  };

  const propertyTypeMap = {
    residential: "residentials",
    commercial: "commercials",
    land: "landplots",
    agricultural: "agriculturals",
  };

  const profileType = propertyTypeMap[propertyType] || "featuredprojects";
  const resolvedListingType = normalizeListingType(listingType);

  // 🔹 Redirect to plans
  const redirectToPlan = () => {
    if (resolvedListingType === "sale") {
      navigation.navigate("BuyViewPlans");
      return;
    }
    if (resolvedListingType === "rent") {
      navigation.navigate("RentViewPlans");
      return;
    }
    navigation.navigate("BuyViewPlans");
  };

  const getContactPerson = () => {
    return listingSource || "Owner";
  };

  const handleContactOwner = async () => {
    if (!isLoggedIn) {
      navigation.navigate("Login");
    }

    if (!projectId) {
      ToastInfo("Property ID missing");
      return;
    }

    try {
      setLoading(true);

      const response = await userServices.postLeads({
        name: userDetails?.name || "Guest User",
        phone: userDetails?.phone,
        email: userDetails?.email,
        projectId: projectId,
        propertyType: profileType,
        // listingType: resolvedListingType,
        remarks: "Interested in this property",
      });
      // console.log("responseresponseresponseresponse", response);

      setShowLeadDialog(true);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to contact owner";

      const lowerMessage = message.toLowerCase();

      if (
        lowerMessage.includes("purchase") ||
        lowerMessage.includes("plan required") ||
        lowerMessage.includes("subscribe") ||
        lowerMessage.includes("plan") ||
        lowerMessage.includes("limit") ||
        lowerMessage.includes("upgrade") ||
        lowerMessage.includes("subscription")
      ) {
        redirectToPlan();
        return;
      }
      console.log("Message :", message);
      // ToastInfo(message);

      //   (message); // replace with Toast if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={handleContactOwner}
        disabled={loading}
        style={{
          paddingHorizontal: 20,
          backgroundColor: "#27AE60",
          paddingVertical: 7,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>
          {children || `Contact ${getContactPerson()}`}
        </Text>
      </TouchableOpacity>

      {/* Lead Dialog */}
      <LeadModal
        open={showLeadDialog}
        onClose={() => setShowLeadDialog(false)}
        ownerName={ownerName}
        ownerRole={getContactPerson()}
        phone={ownerPhone}
        email={ownerEmail}
        postedOn={postedOn}
        price={price}
        propertyLabel={propertyLabel}
      />
    </>
  );
};

export default ContactOwnerButton;
