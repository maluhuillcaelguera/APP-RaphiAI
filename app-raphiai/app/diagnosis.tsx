import SaveDiagnosisModal from '@/components/SaveDiagnosisModal';
import { apiAssignDiagnosis, apiCreateProject, apiGetDiagnosisDetail, apiListProjects, apiUpdateDiagnosis } from '@/lib/api';
import { getCurrentUser } from '@/state/auth';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Animated, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DiagnosisScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ predictedClass?: string; imageUri?: string; projectId?: string; diagnosisId?: string; description?: string; fromPredict?: string; title?: string; name?: string; date?: string; meta?: string }>();
  const imageUriParam = params.imageUri as string | undefined;
  const imageUri = imageUriParam ? decodeURIComponent(imageUriParam) : undefined;
  const projectId = params.projectId as string | undefined;
  const diagnosisId = params.diagnosisId as string | undefined;
  const fromPredict = params.fromPredict as string | undefined;
  const initialDesc = (params.description as string | undefined) ?? '';
  const insets = useSafeAreaInsets();
  const [token, setToken] = React.useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = React.useState<boolean>(!!imageUri);
  const pulse = React.useRef(new Animated.Value(0.6)).current;
  const [detail, setDetail] = React.useState<null | { id: string; name: string; title: string; image: string; date: string; meta: any }>(null);
  const [isDetailLoading, setIsDetailLoading] = React.useState<boolean>(false);

  const [showSaveModal, setShowSaveModal] = React.useState(false);
  const [projects, setProjects] = React.useState<{ id: string; name: string }[]>([]);
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (!projectId) {
      apiListProjects().then(ps => setProjects(ps.map(p => ({ id: p.id, name: p.name }))));
    }
  }, [projectId]);

  React.useEffect(() => { getCurrentUser().then(a => setToken(a?.token ?? null)); }, []);
  React.useEffect(() => { setIsImageLoading(!!imageUri); }, [imageUri]);
  React.useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null;
    if (isImageLoading) {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 0.6, duration: 700, useNativeDriver: true }),
        ])
      );
      loop.start();
    }
    return () => { if (loop) loop.stop(); };
  }, [isImageLoading, pulse]);

  React.useEffect(() => {
    let active = true;
    const fromPredictParams = params.fromPredict === '1';
    if (fromPredictParams && params.title && params.meta) {
      try {
        const parsedMeta = JSON.parse(decodeURIComponent(params.meta));
        setDetail({ id: diagnosisId || '', name: params.name ?? '', title: params.title, image: imageUri ?? '', date: params.date ?? '', meta: parsedMeta });
        setIsDetailLoading(false);
        return;
      } catch {}
    }
    const load = async () => {
      if (!diagnosisId) return;
      setIsDetailLoading(true);
      try {
        const d = await apiGetDiagnosisDetail(diagnosisId);
        if (!active) return;
        setDetail({ id: d.id, name: d.name, title: d.title, image: d.image, date: d.date, meta: d.meta });
      } catch {
      } finally {
        if (active) setIsDetailLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [diagnosisId, params.fromPredict, params.title, params.meta, params.name, imageUri, params.date]);

  const info = detail?.meta;

  const isAssigningFromPredict = !!diagnosisId && !!projectId && fromPredict === '1';
  const isEditingSaved = !!diagnosisId && !!projectId && fromPredict !== '1';

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Diagnóstico',
          headerStyle: { backgroundColor: '#53B175' },
          headerTintColor: '#fff',
          headerTitleStyle: { color: '#fff' },
          headerShadowVisible: false,
        }}
      />

      {isDetailLoading ? (
        <>
          <View style={styles.topArea}>
            <Animated.View style={[styles.skeletonTitle, { opacity: pulse }]} />
            <View style={styles.imageContainer}>
              <Animated.View style={[styles.skeleton, { opacity: pulse }]} />
            </View> 
          </View>

          <View style={styles.bottomSheet}>
            <Text style={styles.sectionTitle}>Síntomas</Text>
            <View style={styles.symptomsWrapper}>
              <View style={styles.symptomsContent}>
                {[0,1,2].map((i) => (
                  <Animated.View key={i} style={[styles.skeletonLine, { opacity: pulse }]} />
                ))}
              </View>
            </View>

            <View style={[styles.footerButtons, { paddingBottom: insets.bottom - 16 }]}>
              <Animated.View style={[styles.skeletonBtnPrimary, { opacity: pulse }]} />
              <Animated.View style={[styles.skeletonBtnPrimary, { opacity: pulse }]} />
              <Animated.View style={[styles.skeletonBtnSecondary, { opacity: pulse }]} />
            </View>
          </View>
        </>
      ) : !info ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>No se encontró información del diagnóstico.</Text>
        </View>
      ) : (
        <>
          <View style={styles.topArea}>
            <Text style={styles.title}>{detail?.title}</Text>

            <View style={styles.imageContainer}>
              {(detail?.image || imageUri) ? (
                <>
                  <Image
                    source={{ uri: (detail?.image ?? imageUri) as string, headers: token ? { Authorization: `Bearer ${token}` } : undefined }}
                    style={styles.photo}
                    contentFit="contain"
                    onLoadStart={() => setIsImageLoading(true)}
                    onLoadEnd={() => setIsImageLoading(false)}
                    onError={() => setIsImageLoading(false)}
                  />
                  {(isImageLoading || isDetailLoading) && (
                    <Animated.View style={[styles.skeleton, { opacity: pulse }]} />
                  )}
                </>
              ) : (
                <Animated.View style={[styles.skeleton, { opacity: pulse }]} />
              )}
            </View>
          </View>

          <View style={styles.bottomSheet}>
            <Text style={styles.sectionTitle}>Síntomas</Text>

            <View style={styles.symptomsWrapper}>
              <ScrollView style={styles.symptomsScroll} contentContainerStyle={styles.symptomsContent}>
                {(info.symptoms as string[]).map((s: string, idx: number) => (
                  <View key={idx} style={styles.bulletItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{s}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={[styles.footerButtons, { paddingBottom: insets.bottom - 16 }]}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => router.push({ 
                  pathname: '/treatment', 
                  params: { 
                    title: detail?.title ?? '', 
                    treatment: encodeURIComponent(JSON.stringify(info?.treatment ?? [])), 
                    safetyPrecautions: encodeURIComponent(JSON.stringify(info?.safetyPrecautions ?? [])) 
                  } 
                })}
              >
                <Text style={styles.primaryBtnText}>Ver Tratamiento</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => setShowSaveModal(true)}>
                <Text style={styles.primaryBtnText}>{isEditingSaved ? 'Editar diagnóstico' : (isAssigningFromPredict ? 'Guardar diagnóstico' : 'Guardar en proyecto')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.back()}>
                <Text style={styles.secondaryBtnText}>Volver A Analizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
      <SaveDiagnosisModal
        visible={showSaveModal}
        title={isEditingSaved ? 'Editar diagnóstico' : (isAssigningFromPredict ? 'Guardar diagnóstico' : 'Guardar diagnóstico en proyecto')}
        initialDescription={isEditingSaved ? initialDesc : ''}
        projects={!projectId ? projects : undefined}
        selectedProjectId={!projectId ? (selectedProjectId ?? projects[0]?.id) : projectId}
        onSelectProject={id => setSelectedProjectId(id)}
        onCancel={() => setShowSaveModal(false)}
        onSave={async (description, createdProject) => {
          try {
            const desc = description?.trim();
            const wantsToCreateProject = !!createdProject && !!createdProject.name?.trim();

            if (wantsToCreateProject && diagnosisId) {
              const proj = await apiCreateProject(createdProject!.name, createdProject!.description);
              await apiAssignDiagnosis({ diagnosis_id: diagnosisId, project_id: proj.id, description: desc });
            } else if (isEditingSaved && diagnosisId) {
              await apiUpdateDiagnosis(diagnosisId, { description: desc, project_id: projectId as string });
            } else if (isAssigningFromPredict && diagnosisId && projectId) {
              await apiAssignDiagnosis({ diagnosis_id: diagnosisId, project_id: projectId, description: desc });
            } else {
              let targetProjectId = selectedProjectId ?? projects[0]?.id;
              if (!targetProjectId && createdProject && createdProject.name) {
                const proj = await apiCreateProject(createdProject.name, createdProject.description);
                targetProjectId = proj.id;
              }
              if (!targetProjectId || !diagnosisId) return;
              await apiAssignDiagnosis({ diagnosis_id: diagnosisId, project_id: targetProjectId, description: desc });
            }
            setShowSaveModal(false);
            router.back();
          } catch { }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#53B175',
    flexDirection: 'column',
  },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'white' },

  topArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 12,
    backgroundColor: 'rgba(229,229,229,0.7)',
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 12,
  },
  imageContainer: {
    flex: 1,
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  photo: { width: '100%', height: '100%' },
  skeleton: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#e8f5e9' },
  skeletonTitle: { height: 28, width: '80%', backgroundColor: '#e8f5e9', borderRadius: 8, marginBottom: 12 },
  skeletonLine: { height: 14, backgroundColor: '#e8f5e9', borderRadius: 8, marginBottom: 10 },
  skeletonBtnPrimary: { height: 48, backgroundColor: '#e8f5e9', borderRadius: 24, marginTop: 16 },
  skeletonBtnSecondary: { height: 44, backgroundColor: '#e8f5e9', borderRadius: 24, marginTop: 12 },

  bottomSheet: {
    height: '50%',
    backgroundColor: 'white',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  sectionTitle: { fontWeight: '700', fontSize: 16, color: '#333', marginBottom: 10 },

  symptomsWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
  },
  symptomsScroll: {},
  symptomsContent: { padding: 12 },

  bulletItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  bullet: { fontSize: 16, color: '#53B175', marginRight: 8, lineHeight: 22 },
  bulletText: { flex: 1, fontSize: 14, color: '#4a4a4a' },

  footerButtons: { paddingTop: 12 },
  primaryBtn: { backgroundColor: '#53B175', borderRadius: 24, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  primaryBtnText: { color: 'white', fontWeight: '600' },
  secondaryBtn: { backgroundColor: '#e8f5e9', borderRadius: 24, paddingVertical: 12, alignItems: 'center', marginTop: 12 },
  secondaryBtnText: { color: '#53B175', fontWeight: '600' },
});
