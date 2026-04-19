import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../_contexts/AuthContext";
import { apiUrl } from "../_utils/api";

type ComplaintItem = {
  _id: string;
  title: string;
  status: string;
  category: string;
};

type CardProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  onPress?: () => void;
};

export default function Home() {
  const router = useRouter();
  const { token } = useAuth();
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        if (!token) {
          return;
        }

        const response = await fetch(apiUrl('/complaints'), {
          headers: {
            'x-auth-token': token,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setComplaints(data);
        }
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };
    if (token) {
      fetchComplaints();
    }
  }, [token]);

  return (
    <ScrollView style={styles.container}>
      {/* 🔥 Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Welcome 👋</Text>
        <Text style={styles.bannerText}>Raise your complaint easily</Text>
      </View>

      {/* ⚡ Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.row}>
        <Card
          icon="add-circle"
          title="New Complaint"
          onPress={() => router.push('/(tabs)/Complaint')}
        />

        <Card
          icon="time"
          title="Track Status"
          onPress={() => router.push("/Components/MyStatus")}
        />
      </View>

      {/* 🧩 Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>

      <View style={styles.row}>
        <Card icon="flash" title="Electricity" />
        <Card icon="water" title="Water" />
      </View>

      <View style={styles.row}>
        <Card icon="car" title="Road" />
        <Card icon="trash" title="Garbage" />
      </View>


      {/* 📄 Recent Complaints */}
      <Text style={styles.sectionTitle}>Recent Complaints</Text>
      {complaints.length > 0 ? (
        complaints.slice(0, 3).map((complaint) => (
          <View key={complaint._id} style={styles.complaintCard}>
            <Text style={styles.complaintTitle}>{complaint.title}</Text>
            <Text>Status: {complaint.status}</Text>
            <Text>Category: {complaint.category}</Text>
          </View>
        ))
      ) : (
        <View style={styles.complaintCard}>
          <Text style={styles.complaintTitle}>No complaints yet</Text>
          <Text>Create your first complaint!</Text>
        </View>
      )}
    </ScrollView>
  );
}

// ✅ FIXED CARD COMPONENT
const Card = ({ icon, title, onPress }: CardProps) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Ionicons name={icon} size={28} color="#4A90E2" />
    <Text style={styles.cardText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    padding: 15,
  },

  banner: {
    backgroundColor: "#4A90E2",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },

  bannerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  bannerText: {
    color: "#fff",
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  card: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
    elevation: 3,
  },

  cardText: {
    marginTop: 8,
    fontWeight: "600",
  },

  complaintCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    elevation: 2,
  },

  complaintTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
});