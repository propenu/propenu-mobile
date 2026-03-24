import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { agentServices } from "../../services/agentServices";
import Octicons from "@expo/vector-icons/Octicons";
import { NotVerified, Verified } from "../../../assets/svg/Logo";
import RazorpayCheckout from "react-native-razorpay";
import { ToastSuccess } from "../../utils/Toast";
import { useAuth } from "../../context/AuthContext";

const BuyViewPlans = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { userDetails } = useAuth();
  const flatListRef = useRef(null);

  const { data: plans, isLoading } = useQuery({
    queryKey: ["buy"],
    queryFn: () =>
      agentServices.getMyPlans({
        userType: "owner",
        category: "buy",
      }),
  });

  useEffect(() => {
    if (plans?.length > 1) {
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: 250,
          animated: false,
        });
      }, 0);
    }
  }, [plans]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#27AE60" />
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderPlanCard = ({ item }) => {
    const handleSubscribe = async (plan) => {
      try {
        const order = await agentServices.createPaymentOrder({
          planId: plan._id,
          userType: "agent",
        });

        if (order?.free) {
          ToastSuccess("Plan activated successfully");
          navigation.navigate("Membership");
          return;
        }

        const options = {
          key: order.key,
          amount: order.amount,
          currency: order.currency,
          order_id: order.orderId,
          name: "Propenu",
          description: `${plan.name} Plan Subscription (${"user"})`,

          prefill: {
            name: userDetails?.name || "",
            email: userDetails?.email || "",
          },

          theme: { color: "#27AE60" },
        };

        RazorpayCheckout.open(options)
          .then(async (response) => {
            await agentServices.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            navigation.navigate("Membership");
          })
          .catch((error) => {
            console.log("Payment Error:", error);
          });
      } catch (err) {
        console.error("Payment failed", err);
      }
    };
    return (
      <View style={styles.card}>
        <View style={styles.planSection}>
          <Text style={styles.planName}>{item.name}</Text>
          <Text style={styles.price}>
            ₹ {item.price}/-{" "}
            {/* <Text style={styles.validity}>
              {item.durationDays} Days validity
            </Text> */}
          </Text>
        </View>
        <View style={styles.features}>
          <View style={[styles.subComponent, { marginTop: 8 }]}>
            <Verified width={16} height={16} />
            <Text style={styles.text}>{item?.category}</Text>
          </View>
          <View style={[styles.subComponent, { marginTop: 8 }]}>
            <Verified width={16} height={16} />
            <Text style={styles.text}>{item.durationDays} Days validity</Text>
          </View>
          <View style={[styles.subComponent]}>
            <Verified width={16} height={16} />
            <Text style={styles.text}>
              Up to {item?.features?.CONTACT_OWNER_LIMIT} property owners
            </Text>
          </View>
          {item?.features?.LEAD_DASHBOARD ? (
            <View style={styles.subComponent}>
              <Verified width={16} height={16} />
              <Text style={styles.text}>Access Lead Dashboard</Text>
            </View>
          ) : (
            <View style={styles.subComponent}>
              <NotVerified width={16} height={16} />
              <Text
                style={[
                  styles.text,
                  { color: "gray"},
                ]}
              >
                Access Lead Dashboard
              </Text>
            </View>
          )}
          {item?.features?.PROPERTY_COMPARISON ? (
            <View style={styles.subComponent}>
              <Verified width={16} height={16} />
              <Text style={styles.text}>Compare Properties</Text>
            </View>
          ) : (
            <View style={styles.subComponent}>
              <NotVerified width={16} height={16} />
              <Text
                style={[
                  styles.text,
                  { color: "gray"},
                ]}
              >
                Compare Properties
              </Text>
            </View>
          )}

          <Pressable
            style={styles.buyButton}
            onPress={() => handleSubscribe(item)}
          >
            <Text style={styles.buyText}>Buy Now</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.mainContainer, { paddingBottom: insets.bottom + 5 }]}
    >
      <Text style={styles.heading}>Get Premium</Text>
      <Text style={styles.subText}>
        Get quick access to more owner contacts and properties.
      </Text>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={plans}
          horizontal
          showsHorizontalScrollIndicator={false}
          //   initialScrollIndex={1}
          //   getItemLayout={(data, index) => ({
          //     length: 270, // width of your card
          //     offset: 270 * index,
          //     index,
          //   })}
          keyExtractor={(item) => item._id}
          renderItem={renderPlanCard}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 5 }}
        />
      </View>
      <Text style={styles.subText}>
        Call or Whatsapp with us -{" "}
        <Text style={{ color: "#27Ae60", fontWeight: 500 }}>
          Get Assistance
        </Text>
      </Text>
      <Text style={styles.subText}>
        Note : After your subscription ends, your property listing will remain
        live but will not avail subscription features
      </Text>
    </SafeAreaView>
  );
};
export default BuyViewPlans;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 10,
    justifyContent: "center",
  },
  heading: {
    color: "#27AE60",
    fontSize: 17,
    fontWeight: 600,
    alignSelf: "center",
    // marginTop: 10,
    paddingHorizontal: 10,
  },
  subText: {
    color: "#818080",
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 30,
    paddingTop: 20,
    lineHeight: 22,
  },
  container: {
    // paddingHorizontal: 10,
    marginVertical: 40,
  },
  planSection: {
    backgroundColor: "#F4FBF6",
    paddingBottom: 5,
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 14,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  features: {
    paddingBottom: 14,
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 7,
  },
  card: {
    width: 270,
    // height: 300,
    backgroundColor: "white",
    marginRight: 18,
    // padding: 14,
    borderRadius: 10,
    elevation: 2,
  },
  planName: {
    color: "#27AE60",
    fontSize: 16,
    fontWeight: 600,
  },
  validity: {
    color: "#000",
    fontSize: 11,
    fontWeight: 400,
  },
  price: {
    fontSize: 15,
    fontWeight: 600,
    marginTop: 5,
    marginBottom: 10,
  },
  subComponent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  text: {
    fontSize: 13,
    marginLeft: 7,
  },
  buyButton: {
    backgroundColor: "#27AE60",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 6,
    marginVertical: 10,
  },
  buyText: {
    color: "white",
    fontWeight: 500,
  },
});
