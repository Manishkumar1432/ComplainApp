import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";
import { apiUrl } from "../../src/utils/api";

type ComplaintForm = {
  title: string;
  description: string;
  category: string;
  location: string;
};

export default function EditComplaint() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { token } = useAuth();
  const [complaint, setComplaint] = useState<ComplaintForm>({
    title: "",
    description: "",
    category: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      const id = params.id as string;
      if (!id || !token) return;

      try {
        const response = await fetch(apiUrl(`/complaints/${id}`), {
          headers: {
            "x-auth-token": token,
          },
        });

        if (!response.ok) {
          throw new Error("Unable to load complaint");
        }

        const data = await response.json();
        setComplaint({
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          location: data.location || "",
        });
      } catch (error) {
        console.error("Fetch complaint error:", error);
        Alert.alert("Error", "Unable to load complaint details.");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [params.id, token]);

  const handleSubmit = async () => {
    const id = params.id as string;
    if (!id || !token) return;

    if (!complaint.title.trim() || !complaint.description.trim() || !complaint.category.trim()) {
      Alert.alert("Validation", "Title, description, and category are required.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(apiUrl(`/complaints/${id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(complaint),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || "Failed to update complaint");
      }

      Alert.alert("Success", "Complaint updated successfully.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Update complaint error:", error);
      Alert.alert("Update failed", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Edit Complaint</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={complaint.title}
        onChangeText={(text) => setComplaint((prev) => ({ ...prev, title: text }))}
        placeholder="Complaint title"
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        value={complaint.category}
        onChangeText={(text) => setComplaint((prev) => ({ ...prev, category: text }))}
        placeholder="Category"
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={complaint.location}
        onChangeText={(text) => setComplaint((prev) => ({ ...prev, location: text }))}
        placeholder="Location"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={complaint.description}
        onChangeText={(text) => setComplaint((prev) => ({ ...prev, description: text }))}
        placeholder="Describe the problem"
        multiline
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit} disabled={saving}>
        <Text style={styles.saveText}>{saving ? "Saving..." : "Save Changes"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  content: {
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111827",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
