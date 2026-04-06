import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";

const PrivacyPolicy = () => {
  const insets = useSafeAreaInsets();
    {/* -----------------------content------------------------*/}
  const features = [
    "Name, email, phone number",
    "City/area, buyer or seller preferences",

    "Information entered in forms, enquiries, or messages",
  ];

  const usage = [
    "Search filters, viewed listings, visit durations, user behaviour",
    "Interaction patterns on listings and pages",
  ];

  const technical = [
    "IP address, browser type, device model, operating system",
    "Log data, crash reports, and analytics data",
  ];
  const document = [
    "Documents voluntarily provided by users for verification or profile setup, where applicable.",
  ];
  const communication = [
    "Messages, enquiry logs, and Calls initiated via Propenu (where applicable)",
    "Calls may be recorded for quality, security, and dispute resolution purposes, where permitted by law.",
  ];

  const information = [
    "Deliver property search results and platform services",
    "Facilitate communication between buyers, sellers, owners, and agents",

    "Send alerts, updates, confirmations, and support messages",
    "Improve features, performance, and security",
    "Personalise recommendations and search results",

    "Prevent fraud, misuse, or suspicious activity",
    "Meet legal or regulatory requirements",
  ];

  const infoSharing = [
    "Owners/Agents/Developers when you submit enquiries",
    "Trusted third-party partners (hosting, analytics, messaging, support tools)",
    "Legal authorities when required by law",
    "Other users when you voluntarily share your details via forms",
  ];
  const tracking = [
    "Improve loading speed and performance",
    "Analyse usage and interactions",
    "Remember user preferences",
    "Deliver personalised content",
  ];
  const rights = [
    "Access your stored information",
    "Request corrections or updates",
    "Request account or data deletion",
    "Opt out of marketing emails",
    "Change cookie and tracking preferences",
  ];
  const Retention = [
    "Provide services",
    "Resolve disputes",
    "Comply with legal obligations",
  ];

    {/* -----------------------UI------------------------*/}

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: insets.bottom + 6,
      }}
    >
      <Text style={styles.title}>Privacy Policy</Text>

      <Text style={styles.content}>
        Propenu (“we”, “our”, “us”) respects your privacy and is committed to
        protecting and managing the personal data you share with us. We
        recognize the importance of safeguarding your information and ensuring
        transparency in how it is collected, used, stored, and shared.
        {"\n"}
        {"\n"}
        This Privacy Policy (“Policy”) governs your access to and use of the
        Propenu website, mobile application, and all related features, tools,
        and services (collectively referred to as the “Platform” or “Services”).
        This Policy explains how Propenu collects, processes, stores, shares,
        and protects personal data when you browse the Platform, create an
        account, list properties, submit enquiries, communicate with other
        users, or otherwise use our Services.
        {"\n"}
        {"\n"}
        This Policy applies to all users of the Platform, including but not
        limited to buyers, sellers, owners, landlords, tenants, agents,
        builders, developers, and general website visitors.
        {"\n"}
        {"\n"}
        For the purposes of this Policy, “Personal Data” means any information
        that identifies or can reasonably be used to identify an individual,
        either directly or indirectly.
        {"\n"}
        {"\n"}
        By accessing, browsing, registering on, or using the Propenu Platform or
        Services, or by providing your information through any means, you
        consent to the collection, use, processing, storage, disclosure, and
        transfer of your Personal Data in accordance with this Privacy Policy.
        Where required by applicable law, Propenu may seek your explicit consent
        for processing Personal Data for specific purposes.
        {"\n"}
        {"\n"}
        We process Personal Data based on User consent, Contractual necessity,
        legal, obligations, and legitimate business interests.
        {"\n"}
        {"\n"}
        This Privacy Policy should be read together with our Terms & Conditions
        and any other applicable policies. Capitalized terms not defined herein
        shall have the meanings assigned to them in the Terms & Conditions.
      </Text>
      <Text style={[styles.subContent, { backgroundColor: "#eff7ed" }]}>
        If you do not agree with this Privacy Policy, please refrain from
        accessing or using the Propenu Platform or Services.
      </Text>
      <Text style={styles.title}>1. Information We Collectn</Text>

      <Text style={styles.subTitle}>1.1 Personal Information</Text>

      {features.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={[styles.content, { width: "95%" }]}>{item}</Text>
        </View>
      ))}
      <Text style={styles.subTitle}>1.2 Usage Data</Text>
      {usage.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={[styles.content, { width: "95%" }]}>{item}</Text>
        </View>
      ))}

      <Text style={styles.subTitle}>1.3 Technical & Device Data</Text>
      {technical.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={[styles.content, { width: "95%" }]}>{item}</Text>
        </View>
      ))}
      <Text style={styles.subTitle}>1.4 Uploaded Documents</Text>
      {document.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={[styles.content, { width: "95%" }]}>{item}</Text>
        </View>
      ))}
      <Text style={styles.subTitle}>1.5 Communication Data</Text>
      {communication.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={[styles.content, { width: "95%" }]}>{item}</Text>
        </View>
      ))}

      <Text style={styles.title}>2. How We Use Your Information</Text>
      <Text style={styles.content}>Propenu uses your information to:</Text>
      {information.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={[styles.content, { width: "95%" }]}>{item}</Text>
        </View>
      ))}

      <Text style={styles.title}>3. Sharing of Information</Text>
      <Text style={styles.content}>We may share data with:</Text>
      {infoSharing.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <View style={{ paddingTop: 5 }}>
            <Entypo name="check" size={14} color="#27AE60" />
          </View>
          <Text style={[styles.content, { paddingLeft: 10, width: "95%" }]}>
            {item}
          </Text>
        </View>
      ))}

      <Text style={[styles.subContent, { backgroundColor: "#edeef7" }]}>
        We do not sell or trade user data outside Propenu.
      </Text>
      <Text style={styles.subTitle}>{"\n"}International Data Transfers:</Text>
      <Text style={styles.content}>
        Your information may be stored, processed, or transferred on servers
        located within or outside India, in compliance with applicable data
        protection laws.
      </Text>
      <Text style={styles.title}>4. Cookies & Tracking Technologies</Text>
      <Text style={styles.content}>
        Propenu uses cookies, pixels, and analytics tools to:
      </Text>

      {tracking.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={[styles.content, { width: "95%" }]}>{item}</Text>
        </View>
      ))}

      <Text style={styles.content}>
        Users may disable cookies, but certain features may not work properly.
        {"\n"}
        Some third-party tools may use their own cookies, governed by their
        respective privacy policies.
      </Text>

      <Text style={styles.title}>5. Data Protection & Security</Text>
      <Text style={styles.content}>
        We take reasonable administrative and technical measures to protect your
        information.
      </Text>
      <Text style={[styles.subContent, { backgroundColor: "#f7f1ed" }]}>
        However, no online system can guarantee complete security, and users
        acknowledge this limitation.
      </Text>

      <Text style={styles.title}>6. User Rights & Choices</Text>
      <Text style={styles.content}>Depending on applicable laws, you may:</Text>
      {rights.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={[styles.content, { paddingLeft: 10, width: "95%" }]}>
            {item}
          </Text>
        </View>
      ))}
      <Text style={styles.content}>
        Contact us if you wish to exercise any of these rights.
      </Text>

      <Text style={styles.title}>7. Data Retention</Text>
      <Text style={styles.content}>
        We retain information only as long as necessary or as required by
        applicable laws to:
      </Text>

      {Retention.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={[styles.content, { paddingLeft: 10, width: "95%" }]}>
            {item}
          </Text>
        </View>
      ))}
      <Text style={styles.content}>
        Anonymised data may be retained for analytics and product improvement.
      </Text>
      <Text style={styles.title}>8. Third-Party Links</Text>
      <Text style={styles.content}>
        Propenu may contain links to external sites.{"\n"}
        We are not responsible for their privacy practices or content.
      </Text>
      <Text style={[styles.subContent, { backgroundColor: "#f7edf6" }]}>
        We encourage users to review third-party policies before sharing
        information.
      </Text>

      <Text style={styles.title}>9. Children’s Privacy</Text>
      <Text style={styles.content}>
        Propenu is intended for users aged 18+. We do not knowingly collect data
        from minors, and users under 18 should not use the platform or submit
        personal information.
      </Text>

      <Text style={styles.title}>10. Changes to This Policy</Text>
      <Text style={styles.content}>
        Propenu may update this Privacy Policy from time to time.{"\n"}
        Changes will be posted with a revised Effective Date.
      </Text>
      <Text style={[styles.subContent, { backgroundColor: "#eff7ed" }]}>
        Continued use of Propenu implies acceptance of updated policies.
      </Text>

      <Text style={styles.title}>11. Contact Information</Text>
      <Text style={styles.content}>
        Questions, concerns, or complaints related to the collection, use,
        processing, or disclosure of your personal data may be addressed through
        our grievance redressal mechanism.{"\n"}

        {"\n"}
        Propenu has appointed a Grievance Officer to handle privacy-related
        concerns, complaints, or data protection issues in a timely manner.
      </Text>

      <Text style={[styles.subContent, { backgroundColor: "#edf6f7" }]}>
        You may contact the Grievance Officer at:{"\n"}
        Email:{" "}
        <Text style={{ color: "green", fontWeight: 500 }}>
          support@propenu.com
        </Text>
       
      </Text>

      <Text style={[styles.subContent, { backgroundColor: "#e4e5e4", textAlign:"center", marginTop:20 }]}>Thank you for trusting Propenu with your information.</Text>
    </ScrollView>
  );
};
export default PrivacyPolicy;

  {/* -----------------------Styles------------------------*/}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "white",
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    marginVertical: 12,
  },

  subTitle: {
    fontSize: 14,
    fontWeight: 500,
    marginVertical: 5,
  },
  content: {
    fontSize: 13,
    textAlign: "justify",
    lineHeight: 22,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    // alignItems:"flex-start",
    // marginBottom: 4,
    marginLeft: 5,
    marginTop: 5,
  },
  bullet: {
    fontSize: 18,
    marginRight: 8,
  },
  subContent: {
    fontSize: 13,
    textAlign: "justify",
    lineHeight: 22,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  smallText: {
    fontSize: 11,
  },
});
