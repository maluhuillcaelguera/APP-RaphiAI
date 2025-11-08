import { RecoveryModalProvider, useRecoveryModal } from '@/components/RecoveryModal';
import { RecoveryToastProvider, useRecoveryToast } from '@/components/RecoveryToast';
import { apiPasswordForgot } from '@/lib/api';
import { setRecoveryEmail } from '@/state/passwordReset';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

function ScreenInner() {
  const router = useRouter();
  const toast = useRecoveryToast();
  const modal = useRecoveryModal();
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [cooldown, setCooldown] = React.useState<number>(0);

  React.useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    }
    return () => timer && clearInterval(timer);
  }, [cooldown]);

  const onSend = async () => {
    if (!email.trim()) return;
    try {
      setIsSubmitting(true);
      const { message } = await apiPasswordForgot(email.trim());
      setRecoveryEmail(email.trim());
      setCooldown(60);
      modal.show('Recuperación de contraseña', message || 'Si el correo existe, te enviamos un código', {
        variant: 'info',
        autoCloseMs: 1400,
        onDismiss: () => router.push('/(auth)/verify'),
      });
    } catch (e: any) {
      if (e?.status === 502) {
        toast.show('No se pudo enviar el correo de recuperación', 'error');
      } else {
        toast.show(e?.message || 'No se pudo solicitar el código de recuperación', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Recuperar contraseña</Text>
        <Text style={styles.help}>Ingresa tu email y te enviaremos un código de 6 dígitos.</Text>
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          editable={!isSubmitting}
        />
        <TouchableOpacity style={[styles.primaryBtn, (isSubmitting || cooldown > 0) && styles.disabledBtn]} onPress={onSend} disabled={isSubmitting || cooldown > 0}>
          {isSubmitting ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.btnText}>Enviando...</Text>
            </View>
          ) : (
            <Text style={styles.btnText}>{cooldown > 0 ? `Reenviar en ${cooldown}s` : 'Enviar código'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function ForgotPasswordScreen() {
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
  disabledBtn: { opacity: 0.6 },
  btnText: { color: 'white', fontWeight: '700' },
});


