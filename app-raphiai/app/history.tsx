import { useInfoModal } from '@/components/InfoModal';
import { apiDeleteDiagnosis, apiListHistories } from '@/lib/api';
import { getCurrentUser } from '@/state/auth';
import { Image } from 'expo-image';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const router = useRouter();
  const [items, setItems] = React.useState<{ id: string; name: string; date: string; image?: string }[]>([]);
  const [isRefreshing, setRefreshing] = React.useState(false);
  const insets = useSafeAreaInsets();
  const [token, setToken] = React.useState<string | null>(null);
  const info = useInfoModal();

  const load = React.useCallback(async (showSpinner: boolean = true) => {
    if (showSpinner) setRefreshing(true);
    try {
      const data = await apiListHistories();
      setItems(
        data.map(h => ({ id: h.diagnosis_id, name: h.name, date: h.date, image: h.image }))
      );
    } catch {
      info.show('No pudimos cargar tu historial ahora. Por favor, vuelve al inicio e inténtalo nuevamente.', 'Problema de conexión');
    } finally {
      if (showSpinner) setRefreshing(false);
    }
  }, [info]);

  useFocusEffect(
    React.useCallback(() => {
      getCurrentUser().then(a => setToken(a?.token ?? null));
      load();
      return () => {};
    }, [load])
  );

  const renderItem = ({ item }: { item: { id: string; name: string; date: string; image?: string } }) => {
    return (
      <View style={styles.card}>
        <TouchableOpacity style={styles.cardBody} onPress={() => router.push({ pathname: '/diagnosis', params: { diagnosisId: item.id } })}>
          {!!item.image && <Image source={{ uri: item.image, headers: token ? { Authorization: `Bearer ${token}` } : undefined }} style={styles.thumb} contentFit="cover" />}
          <View style={styles.meta}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={async () => {
          try { await apiDeleteDiagnosis(item.id); await load(false); } catch { info.show('No pudimos eliminar este diagnóstico. Por favor, vuelve al inicio e inténtalo nuevamente.', 'Problema de conexión'); }
        }}>
          <Text style={styles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Historial', headerStyle: { backgroundColor: '#53B175' }, headerTintColor: '#fff' }} />
      <View style={styles.contentArea}>
        {isRefreshing ? (
          <View style={styles.loadingBox}><ActivityIndicator size="small" color="#53B175" /><Text style={styles.loadingText}>Cargando historial...</Text></View>
        ) : items.length === 0 ? (
          <View style={styles.empty}><Text style={styles.emptyText}>Aún no hay diagnósticos.</Text></View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(i) => i.id}
            renderItem={renderItem}
            contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom }]}
            refreshing={isRefreshing}
            onRefresh={() => load(true)}
          />
        )}
      </View>
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  contentArea: { flex: 1 },
  listContent: { padding: 16 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, overflow: 'hidden', marginBottom: 12, paddingRight: 8 },
  cardBody: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  thumb: { width: 70, height: 70, backgroundColor: '#e5e5e5' },
  meta: { flex: 1, padding: 12, justifyContent: 'center' },
  title: { fontWeight: '700', color: '#53B175', marginBottom: 2 },
  date: { color: '#666', fontSize: 12 },
  deleteBtn: { paddingVertical: 8, paddingHorizontal: 10, backgroundColor: '#ffeaea', borderRadius: 8 },
  deleteText: { color: '#c62828', fontWeight: '700', fontSize: 12 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#666' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  loadingText: { color: '#53B175' },
  footer: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16, backgroundColor: 'white', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#e5e5e5' },
  backBtn: { backgroundColor: '#53B175', borderRadius: 24, paddingVertical: 14, alignItems: 'center' },
  backBtnText: { color: 'white', fontWeight: '700' }
});


