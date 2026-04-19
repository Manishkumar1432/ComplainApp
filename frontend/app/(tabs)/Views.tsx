import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { apiUrl } from "../_utils/api";

export default function ViewComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(apiUrl('/complaints/all'));
        if (!response.ok) {
          throw new Error('Unable to load complaints');
        }
        const data = await response.json();
        setComplaints(data);
      } catch (err) {
        setError(err.message || 'Failed to load complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.category}>{item.category || 'General'}</Text>
      {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
      {item.location ? <Text style={styles.location}>Location: {item.location}</Text> : null}
      {item.photos && item.photos.length > 0 ? (
        <View style={styles.photoRow}>
          {item.photos.map((photoUri, index) => (
            <Image
              key={`${item._id}-${index}`}
              source={{ uri: photoUri }}
              style={styles.photo}
            />
          ))}
        </View>
      ) : null}
      <Text
        style={[
          styles.status,
          item.status === "Pending"
            ? styles.pending
            : styles.resolved,
        ]}
      >
        {item.status}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>All Complaints</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>All Complaints</Text>
      {complaints.length === 0 ? (
        <Text style={styles.emptyText}>No complaints submitted yet.</Text>
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={complaints.length === 0 ? styles.emptyContainer : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F5F7FB",
  },

  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
  },

  category: {
    color: "gray",
    marginTop: 5,
  },

  description: {
    marginTop: 10,
    color: "#555",
  },

  location: {
    marginTop: 6,
    color: "#777",
    fontStyle: "italic",
  },

  photoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },

  photo: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
  },

  status: {
    marginTop: 8,
    fontWeight: "bold",
  },

  pending: {
    color: "orange",
  },

  resolved: {
    color: "green",
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FB",
  },

  errorText: {
    color: "red",
    marginTop: 10,
  },

  emptyText: {
    color: "#555",
    marginTop: 15,
  },

  emptyContainer: {
    flexGrow: 1,
  },
});