// // constants/amenities.ts
// export const AMENITIES = [
//   { key: "lift", title: "Lift" },
//   { key: "power-backup", title: "Power Backup" },
//   { key: "gym", title: "Gym" },
//   { key: "swimming-pool", title: "Swimming Pool" },
//   { key: "club-house", title: "Club House" },
//   { key: "children-play", title: "Children’s Play Area" },
//   { key: "garden", title: "Garden" },
//   { key: "security", title: "24x7 Security" },
// ];

// export const COMMERCIAL_AMENITIES = [
//   { key: "power-backup", title: "Power Backup" },
//   { key: "security", title: "24x7 Security" },
//   { key: "cctv", title: "CCTV Surveillance" },
//   { key: "fire-safety", title: "Fire Safety" },
//   { key: "central-ac", title: "Central AC" },
//   { key: "pantry", title: "Pantry" },
//   { key: "conference-room", title: "Conference Room" },
//   { key: "reception", title: "Reception Area" },
//   { key: "furnished", title: "Furnished" },
//   { key: "wifi", title: "WiFi / Internet" },
//   { key: "maintenance", title: "Maintenance Staff" },
// ];

// export const LAND_AMENITIES = [
//   { key: "gated-community", title: "Gated Community" },
//   { key: "street-light", title: "Street Lights" },
//   { key: "drainage", title: "Underground Drainage" },
//   { key: "water-connection", title: "Water Connection" },
//   { key: "electricity", title: "Electricity Available" },
//   { key: "park", title: "Park / Open Space" },
//   { key: "avenue-plantation", title: "Avenue Plantation" },
//   { key: "boundary", title: "Compound Fencing" },
//   { key: "rainwater", title: "Rain Water Harvesting" },
//   { key: "sewage", title: "Sewage Line" },
// ];
// export const AGRICULTURE_AMENITIES = [
//   { key: "borewell", title: "Borewell" },
//   { key: "irrigation", title: "Irrigation Facility" },
//   { key: "farm-road", title: "Farm Road Access" },
//   { key: "electric-pole", title: "Electric Pole Nearby" },
//   { key: "water-source", title: "Water Source Nearby" },
//   { key: "fencing", title: "Fencing" },
// ];


export const AmenityCategory =
  "Sports" |
  "Convenience" |
  "Safety" |
  "Environment" |
  "Land" |
  "Water" |
  "Power" |
  "Infrastructure" |
  "Connectivity";

export const RESIDENTIAL_AMENITIES = [
  {
    key: "gym",
    title: "Gym",
    category: "Sports",
  },
  {
    key: "swimming_pool",
    title: "Swimming Pool",
    category: "Sports",
  },
  {
    key: "jogging_track",
    title: "Jogging Track",
    category: "Sports",
  },
  {
    key: "children_play",
    title: "Kid's Play Area",
    category: "Sports",
  },

  // 🏢 Convenience
  {
    key: "elevator",
    title: "Elevator",
    category: "Convenience",
  },
  {
    key: "power_backup",
    title: "Power Backup",
    category: "Convenience",
  },
  {
    key: "club_house",
    title: "Club House",
    category: "Convenience",
  },
  {
    key: "visitor_parking",
    title: "Visitor Parking",
    category: "Convenience",
  },

  // 🔐 Safety
  {
    key: "security",
    title: "24x7 Security",
    category: "Safety",
  },
  {
    key: "cctv_video_surveillance",
    title: "CCTV Video Surveillance",
    category: "Safety",
  },
  {
    key: "fire_fighting_systems",
    title: "Fire Fighting Systems",
    category: "Safety",
  },
  {
    key: "video_intercom",
    title: "Video Intercom",
    category: "Safety",
  },

  // 🌱 Environment
  {
    key: "park",
    title: "Park",
    category: "Environment",
  },
  {
    key: "rain_water_harvesting",
    title: "Rain water Harvesting",
    category: "Environment",
  },
  {
    key: "solar_lighting",
    title: "Solar Lighting",
    category: "Environment",
  },
];

