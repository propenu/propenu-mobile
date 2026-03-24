import { ENV } from "../../config";
import { API_ROUTES } from "./apiRoutes";
import { ToastError, ToastSuccess } from "../utils/Toast";
import * as Keychain from "react-native-keychain";

const getToken = async () => {
  const credentials = await Keychain.getGenericPassword();

  if (!credentials) {
    console.log("No token found in keychain");
    return;
  }

  const token = credentials.password;
  return token;
};

export const agentServices = {
  getAgent: async (dateRange = "30") => {
    const token = await getToken();
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.AGENT.AGENT_PROFILE}/my?range=${dateRange}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Something went wrong");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error :", error);
    }
  },

  updateAgentProfileByPhone: async (phone, payload) => {
    const token = await getToken();
    const hasFiles = payload.avatar || payload.coverImage;

    const url = `${ENV.BASE_URL}/api/users/agent/by-phone/${phone}`;

    try {
      if (hasFiles) {
        const formData = new FormData();

        Object.keys(payload).forEach((key) => {
          const value = payload[key];

          if (key === "avatar" || key === "coverImage") {
            if (value?.uri) {
              formData.append(key, {
                uri: value.uri,
                name: value.fileName || "image.jpg",
                type: value.type || "image/jpeg",
              });
            }
          } else if (Array.isArray(value)) {
            value.forEach((v) => {
              formData.append(`${key}[]`, String(v));
            });
          } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });

        const response = await fetch(url, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        // console.log("Server Response1111:", response);
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || "Failed to update profile");
        }

        ToastSuccess("Profile updated successfully");

        return await response.json();
      }

      // 🔹 JSON request (no files)
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // console.log("Server Response2222222:", response);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to update profile");
      }
      ToastSuccess("Profile updated successfully");

      return await response.json();
    } catch (error) {
      console.log("Error when editing profile:", error);
    }
  },

  // updateAgentProfileByPhone: async (phone, payload) => {
  //   try {
  //     const token = await getToken();
  //     const url = `${ENV.BASE_URL}/api/users/agent/by-phone/${phone}`;

  //     const response = await fetch(url, {
  //       method: "PATCH",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     const data = await response.json();

  //     console.log("Server Response:", data);
  //     if (!response.ok) {
  //       throw new Error(data?.message || "Failed to update profile");
  //     }
  //     ToastSuccess("Profile updated successfully")

  //     return data;
  //   } catch (error) {
  //     ToastError("Failed to update profile.")
  //     console.error("Update Profile Error:", error);
  //     throw new Error(
  //       error?.message || "Something went wrong while updating profile",
  //     );
  //   }
  // },

  getMySubscription: async () => {
    const token = await getToken();
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.PAYMENTS.MY_SUBSCIPTION}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Something went wrong");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error :", error);
    }
  },

  getMyPlans: async (params) => {
    try {
      const query = new URLSearchParams(params).toString();

      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.PAYMENTS.PLANS}?${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        console.log("response plans:", response)
        const errorData = await response.json();
        throw (errorData || "Something went wrong");
      }

      return await response.json();
    } catch (error) {
      console.log("Error:", error);
      throw error;
    }
  },

  verifyPayment: async (payload) => {
    const token = await getToken();
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.PAYMENTS.VERIFY_PAYMENT}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Payment verification failed");
      }

      return await response.json();
    } catch (error) {
      console.log("Verify Payment Error:", error);
      throw error;
    }
  },

  createPaymentOrder: async (payload) => {
    const token = await getToken();
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.PAYMENTS.PAYMENT_CREATE}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Something went wrong");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Create Payment Order Error:", error.message);
      throw error;
    }
  },

 registerAgency : async (payload, files) => {
  try {
       const token = await getToken();

    const formData = new FormData();

    // ✅ Basic fields
    formData.append("name", payload.name);
    formData.append("bio", payload.bio);
    formData.append("agencyName", payload.agencyName);
    formData.append("licenseNumber", payload.licenseNumber);
    formData.append("licenseValidTill", payload.licenseValidTill);
    formData.append("city", payload.city);
    formData.append("experienceYears", String(payload.experienceYears));
    formData.append("dealsClosed", String(payload.dealsClosed));
    formData.append("verificationStatus", payload.verificationStatus);
    formData.append("user", payload.user);

    // ✅ Arrays
    payload.areasServed?.forEach((area) => {
      formData.append("areasServed[]", area.trim());
    });

    payload.languages?.forEach((lang) => {
      formData.append("languages[]", lang.trim());
    });

    // ✅ Objects
    formData.append("rera[reraAgentId]", payload.rera?.reraAgentId);
    formData.append("rera[isVerified]", String(payload.rera?.isVerified));

    formData.append(
      "stats[totalProperties]",
      String(payload.stats?.totalProperties)
    );
    formData.append(
      "stats[publishedCount]",
      String(payload.stats?.publishedCount)
    );

    // ✅ Files (IMPORTANT for React Native)
    if (files?.avatar) {
      formData.append("avatar", {
        uri: files.avatar.uri,
        type: files.avatar.type || "image/jpeg",
        name: files.avatar.fileName || "avatar.jpg",
      });
    }

    if (files?.coverImage) {
      formData.append("coverImage", {
        uri: files.coverImage.uri,
        type: files.coverImage.type || "image/jpeg",
        name: files.coverImage.fileName || "cover.jpg",
      });
    }

    const response = await fetch(`${ENV.BASE_URL}/api/users/agent`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("API Error:", data);
      return data;
    }

    return data;
  } catch (error) {
    console.log("Register Agency Error:", error);
    return data;
  }
},
 
};
