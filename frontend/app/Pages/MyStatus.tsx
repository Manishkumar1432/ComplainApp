import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";
import { apiUrl } from "../../src/utils/api";

type ComplaintItem = {
  _id: string;
  title: string;
  status: string;
  category: string;
  createdAt: string;
};

export default function MyStatus() {
  const router = useRouter();
  const { token } = useAuth();
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyComplaints = async () => {
      try {
        if (!token) return;

        const response = await fetch(apiUrl("/complaints"), {
          headers: {
            "x-auth-token": token,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setComplaints(data);
        }
      } catch (error) {
        console.error("Error fetching my complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyComplaints();
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!token) {
      Alert.alert('Unauthorized', 'You must be logged in to delete a complaint.');
      return;
    }

    Alert.alert(
      'Delete Complaint',
      'Are you sure you want to delete this complaint?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(apiUrl(`/complaints/${id}`), {
                method: 'DELETE',
                headers: {
                  'x-auth-token': token,
                },
              });
              const contentType = response.headers.get('content-type') || '';
              const data = contentType.includes('application/json')
                ? await response.json()
                : { msg: await response.text() };
              if (response.ok) {
                setComplaints((prev) => prev.filter((item) => item._id !== id));
                Alert.alert('Deleted', data.msg || 'Complaint deleted successfully');
              } else {
                console.warn('Delete failed response', response.status, data);
                Alert.alert(
                  'Delete failed',
                  data.msg || `Server returned ${response.status}`
                );
              }
            } catch (error) {
              console.error('Delete complaint error:', error);
              Alert.alert('Delete failed', 'Network error');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }: { item: ComplaintItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.status === "Resolved" ? "#DEF7EC" : "#FEF3C7" },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: item.status === "Resolved" ? "#03543F" : "#92400E" },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>
      <Text style={styles.cardCategory}>{item.category}</Text>
      <Text style={styles.cardDate}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
      <View style={styles.actionRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.editButton}
          onPress={() => router.push(`/Pages/EditComplaint?id=${item._id}`)}
        >
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.deleteButton}
          onPress={() => handleDelete(item._id)}
        >
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Complaint Status</Text>
      {complaints.length > 0 ? (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyText}>No complaints found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    padding: 15,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 10,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardCategory: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  cardDate: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 90,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    marginRight: 10,
    alignItems: 'center',
  },
  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 90,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#9CA3AF",
  },
});