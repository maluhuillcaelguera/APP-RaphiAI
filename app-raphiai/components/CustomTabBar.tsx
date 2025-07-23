/*import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useCameraContext } from '../context/CameraContext';

type TabItem = {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon?: keyof typeof Ionicons.glyphMap;
  route: string;
};

type CameraControl = {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  action: string;
};

const TABS: TabItem[] = [
  { 
    name: 'camera', 
    icon: 'camera-outline',
    activeIcon: 'camera',
    route: '/(tabs)/camera'
  },
  { 
    name: 'index', 
    icon: 'home-outline',
    activeIcon: 'home',
    route: '/(tabs)/'
  },
  { 
    name: 'menu', 
    icon: 'menu-outline',
    activeIcon: 'menu',
    route: '/(tabs)/menu'
  },
];

const CAMERA_CONTROLS: CameraControl[] = [
  {
    name: 'info',
    icon: 'information-circle-outline',
    action: 'info'
  },
  {
    name: 'capture',
    icon: 'camera',
    action: 'capture'
  },
  {
    name: 'gallery',
    icon: 'images-outline',
    action: 'gallery'
  }
];

export default function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { onCameraAction } = useCameraContext();
  const isCameraScreen = pathname === '/(tabs)/camera';

  const handlePress = (route: string) => {
    router.push(route as any);
  };

  const handleCameraAction = (action: string) => {
    if (onCameraAction) {
      onCameraAction(action);
    }
  };
 //Mostrar controles de cámara cuando esté en la pantalla de cámara
  if (isCameraScreen) {
    return (
      <View style={styles.cameraContainer}>
        {CAMERA_CONTROLS.map((control, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleCameraAction(control.action)}
            style={[
              styles.cameraButton,
              control.name === 'capture' && styles.captureButton
            ]}>
            <Ionicons 
              name={control.icon} 
              size={control.name === 'capture' ? 32 : 24} 
              color={control.name === 'capture' ? '#000' : '#fff'} 
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  // Mostrar navegación normal en otras pantallas
  return (
    <View style={styles.container}>
      {TABS.map((tab, index) => {
        const isFocused = pathname === tab.route || 
                          (tab.name === 'index' && pathname === '/(tabs)');

        return (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(tab.route)}
            style={[styles.button, isFocused && styles.activeButton]}>
            <Ionicons 
              name={isFocused ? (tab.activeIcon || tab.icon) : tab.icon} 
              size={24} 
              color="#fff" 
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  button: {
    backgroundColor: '#53B175',
    borderRadius: 30,
    padding: 18,
  },
  activeButton: {
    opacity: 1,
  },
  cameraContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  cameraButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 30,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    backgroundColor: '#fff',
    borderRadius: 40,
    padding: 20,
    width: 80,
    height: 80,
  },
});*/