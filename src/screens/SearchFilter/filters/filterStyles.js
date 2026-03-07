import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    //  position:"relative",
  },
  content: {
    paddingVertical: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  filterCount: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "white",
  },

  filterCountText: {
    color: "white",
    fontSize: 12,
    fontWeight: 500,
    textAlign: "center",
  },
  moreFilterHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginVertical: 8,
  },
  badge: {
    backgroundColor: "#27AE60",
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  moreFilterText: {
    flex: 1,
    fontWeight: "500",
    fontSize: 14,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  budget: {
    flexDirection: "row",
    gap: 8,
    // marginHorizontal: 8,
    marginVertical: 5,
  },
  budgetArea: {
    // flexDirection: "row",
    marginTop: 5,
    gap: 8,
  },
  minMaxBudget: {
    flex: 1,
  },
  contentBar: {
    // padding: 5,
    marginVertical: 5,
    // shadowColor: "gray",
    // shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
    // borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 5,
    paddingVertical: 10,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  locationScroll: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedLoc: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginVertical: 10,
  },

  subTitle: {
    fontSize: 14,
    fontWeight: 500,
    // paddingLeft: 8,
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  addButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  searchIcon: {
    // marginRight: 2,
  },
  localitiesHeading: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 10,
  },

  localitiesText: {
    fontSize: 13,
    fontWeight: 400,
    paddingVertical: 3,
  },

  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
  },

  chipContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E9F7EF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    // marginRight: 10, // spacing between chips
    // gap: 6,
  },

  chipText: {
    color: "#1E8449",
    fontSize: 13,
    fontWeight: "500",
    paddingRight: 3,
  },

  buttonBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    // backgroundColor: "#F0FDF4",
    paddingVertical: 5,
    // marginTop: 10,
  },

  clearText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#27AE60",
  },
  clearButton: {
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#27AE60",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },

  nextButton: {
    // paddingHorizontal: 50,
    // marginBottom:10,
    // marginTop: 10,
    width: "40%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#27AE60",
  },

  nextText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  toggleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 10,
    paddingHorizontal: 2,
    gap: 10,
  },
  bhkData: {
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  optionActive: {
    borderColor: "#22c55e",
    // backgroundColor: "#dcfce7",
  },
  labelText: {
    fontSize: 12,
    // color:"gray"
  },
  lableSelectText:{
    fontSize:13, 
    fontWeight:500
  },

  activeChip: {
    backgroundColor: "#E9F7EF",
    borderColor: "#27AE60",
  },
  activeChipText: {
    color: "#27AE60",
    fontWeight: "500",
  },
  option: {
    paddingVertical: 8,
  },
  activeOption: {
    backgroundColor: "#f2f2f2",
  },

  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    // backgroundColor:"green",
    borderRadius: 6,
  },

  activeBtn: {
    backgroundColor: "#27AE60",
  },

  toggleText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
  heading: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    paddingLeft: 15,
    fontWeight: "600",
    color: "#111827",
  },

  sectionContainer: {
    flexDirection: "row",
    // height: 420,
    // backgroundColor: "#fff",
  },

  leftPanel: {
    width: 130,
    marginBottom: 12,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },

  leftItem: {
    paddingVertical: 11,
    paddingLeft: 10,
    // paddingRight: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  leftItemActive: {
    backgroundColor: "#F0FDF4",
    // backgroundColor: "#fff",
  },

  leftText: {
    fontSize: 12,
    fontWeight: "500",
    // color: "#374151",
  },

  leftTextActive: {
    color: "#16A34A",
    fontSize: 13,
    fontWeight: "600",
  },

  rightPanel: {
    // flex: 1,
    marginHorizontal: 12,
    marginTop: 4,
    // marginBottom: 40,
  },

  section: {
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },

  optionText: {
    fontSize: 12,
    color: "#111827",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#999",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  checkedBox: {
    borderColor: "#27A361",
    backgroundColor: "#27A361",
  },

  innerCheck: {
    width: 10,
    height: 10,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#999",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  radioOuterSelected: {
    borderColor: "#27AE60",
  },

  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#27AE60",
  },
});
