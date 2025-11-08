import { RecoveryModalProvider, useRecoveryModal } from '@/components/RecoveryModal';
import { RecoveryToastProvider, useRecoveryToast } from '@/components/RecoveryToast';
import { apiPasswordVerify } from '@/lib/api';
import { getRecoveryEmail, setResetToken } from '@/state/passwordReset';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

function ScreenInner() {
  const router = useRouter();
  const toast = useRecoveryToast();
  const modal = useRecoveryModal();
  const email = getRecoveryEmail();
  const [code, setCode] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!email) {
      router.replace('/(auth)/forgot');
    }
  }, [email, router]);

  const onVerify = async () => {
    if (!email) return;
    if (!code.trim()) return;
    try {
      setIsSubmitting(true);
      const res = await apiPasswordVerify(email, code.trim());
      if (res.valid && res.reset_token) {
        setResetToken(res.reset_token);
        modal.show('Código verificado', 'Tu código fue validado correctamente', {
          variant: 'verified',
          autoCloseMs: 1200,
          onDismiss: () => router.push('/(auth)/reset'),
        });
      } else {
        toast.show('Código inválido o expirado', 'error');
      }
    } catch (e: any) {
      toast.show(e?.message || 'No se pudo verificar el código', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Verificar código</Text>
        <Text style={styles.help}>Ingresa el código de 6 dígitos enviado a tu correo.</Text>
        <TextInput
          placeholder="Código de 6 dígitos"
          value={code}
          keyboardType="number-pad"
          onChangeText={setCode}
          maxLength={6}
          style={styles.input}
          editable={!isSubmitting}
        />
        <TouchableOpacity style={[styles.primaryBtn]} onPress={onVerify} disabled={isSubmitting}>
          {isSubmitting ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.btnText}>Verificando...</Text>
            </View>
          ) : (
            <Text style={styles.btnText}>Continuar</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function VerifyCodeScreen() {
  return (
    <RecoveryToastProvider>
      <RecoveryModalProvider>
        <ScreenInner />
      </RecoveryModalProvider>
    </RecoveryToastProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#53B175', justifyContent: 'center', alignItems: 'center', padding: 16 },
  card: { width: '100%', maxWidth: 460, backgroundColor: 'white', borderRadius: 16, padding: 16 },
  title: { fontSize: 20, fontWeight: '900', color: '#53B175', marginBottom: 8 },
  help: { color: '#444', marginBottom: 12 },
  input: { backgroundColor: '#f0f0f0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8 },
  primaryBtn: { backgroundColor: '#53B175', borderRadius: 20, alignItems: 'center', paddingVertical: 12, marginTop: 8 },
  btnText: { color: 'white', fontWeight: '700' },
});


