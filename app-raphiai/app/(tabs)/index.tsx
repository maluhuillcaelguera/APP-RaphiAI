// app/(tabs)/index.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HomeScreen() {
  const handleIdentifyDisease = () => {
    //router.push('/(tabs)/CameraScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#53B175" />

      <View style={styles.statusBar}>
        <Text style={styles.statusTime}>16:04</Text>
        <View style={styles.statusIcons}>
          <Ionicons size={16} color="white" />
          <Ionicons name="wifi" size={16} color="white" />
          <Ionicons name="battery-full" size={16} color="white" />
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Image
              source={require('@/assets/images/raphiai-logo.png')}
              style={styles.logoImage}
              contentFit="contain"
            />
          </View>
          <Text style={styles.title}>RaphiAI</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Text style={styles.subtitle}>Por favor, elija una opción</Text>

          <TouchableOpacity style={styles.actionButton} onPress={handleIdentifyDisease}>
            <View style={styles.buttonContent}>
              <Ionicons name="camera" size={24} color="#4CAF50" />
              <Text style={styles.buttonText}>Identifica Enfermedad</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.buttonContent}>
              <Ionicons name="person" size={24} color="#53B175" />
              <Text style={styles.buttonText}>Ver Diagnóstico</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.buttonContent}>
              <Ionicons name="document-text" size={24} color="#53B175" />
              <Text style={styles.buttonText}>Obtener Tratamiento</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // (los estilos son los mismos que ya usas)
  container: {
    flex: 1,
    backgroundColor: '#53B175',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  statusTime: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statusIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logoIcon: {
    borderRadius: 30,
    padding: 15,
    marginBottom: 20,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 130,
    height: 130,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 0,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: '#53b17526',
    borderRadius: 15,
    marginBottom: 15,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 5,
    marginLeft: 3,
    marginRight: 3,
    backgroundColor: '#ffffffff',
  },
  navButton: {
    backgroundColor: '#53b175ff',
    borderRadius: 25,
    padding: 15,
  },
});
