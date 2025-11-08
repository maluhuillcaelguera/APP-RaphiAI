import { Link, Stack } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Página no encontrada' }} />
      <ThemedView style={styles.container}>
        <Image
          source={require('@/assets/images/raphiai-logo.png')}
          style={styles.logo}
          contentFit="contain"
        />
        <ThemedText type="title" style={styles.title}>No encontramos esta página</ThemedText>
        <ThemedText style={styles.subtitle}>La ruta solicitada no existe o fue movida.</ThemedText>

        <Link href="/" asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <Ionicons name="home" size={20} color="#ffffff" />
            <ThemedText type="link" style={styles.primaryButtonText}>Ir al inicio</ThemedText>
          </TouchableOpacity>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#53B175',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    marginLeft: 8,
  },
});
