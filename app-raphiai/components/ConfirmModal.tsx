import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  visible: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
};

export default function ConfirmModal({ visible, title = 'Confirmar', message, confirmText = 'Sí', cancelText = 'No', onCancel, onConfirm }: Props) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {!!title && <Text style={styles.title}>{title}</Text>}
          <Text style={styles.message}>{message}</Text>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.cancel, isSubmitting ? styles.disabled : undefined]} onPress={onCancel} disabled={isSubmitting}><Text style={styles.cancelText}>{cancelText}</Text></TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.confirm, isSubmitting ? styles.disabled : undefined]}
              disabled={isSubmitting}
              onPress={async () => {
                try {
                  setIsSubmitting(true);
                  await Promise.resolve(onConfirm());
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.confirmText}>{confirmText}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  sheet: { width: '100%', backgroundColor: 'white', borderRadius: 16, padding: 16 },
  title: { fontSize: 16, fontWeight: '700', color: '#53B175', marginBottom: 8 },
  message: { color: '#333' },
  row: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 12 },
  btn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  cancel: { backgroundColor: '#eee' },
  confirm: { backgroundColor: '#c62828' },
  cancelText: { color: '#333', fontWeight: '600' },
  confirmText: { color: 'white', fontWeight: '700' },
  disabled: { opacity: 0.7 },
});


