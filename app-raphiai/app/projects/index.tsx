import ConfirmModal from '@/components/ConfirmModal';
import { useInfoModal } from '@/components/InfoModal';
import ProjectFormModal from '@/components/ProjectFormModal';
import { apiCreateProject, apiDeleteProject, apiListProjects, apiUpdateProject } from '@/lib/api';
import { formatDateTimeAMPM } from '@/lib/date';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Project = { id: string; name: string; description?: string; date: string };

export default function ProjectsHome() {
  const router = useRouter();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const info = useInfoModal();
  const [showCreate, setShowCreate] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Project | null>(null);

  const load = React.useCallback(async (showSpinner: boolean = true) => {
    if (showSpinner) setIsLoading(true);
    try {
      const data = await apiListProjects();
      setProjects(data);
    } catch {
      info.show('No se pudo cargar la lista de proyectos. Por favor, vuelve al inicio e inténtalo nuevamente.', 'Problema de conexión');
    } finally {
      if (showSpinner) setIsLoading(false);
    }
  }, [info]);

  React.useEffect(() => { load(); }, [load]);

  const onCreate = async (name: string, desc?: string) => {
    await apiCreateProject(name, desc);
    await load(false);
    setShowCreate(false);
  };

  const renderItem = ({ item }: { item: Project }) => (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardBody} onPress={() => router.push({ pathname: '/projects/[id]', params: { id: item.id } })}>
        <Text style={styles.pTitle}>{item.name}</Text>
        <Text style={styles.pDate}>{formatDateTimeAMPM(item.date)}</Text>
        {!!item.description && <Text style={styles.pDesc} numberOfLines={2}>{item.description}</Text>}
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity style={styles.editBtn} onPress={() => setEditTarget(item)}>
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => setDeleteTarget(item)}>
          <Text style={styles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Proyectos', 
          headerStyle: { backgroundColor: '#53B175' }, 
          headerTintColor: '#fff',
          headerRight: () => (
            <TouchableOpacity onPress={() => setShowCreate(true)} style={styles.headerCreate}>
              <Text style={styles.headerCreateText}>Nuevo</Text>
            </TouchableOpacity>
          )
        }} 
      />

      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color="#53B175" />
          <Text style={styles.loadingText}>Cargando proyectos...</Text>
        </View>
      ) : projects.length === 0 ? (
        <View style={styles.empty}> 
          <Text style={styles.emptyTitle}>Aún no hay proyectos</Text>
          <Text style={styles.emptyHint}>Usa el botón &quot;Nuevo&quot; en la parte superior para crear tu primer proyecto.</Text>
        </View>
      ) : (
        <FlatList data={projects} keyExtractor={(p) => p.id} renderItem={renderItem} contentContainerStyle={styles.listContent} />
      )}

      <ProjectFormModal
        visible={showCreate || !!editTarget}
        title={showCreate ? 'Crear proyecto' : 'Editar proyecto'}
        initialName={!showCreate ? (editTarget?.name ?? '') : ''}
        initialDescription={!showCreate ? (editTarget?.description ?? '') : ''}
        onCancel={() => { setShowCreate(false); setEditTarget(null); }}
        onSave={async (n, d) => {
          if (showCreate) {
            try {
              await onCreate(n, d);
            } catch (e: any) {
              if (e?.status === 409) {
                throw new Error('Ya existe un proyecto con ese nombre');
              }
              info.show('No se pudo crear el proyecto. Por favor, vuelve al inicio e inténtalo nuevamente.', 'Problema de conexión');
            }
          } else if (editTarget) {
            try {
              await apiUpdateProject(editTarget.id, { name: n, description: d });
              await load(false);
              setEditTarget(null);
            } catch (e: any) {
              if (e?.status === 409) {
                throw new Error('Ya existe un proyecto con ese nombre');
              }
              info.show('No se pudo actualizar el proyecto. Por favor, vuelve al inicio e inténtalo nuevamente.', 'Problema de conexión');
            }
          }
        }}
      />
      <ConfirmModal
        visible={!!deleteTarget}  
        message={`¿Eliminar el proyecto "${deleteTarget?.name ?? ''}"?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => { if (deleteTarget) { try { await apiDeleteProject(deleteTarget.id); await load(false); setDeleteTarget(null); } catch (e) { info.show('No se pudo eliminar el proyecto. Por favor, vuelve al inicio e inténtalo nuevamente.', 'Problema de conexión'); } } }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  createBtn: { backgroundColor: '#53B175', borderRadius: 20, alignItems: 'center', paddingVertical: 12 },
  createText: { color: 'white', fontWeight: '700' },
  listContent: { paddingHorizontal: 16, padding: 16 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 12 },
  cardBody: { flex: 1 },
  pTitle: { fontWeight: '700', color: '#53B175', marginBottom: 4 },
  pDate: { color: '#888', fontSize: 12, marginBottom: 4 },
  pDesc: { color: '#666' },
  deleteBtn: { paddingVertical: 8, paddingHorizontal: 10, backgroundColor: '#ffeaea', borderRadius: 8 },
  deleteText: { color: '#c62828', fontWeight: '700', fontSize: 12 },
  editBtn: { paddingVertical: 8, paddingHorizontal: 10, backgroundColor: '#e8f5e9', borderRadius: 8 },
  editText: { color: '#53B175', fontWeight: '700', fontSize: 12 },
  headerCreate: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, marginRight: 8 },
  headerCreateText: { color: '#fff', fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  emptyTitle: { color: '#53B175', fontWeight: '800', fontSize: 18, marginBottom: 6 },
  emptyHint: { color: '#555', textAlign: 'center' },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  loadingText: { color: '#53B175' }
});


