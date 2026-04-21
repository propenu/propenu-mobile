import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import HorizontalBarChart from "./ui/HorizontalBarChart";
import PieChartCard from "./ui/PieChartCard";
import KpiCard from "./ui/KpiCard";
import DropdownUI from "../../components/ui/DropDownUI";
import { agentServices } from "../../services/agentServices";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopPropertiesTable from "./ui/TopPropertiesTable";

const DATE_RANGE_OPTIONS = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 6 months", value: "180" },
];

const AgentDashBoard = () => {
  const [dateRange, setDateRange] = useState("30");
  const insets = useSafeAreaInsets();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["myAgentProfile", dateRange],
    queryFn: () => agentServices.getAgent(dateRange),
    staleTime: 1000 * 60 * 5,
  });

  const kpis = {
    totalProperties: data?.kpis?.totalProperties ?? 0,
    activeListings: data?.kpis?.activeListings ?? 0,
    pendingListings: data?.kpis?.pendingListings ?? 0,
    totalViews: data?.kpis?.totalViews ?? 0,
    totalClicks: data?.kpis?.totalClicks ?? 0,
    totalInquiries: data?.kpis?.totalInquiries ?? 0,
  };

  const barChartData = useMemo(() => {
    if (!Array.isArray(data?.charts?.byCity)) return [];
    return data.charts.byCity.map((item) => ({
      name: item.city,
      value: item.count,
    }));
  }, [data]);

  const propertyTypePie = useMemo(() => {
    return [
      { name: "Residential", value: data?.stats?.residential ?? 10 },
      { name: "Commercial", value: data?.stats?.commercial ?? 5 },
      { name: "Plot", value: data?.stats?.plot ?? 2 },
      { name: "Agricultural", value: data?.stats?.agricultural ?? 2 },
    ].filter((item) => item.value > 0);
  }, [data]);

  const topProperties = useMemo(() => {
    return (
      data?.topProperties?.map((p) => ({
        _id: p._id,
        title: p.title,
        city: p.city,
        image: p.gallery?.[0]?.url,
        views: p.meta?.views ?? 0,
        inquiries: p.meta?.inquiries ?? 0,
      })) ?? []
    );
  }, [data]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#27AE60" />
        <Text style={{ marginTop: 10 }}>Loading dashboard...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>{error?.message || "Failed to load dashboard"}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <View>
        <Text style={styles.title}>Agent Analytics Dashboard</Text>
        <Text style={styles.subtitle}>
          Track your property performance and leads
        </Text>
      </View>
      <FlatList
        data={[]}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{
          paddingHorizontal: 5,
          paddingBottom: insets.bottom + 55,
        }}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.dropdownContainer}>
                <Text style={styles.rangeLabel}>Date Range:</Text>
                <DropdownUI
                  value={dateRange}
                  onChange={setDateRange}
                  options={DATE_RANGE_OPTIONS}
                />
              </View>
            </View>

            {/* KPI Section */}
            <View style={styles.kpiGrid}>
              <KpiCard
                title="Total Properties"
                value={kpis.totalProperties}
                icon={<Entypo name="home" size={16} color="#5752ec" />}
                bgColor="#F5F9FF"
                iconBgColor="#E0ECFF"
              />
              <KpiCard
                title="Active Listings"
                value={kpis.activeListings}
                icon={
                  <FontAwesome name="check-circle" size={16} color="#27AE60" />
                }
                bgColor="#F3FBF7"
                iconBgColor="#DFF4E8"
              />
              <KpiCard
                title="Pending Listings"
                value={kpis.pendingListings}
                icon={
                  <MaterialCommunityIcons
                    name="clock"
                    size={16}
                    color="orange"
                  />
                }
                bgColor="#FFF7ED"
                iconBgColor="#FFE7CC"
              />
              <KpiCard
                title="Total Views"
                value={kpis.totalViews}
                icon={
                  <MaterialCommunityIcons
                    name="eye"
                    size={16}
                    color="#9c45c2"
                  />
                }
                bgColor="#F8F5FF"
                iconBgColor="#ECE6FF"
              />
              <KpiCard
                title="Total Clicks"
                value={kpis.totalClicks}
                icon={<Entypo name="mouse-pointer" size={16} color="#6161ed" />}
                bgColor="#F5F7FF"
                iconBgColor="#E4E8FF"
              />
              <KpiCard
                title="Total Enquiries"
                value={kpis.totalInquiries}
                icon={
                  <MaterialIcons name="message" size={16} color="#EF4444" />
                }
                bgColor="#FFF5F7"
                iconBgColor="#FFE4EC"
              />
            </View>

            {/* Charts */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Property Type Distribution
              </Text>
              <Text style={styles.subSection}>
                Residential vs Commercial vs Plot vs Agricultural
              </Text>
              {propertyTypePie.length > 0 ? (
                <PieChartCard data={propertyTypePie} />
              ) : null}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Top Cities by Views</Text>
              <Text style={styles.subSection}>
                Performance of your listings across different cities
              </Text>
              {barChartData.length > 0 ? (
                <HorizontalBarChart data={barChartData} />
              ) : (
                <View style={styles.center}>
                  <Text style={styles.emptyText}>
                    No city data available
                  </Text>
                </View>
              )}
            </View>
          </>
        }
        ListFooterComponent={<TopPropertiesTable properties={topProperties} />}
        renderItem={null}
        // renderItem={({ item }) => ( < TopPropertiesTable properties={topProperties} />)}

        //  <View style={styles.section}>
        //      <Text style={styles.sectionTitle}>Top Properties</Text>
        //     <Text style={styles.subSection}>Your best performing listings</Text>
        //   <View style={styles.propertyCard}>
        //       <Text style={styles.propertyTitle}>{item.title}</Text>
        //       <Text style={styles.propertyMeta}>
        //         {item.city} • Views: {item.views} • Inquiries: {item.inquiries}
        //       </Text>
        //     </View>
        //   </View>. 
        ListEmptyComponent={()=> null }
      />
    </View>
  );
};

export default AgentDashBoard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 7,
    paddingTop: 5,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    paddingLeft: 5,
    fontWeight: "600",
    color: "#111827",
  },
  subtitle: {
    fontSize: 12,
    paddingLeft: 5,
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 5,
  },
  subSection: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  dropdownContainer: {
    marginTop: 7,
  },
  rangeLabel: {
    fontSize: 12,
    fontWeight: 500,
    marginBottom: 6,
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  section: {
    marginTop: 15,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    // minHeight: 200,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
  },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 10,
  },
  propertyCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginTop: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  },
  propertyTitle: {
    fontWeight: "600",
    fontSize: 16,
  },
  propertyMeta: {
    marginTop: 4,
    color: "#6B7280",
  },
});
