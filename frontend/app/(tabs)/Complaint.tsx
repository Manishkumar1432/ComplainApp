import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../_contexts/AuthContext";

export default function Complaint() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [images, setImages] = useState([]);
  const { token } = useAuth();

  // 📸 Open Gallery
  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.5,
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      setImages(result.assets.map(asset => asset.uri));
    }
  };

  const handleSubmit = async () => {
    const finalCategory =
      category === "Others" ? otherCategory : category;

    if (!title || !description || !finalCategory) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', finalCategory);

    images.forEach((uri, index) => {
      const fileName = uri.split('/').pop();
      const fileType = fileName.split('.').pop();
      formData.append('photos', {
        uri,
        name: fileName,
        type: `image/${fileType}`,
      });
    });

    try {
      const response = await fetch('http://10.115.134.30:5000/api/complaints', {
        method: 'POST',
        headers: {
          'x-auth-token': token,
          // Don't set Content-Type, let fetch set it for FormData
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert("Success", "Complaint Submitted ✅");
        // reset
        setTitle("");
        setDescription("");
        setCategory("");
        setOtherCategory("");
        setImages([]);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.msg || "Submission failed");
      }
    } catch (error) {
      Alert.alert("Error", "Network error");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Register Complaint</Text>

      {/* Title */}
      <TextInput
        placeholder="Enter complaint title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      {/* Description */}
      <TextInput
        placeholder="Enter description"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 100 }]}
        multiline
      />

      {/* Category Dropdown */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="Select Category" value="" />
          <Picker.Item label="Electricity" value="Electricity" />
          <Picker.Item label="Water" value="Water" />
          <Picker.Item label="Road" value="Road" />
          <Picker.Item label="Garbage" value="Garbage" />
          <Picker.Item label="Street Light" value="Street Light" />
          <Picker.Item label="Construction" value="Construction" />
          <Picker.Item label="Environment" value="Environment" />
          <Picker.Item label="Transport" value="Transport" />
          <Picker.Item label="Education" value="Education" />
          <Picker.Item label="Health" value="Health" />
          <Picker.Item label="Police" value="Police" />
          <Picker.Item label="Housing" value="Housing" />
          <Picker.Item label="Internet" value="Internet" />
          <Picker.Item label="Telecom" value="Telecom" />
          <Picker.Item label="Drainage" value="Drainage" />
          <Picker.Item label="Noise" value="Noise" />
          <Picker.Item label="Parking" value="Parking" />
          <Picker.Item label="Traffic" value="Traffic" />
          <Picker.Item label="Public Toilet" value="Public Toilet" />
          <Picker.Item label="Others" value="Others" />
        </Picker>
      </View>

      {/* 🔥 Show input if Others selected */}
      {category === "Others" && (
        <TextInput
          placeholder="Enter custom category"
          value={otherCategory}
          onChangeText={setOtherCategory}
          style={styles.input}
        />
      )}

      {/* 📸 Image Preview */}
      {images.length > 0 && (
        <ScrollView horizontal style={styles.imageContainer}>
          {images.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))}
        </ScrollView>
      )}

      {/* 📷 Select Photo Button */}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Ionicons name="image" size={20} color="#fff" />
        <Text style={styles.buttonText}> Select Photo</Text>
      </TouchableOpacity>

      {/* Submit */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Complaint</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F7FB",
  },

  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },

  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },

  imageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },

  button: {
    flexDirection: "row",
    backgroundColor: "#6C63FF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  submitBtn: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "bold",
  },
});