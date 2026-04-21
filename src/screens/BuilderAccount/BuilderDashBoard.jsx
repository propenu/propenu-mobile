import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import KpiCard from "../AgentAccount/ui/KpiCard";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { builderServices } from "../../services/builderServices";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { PieChart, BarChart } from "react-native-chart-kit";
import useDimensions from "../../components/CustomHooks/UseDimension";
import TopViewedProjects from "./TopViewedProjects";

const BuilderDashBoard = () => {
  const insets = useSafeAreaInsets();
  const { width } = useDimensions();

  {
    /*----------------Calling API----------------*/
  }
  const { data, error, isLoading } = useQuery({
    queryKey: ["BuilderDashBoardData"],
    queryFn: builderServices.getBuilderAnalytics,
  });

  console.log("data", data);
  if (error) {
    console.log("Error when getting builder Data", error);
  }
  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" style={{ color: "#27AE60" }} />
        <Text>Loading...</Text>
      </View>
    );
  }

  /* ----------------KPIS----------------*/
  const activeCount = data?.status?.find((s) => s._id === "active")?.count ?? 0;

  const pendingCount =
    data?.status?.find((s) => s._id === "pending")?.count ?? 0;

  const kpis = {
    totalProperties: data?.builderSummary?.totalProjects ?? 0,
    featuredProjects: data?.builderSummary?.featuredProjects ?? 0,
    totalViews: data?.builderSummary?.totalViews,
  };

  /* ----------------PIE----------------*/

  const featuredCount =
    data?.featuredSplit?.find((f) => f._id === true)?.count ?? 0;
  const nonFeaturedCount =
    data?.featuredSplit?.find((f) => f._id === false)?.count ?? 0;

  const featuredPieData = [
    {
      name: "Featured",
      population: featuredCount,
      color: "#22C55E",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
    {
      name: "Non-Featured",
      population: nonFeaturedCount,
      color: "#94A3B8",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
  ];

  /* -----------------city bar chart data----------------*/
  const formattedCityData = {
    labels: data?.locationStats?.cities?.map((item) => item._id) ?? [],
    datasets: [
      {
        data: data?.locationStats?.cities?.map((item) => item.count) ?? [],
      },
    ],
  };

  /* ------------------State bar chart data----------------*/
  const formattedStateData = {
    labels: data?.locationStats?.states?.map((item) => item._id) ?? [],
    datasets: [
      {
        data: data?.locationStats?.states?.map((item) => item.count) ?? [],
      },
    ],
  };

  /* ----------------UI----------------*/
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: insets.bottom + 10,
      }}
    >
      <View>
        <Text style={[styles.title]}>Builder Analytics Dashboard</Text>
        <Text style={styles.small}>
          Track your property performance and leads
        </Text>

        {/*-------------------KPI Section ----------------*/}
        <View style={styles.kpiGrid}>
          <KpiCard
            title="Total Projects"
            value={kpis.totalProperties}
            icon={<Entypo name="home" size={16} color="#5752ec" />}
            bgColor="#F5F9FF"
            iconBgColor="#E0ECFF"
          />
          <KpiCard
            title="Total Views"
            value={kpis.totalViews}
            icon={
              <MaterialCommunityIcons name="eye" size={16} color="#27AE60" />
            }
            bgColor="#F3FBF7"
            iconBgColor="#DFF4E8"
          />
          <KpiCard
            title="Featured Projects"
            value={kpis.featuredProjects}
            icon={<FontAwesome name="star" size={16} color="orange" />}
            bgColor="#FFF7ED"
            iconBgColor="#FFE7CC"
          />
          {/* <KpiCard
            title="Pending Listings"
            value={kpis.pendingListings}
            icon={
              <MaterialIcons name="pending-actions" size={17} color="#bd2d2d" />
            }
            bgColor="#FFF5F5"
            iconBgColor="#FFEBEB"
          /> */}
        </View>

        {/*--------------------Featured (PieCahrt) Removed after api changes----------------*/}
        {/* <View style={styles.card}>
          <Text style={styles.subTitle}>Featured Split</Text>
          <PieChart
            data={featuredPieData}
            width={width - 40}
            height={170}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            }}
            accessor={"population"}
            backgroundColor={"transparent"}
            // paddingLeft={"15"}
            absolute
          />
        </View> */}
        {/*--------------------Top Cities (BarChart)----------------*/}
        <View style={styles.card}>
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.subTitle}>Top Cities</Text>
            <Text style={styles.smallText}>
              Performance of your listings across different cities
            </Text>
          </View>

          <BarChart
            data={formattedCityData}
            width={width - 60}
            height={220}
            fromZero
            withInnerLines
            yAxisLabelWidth={30}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              fillShadowGradient: "#5384db",
              fillShadowGradientOpacity: 1,
              color: (opacity = 1) => `rgba(59,130,256,${opacity})`,
              labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            }}
            style={{
              borderRadius: 12,
              marginLeft: 15,
            }}
          />
        </View>

        {/*---------------------Top states (BarChart)----------------*/}
        <View style={styles.card}>
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.subTitle}>Listings by State</Text>
            <Text style={styles.smallText}>
              Total listings distribution across states
            </Text>
          </View>

          {/* <View style={{ transform: [{ rotate: "90deg" }] }}> //To make horizontal view*/}
          <BarChart
            data={formattedStateData}
            width={width - 60}
            height={220}
            fromZero
            withInnerLines={true}
            // showValuesOnTopOfBars
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              fillShadowGradient: "#5384db",
              fillShadowGradientOpacity: 1,
              color: (opacity = 1) => `rgba(59,130,256,${opacity})`,
              labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            }}
            style={{
              borderRadius: 12,
              marginLeft: 15,
            }}
          />
          {/* </View> */}
        </View>

        {/*---------------------Top Viewed Projects----------------*/}

        <TopViewedProjects data={data?.topViewed} />
      </View>
    </ScrollView>
  );
};

export default BuilderDashBoard;

{
  /*----------------styles----------------*/
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 12,
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 5,
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 5,
  },
  small: {
    fontSize: 12,
    color: "gray",
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: 500,
    marginLeft: 8,
    paddingVertical: 5,
  },
  smallText: {
    fontSize: 12,
    marginLeft: 8,
    color: "gray",
  },
  card: {
    elevation: 1,
    backgroundColor: "#fff",
    marginVertical: 10,
    borderRadius: 8,
    padding: 5,
    shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  },
});
