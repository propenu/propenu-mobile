import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../services/apiService";
import { getItem } from "../../utils/Storage";
import {
  getFiles as getFileStoreFiles,
  clearFiles as clearFileStoreFiles,
} from "../../lib/FileStore";
import {postPropertyServices} from "../../services/postPropertyServices"
import { ErrorToast } from "react-native-toast-message";

export const createDraftThunk = createAsyncThunk(
  "postProperty/createDraft",
  async (category) => {
    console.log("Category1 :", category)
    return await postPropertyServices.getDraftId(category);
  },
);

export const getMyDraftThunk = createAsyncThunk(
  "postProperty/getMyDraft",
  async (category) => {
    return await postPropertyServices.getMyDraftId(category);
  },
);

export const submitBasicThunk = createAsyncThunk(
  "postProperty/basic",
  async ({ category, id, data }) => {
    // console.log("📦 [BASIC] category:", category, "id:", id);
    // console.log("📦 [BASIC] payload:", data);
    return await postPropertyServices.BasicDetailsStep(category, id,"basic", data);
  },
);

export const submitLocationThunk = createAsyncThunk(
  "postProperty/location",
  async ({ category, id, data }) => {
    // console.log("📍 [LOCATION] payload:",category, data);
    return await postPropertyServices.BasicDetailsStep(category, id, "location", data);
  },
);

export const submitDetailsThunk = createAsyncThunk(
  "postProperty/details",
  async ({ category, id, payload }, { rejectWithValue }) => {
    try {
      console.log("🧩 [DETAILS] RAW payload from Redux:", payload);

      // 🔹 Files from your custom store (RN format expected)
      const files = getFileStoreFiles("postProperty"); 
      // each file should look like:
      // { uri: string, name: string, type: string }

      // console.log(files,"getting files from the store")

      const safePayload = {
        ...payload,

        totalArea: payload?.totalArea
          ? {
              value: Number(payload.totalArea.value),
              unit: payload.totalArea.unit,
            }
          : undefined,

        roadWidth: payload?.roadWidth
          ? {
              value: Number(payload.roadWidth.value),
              unit: payload.roadWidth.unit,
            }
          : undefined,

        amenities: Array.isArray(payload?.amenities)
          ? payload.amenities.map((a) => ({
              title:
                typeof a === "string"
                  ? a.trim()
                  : String(a?.title).trim(),
            }))
          : [],
      };

      const formData = new FormData();

      Object.entries(safePayload).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      if (Array.isArray(files) && files.length > 0) {
        files.forEach((file, index) => {
          formData.append("galleryFiles", {
            uri: file.uri,
            name: file.fileName || file.name || "image.jpg",
            type: file.mimeType || file.type || "image/jpeg",
          });
        });

        clearFileStoreFiles("postProperty");
      }

      // console.log("📤 [DETAILS] FINAL FormData:", formData);
     

      const response = await postPropertyServices.ProfileDetailsStep(category, id, formData);
      return response;
    } catch (error) {
      console.log("❌ submitDetailsThunk error:", error);
      return rejectWithValue(error);
    }
  }
);

export const submitVerificationThunk = createAsyncThunk(
  "postProperty/verification",
  async ({ category, id, payload }, { rejectWithValue }) => {
    try {
      console.log("Thunk payload:", payload);

      const response = await postPropertyServices.VerificationStep(category, id, payload);
      console.log("Response :", response)

      return response;
    } catch (err) {
      console.log("SUBMIT THUNK ERROR:", err);

      return rejectWithValue(err || "Something went wrong");
    }
  }
);


export const submitPropertyThunk = createAsyncThunk(
  "postProperty/submit",
  async (argPropertyType, { getState, rejectWithValue }) => {
    try {
      const state = getState().postProperty;
      const { base } = state;

      const propertyType = argPropertyType || state.propertyType;
      if (!propertyType) {
        throw new Error("Property type not selected");
      }

       const data = await getItem("user");
       const userData = JSON.parse(data);
      if (!userData || !userData.name) {
        throw new Error("User not authenticated");
      }

      const user = userData.user;

      // 🔹 Select profile by property type
      const profile =
        propertyType === "residential"
          ? state.residential
          : propertyType === "commercial"
          ? state.commercial
          : propertyType === "land"
          ? state.land
          : state.agricultural;

      const apiPropertyType =
        propertyType === "residential"
          ? state.residential.propertyType ||
            state.residential.propertySubType
          : propertyType === "commercial"
          ? state.commercial.propertyType ||
            state.commercial.propertySubType
          : propertyType === "land"
          ? state.land.propertyType || state.land.propertySubType
          : state.agricultural.propertyType ||
            state.agricultural.propertySubType;

      if (!apiPropertyType) {
        throw new Error(`Property sub-type is required for ${propertyType}`);
      }

      const userId = userData.id;
      if (!userId) {
        throw new Error("User ID not found");
      }

      // 🔹 Base payload (NO files here)
      const payload = {
        ...base,
        ...profile,
        propertyType: apiPropertyType,
        createdBy: userId,
        listingSource: user.roleName || "user",
      };

      // 🔹 Handle gallery metadata (ONLY URLs)
      const galleryMeta = Array.isArray(payload.galleryFiles)
        ? payload.galleryFiles
        : [];

      if (galleryMeta.length > 0) {
        const urlGallery = galleryMeta
          .filter((g) => typeof g?.url === "string")
          .map((g) => ({ url: g.url }));

        if (urlGallery.length > 0) {
          payload.gallery = urlGallery;
        }

        delete payload.galleryFiles;
      }

      // 🔹 Build FormData
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      // 🔹 Attach local images (uri-based)
      const actualFiles = getFileStoreFiles("postProperty");

      if (Array.isArray(actualFiles) && actualFiles.length > 0) {
        actualFiles.forEach((file) => {
          formData.append("galleryFiles", {
            uri: file.uri,
            name: file.fileName || file.name || "image.jpg",
            type: file.mimeType || file.type || "image/jpeg",
          });
        });

        clearFileStoreFiles("postProperty");
      }
      console.log("formData" , formData)

      // 🔹 Submit based on property type
      switch (propertyType) {
        case "residential":
          return await apiService.residentialApi(formData);
        case "commercial":
          return await apiService.commercialApi(formData);
        case "land":
          return await apiService.landApi(formData);
        case "agricultural":
          return await apiService.agriculturalApi(formData);
        default:
          throw new Error("Invalid property type");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);
