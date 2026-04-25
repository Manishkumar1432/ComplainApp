import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Alert, SafeAreaView, StatusBar } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const Help = () => {

  const navigation = useNavigation();

  const handleEmail = () => {
    const email = 'manishkumardphs9090@gmail.com';
    const subject = 'Help & Support';
    const body = 'Hello, I need help regarding...';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    Linking.openURL(url);
  };

  const handleWhatsApp = async () => {
    const phoneNumber = '919304248307';
    const message = 'Hello, I need help regarding ComplaneDaalo app';
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    try {
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        await Linking.openURL(waUrl);
      }
    } catch (error) {
      Alert.alert(
        'WhatsApp Not Found',
        'WhatsApp is not installed on your device. Please contact us via email.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleInstagram = async () => {
    const username = 'manishflipper143';
    const appUrl = `instagram://user?username=${username}`;
    const webUrl = `https://www.instagram.com/${username}`;

    try {
      const supported = await Linking.canOpenURL(appUrl);
      if (supported) {
        await Linking.openURL(appUrl);
      } else {
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      Alert.alert(
        'Instagram Not Found',
        'Instagram is not installed on your device.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#007bff" barStyle="light-content" />

      {/* ✅ Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>🆘 Help & Support</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.container}>

        {/* Intro */}
        <View style={styles.card}>
          <Text style={styles.heading}>Need Help?</Text>
          <Text style={styles.text}>
            We're here to help you resolve issues quickly. Browse FAQs or contact us directly.
          </Text>
        </View>

        {/* FAQ Section */}
        <View style={styles.card}>
          <Text style={styles.heading}>❓ Frequently Asked Questions</Text>

          <Text style={styles.question}>1. How to submit a complaint?</Text>
          <Text style={styles.answer}>
            Go to Complaint section, fill details and upload images if needed.
          </Text>

          <Text style={styles.question}>2. How to track complaint?</Text>
          <Text style={styles.answer}>
            Open "My Complaints" to see current status.
          </Text>

          <Text style={styles.question}>3. Is login required?</Text>
          <Text style={styles.answer}>
            Yes, login is required to submit and track complaints securely.
          </Text>
        </View>

        {/* Contact Section */}
        <View style={styles.card}>
          <Text style={styles.heading}>📞 Contact Us</Text>

          <Text style={styles.text}>Email: manishkumardphs9090@gmail.com</Text>
          <Text style={styles.text}>Phone: +91 9304248307</Text>
          <Text style={styles.text}>Instagram: @manishflipper143</Text>

          <TouchableOpacity style={styles.button} onPress={handleEmail}>
            <Text style={styles.buttonText}>📧 Send Email</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonSecondary} onPress={handleWhatsApp}>
            <Text style={styles.buttonText}>💬 Live Chat on WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonInstagram} onPress={handleInstagram}>
            <Text style={styles.buttonText}>📸 Follow on Instagram</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          🚀 We're always here to help you
        </Text>

      </ScrollView>
    </SafeAreaView>
  )
}

export default Help

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#007bff',
  },
  header: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
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
  backButton: {
    width: 46,
    height: 69,
    paddingTop:14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    color: '#fff',
    fontSize: 44,
    fontWeight: 'bold',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop:33,
    letterSpacing: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  text: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5
  },
  question: {
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333'
  },
  answer: {
    color: '#666',
    marginBottom: 5
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    elevation: 2,
  },
  buttonSecondary: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    elevation: 2,
  },
  buttonInstagram: {
    backgroundColor: '#f12c67',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  footer: {
    textAlign: 'center',
    marginTop: 10,
    color: '#888',
    marginBottom: 30,
    fontSize: 13,
  }
})