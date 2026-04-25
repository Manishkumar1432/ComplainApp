import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const AboutApp = () => {

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#007bff" barStyle="light-content" />

      {/* ✅ Header - title aur subtitle hata ke sirf "About App" rakha */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>📱 About App</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.container}>

        {/* ✅ Title aur subtitle vapas ScrollView me rakha */}
        <Text style={styles.title}>📱 ComplaneDaalo</Text>
        <Text style={styles.subtitle}>
          A smart complaint management platform
        </Text>

        {/* About Section */}
        <View style={styles.card}>
          <Text style={styles.heading}>About Us</Text>
          <Text style={styles.text}>
            ComplaneDaalo is a mobile application that helps users register complaints,
            upload proof, track status, and communicate in real-time. It simplifies
            issue reporting and improves transparency.
          </Text>
        </View>

        {/* Mission */}
        <View style={styles.card}>
          <Text style={styles.heading}>🎯 Our Mission</Text>
          <Text style={styles.text}>
            To provide a simple and transparent system for resolving local issues
            efficiently using technology.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.card}>
          <Text style={styles.heading}>✨ Key Features</Text>
          <Text style={styles.text}>• Complaint registration with images</Text>
          <Text style={styles.text}>• Real-time chat support</Text>
          <Text style={styles.text}>• Complaint tracking system</Text>
          <Text style={styles.text}>• Secure authentication</Text>
        </View>

        {/* Tech Stack */}
        <View style={styles.card}>
          <Text style={styles.heading}>⚙️ Tech Stack</Text>
          <Text style={styles.text}>• React Native (Expo)</Text>
          <Text style={styles.text}>• Node.js & Express</Text>
          <Text style={styles.text}>• MongoDB</Text>
          <Text style={styles.text}>• AWS S3</Text>
          <Text style={styles.text}>• Socket.IO</Text>
        </View>

        {/* Developer */}
        <View style={styles.card}>
          <Text style={styles.heading}>👨‍💻 Developer</Text>
          <Text style={styles.text}>Manish Kumar</Text>
          <Text style={styles.text}>Full Stack Developer</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          🚀 Built with passion for solving real-world problems
        </Text>

      </ScrollView>
    </SafeAreaView>
  )
}

export default AboutApp

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#007bff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 15,
  },
  // ✅ paddingVertical 25 for good height
  header: {
    backgroundColor: '#007bff',
    paddingVertical: 25,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  // ✅ backButton - extra height aur paddingTop hata diya
backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
backArrow: {
    color: '#fff',
    fontSize: 39,  // ✅ 24 se 32 kiya
    fontWeight: 'bold',
  },
  // ✅ headerText - paddingTop: 33 hata diya
  headerText: {
    color: '#fff',
    fontSize: 20,
    paddingTop:22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  // ✅ title marginTop thoda rakha ScrollView me
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginTop: 15,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222'
  },
  text: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4
  },
  footer: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
    marginBottom: 30
  }
})