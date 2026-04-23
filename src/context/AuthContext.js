import React, { createContext, useContext, useEffect, useState } from "react";
import { Linking } from "react-native";
import * as Keychain from "react-native-keychain";
import { setItem } from "../utils/Storage";
import { apiService } from "../services/apiService";

const AuthContext = createContext(null);

const getStoredToken = async () => {
  const credentials = await Keychain.getGenericPassword();
  return credentials?.password || null;
};

const isKycCallbackUrl = (url) => {
  if (!url) return false;

  const normalizedUrl = url.toLowerCase();

  return (
    normalizedUrl.includes("kyc") ||
    normalizedUrl.includes("onboarding-complete")
  );
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  const syncAuthFromStoredToken = async () => {
    const token = await getStoredToken();

    if (!token) {
      return false;
    }

    const tokenResult = await apiService.verifyToken(token);

    if (tokenResult?.status !== 200 || !tokenResult?.data) {
      return false;
    }

    const data = tokenResult.data;

    if (data?.token) {
      await Keychain.setGenericPassword("token", data.token);
    }

    if (data?.user) {
      await setItem("user", JSON.stringify(data.user));
    }

    setIsLoggedIn(true);
    setUserDetails(data?.user || null);

    return true;
  };

  const refreshAuth = async () => {
    try {
      setIsChecking(true);

      const token = await getStoredToken();

      if (!token) {
        console.log("No token found in keychain");
        setIsLoggedIn(false);
        setUserDetails(null);
        return;
      }

      const isSynced = await syncAuthFromStoredToken();

      if (!isSynced) {
        setIsLoggedIn(false);
        setUserDetails(null);
        await Keychain.resetGenericPassword();
      }
    } catch (e) {
      console.log("Auth refresh error", e);
      setIsLoggedIn(false);
      setUserDetails(null);
    } finally {
      setIsChecking(false);
    }
  };

  const updateUserDetails = async (newData) => {
    try {
      const updatedUser = { ...userDetails, ...newData };

      setUserDetails(updatedUser);

      await setItem("user", JSON.stringify(updatedUser));
    } catch (e) {
      console.log("Update user error:", e);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  useEffect(() => {
    const handleIncomingUrl = async (url) => {
      if (!isKycCallbackUrl(url)) {
        return;
      }

      try {
        setIsChecking(true);
        const isSynced = await syncAuthFromStoredToken();

        if (!isSynced) {
          console.log("Unable to refresh auth after KYC callback");
        }
      } catch (error) {
        console.log("KYC callback error", error);
      } finally {
        setIsChecking(false);
      }
    };

    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleIncomingUrl(url);
    });

    Linking.getInitialURL().then(handleIncomingUrl).catch((error) => {
      console.log("Initial URL error", error);
    });

    return () => subscription.remove();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isChecking,
        userDetails,
        refreshAuth,
        updateUserDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