export const COMMERCIAL_AMENITIES = [
  // 🏃 Sports
  {
    key: "gym",
    title: "Gym",
    category: "Sports",
  },
  {
    key: "swimming_pool",
    title: "Swimming Pool",
    category: "Sports",
  },

  // 🏢 Convenience
  {
    key: "elevator",
    title: "Elevator",
    category: "Convenience",
  },
  {
    key: "power_backup",
    title: "Power Backup",
    category: "Convenience",
  },
  {
    key: "visitor_parking",
    title: "Visitor Parking",
    category: "Convenience",
  },
  {
    key: "atms",
    title: "ATMs",
    category: "Convenience",
  },
  {
    key: "ac_waiting_lobby",
    title: "AC Waiting Lobby",
    category: "Convenience",
  },
  {
    key: "parking",
    title: "Parking",
    category: "Convenience",
  },
  {
    key: "valet_parking",
    title: "Valet Parking",
    category: "Convenience",
  },
  {
    key: "podium_parking",
    title: "Podium Parking",
    category: "Convenience",
  },
  {
    key: "multi_level_parking",
    title: "Multi Level Parking",
    category: "Convenience",
  },

  {
    key: "front_desk_service",
    title: "Front Desk Service",
    category: "Convenience",
  },
  {
    key: "centralized_ac",
    title: "Centralized AC",
    category: "Convenience",
  },
  {
    key: "water_supply",
    title: "24x7 Water Supply",
    category: "Convenience",
  },
  {
    key: "separate_entry_or_exit_gates",
    title: "Separate Entry or Exit Gates",
    category: "Convenience",
  },

  {
    key: "automatic_boom_barriers",
    title: "Automatic Boom Barriers",
    category: "Convenience",
  },
  {
    key: "cafe_or_coffee_bar",
    title: "Cafe or Coffee Bar",
    category: "Convenience",
  },

  // 🔐 Safety
  {
    key: "security",
    title: "24x7 Security",
    category: "Safety",
  },
  {
    key: "cctv_video_surveillance",
    title: "CCTV Video Surveillance",
    category: "Safety",
  },
  {
    key: "fire_fighting_systems",
    title: "Fire Fighting Systems",
    category: "Safety",
  },
  {
    key: "smoke_or_heat_sensors",
    title: "Smoke or Heat Sensors",
    category: "Safety",
  },
  {
    key: "smart_card_access",
    title: "Smart Card Access",
    category: "Safety",
  },
  {
    key: "emergency_rescue_alarms",
    title: "Emergency Rescue Alarms",
    category: "Safety",
  },
  {
    key: "solar_lighting",
    title: "Solar Lighting",
    category: "Environmental",
  },
  {
    key: "igbc_certified_building",
    title: "IGBC Certified Building",
    category: "Environmental",
  },
];

export const LAND_AMENITIES = [
  {
    key: "water_supply",
    title: "24x7 Water Supply",
    category: "Land",
    icon: "/icons/amenities/24x7_water_supply.svg",
  },

  // 💧 Water
  {
    key: "borewell_open_well",
    title: "Borewell Open Well",
    category: "Water",
    icon: "/icons/amenities/borewell_open_well.svg",
  },

  // ⚡ Power
  {
    key: "electricity_connection",
    title: "Electricity Connection",
    category: "Power",
    icon: "/icons/amenities/electricity_connection.svg",
  },
  {
    key: "solar_power_provision",
    title: "Solar Power Provision",
    category: "Power",
    icon: "/icons/amenities/solar_power_provision.svg",
  },

  // 🛣 Connectivity
  {
    key: "near_highway",
    title: "Near Highway",
    category: "Connectivity",
    icon: "/icons/amenities/near_highway.svg",
  },
  {
    key: "close_to_village",
    title: "Close to Village",
    category: "Connectivity",
    icon: "/icons/amenities/close_to_village.svg",
  },

  // 🔐 Security
  {
    key: "cctv_video_surveillance",
    title: "CCTV Video Surveillance",
    category: "Safety",
    icon: "/icons/amenities/cctv_video_surveillance.svg",
  },
];

