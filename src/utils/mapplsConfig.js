import { Platform } from "react-native";
import MapplsGL from "mappls-map-react-native";

let hasConfiguredMappls = false;

const IOS_CONFIG_HINT =
  "iOS Mappls auth looks invalid. Re-download the iOS config files for bundle id com.propenu.app from the Mappls Console and replace the files in ios/Propenu/Supporting.";

function isFunction(value) {
  return typeof value === "function";
}

function isAuthorizationMessage(message = "") {
  const normalized = String(message).toLowerCase();

  return (
    normalized.includes("401") ||
    normalized.includes("unauthor") ||
    normalized.includes("authoriz") ||
    normalized.includes("token") ||
    normalized.includes("forbidden") ||
    normalized.includes("failed to load tile")
  );
}

export function initializeMappls() {
  if (hasConfiguredMappls) {
    return;
  }

  hasConfiguredMappls = true;

  try {
    if (isFunction(MapplsGL.setRegion)) {
      MapplsGL.setRegion("IND");
    }

    if (isFunction(MapplsGL.setShowLastSelectedStyle)) {
      MapplsGL.setShowLastSelectedStyle(true);
    }

    if (Platform.OS === "ios" && isFunction(MapplsGL.setDeveloperShowingSplash)) {
      // Passing false here keeps the native authorization failure overlay visible.
      MapplsGL.setDeveloperShowingSplash(false);
    }
  } catch (error) {
    console.warn("Mappls initialization failed:", error);
  }
}

export function buildMapplsHandlers(screenName) {
  const prefix = `[Mappls:${screenName}]`;

  return {
    onMapError(error) {
      const message = error?.message || "Unknown map error";
      console.error(`${prefix} error ${error?.code ?? "NA"}: ${message}`);

      if (Platform.OS === "ios" && isAuthorizationMessage(message)) {
        console.error(`${prefix} ${IOS_CONFIG_HINT}`);
      }
    },

    onMapReinit(event) {
      const message = event?.message || "Map reinitialized";
      console.warn(
        `${prefix} reinit ${event?.code ?? "NA"} after ${event?.reinitAfter ?? "NA"}ms: ${message}`,
      );

      if (Platform.OS === "ios" && isAuthorizationMessage(message)) {
        console.error(`${prefix} ${IOS_CONFIG_HINT}`);
      }
    },

    onDidFailLoadingMap() {
      console.warn(`${prefix} map style failed to load.`);
    },
  };
}
