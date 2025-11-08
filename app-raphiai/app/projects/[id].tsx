import ConfirmModal from '@/components/ConfirmModal';
import DiagnosePickerLauncher from '@/components/DiagnosePickerLauncher';
import { useInfoModal } from '@/components/InfoModal';
import SaveDiagnosisModal from '@/components/SaveDiagnosisModal';
import { apiDeleteDiagnosis, apiGetProject, apiListProjectDiagnoses, apiListProjects, apiUpdateDiagnosis } from '@/lib/api';
import { formatDateTimeAMPM } from '@/lib/date';
import { getCurrentUser } from '@/state/auth';
import { Image } from 'expo-image';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProjectDetail() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const projectId = params.id as string;
  const [projectName, setProjectName] = React.useState<string>('Proyecto');
  const [items, setItems] = React.useState<any[]>([]);
  const [token, setToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const info = useInfoModal();

  const load = React.useCallback(async (showSpinner: boolean = true) => {
    if (showSpinner) setIsLoading(true);
    try {
      const p = await apiGetProject(projectId).catch(() => null);
      if (p) setProjectName(p.name);
      const diags = await apiListProjectDiagnoses(projectId);
      setItems(diags);
    } catch {
      info.show('No se pudo cargar el proyecto o sus diagnósticos. Por favor, vuelve al inicio e inténtalo nuevamente.', 'Problema de conexión');
    } finally {
      if (showSpinner) setIsLoading(false);
    }
  }, [projectId, info]);

  React.useEffect(() => { load(); }, [load]);
  useFocusEffect(React.useCallback(() => { getCurrentUser().then(a => setToken(a?.token ?? null)); load(); return () => { }; }, [load]));


  const [editTarget, setEditTarget] = React.useState<{ id: string; description?: string; projectId?: string } | null>(null);
  const [allProjects, setAllProjects] = React.useState<{ id: string; name: string }[]>([]);
  const [selectedProjectForEdit, setSelectedProjectForEdit] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    apiListProjects().then(ps => setAllProjects(ps.map(p => ({ id: p.id, name: p.name }))));
  }, []);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
          onPress={() => router.push({ pathname: '/diagnosis', params: { diagnosisId: item.id, projectId: projectId, description: item.description ?? '' } })}
        >
          {!!item.image && <Image source={{ uri: item.image, headers: token ? { Authorization: `Bearer ${token}` } : undefined }} style={styles.thumb} contentFit="cover" />}
          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.dateText}>{formatDateTimeAMPM(item.date)}</Text>
            {!!item.description && <Text style={styles.descText} numberOfLines={2}>{item.description}</Text>}
          </View>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={styles.editBtn} onPress={() => { setEditTarget({ id: item.id, description: item.description, projectId: projectId }); setSelectedProjectForEdit(projectId); }}>
            <Text style={styles.editText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => setDeleteTarget(item.id)}>
            <Text style={styles.deleteText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: projectName || 'Proyecto',
          headerStyle: { backgroundColor: '#53B175' },
          headerTintColor: '#fff',
          headerRight: () => (
            <DiagnosePickerLauncher
              projectId={projectId}
              render={(open) => (
                <TouchableOpacity style={styles.addBtn} onPress={open}><Text style={styles.addText}>Agregar</Text></TouchableOpacity>
              )}
            />
          )
        }}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Diagnósticos</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color="#53B175" />
          <Text style={styles.loadingText}>Cargando diagnósticos...</Text>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Aún no hay diagnósticos</Text>
          <Text style={styles.emptyHint}>Usa el botón &quot;Agregar&quot; en la parte superior para registrar el primer diagnóstico.</Text>
        </View>
      ) : (
        <FlatList data={items} keyExtractor={(i) => i.id} renderItem={renderItem} contentContainerStyle={styles.listContent} />
      )}

      <SaveDiagnosisModal
        visible={!!editTarget}
        title="Editar diagnóstico"
        initialDescription={editTarget?.description ?? ''}
        projects={allProjects}
        selectedProjectId={selectedProjectForEdit ?? allProjects[0]?.id}
        onSelectProject={(pid) => setSelectedProjectForEdit(pid)}
        onCancel={() => setEditTarget(null)}
        onSave={async (description) => {
          if (!editTarget) return;
          const targetProject = selectedProjectForEdit ?? editTarget.projectId ?? projectId;
          try {
            await apiUpdateDiagnosis(editTarget.id, { description, project_id: targetProject });
            await load(false);
            setEditTarget(null);
          } catch {
            info.show('No se pudo actualizar el diagnóstico. Por favor, vuelve al inicio e inténtalo nuevamente.', 'Problema de conexión');
          }
        }}
      />
      <ConfirmModal
        visible={!!deleteTarget}
        message={'¿Eliminar este diagnóstico?'}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => { if (deleteTarget) { try { await apiDeleteDiagnosis(deleteTarget); await load(false); setDeleteTarget(null); } catch { info.show('No se pudo eliminar el diagnóstico. Por favor, vuelve al inicio e inténtalo nuevamente.', 'Problema de conexión'); } } }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  sectionHeader: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontWeight: '700', color: '#53B175' },
  addBtn: { backgroundColor: '#e8f5e9', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 8 },
  addText: { color: '#53B175', fontWeight: '700' },
  listContent: { paddingHorizontal: 16, paddingBottom: 20 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 12 },
  thumb: { width: 70, height: 70, backgroundColor: '#e5e5e5', borderRadius: 6 },
  title: { fontWeight: '700', color: '#53B175', marginBottom: 6 },
  dateText: { color: '#888', fontSize: 12, marginBottom: 4 },
  descText: { color: '#555' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  emptyTitle: { color: '#53B175', fontWeight: '800', fontSize: 18, marginBottom: 6 },
  emptyHint: { color: '#555', textAlign: 'center' },
  editBtn: { paddingVertical: 8, paddingHorizontal: 10, backgroundColor: '#e8f5e9', borderRadius: 8 },
  editText: { color: '#53B175', fontWeight: '700', fontSize: 12 },
  deleteBtn: { paddingVertical: 8, paddingHorizontal: 10, backgroundColor: '#ffeaea', borderRadius: 8, marginLeft: 0 },
  deleteText: { color: '#c62828', fontWeight: '700', fontSize: 12 },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  loadingText: { color: '#53B175' }
});


