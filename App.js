
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

const KEY = "@dhanda_ai_mvp";

export default function App() {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState("");
  const [screen, setScreen] = useState("dashboard");
  const [autopilot, setAutopilot] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [team, setTeam] = useState([]);

  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [product, setProduct] = useState("");
  const [campaignText, setCampaignText] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const saved = await AsyncStorage.getItem(KEY);
      if (saved) {
        const d = JSON.parse(saved);
        setUser(d.user || null);
        setCompany(d.company || "");
        setAutopilot(d.autopilot || false);
        setCampaigns(d.campaigns || []);
        setCustomers(d.customers || []);
        setTeam(d.team || []);
      }
    } catch {}
  }

  async function saveData(extra = {}) {
    const data = {
      user,
      company,
      autopilot,
      campaigns,
      customers,
      team,
      ...extra
    };
    await AsyncStorage.setItem(KEY, JSON.stringify(data));
  }

  async function login() {
    if (!name.trim() || !company.trim()) {
      Alert.alert("Required", "Enter your name and company name.");
      return;
    }

    const u = {
      name: name.trim(),
      role: "Admin"
    };

    setUser(u);
    setCompany(company.trim());
    await saveData({
      user: u,
      company: company.trim()
    });
  }

  async function createCampaign() {
    if (!product.trim()) {
      Alert.alert("Product required", "Enter a product or service.");
      return;
    }

    const campaign = {
      id: Date.now(),
      title: `${product} Promotion`,
      text:
        `🔥 Special Offer\n\n` +
        `${product} is now available from ${company}.\n\n` +
        `${campaignText || "Contact us today to know more."}`,
      status: "Draft",
      date: new Date().toLocaleDateString()
    };

    const next = [campaign, ...campaigns];

    setCampaigns(next);
    await saveData({ campaigns: next });
    setCampaignText("");

    Alert.alert("Campaign created", "Your AI marketing campaign is ready.");
  }

  async function addCustomer() {
    const customer = {
      id: Date.now(),
      name: `Customer ${customers.length + 1}`,
      segment: "New Customer"
    };

    const next = [customer, ...customers];
    setCustomers(next);
    await saveData({ customers: next });
  }

  async function addTeamMember() {
    const member = {
      id: Date.now(),
      name: `Team Member ${team.length + 1}`,
      role: "Marketing Manager",
      status: "Invited"
    };

    const next = [member, ...team];
    setTeam(next);
    await saveData({ team: next });
  }

  async function toggleAutopilot() {
    const next = !autopilot;
    setAutopilot(next);
    await saveData({ autopilot: next });
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="dark" />
        <View style={styles.login}>
          <Text style={styles.logo}>Dhanda AI</Text>
          <Text style={styles.subtitle}>
            Automatic Marketing for Businesses
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Your name"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Company name"
            value={company}
            onChangeText={setCompany}
          />

          <TouchableOpacity style={styles.primary} onPress={login}>
            <Text style={styles.primaryText}>Create Workspace</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View>
          <Text style={styles.logoSmall}>Dhanda AI</Text>
          <Text style={styles.muted}>{company}</Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>ADMIN</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>

        {screen === "dashboard" && (
          <>
            <Text style={styles.title}>Growth Dashboard</Text>

            <View style={styles.grid}>
              <Stat title="Campaigns" value={campaigns.length} />
              <Stat title="Customers" value={customers.length} />
              <Stat title="Team" value={team.length} />
              <Stat title="Leads" value="18" />
            </View>

            <View style={styles.card}>
              <View style={styles.row}>
                <View>
                  <Text style={styles.cardTitle}>AI Autopilot</Text>
                  <Text style={styles.muted}>
                    Automatically plan marketing campaigns
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.toggle,
                    autopilot && styles.toggleOn
                  ]}
                  onPress={toggleAutopilot}
                >
                  <Text style={styles.toggleText}>
                    {autopilot ? "ON" : "OFF"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                AI Recommendation
              </Text>

              <Text style={styles.paragraph}>
                Promote your best product to inactive customers
                and use a limited-time offer.
              </Text>

              <TouchableOpacity
                style={styles.primary}
                onPress={() => setScreen("campaign")}
              >
                <Text style={styles.primaryText}>
                  Create Campaign
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {screen === "business" && (
          <View style={styles.card}>
            <Text style={styles.title}>Business Setup</Text>

            <Text style={styles.label}>Business Category</Text>
            <TextInput
              style={styles.input}
              placeholder="Retail / Service / Restaurant"
              value={business}
              onChangeText={setBusiness}
            />

            <Text style={styles.label}>Main Product / Service</Text>
            <TextInput
              style={styles.input}
              placeholder="Your main product"
              value={product}
              onChangeText={setProduct}
            />

            <TouchableOpacity
              style={styles.primary}
              onPress={() =>
                Alert.alert(
                  "Saved",
                  "Business profile saved."
                )
              }
            >
              <Text style={styles.primaryText}>Save Profile</Text>
            </TouchableOpacity>
          </View>
        )}

        {screen === "campaign" && (
          <View style={styles.card}>
            <Text style={styles.title}>AI Campaign</Text>

            <Text style={styles.label}>Product / Service</Text>
            <TextInput
              style={styles.input}
              placeholder="Example: Premium Shoes"
              value={product}
              onChangeText={setProduct}
            />

            <Text style={styles.label}>Offer / Message</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Example: 20% weekend discount"
              multiline
              value={campaignText}
              onChangeText={setCampaignText}
            />

            <TouchableOpacity
              style={styles.primary}
              onPress={createCampaign}
            >
              <Text style={styles.primaryText}>
                Generate Campaign
              </Text>
            </TouchableOpacity>

            {campaigns.map(c => (
              <View style={styles.campaign} key={c.id}>
                <Text style={styles.cardTitle}>{c.title}</Text>
                <Text style={styles.paragraph}>{c.text}</Text>
                <Text style={styles.muted}>
                  {c.status} • {c.date}
                </Text>
              </View>
            ))}
          </View>
        )}

        {screen === "customers" && (
          <View style={styles.card}>
            <Text style={styles.title}>Customers</Text>

            <TouchableOpacity
              style={styles.primary}
              onPress={addCustomer}
            >
              <Text style={styles.primaryText}>
                Add Customer
              </Text>
            </TouchableOpacity>

            {customers.map(c => (
              <View style={styles.listItem} key={c.id}>
                <Text style={styles.cardTitle}>{c.name}</Text>
                <Text style={styles.muted}>{c.segment}</Text>
              </View>
            ))}
          </View>
        )}

        {screen === "team" && (
          <View style={styles.card}>
            <Text style={styles.title}>Team</Text>

            <TouchableOpacity
              style={styles.primary}
              onPress={addTeamMember}
            >
              <Text style={styles.primaryText}>
                Invite User
              </Text>
            </TouchableOpacity>

            {team.map(m => (
              <View style={styles.listItem} key={m.id}>
                <Text style={styles.cardTitle}>{m.name}</Text>
                <Text style={styles.muted}>
                  {m.role} • {m.status}
                </Text>
              </View>
            ))}
          </View>
        )}

        {screen === "analytics" && (
          <View style={styles.card}>
            <Text style={styles.title}>Analytics</Text>

            <Stat title="Reach" value="12.4K" />
            <Stat title="Engagement" value="8.7%" />
            <Stat title="Leads" value="18" />
            <Stat title="Conversion" value="4.2%" />

            <Text style={styles.paragraph}>
              AI recommends increasing promotional campaigns
              while keeping educational content for engagement.
            </Text>
          </View>
        )}

      </ScrollView>

      <View style={styles.nav}>
        <Nav text="Home" onPress={() => setScreen("dashboard")} />
        <Nav text="Business" onPress={() => setScreen("business")} />
        <Nav text="Campaigns" onPress={() => setScreen("campaign")} />
        <Nav text="Customers" onPress={() => setScreen("customers")} />
        <Nav text="Team" onPress={() => setScreen("team")} />
        <Nav text="Analytics" onPress={() => setScreen("analytics")} />
      </View>
    </SafeAreaView>
  );
}

