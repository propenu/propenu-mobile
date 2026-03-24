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
export const apiService = {
  login: async (payload) => {
    console.log(payload);
    try {
      const response = await fetch(`${ENV.BASE_URL}${API_ROUTES.AUTH.LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return {
        status: response.status,
        data,
      };
    } catch (error) {
      throw error;
    }
  },
  verifyOtp: async (payload) => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.AUTH.VERIFY_OTP}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );
      const data = await response.json();
      return {
        status: response.status,
        data,
      };
    } catch (error) {
      throw error;
    }
  },

  verifyToken: async (token) => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.AUTH.VERIFY_TOKEN}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      return {
        status: response.status,
        data,
      };
    } catch (error) {
      throw error;
    }
  },

  createAccount: async (payload) => {
    console.log("PAYLOAD IN CREATE ACCOUNT :", payload);
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.AUTH.CREATE_ACCOUNT}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );
      const data = await response.json();
      return {
        status: response.status,
        data,
      };
    } catch (error) {
      throw error;
    }
  },

  updateLocation: async (payload) => {
    const token = await getToken();
    console.log("PAYLOAD IN LOCATION UPDATE :", payload, token,   `${ENV.BASE_URL}${API_ROUTES.AUTH.LOCATION}`,);

    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.AUTH.LOCATION}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();
      // console.log("LOCATION RESPONSE" ,data)

      if (!response.ok) {
        throw data || "Something went wrong";
      }

      return {
        status: response.status,
        data,
      };;
    } catch (error) {
      console.log("Update Location Error:", error);
      throw error;
    }
  },

  requestOTP: async (payload) => {
    console.log(
      "checking Payload for verify otp when creating the account :",
      payload,
    );

    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.AUTH.REQUEST_OTP}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw data || "Request OTP failed";
      }

      return { data, status: response.status };
    } catch (error) {
      console.log("Request OTP Error:", error);
      throw error;
    }
  },

  startKyc: async () => {
    try {
      const token = await getToken();

      const response = await fetch(`${ENV.BASE_URL}${API_ROUTES.AUTH.KYC}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw data || "KYC failed";
      }

      return { data, status: response.status };
    } catch (error) {
      console.log("Start KYC Error:", error);
      throw error;
    }
  },
  featuredProjects: async () => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.USER.FEATURED_PROJECTS}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      return {
        status: response.status,
        data,
      };
    } catch (error) {
      throw error;
    }
  },

  featuredProjectById: async (id) => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.USER.FEATURED_PROJECTS}/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      return data;
    } catch (error) {
      throw error;
    }
  },

  HighlightProjects: async () => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.USER.HIGHLIGHT_PROJECTS}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      return {
        status: response.status,
        data,
      };
    } catch (error) {
      throw error;
    }
  },
  ownersProperties: async () => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.USER.OWNERS_PROPERTIES}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      return {
        status: response.status,
        data,
      };
    } catch (error) {
      throw error;
    }
  },

  agricultural: async () => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.USER.ARGICULTURAL}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      console.log("Agricultural data from the api:", data);

      return {
        status: response.status,
        data,
      };
    } catch (error) {
      throw error;
    }
  },
  land: async () => {
    try {
      const response = await fetch(`${ENV.BASE_URL}${API_ROUTES.USER.LAND}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return {
        status: response.status,
        data,
      };
    } catch (error) {
      console.error("land error:", error);
      throw error;
    }
  },
  commercial: async () => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.USER.COMMERCIAL}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      return {
        status: response.status,
        data,
      };
    } catch (error) {
      console.error("land error:", error);
      throw error;
    }
  },
  residential: async () => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.USER.RESIDENTIAL}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      return {
        status: response.status,
        data,
      };
    } catch (error) {
      console.error("residential error:", error);
      throw error;
    }
  },
  agent: async () => {
    try {
      const response = await fetch(`${ENV.BASE_URL}${API_ROUTES.USER.AGENT}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      return {
        status: response.status,
        data,
      };
    } catch (error) {
      console.log("agent error:", error);
      throw error;
    }
  },

  agentDetailsBySlug: async (id) => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.USER.AGENT}/slug/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Request failed");
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  location: async () => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.USER.LOCATION}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      // const data = await response.json();
      return response;
    } catch (error) {
      console.error("Location error:", error);
      throw error;
    }
  },
  residentialApi: async (formData) => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.USER.RESIDENTIAL}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();
      console.log("success residentialApi :", response.status, response);
      return {
        success: response.ok,
        status: response.status,
        data,
      };
    } catch (error) {
      console.error("residentialApi error:", error);
      throw error;
    }
  },

  commercialApi: async (formData) => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.USER.COMMERCIAL}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();
      console.log("success commercialApi :", response.status);
      return {
        success: response.ok,
        status: response.status,
        data,
      };
    } catch (error) {
      console.error("commercialApi error:", error);
      throw error;
    }
  },
  landApi: async (formData) => {
    try {
      const response = await fetch(`${ENV.BASE_URL}${API_ROUTES.USER.LAND}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("success Land API :", response.status, response);

      return {
        success: response.ok,
        status: response.status,
        data,
      };
    } catch (error) {
      console.error("landApi error:", error);
      throw error;
    }
  },
  agriculturalApi: async (formData) => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.USER.ARGICULTURAL}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();
      return {
        success: response.ok,
        status: response.status,
        data,
      };
    } catch (error) {
      console.error("agriculturalApi error:", error);
      throw error;
    }
  },

  //  Returning NDJSON (newline-delimited JSON) NOT normal JSON
  category_search: async (params) => {
    try {
      const query = new URLSearchParams(params).toString();
      console.log(
        "`${ENV.BASE_URL}${API_ROUTES.SEARCH.CATEGORY_SEARCH}?${query}`,",
        `${ENV.BASE_URL}${API_ROUTES.SEARCH.CATEGORY_SEARCH}?${query}`,
      );

      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.SEARCH.CATEGORY_SEARCH}?${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      // 🔥 NDJSON handling
      const text = await response.text();

      if (!text) return [];

      const items = text
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line));

      return items;
    } catch (error) {
      console.error("Category Search error:", error);
      throw error;
    }
  },
  residential_category_search: async (slug) => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.SEARCH.RESIDENTIAL_CATEGORY_SEARCH}/slug/${slug}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      // 🔥 NDJSON handling
      const text = await response.text();

      if (!text) return [];

      const items = text
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line));

      return items;
    } catch (error) {
      console.error("residential_category Search error:", error);
      throw error;
    }
  },
  commercial_category_search: async (id) => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.SEARCH.COMMERCIAL_CATEGORY_SEARCH}/slug/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const text = await response.text();

      if (!text) return [];

      const items = text
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line));

      return items;
    } catch (error) {
      console.error("commercial_category Search error:", error);
      throw error;
    }
  },
  land_category_search: async (slug) => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.SEARCH.LAND_CATEGORY_SEARCH}/slug/${slug}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      // 🔥 NDJSON handling
      const text = await response.text();

      if (!text) return [];

      const items = text
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line));

      return items;
    } catch (error) {
      console.error("land_category Search error:", error);
      throw error;
    }
  },
  agricultural_category_search: async (slug) => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.SEARCH.AGRICULTURAL_CATEGORY_SEARCH}/slug/${slug}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      // 🔥 NDJSON handling
      const text = await response.text();

      if (!text) return [];

      const items = text
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line));

      return items;
    } catch (error) {
      console.error("agricultural_category Search error:", error);
      throw error;
    }
  },
};
