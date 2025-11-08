import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSave: (description: string, createdProject?: { name: string; description?: string }) => void;
  title?: string;
  initialDescription?: string;

  projects?: { id: string; name: string }[];
  selectedProjectId?: string;
  onSelectProject?: (projectId: string) => void;
};

export default function SaveDiagnosisModal({ visible, onCancel, onSave, title = 'Guardar diagnóstico', initialDescription = '', projects, selectedProjectId, onSelectProject }: Props) {
  const [desc, setDesc] = React.useState(initialDescription);
  const [newProjectName, setNewProjectName] = React.useState('');
  const [newProjectDesc, setNewProjectDesc] = React.useState('');
  const [showProjectNameError, setShowProjectNameError] = React.useState(false);
  const [showDescError, setShowDescError] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (visible) {
      setDesc(initialDescription);
      setNewProjectName('');
      setNewProjectDesc('');
      setShowProjectNameError(false);
      setShowDescError(false);
      setIsSaving(false);
    }
  }, [visible, initialDescription]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => { if (!isSaving) onCancel(); }}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>
          {projects && projects.length > 0 && (
            <View style={styles.projectPicker}>
              <Text style={styles.label}>Proyecto</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedProjectId ?? projects[0]?.id}
                  onValueChange={(value: string | number) => onSelectProject && onSelectProject(String(value))}
                >
                  {projects.map(p => (
                    <Picker.Item key={p.id} label={p.name} value={p.id} />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {projects && projects.length === 0 && (
            <View style={styles.projectPicker}>
              <Text style={styles.label}>Crear proyecto</Text>
              <TextInput
                placeholder="Nombre del proyecto"
                value={newProjectName}
                onChangeText={setNewProjectName}
                style={[styles.input, showProjectNameError && newProjectName.trim().length === 0 ? styles.inputError : undefined]}
                editable={!isSaving}
              />
              {showProjectNameError && newProjectName.trim().length === 0 && (
                <Text style={styles.errorText}>El nombre del proyecto es obligatorio</Text>
              )}
              <TextInput
                placeholder="Descripción (opcional)"
                value={newProjectDesc}
                onChangeText={setNewProjectDesc}
                style={styles.input}
                editable={!isSaving}
                multiline
              />
            </View>
          )}
          <TextInput
            placeholder="Descripción del diagnóstico"
            value={desc}
            onChangeText={setDesc}
            style={[styles.input, showDescError && desc.trim().length === 0 ? styles.inputError : undefined]}
            editable={!isSaving}
            multiline
          />
          {showDescError && desc.trim().length === 0 && (
            <Text style={styles.errorText}>La descripción es obligatoria</Text>
          )}
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.cancel, isSaving ? styles.disabled : undefined]} onPress={onCancel} disabled={isSaving}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.save, isSaving ? styles.disabled : undefined]}
              disabled={isSaving}
              onPress={async () => {
                const isCreating = !!projects && projects.length === 0;
                if (isCreating && newProjectName.trim().length === 0) {
                  setShowProjectNameError(true);
                  return;
                }
                if (desc.trim().length === 0) {
                  setShowDescError(true);
                  return;
                }
                try {
                  setIsSaving(true);
                  await Promise.resolve(
                    onSave(
                      desc.trim(),
                      isCreating ? { name: newProjectName.trim(), description: newProjectDesc.trim() || undefined } : undefined
                    )
                  );
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
  input: { backgroundColor: '#f0f0f0', borderRadius: 8, minHeight: 48, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8, textAlignVertical: 'top' },
  inputError: { borderWidth: 1, borderColor: '#c62828' },
  errorText: { color: '#c62828', marginTop: -4, marginBottom: 8 },
  projectPicker: { marginBottom: 10 },
  label: { color: '#53B175', fontWeight: '700', marginBottom: 6 },
  pickerWrapper: { backgroundColor: '#f0f0f0', borderRadius: 8 },
  row: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
  btn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  cancel: { backgroundColor: '#eee' },
  save: { backgroundColor: '#53B175' },
  disabled: { opacity: 0.5 },
  cancelText: { color: '#333', fontWeight: '600' },
  saveText: { color: 'white', fontWeight: '700' },
});


