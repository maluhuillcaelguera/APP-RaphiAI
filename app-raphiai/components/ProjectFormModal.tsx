import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  visible: boolean;
  title: string;
  initialName?: string;
  initialDescription?: string;
  onCancel: () => void;
  onSave: (name: string, description?: string) => void;
};

export default function ProjectFormModal({ visible, title, initialName = '', initialDescription = '', onCancel, onSave }: Props) {
  const [name, setName] = React.useState(initialName);
  const [description, setDescription] = React.useState(initialDescription);
  const [showNameError, setShowNameError] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [serverNameError, setServerNameError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (visible) {
      setName(initialName);
      setDescription(initialDescription);
      setShowNameError(false);
      setIsSaving(false);
      setServerNameError(null);
    }
  }, [visible, initialName, initialDescription]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => { if (!isSaving) onCancel(); }}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>
          <TextInput
            placeholder="Nombre del proyecto"
            value={name}
            onChangeText={setName}
            style={[styles.input, (showNameError && name.trim().length === 0) || serverNameError ? styles.inputError : undefined]}
            editable={!isSaving}
          />
          {showNameError && name.trim().length === 0 && (
            <Text style={styles.errorText}>El nombre del proyecto es obligatorio</Text>
          )}
          {!!serverNameError && (
            <Text style={styles.errorText}>{serverNameError}</Text>
          )}
          <TextInput
            placeholder="Descripción (opcional)"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.inputDesc]}
            editable={!isSaving}
            multiline
          />
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.cancel, isSaving ? styles.disabled : undefined]} onPress={onCancel} disabled={isSaving}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.save, isSaving ? styles.disabled : undefined]}
              disabled={isSaving}
              onPress={async () => {
                if (!name.trim()) { setShowNameError(true); return; }
                try {
                  setIsSaving(true);
                  setServerNameError(null);
                  await Promise.resolve(onSave(name.trim(), description.trim() || undefined));
                } catch (err: any) {
                  const msg = typeof err?.message === 'string' ? err.message : '';
                  if (msg) setServerNameError(msg);
                } finally {
                  setIsSaving(false);
                }
              }}
            >
              {isSaving ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.saveText}>Guardando...</Text>
                </View>
              ) : (
                <Text style={styles.saveText}>Guardar</Text>
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
  input: { backgroundColor: '#f0f0f0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8 },
  inputError: { borderWidth: 1, borderColor: '#c62828' },
  errorText: { color: '#c62828', marginTop: -4, marginBottom: 8 },
  inputDesc: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
  btn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  cancel: { backgroundColor: '#eee' },
  save: { backgroundColor: '#53B175' },
  disabled: { opacity: 0.5 },
  cancelText: { color: '#333', fontWeight: '600' },
  saveText: { color: 'white', fontWeight: '700' },
});


