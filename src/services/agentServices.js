import { ENV } from "../../config";
import { API_ROUTES } from "./apiRoutes";
import { ToastError, ToastSuccess } from "../utils/Toast";
import * as Keychain from "react-native-keychain";
import { Platform } from "react-native";

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
  
registerAgency: async (payload, files) => {
  const getFile = (file, defaultName) => ({
    uri: Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri,
    type: file.mimeType || "image/jpeg",
    name: file.fileName || defaultName,
  });

  try {
    const token = await getToken();
    const formData = new FormData();

    formData.append("name", payload?.name || "");
    formData.append("bio", payload?.bio || "");
    formData.append("agencyName", payload?.agencyName || "");
    formData.append("licenseNumber", payload?.licenseNumber || "");
    formData.append("licenseValidTill", payload?.licenseValidTill || "");
    formData.append("city", payload?.city || "");
    formData.append("experienceYears", String(payload?.experienceYears || 0));
    formData.append("dealsClosed", String(payload?.dealsClosed || 0));
    formData.append("verificationStatus", payload?.verificationStatus || "pending");

    if (payload?.user) {
      formData.append("user", payload.user);
    }

    payload?.areasServed?.forEach((area) => {
      if (area?.trim()) formData.append("areasServed[]", area.trim());
    });

    payload?.languages?.forEach((lang) => {
      if (lang?.trim()) formData.append("languages[]", lang.trim());
    });

    if (payload?.rera?.reraAgentId) {
      formData.append("rera[reraAgentId]", payload.rera.reraAgentId);
    }
    formData.append("rera[isVerified]", String(payload?.rera?.isVerified ?? false));

    formData.append(
      "stats[totalProperties]",
      String(payload?.stats?.totalProperties ?? 0)
    );
    formData.append(
      "stats[publishedCount]",
      String(payload?.stats?.publishedCount ?? 0)
    );

    if (files?.avatar?.uri) {
      console.log("Uploading avatar:", files.avatar);
      formData.append("avatar", getFile(files.avatar, "avatar.jpg"));
    }

    if (files?.coverImage?.uri) {
      console.log("Uploading cover:", files.coverImage);
      formData.append("coverImage", getFile(files.coverImage, "cover.jpg"));
    }

    const url = `${ENV.BASE_URL}/api/users/agent`;
    console.log("API URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    console.log("Response status:", response.status);

    let data;
    try {
      data = await response.json();
    } catch {
      data = await response.text();
    }

    console.log("Response data:", data);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || "Something went wrong",
        data,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.log("Register Agency Error:", error);
    return {
      success: false,
      message: error?.message || "Network request failed",
    };
  }
},
};
