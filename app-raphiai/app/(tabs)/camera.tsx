import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import type { ElementRef } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CameraScreen() {
  // 1️⃣ Permisos
  const [cameraPerm, requestCameraPerm] = useCameraPermissions();
  const [mediaPerm, requestMediaPerm] = MediaLibrary.usePermissions();
  
  // 2️⃣ Ref tipado para CameraView
  const cameraRef = useRef<ElementRef<typeof CameraView> | null>(null);
  const isFocused = useIsFocused();
  
  // 3️⃣ Estados para controles
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  
  // 4️⃣ Función para tomar foto
  const takePicture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync();
      if (mediaPerm?.status !== 'granted') {
        await requestMediaPerm();
      }
      await MediaLibrary.saveToLibraryAsync(photo.uri);
      Alert.alert('¡Foto guardada!', 'Se guardó en tu galería.');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No pudimos tomar la foto.');
    }
  };
  
  // 5️⃣ Función para cambiar cámara
  const toggleCameraType = () => {
    setCameraType(current => (current === 'back' ? 'front' : 'back'));
  };
  
  // 6️⃣ Función para cambiar flash
  const toggleFlash = () => {
    setFlashMode(current => {
      switch (current) {
        case 'off': return 'on';
        case 'on': return 'auto';
        case 'auto': return 'off';
        default: return 'off';
      }
    });
  };
  
  // 7️⃣ Pedir permiso de cámara al montar
  useEffect(() => {
    if (!cameraPerm?.granted) {
      requestCameraPerm();
    }
  }, [cameraPerm?.granted, requestCameraPerm]);
  
  // 8️⃣ Si no hay permiso, mostramos botón para pedirlo
  if (!cameraPerm || !cameraPerm.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>Necesitamos permiso para acceder a la cámara</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPerm}>
          <Text style={styles.permissionButtonText}>Conceder permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // 9️⃣ Renderizamos CameraView con controles nativos
  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={cameraType}
          flash={flashMode}
          ratio="16:9"
        />
      )}
      
      {/* Controles superiores */}
      <View style={styles.topControls}>
        <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
          <Ionicons 
            name={flashMode === 'off' ? 'flash-off' : flashMode === 'on' ? 'flash' : 'flash-outline'} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
      
      {/* Controles inferiores */}
      <View style={styles.bottomControls}>
        {/* Botón de galería */}
        <TouchableOpacity style={styles.galleryButton}>
          <Ionicons name="images" size={24} color="white" />
        </TouchableOpacity>
        
        {/* Botón de captura central */}
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
        
        {/* Botón de cambiar cámara */}
        <TouchableOpacity style={styles.flipButton} onPress={toggleCameraType}>
          <Ionicons name="camera-reverse" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  camera: { 
    flex: 1 
  },
  topControls: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    zIndex: 1,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 1,
  },
  galleryButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  flipButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
