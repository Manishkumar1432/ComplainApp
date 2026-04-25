import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { apiUrl } from '../../src/utils/api';

const AddComplaint = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electricity');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const router = useRouter();
  const { token } = useAuth();

  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.6,
    });

    if (!result.canceled) {
      setImages(result.assets.map((asset) => asset.uri));
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !category) {
      Alert.alert('Error', 'Please fill in title, description and category.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('location', location);

    images.forEach((uri, index) => {
      const fileName = uri.split('/').pop() || `image_${index}.jpg`;
      const fileType = fileName.split('.').pop() || 'jpg';
      formData.append('photos', {
        uri: uri,
        name: fileName,
        type: `image/${fileType}`,
      } as any);
    });

    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['x-auth-token'] = token;
      }

      const response = await fetch(apiUrl('/complaints'), {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        Alert.alert('Upload failed', data.msg || 'Could not submit complaint.');
        return;
      }

      Alert.alert('Success', 'Complaint submitted successfully');
      setTitle('');
      setDescription('');
      setCategory('Electricity');
      setLocation('');
      setImages([]);
      router.back();
    } catch {
      Alert.alert('Error', 'Network error while uploading complaint.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>New Complaint</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={styles.picker}
          >
            <Picker.Item label="Electricity" value="Electricity" />
            <Picker.Item label="Water" value="Water" />
            <Picker.Item label="Road" value="Road" />
            <Picker.Item label="Garbage" value="Garbage" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={styles.photoButton} onPress={pickImages}>
        <Text style={styles.photoButtonText}>Select Photos</Text>
      </TouchableOpacity>

      {images.length > 0 && (
        <View style={styles.photoPreviewRow}>
          {images.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.photoPreview} />
          ))}
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Complaint</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F7FB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  photoButton: {
    backgroundColor: '#6C63FF',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  photoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  photoPreviewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  photoPreview: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
});

export default AddComplaint;