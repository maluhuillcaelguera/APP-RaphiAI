import ImageSourcePicker from '@/components/ImageSourcePicker';
import { useInfoModal } from '@/components/InfoModal';
import { uploadImageForDiagnosis } from '@/lib/api';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Animated, Easing, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  render: (openPicker: () => void) => React.ReactNode;
  projectId?: string;
};

export default function DiagnosePickerLauncher({ render, projectId }: Props) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [showSourcePicker, setShowSourcePicker] = React.useState(false);
  const info = useInfoModal();
  const [specialError, setSpecialError] = React.useState<{ message: string } | null>(null);
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    let loop: Animated.CompositeAnimation | undefined;
    if (isUploading) {
      loop = Animated.loop(
        Animated.timing(spinValue, { toValue: 1, duration: 1200, easing: Easing.linear, useNativeDriver: true })
      );
      loop.start();
    } else {
      spinValue.stopAnimation();
      spinValue.setValue(0);
    }
    return () => { if (loop) loop.stop(); };
  }, [isUploading, spinValue]);
  const spin = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const openPicker = React.useCallback(() => setShowSourcePicker(true), []);

  const onPick = React.useCallback(async ({ uri, fileName, mimeType }: { uri: string; fileName?: string | null; mimeType?: string | null }) => {
    try {
      setIsUploading(true);
      const data = await uploadImageForDiagnosis(uri, fileName ?? undefined, mimeType ?? undefined);
      const raw = (data as any)?.raw as any;
      const diagnosisId = (data as any)?.id as string | undefined;
      router.push({
        pathname: '/diagnosis',
        params: {
          projectId,
          diagnosisId,
          fromPredict: '1',
          title: raw?.title ?? '',
          name: raw?.name ?? '',
          date: raw?.date ?? '',
          imageUri: raw?.image ? encodeURIComponent(raw.image) : undefined,
          meta: raw?.meta ? encodeURIComponent(JSON.stringify(raw.meta)) : undefined,
        },
      });
    } catch (e: any) {
      if (e?.status === 422) {
        const msg = e?.payload?.detail?.message || 'La imagen no corresponde a una hoja.';
        setSpecialError({ message: msg });
      } else {
        info.show('No pudimos procesar la imagen en este momento. Por favor, vuelve al inicio e inténtalo nuevamente.', 'Problema de conexión');
      }
    } finally {
      setIsUploading(false);
      setShowSourcePicker(false);
    }
  }, [info, projectId]);

  return (
    <>
      {render(openPicker)}
      <ImageSourcePicker visible={showSourcePicker} onClose={() => setShowSourcePicker(false)} onPick={onPick} />

      <Modal visible={isUploading || !!specialError} transparent statusBarTranslucent animationType="fade" onRequestClose={() => { if (!isUploading) setSpecialError(null); }}>
        <View style={styles.fullOverlay}>
          <View style={styles.centerBox}>
            {specialError ? (
              <>
                <Image source={require('@/assets/images/raphiai-logo.png')} style={styles.logo} contentFit="contain" />
                <Text style={styles.fullTitle}>Ups... no es una hoja</Text>
                <Text style={styles.fullSub}>{specialError?.message ?? 'Intenta nuevamente con una fotografía clara de una hoja de papa.'}</Text>
                <View style={styles.ctaRow}>
                  <TouchableOpacity style={styles.primaryCta} onPress={() => { setSpecialError(null); setShowSourcePicker(true); }}>
                    <Text style={styles.primaryCtaText}>Volver a intentar</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <Image source={require('@/assets/images/raphiai-logo.png')} style={styles.logo} contentFit="contain" />
                </Animated.View>
                <ActivityIndicator color="#ffffff" size="small" style={{ marginTop: 12 }} />
                <Text style={styles.fullTitle}>Analizando imagen...</Text>
                <Text style={styles.fullSub}>Conectando con el modelo • Preparando diagnóstico</Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fullOverlay: { flex: 1, backgroundColor: '#53B175', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  centerBox: { alignItems: 'center' },
  logo: { width: 110, height: 110 },
  fullTitle: { marginTop: 10, color: 'white', fontSize: 18, fontWeight: '800' },
  fullSub: { marginTop: 6, color: 'rgba(255,255,255,0.9)', fontSize: 13, textAlign: 'center' },
  ctaRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  primaryCta: { backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 24 },
  primaryCtaText: { color: '#53B175', fontWeight: '800' },
  secondaryCta: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 24 },
  secondaryCtaText: { color: 'white', fontWeight: '800' },
});


