import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type PickResult = { uri: string; fileName?: string | null; mimeType?: string | null };

type Props = {
  visible: boolean;
  onClose: () => void;
  onPick: (result: PickResult) => void;
};

export default function ImageSourcePicker({ visible, onClose, onPick }: Props) {
  const openCamera = async () => {
    try {
      const camPerm = await ImagePicker.requestCameraPermissionsAsync();
      if (!camPerm.granted) return;
      const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
      if (result.canceled) return;
      const asset = result.assets[0];
      onPick({ uri: asset.uri, fileName: asset.fileName ?? null, mimeType: asset.mimeType ?? null });
      onClose();
    } catch {}
  };

  const openGallery = async () => {
    try {
      const galPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!galPerm.granted) return;
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsMultipleSelection: false, quality: 1 });
      if (result.canceled) return;
      const asset = result.assets[0];
      onPick({ uri: asset.uri, fileName: asset.fileName ?? null, mimeType: asset.mimeType ?? null });
      onClose();
    } catch {}
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Seleccione el origen de la imagen</Text>
          <TouchableOpacity style={styles.option} onPress={openCamera}>
            <Ionicons name="camera" size={22} color="#53B175" />
            <Text style={styles.optText}>Cámara</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={openGallery}>
            <Ionicons name="image" size={22} color="#53B175" />
            <Text style={styles.optText}>Galería</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },
  title: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 12 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14 },
  optText: { fontSize: 15, color: '#53B175', fontWeight: '600' },
  cancel: { marginTop: 8, backgroundColor: '#e8f5e9', borderRadius: 12, alignItems: 'center', paddingVertical: 12 },
  cancelText: { color: '#53B175', fontWeight: '600' },
});