export const AGRICULTURE_AMENITIES = [
  // 🌿 Land
  {
    key: "levelled_or_semi_levelled_land",
    title: "Levelled or Semi-Levelled Land",
    category: "Land",
    icon: "/icons/amenities/levelled_or_semi-levelled_land.svg",
  },
  {
    key: "river_harvesting_system",
    title: "River Harvesting System",
    category: "Water",
    icon: "/icons/amenities/river_harvesting_system.svg",
  },

  // 💧 Water Resources
  {
    key: "drip_irrigation_facility",
    title: "Drip Irrigation Facility",
    category: "Water",
    icon: "/icons/amenities/drip_irrigation_facility.svg",
  },
  {
    key: "sprinkler_irrigation_system",
    title: "Sprinkler Irrigation System",
    category: "Water",
    icon: "/icons/amenities/sprinkler_irrigation_system.svg",
  },
  {
    key: "canal_river_water_access",
    title: "Canal River Water Access",
    category: "Water",
    icon: "/icons/amenities/canal_river_water_access.svg",
  },

  // ⚡ Power
  {
    key: "water_pump_set",
    title: "Water Pump Set",
    category: "Power",
    icon: "/icons/amenities/water_pump_set.svg",
  },
  {
    key: "solar_power_provision",
    title: "Solar Power Provision",
    category: "Power",
    icon: "/icons/amenities/solar_power_provision.svg",
  },
  {
    key: "electricity_connection",
    title: "Electricity Connection",
    category: "Power",
    icon: "/icons/amenities/electricity_connection.svg",
  },

  // 🚜 Infrastructure
  {
    key: "cattle_shed",
    title: "Cattle Shed",
    category: "Infrastructure",
    icon: "/icons/amenities/cattle_shed.svg",
  },
  {
    key: "motor_shed",
    title: "Motor Shed",
    category: "Infrastructure",
    icon: "/icons/amenities/motor_shed.svg",
  },
  {
    key: "greenhouse",
    title: "Greenhouse",
    category: "Infrastructure",
    icon: "/icons/amenities/greenhouse.svg",
  },

  // 🏡 Residential Support
  {
    key: "watchman_room",
    title: "Watchman Room",
    category: "Infrastructure",
    icon: "/icons/amenities/watchman_room.svg",
  },
  {
    key: "toilets_wash_area",
    title: "Toilets and Wash Area",
    category: "Infrastructure",
    icon: "/icons/amenities/toilets_wash_area.svg",
  },
  {
    key: "cctv_video_surveillance",
    title: "CCTV Video Surveillance",
    category: "Safety",
    icon: "/icons/amenities/cctv_video_surveillance.svg",
  },
];

export const FEATURED_PROJECT_AMENITIES = [
  { key: "swimming_pool", title: "Swimming Pool" },
  { key: "kids_pool", title: "Kids Pool" },
  { key: "gym", title: "Gym" },
  { key: "yoga_hall", title: "Yoga Hall" },
  { key: "spa", title: "Spa & Wellness Center" },
  { key: "club_house", title: "Club House" },
  { key: "mini_theatre", title: "Mini Theatre" },
  { key: "co_working", title: "Co-Working Space" },

  { key: "garden", title: "Landscaped Garden" },
  { key: "jogging_track", title: "Jogging Track" },
  { key: "open_lawn", title: "Open Lawn" },
  { key: "kids_play_area", title: "Children's Play Area" },
  { key: "basketball_court", title: "Basketball Court" },
  { key: "tennis_court", title: "Tennis Court" },

  { key: "cctv", title: "CCTV Surveillance" },
  { key: "security", title: "24x7 Security" },
  { key: "video_door_phone", title: "Video Door Phone" },
  { key: "fire_safety", title: "Fire Safety System" },

  { key: "covered_parking", title: "Covered Parking" },
  { key: "visitor_parking", title: "Visitor Parking" },
  { key: "ev_charging", title: "EV Charging Station" },
  { key: "wheelchair_access", title: "Wheelchair Access" },

  { key: "power_backup", title: "Power Backup" },
  { key: "lift", title: "High Speed Elevators" },
  { key: "water_harvesting", title: "Rain Water Harvesting" },
  { key: "solar_lighting", title: "Solar Lighting" },
];
