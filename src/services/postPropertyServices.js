import { tryCatch } from "ramda";
import { ENV } from "../../config";
import { API_ROUTES } from "./apiRoutes";
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

export const postPropertyServices = {
  getDraftId: async (category) => {
    const token = await getToken();

    try {
      const response = await fetch(
        `${ENV.BASE_URL}/api/properties/${category}/draft`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      let data = response.json();
      console.log("Response :", response);
      if (!response.ok) {
        throw data;
      }

      return data;
    } catch (error) {
      console.log("Error in getting draft ID:", category, error);
    }
  },
  getMyDraftId: async (category) => {
    const token = await getToken();

    try {
      const response = await fetch(
        `${ENV.BASE_URL}/api/properties/${category}/draft/me`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        throw await response.json();
      }

      return await response.json();
    } catch (error) {
      console.log("Error in getting draft My ID:", error);
    }
  },

  BasicDetailsStep: async (category, id, step, payload) => {
    const token = await getToken();
    console.log("@@@@@@@@", category, id, step, payload);

    try {
      const response = await fetch(
        `${ENV.BASE_URL}/api/properties/${category}/${id}/${step}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      return result;
    } catch (error) {
      console.log("Error in basic details step:", error);
    }
  },

  ProfileDetailsStep: async (category, id, formData) => {
    const token = await getToken();
    try {
      const response = await fetch(
        `${ENV.BASE_URL}/api/properties/${category}/${id}/details`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data || "Something went wrong");
      }
      return await data;
    } catch (error) {
      console.log("Error in details step:", error);
    }
  },

  VerificationStep: async (category, id, formData) => {
    const token = await getToken();

    try {
      const res = await fetch(
        `${ENV.BASE_URL}/api/properties/${category}/${id}/verification`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );
      const data = await res.json();
      console.log("RESSSSSSSSS", data);

      if (!res.ok) {
        throw new Error(data || "Something went wrong");
      }

      return await data;
    } catch (error) {
      console.log("🔥 VERIFY API ERROR:", error);
      throw error;
    }
  },

  deleteGalleryImageApi: async (category, id, imageIndex) => {
    const token = await getToken();
    try {
      const res = await fetch(
        `${ENV.BASE_URL}/api/properties/${category}/${id}/gallery/${imageIndex}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        const error = await res.json();
        throw error;
      }

      return await res.json();
    } catch (err) {
      console.log("ERROR", err);
    }
  },
};
