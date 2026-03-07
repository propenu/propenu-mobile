import { createSlice } from "@reduxjs/toolkit";

/* ---------------- Initial State ---------------- */

const initialState = {
  listingTypeLabel: "Buy",
  listingTypeValue: "buy",

  // category: "Residential",
  category: "null",

  searchText: "",

  /* Budget (shared) */
  minBudget: 5,
  maxBudget: 5000,

  /* Category buckets */
  residential: {},
  commercial: {},
  land: {},
  agricultural: {},
};

/* ---------------- Slice ---------------- */

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    /* -------- Core -------- */

    setListingType(state, action) {
      state.listingTypeLabel = action.payload.label;
      state.listingTypeValue = action.payload.value;
    },

    setCategory(state, action) {
      state.category = action.payload;
    },

    setSearchText(state, action) {
      state.searchText = action.payload;
    },

    /* -------- Budget -------- */

    setBudget(state, action) {
      state.minBudget = action.payload.min;
      state.maxBudget = action.payload.max;
    },

    /* -------- Residential -------- */

    // setResidentialFilter(state, action) {
    //   const { key, value } = action.payload;
    //   state.residential[key] = value;
    // },

    setResidentialFilter(state, action) {
       const { key, value } = action.payload;
      state.residential[key] = value;
      // const { key, value } = action.payload;

      // const existingValue = state.residential[key];

      // // if already array → handle multiple selection
      // if (Array.isArray(existingValue)) {
      //   if (existingValue.includes(value)) {
      //     // remove (unselect)
      //     const updated = existingValue.filter((item) => item !== value);

      //     if (updated.length === 0) {
      //       delete state.residential[key]; // remove key if empty
      //     } else {
      //       state.residential[key] = updated;
      //     }
      //   } else {
      //     // add
      //     state.residential[key] = [...existingValue, value];
      //   }
      // } else if (existingValue) {
      //   // convert single value → array
      //   state.residential[key] = [existingValue, value];
      // } else {
      //   // first value
      //   state.residential[key] = [value];
      // }
    },

    /* -------- Commercial -------- */

    setCommercialFilter(state, action) {
      const { key, value } = action.payload;
      state.commercial[key] = value;
    },

    /* -------- Land -------- */

    setLandFilter(state, action) {
      const { key, value } = action.payload;
      state.land[key] = value;
    },

    /* -------- Agricultural -------- */

    setAgriculturalFilter(state, action) {
      const { key, value } = action.payload;
      state.agricultural[key] = value;
    },

    /* -------- Reset Helpers -------- */

    resetResidentialFilters(state) {
      state.residential = {};
    },

    resetCommercialFilters(state) {
      state.commercial = {};
    },

    resetLandFilters(state) {
      state.land = {};
    },

    resetAgriculturalFilters(state) {
      state.agricultural = {};
    },
  },
});

/* ---------------- Exports ---------------- */

export const {
  setListingType,
  setCategory,
  setSearchText,
  setBudget,

  setResidentialFilter,
  setCommercialFilter,
  setLandFilter,
  setAgriculturalFilter,

  resetResidentialFilters,
  resetCommercialFilters,
  resetLandFilters,
  resetAgriculturalFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
