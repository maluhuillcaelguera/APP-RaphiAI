import DiagnosePickerLauncher from '@/components/DiagnosePickerLauncher';
import TermsModal from '@/components/TermsModal';
import { signOut } from '@/state/auth';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [openPickerFn, setOpenPickerFn] = React.useState<(() => void) | null>(null);
  const [showTerms, setShowTerms] = React.useState(false);


  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#53B175" />

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
            <View style={styles.heroTermsRow}>
              <TouchableOpacity style={styles.inlineLink} onPress={() => setShowTerms(true)}>
                <Ionicons name="document-text-outline" size={18} color="#ffffff" />
                <Text style={styles.heroTermsText}>Términos y Condiciones</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Text style={styles.subtitle}>Por favor, elija una opción</Text>

            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/projects' as any)}>
              <View style={styles.buttonContent}>
                <Ionicons name="albums" size={24} color="#53B175" />
                <Text style={styles.buttonText}>Proyectos</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => openPickerFn && openPickerFn()}>
              <View style={styles.buttonContent}>
                <Ionicons name="medkit" size={24} color="#53B175" />
                <Text style={styles.buttonText}>Diagnóstico</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/history')}>
              <View style={styles.buttonContent}>
                <Ionicons name="time" size={24} color="#53B175" />
                <Text style={styles.buttonText}>Ver Historial</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dangerActionButton} onPress={async () => { await signOut(); router.replace('/(auth)/login'); }}>
              <View style={styles.buttonContent}>
                <Ionicons name="log-out-outline" size={24} color="#c62828" />
                <Text style={styles.dangerButtonText}>Cerrar sesión</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.cameraRow}>
              <TouchableOpacity style={styles.cameraIconBtn} onPress={() => router.push('/CameraScreen')}>
                <Ionicons name="camera" size={30} color="#ffffff" />
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </SafeAreaView>

      <DiagnosePickerLauncher render={(open) => { setTimeout(() => setOpenPickerFn(() => open), 0); return null; }} />
      <TermsModal visible={showTerms} onClose={() => setShowTerms(false)} onAccept={() => setShowTerms(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#53B175',
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
    width: '100%',
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
  dangerActionButton: {
    backgroundColor: '#ffebee',
    borderRadius: 15,
    marginBottom: 0,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  cameraRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 15, marginBottom: 8 },
  cameraIconBtn: {
    width: 60,
    height: 60,
    borderRadius: 34,
    backgroundColor: '#53B175',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
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
  dangerButtonText: {
    fontSize: 16,
    color: '#c62828',
    fontWeight: '700',
  },
  cameraButtonText: { fontSize: 16, color: '#ffffff', fontWeight: '700' },
  heroTermsRow: { position: 'absolute', bottom: -45, left: 0, right: 0, alignItems: 'center', width: '100%' },
  inlineLink: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 8 },
  heroTermsText: { color: '#ffffff', fontWeight: '700', textDecorationLine: 'underline', fontSize: 14 },
});


