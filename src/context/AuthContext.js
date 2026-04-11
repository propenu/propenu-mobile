import React, { createContext, useContext, useEffect, useState } from "react";
import * as Keychain from "react-native-keychain";
import { getItem, setItem } from "../utils/Storage";
import { apiService } from "../services/apiService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  const refreshAuth = async () => {
    try {
      setIsChecking(true);

      const credentials = await Keychain.getGenericPassword();

      if (!credentials) {
        console.log("No token found in keychain");
        setIsLoggedIn(false);
        setUserDetails(null);
        return;
      }

      const token = credentials.password;
      const tokenResult = await apiService.verifyToken(token);

      if (tokenResult?.status === 200 && tokenResult?.data) {
        const data = tokenResult.data;

        if (data?.token) {
          await Keychain.setGenericPassword("token", data.token);
        }

        setIsLoggedIn(true);
        setUserDetails(data?.user || null);
      } else {
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
