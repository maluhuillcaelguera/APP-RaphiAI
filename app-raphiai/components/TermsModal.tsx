import { TERMS_SECTIONS } from '@/constants/terms';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onAccept?: () => void;
};

export default function TermsModal({ visible, onClose, onAccept }: Props) {
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Términos y Condiciones</Text>
          <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 16 }}>
            {TERMS_SECTIONS.map((s, idx) => (
              <View key={`${idx}-${s.title}`} style={{ marginBottom: 12 }}>
                <Text style={styles.sectionTitle}>{s.title}</Text>
                <Text style={styles.sectionBody}>{s.body}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={onClose}>
              <Text style={styles.cancelText}>Cerrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.accept]} onPress={onAccept}>
              <Text style={styles.acceptText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '85%', padding: 16 },
  title: { fontSize: 18, fontWeight: '800', color: '#53B175', marginBottom: 8 },
  content: { maxHeight: '70%' },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4, color: '#222' },
  sectionBody: { color: '#444' },
  row: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 12 },
  btn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  cancel: { backgroundColor: '#eee' },
  accept: { backgroundColor: '#53B175' },
  cancelText: { color: '#333', fontWeight: '600' },
  acceptText: { color: 'white', fontWeight: '700' },
});


