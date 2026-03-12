import React, { useEffect, useState } from "react";
import { StyleSheet, Pressable } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { userServices } from "../../services/userServices";
import { useAuth } from "../../context/AuthContext";
import { ToastSuccess } from "../../utils/Toast";
import { getItem, setItem } from "../../utils/Storage";
import { useQueryClient } from "@tanstack/react-query";
const LikedIconContainer = ({ slug, id, type }) => {
  const [liked, setLiked] = useState(false);
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    checkInitialStatus();
  }, [slug]);

const checkInitialStatus = async () => {
  try {
    if (!isLoggedIn) {
      const stored = await getItem("guest_shortlist");
      const parsed = stored ? JSON.parse(stored) : [];

      const exists = parsed.some((item) => item.propertyId === id);
      setLiked(exists);
      return;
    }

    const res = await userServices.getShortlistedProperties();

    const exists = res?.data?.some((item) => item?.property?.slug === slug);
    setLiked(exists);
  } catch (error) {
    console.log("Error fetching shortlist:", error);
  }
};

  const postShortlisted = async () => {
    const payload = {
      propertyId: id,
      propertyType: type,
    };

    return await userServices.postShortlistedProperties(payload);
  };

  const deleteShortlisted = async () => {
    return await userServices.deleteShortlistedProperty(id);
  };

  // const handleToggle = async () => {
  //   if (!isLoggedIn) return;

  //   const previous = liked;

  //   try {
  //     setLiked(!previous);

  //     let res;

  //     if (previous) {
  //       res = await deleteShortlisted();
  //     } else {
  //       res = await postShortlisted();
  //     }

  //     if (res?.success) {
  //       ToastSuccess(
  //         previous ? "Property removed from shortlist" : "Property shortlisted",
  //       );
  //     } else {
  //       setLiked(previous);
  //     }
  //   } catch (error) {
  //     console.log("Shortlist error:", error);
  //     setLiked(previous);
  //   }
  // };

  const handleToggle = async () => {
    const previous = liked;

    const payload = {
      propertyId: id,
      propertyType: type,
    };

    try {
      setLiked(!previous);

      //If user not logged in, store locally
      if (!isLoggedIn) {
        const stored = await getItem("guest_shortlist");
        const parsed = stored ? JSON.parse(stored) : [];

        if (!previous) {
const exists = parsed.some((item) => item.propertyId === id);

if (!exists) {
  parsed.push(payload);
}        } else {
          const updated = parsed.filter((item) => item.propertyId !== id);
          await setItem("guest_shortlist", JSON.stringify(updated));
          return;
        }

        await setItem("guest_shortlist", JSON.stringify(parsed));

        ToastSuccess(
          previous ? "Property removed from shortlist" : "Property shortlisted",
        );

        return;
      }

      let res;

      if (previous) {
        res = await deleteShortlisted();
      } else {
        res = await postShortlisted();
      }

      if (res?.success) {
        queryClient.invalidateQueries(["shortlistedProperties"]);

        ToastSuccess(
          previous ? "Property removed from shortlist" : "Property shortlisted",
        );
      } else {
        setLiked(previous);
      }
    } catch (error) {
      console.log("Shortlist error:", error);
      setLiked(previous);
    }
  };

  return (
    <Pressable
      onPress={handleToggle}
      hitSlop={6}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <Entypo name="heart" size={18} color={liked ? "#DD3355" : "#575555"} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "rgba(241, 237, 237, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});

export default LikedIconContainer;