function Stat({ title, value }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.muted}>{title}</Text>
      <Text style={styles.metric}>{value}</Text>
    </View>
  );
}

function Nav({ text, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.navText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f5f7fb"
  },
  login: {
    flex: 1,
    justifyContent: "center",
    padding: 25
  },
  logo: {
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
    color: "#2563eb"
  },
  logoSmall: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2563eb"
  },
  subtitle: {
    textAlign: "center",
    color: "#667085",
    marginBottom: 30,
    marginTop: 6
  },
  header: {
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb"
  },
  badge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20
  },
  badgeText: {
    color: "#1d4ed8",
    fontWeight: "700",
    fontSize: 11
  },
  container: {
    padding: 16,
    paddingBottom: 100
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    marginBottom: 18,
    color: "#101828"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 15
  },
  stat: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 15,
    width: "48%",
    marginBottom: 8
  },
  metric: {
    fontSize: 25,
    fontWeight: "800",
    marginTop: 5
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e8ebf0"
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#101828"
  },
  muted: {
    color: "#667085",
    fontSize: 12,
    marginTop: 4
  },
  label: {
    fontWeight: "700",
    marginBottom: 4,
    color: "#344054"
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#d0d5dd",
    borderRadius: 10,
    padding: 13,
    marginBottom: 14,
    fontSize: 15
  },
  textarea: {
    minHeight: 110,
    textAlignVertical: "top"
  },
  primary: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5
  },
  primaryText: {
    color: "#fff",
    fontWeight: "800"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  toggle: {
    backgroundColor: "#98a2b3",
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20
  },
  toggleOn: {
    backgroundColor: "#16a34a"
  },
  toggleText: {
    color: "#fff",
    fontWeight: "800"
  },
  paragraph: {
    color: "#475467",
    lineHeight: 21,
    marginVertical: 12
  },
  campaign: {
    marginTop: 15,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0"
  },
  listItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  nav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  navText: {
    fontSize: 11,
    color: "#344054",
    fontWeight: "700"
  }
});
