import { RecoveryModalProvider, useRecoveryModal } from '@/components/RecoveryModal';
import { RecoveryToastProvider, useRecoveryToast } from '@/components/RecoveryToast';
import { apiPasswordReset } from '@/lib/api';
import { clearRecoveryEmail, clearResetToken, getResetToken } from '@/state/passwordReset';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

function ScreenInner() {
  const router = useRouter();
  const toast = useRecoveryToast();
  const modal = useRecoveryModal();
  const [initialToken] = React.useState<string | null>(getResetToken());
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  React.useEffect(() => {
    if (!initialToken) {
      router.replace('/(auth)/forgot');
    }
  }, [initialToken, router]);

  const onReset = async () => {
    if (!initialToken) return;
    if (password.length < 6) {
      toast.show('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }
    if (password !== confirm) {
      toast.show('Las contraseñas no coinciden', 'error');
      return;
    }
    try {
      setIsSubmitting(true);
      await apiPasswordReset(initialToken, password);
      modal.show('Contraseña actualizada', 'Tu contraseña fue cambiada correctamente', {
        variant: 'updated',
        autoCloseMs: 1500,
        onDismiss: () => {
          clearResetToken();
          clearRecoveryEmail();
          router.replace('/(auth)/login');
        },
      });
    } catch (e: any) {
      if (e?.status === 401) {
        toast.show('Token inválido o expirado', 'error');
        router.replace('/(auth)/forgot');
      } else if (e?.status === 400) {
        toast.show('La contraseña debe tener al menos 6 caracteres', 'error');
      } else {
        toast.show(e?.message || 'No se pudo actualizar la contraseña', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Establecer nueva contraseña</Text>
        <Text style={styles.help}>Por seguridad, no mostramos tu email. Ingresa tu nueva contraseña.</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Nueva contraseña"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={[styles.input, styles.inputWithToggle]}
            editable={!isSubmitting}
            textContentType="newPassword"
            autoComplete="new-password"
            importantForAutofill="yes"
            returnKeyType="next"
          />
          <TouchableOpacity
            accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            style={styles.toggleBtn}
            onPress={() => setShowPassword((s) => !s)}
            disabled={isSubmitting}
          >
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#53B175" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Confirmar contraseña"
            secureTextEntry={!showConfirm}
            value={confirm}
            onChangeText={setConfirm}
            style={[styles.input, styles.inputWithToggle]}
            editable={!isSubmitting}
            textContentType="newPassword"
            autoComplete="new-password"
            importantForAutofill="yes"
            returnKeyType="done"
          />
          <TouchableOpacity
            accessibilityLabel={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            style={styles.toggleBtn}
            onPress={() => setShowConfirm((s) => !s)}
            disabled={isSubmitting}
          >
            <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={20} color="#53B175" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={onReset} disabled={isSubmitting}>
          {isSubmitting ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.btnText}>Guardando...</Text>
            </View>
          ) : (
            <Text style={styles.btnText}>Guardar contraseña</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function ResetPasswordScreen() {
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
  inputWrapper: { position: 'relative' },
  inputWithToggle: { paddingRight: 42 },
  toggleBtn: { position: 'absolute', right: 10, top: 10, height: 28, width: 28, alignItems: 'center', justifyContent: 'center' },
  primaryBtn: { backgroundColor: '#53B175', borderRadius: 20, alignItems: 'center', paddingVertical: 12, marginTop: 8 },
  btnText: { color: 'white', fontWeight: '700' },
});


