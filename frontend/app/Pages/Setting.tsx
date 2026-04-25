import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Setting = () => {

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#007bff" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>⚙️ Settings</Text>
        <View style={styles.backButton} />
      </View>

      {/* Content */}
      <View style={styles.container}>

        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/weat.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.text}>Coming soon</Text>

      </View>

    </SafeAreaView>
  )
}

export default Setting

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#007bff',
  },
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
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 18,
    color: '#888',
    fontWeight: 'bold',
    marginTop: 10,
  }
})