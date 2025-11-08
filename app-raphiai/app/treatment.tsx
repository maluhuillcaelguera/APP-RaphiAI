import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TreatmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ title?: string; treatment?: string; safetyPrecautions?: string }>();
  const title = (params.title as string) ?? '';
  const treatment = React.useMemo(() => {
    try { return JSON.parse(decodeURIComponent((params.treatment as string) ?? '[]')); } catch { return []; }
  }, [params.treatment]);
  const safetyPrecautions = React.useMemo(() => {
    try { return JSON.parse(decodeURIComponent((params.safetyPrecautions as string) ?? '[]')); } catch { return []; }
  }, [params.safetyPrecautions]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Tratamiento',
          headerStyle: { backgroundColor: '#53B175' },
          headerTintColor: '#fff',
          headerTitleStyle: { color: '#fff' },
          headerShadowVisible: false
        }}
      />

      {(!title && treatment.length === 0 && safetyPrecautions.length === 0) ? (
        <View style={styles.center}><Text style={styles.errorText}>No hay información disponible.</Text></View>
      ) : (
        <View style={styles.card}> 
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.sectionTitle}>Recomendaciones</Text>
          <ScrollView style={styles.contentScroll} contentContainerStyle={styles.contentInner}>
            {treatment.map((t: string, idx: number) => (
              <View key={idx} style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{t}</Text>
              </View>
            ))}

            {Array.isArray(safetyPrecautions) && safetyPrecautions.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Precauciones de seguridad</Text>
                {safetyPrecautions.map((p: string, idx: number) => (
                  <View key={idx} style={styles.bulletItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{p}</Text>
                  </View>
                ))}
              </>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.back()}>
              <Text style={styles.secondaryBtnText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#53B175' },
  header: { },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'white' },
  scrollContent: { paddingBottom: 32 },
  card: { flex: 1, backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 20, minHeight: '100%' },
  contentScroll: { flex: 1 },
  contentInner: { paddingBottom: 16 },
  footer: { paddingTop: 8, paddingBottom: 24 },
  title: { fontSize: 20, fontWeight: '700', color: '#53B175', marginBottom: 12 },
  sectionTitle: { fontWeight: '700', fontSize: 16, color: '#333', marginBottom: 8 },
  bulletItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  bullet: { fontSize: 16, color: '#53B175', marginRight: 8, lineHeight: 22 },
  bulletText: { flex: 1, fontSize: 14, color: '#4a4a4a' },
  secondaryBtn: { backgroundColor: '#e8f5e9', borderRadius: 24, paddingVertical: 12, alignItems: 'center', marginTop: 20, marginBottom: 24 },
  secondaryBtnText: { color: '#53B175', fontWeight: '600' },
});


