import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const cameraRef = React.useRef<React.ComponentRef<typeof CameraView> | null>(null);

  useEffect(() => {
    if (!permission || permission.status !== 'granted') {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) {
    return <Text style={styles.loadingText}>Cargando permisos...</Text>;
  }

  if (permission.status !== 'granted') {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Acceso denegado a la cámara</Text>
        <Text style={styles.subtitle}>Necesitamos tu permiso para continuar.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
          <Ionicons name="camera" size={18} color="#ffffff" />
          <Text style={styles.primaryButtonText}>Permitir cámara</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const onToggleFacing = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const onToggleFlash = () => {
    setFlash((prev) => (prev === 'off' ? 'on' : 'off'));
  };

  const onShutter = async () => {
    try {
      if (!cameraRef.current) return;
      await cameraRef.current.takePictureAsync?.({ quality: 0.8 });
      // Aquí podrías navegar a una vista de previsualización o guardar la foto
    } catch (error) {
      console.error(error);
      // Podrías mostrar un mensaje de error o loguearlo
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Cámara' }} />

      {isFocused && (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          flash={flash}
        />
      )}

      <View style={styles.overlayTop}>
        <TouchableOpacity style={styles.iconButton} onPress={onToggleFlash}>
          <Ionicons name={flash === 'on' ? 'flash' : 'flash-off'} size={22} color="#ffffff" />
          <Text style={styles.iconLabel}>{flash === 'on' ? 'Flash' : 'Sin flash'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.overlayBottom}>
        <TouchableOpacity style={styles.switchButton} onPress={onToggleFacing}>
          <Ionicons name="camera-reverse" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.shutterButton} onPress={onShutter}>
          <View style={styles.shutterInner} />
        </TouchableOpacity>

        <View style={{ width: 56 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  loadingText: { marginTop: 40, textAlign: 'center' },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 16, textAlign: 'center' },
  primaryButton: {
    backgroundColor: '#53B175',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonText: { color: '#fff', fontWeight: '700', marginLeft: 6 },

  overlayTop: {
    position: 'absolute',
    top: 24,
    right: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: '#00000066',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconLabel: { color: '#fff' },

  overlayBottom: {
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
  },
  switchButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#53B175',
  },
});
