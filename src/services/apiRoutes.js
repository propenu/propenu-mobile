import { PROVIDER_DEFAULT } from "react-native-maps";

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/users/auth/request-otp",
    VERIFY_OTP: "/api/users/auth/verify-otp",
    VERIFY_TOKEN: "/api/users/auth/me",
    CREATE_ACCOUNT: "/api/users/auth/request-otp/create",
    REQUEST_OTP: "/api/users/auth/verify-otp/create",
    LOCATION:"/api/users/auth/update-location/create",
    KYC:"/api/users/kyc/start"
  },
  USER: {
    FEATURED_PROJECTS: "/api/properties/featured-project",
    HIGHLIGHT_PROJECTS: "/api/properties/highlight-projects",
    OWNERS_PROPERTIES: "/api/properties/owners-properties",
    ARGICULTURAL: "/api/properties/agricultural",
    LAND: "/api/properties/land",
    COMMERCIAL: "/api/properties/commercial",
    RESIDENTIAL: "/api/properties/residential",
    AGENT: "/api/users/agent",
    LOCATION: "/api/users/location",
  },
  SEARCH: {
    CATEGORY_SEARCH: "/api/properties/search",
    RESIDENTIAL_CATEGORY_SEARCH: "/api/properties/residential",
    COMMERCIAL_CATEGORY_SEARCH: "/api/properties/commercial",
    LAND_CATEGORY_SEARCH: "/api/properties/land",
    AGRICULTURAL_CATEGORY_SEARCH: "/api/properties/agricultural",
  },

  SHORTLIST: {
    SHORTLISTED_PROP: "/api/users/shortlist",
    MY_PROPERTIES: "/api/properties/search/my",
    LEADS: "/api/properties/leads",
    CONTACTED_PROP: "/api/properties/leads/my-contacts",
  },

  AGENT: {
    AGENT_PROFILE: "/api/users/agent",
    AGENT_DETAILS: "/api/users/agent/me/profile",
    GET_AGENT_PROFILE :"/api/users/agent/my"
  },

  BUILDER: {
    BUILDER_ANALYTICS: "/api/users/builder/analytics",
    BUILDER_MYPROPERTIES : "/api/properties/highlight-projects/builder/me",
    BUILDER_FEATURED_PROPERTIES : "/api/properties/highlight-projects/builder/featured/me",
    LEADS:"/api/properties/leads/project/lead"
  },

  PAYMENTS: {
    PAYMENTS_HISTORY: "/api/payments/subscriptions/history",
    MY_SUBSCIPTION : "/api/payments/subscriptions/me",
    PLANS :"/api/payments/plans",
    PAYMENT_CREATE :"/api/payments/create",
    VERIFY_PAYMENT :"/api/payments/verify"
  },
};
