import { useInfoModal } from '@/components/InfoModal';
import { RecoveryModalProvider, useRecoveryModal } from '@/components/RecoveryModal';
import TermsModal from '@/components/TermsModal';
import { signUp } from '@/state/auth';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

function ScreenInner() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [showErrors, setShowErrors] = React.useState(false);
  const info = useInfoModal();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const modal = useRecoveryModal();
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const [showTerms, setShowTerms] = React.useState(false);

  const isEmailValid = React.useMemo(() => {
    const value = email.trim();
    if (!value) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }, [email]);

  const isPasswordValid = React.useMemo(() => password.length >= 6, [password]);
  const isConfirmValid = React.useMemo(() => confirm === password, [confirm, password]);

  const onRegister = async () => {
    try {
      setShowErrors(true);
      if (!isEmailValid || !isPasswordValid || !isConfirmValid || !acceptedTerms) return;
      setIsSubmitting(true);
      await signUp(email, password);
      modal.show('¡Bienvenido a RaphiAI!', 'Tu cuenta fue creada con éxito', {
        variant: 'verified',
        autoCloseMs: 1500,
        onDismiss: () => router.replace('/'),
      });
    } catch (e: any) {
      if (typeof e?.status === 'number' && e.status === 409) {
        info.show(e?.message || 'Entrada inválida', 'No pudimos crear tu cuenta', { primaryText: 'OK', onPrimary: () => {} });
      } else {
        info.show('No pudimos crear tu cuenta. Intenta nuevamente.', 'Problema de conexión', { primaryText: 'OK', onPrimary: () => {} });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.hero}>
        <Image source={require('@/assets/images/raphiai-logo.png')} style={styles.logo} contentFit="contain" />
        <Text style={styles.appName}>Crear cuenta</Text>
        <Text style={styles.subtitle}>Regístrate para comenzar</Text>
      </View>
      <View style={styles.card}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, showErrors && !isEmailValid ? styles.inputError : undefined]}
          editable={!isSubmitting}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          inputMode="email"
          textContentType="emailAddress"
          autoComplete="email"
          importantForAutofill="yes"
          returnKeyType="next"
        />
        {showErrors && !isEmailValid && <Text style={styles.errorText}>Ingresa un email válido</Text>}

        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Contraseña"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={[styles.input, styles.inputWithToggle, showErrors && !isPasswordValid ? styles.inputError : undefined]}
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
        {showErrors && !isPasswordValid && <Text style={styles.errorText}>La contraseña debe tener al menos 6 caracteres</Text>}

        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Confirmar contraseña"
            secureTextEntry={!showConfirm}
            value={confirm}
            onChangeText={setConfirm}
            style={[styles.input, styles.inputWithToggle, showErrors && !isConfirmValid ? styles.inputError : undefined]}
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
        {showErrors && !isConfirmValid && <Text style={styles.errorText}>Las contraseñas no coinciden</Text>}

        <View style={styles.termsRow}>
          <TouchableOpacity style={styles.checkbox} onPress={() => setAcceptedTerms((s) => !s)} disabled={isSubmitting}>
            <View style={[styles.checkboxBox, acceptedTerms ? styles.checkboxChecked : undefined]} />
          </TouchableOpacity>
          <Text style={styles.termsText}>
            Acepto los{' '}
            <Text style={styles.termsLink} onPress={() => setShowTerms(true)}>Términos y Condiciones</Text>
          </Text>
        </View>
        {showErrors && !acceptedTerms && <Text style={styles.errorText}>Debes aceptar los Términos y Condiciones</Text>}

        <TouchableOpacity style={styles.primaryBtn} onPress={onRegister} disabled={isSubmitting}>
          {isSubmitting ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.btnText}>Creando...</Text>
            </View>
          ) : (
            <Text style={styles.btnText}>Crear cuenta</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.back()} disabled={isSubmitting}>
          <Text style={styles.secondaryText}>Volver a iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    <TermsModal
      visible={showTerms}
      onClose={() => setShowTerms(false)}
      onAccept={() => { setAcceptedTerms(true); setShowTerms(false); }}
    />
    </>
  );
}

export default function RegisterScreen() {
  return (
    <RecoveryModalProvider>
      <ScreenInner />
    </RecoveryModalProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#53B175', justifyContent: 'center', alignItems: 'center', padding: 16 },
  hero: { alignItems: 'center', marginBottom: 16 },
  logo: { width: 100, height: 100 },
  appName: { fontSize: 26, fontWeight: '900', color: 'white', marginTop: 8 },
  subtitle: { color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  card: { width: '100%', maxWidth: 460, backgroundColor: 'white', borderRadius: 16, padding: 16 },
  input: { backgroundColor: '#f0f0f0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8 },
  inputWrapper: { position: 'relative' },
  inputWithToggle: { paddingRight: 42 },
  toggleBtn: { position: 'absolute', right: 10, top: 10, height: 28, width: 28, alignItems: 'center', justifyContent: 'center' },
  inputError: { borderWidth: 1, borderColor: '#c62828' },
  errorText: { color: '#c62828', marginTop: -4, marginBottom: 8 },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4, marginBottom: 8 },
  checkbox: { padding: 6 },
  checkboxBox: { width: 18, height: 18, borderRadius: 4, borderWidth: 2, borderColor: '#53B175' },
  checkboxChecked: { backgroundColor: '#53B175' },
  termsText: { color: '#333' },
  termsLink: { color: '#53B175', fontWeight: '700', textDecorationLine: 'underline' },
  primaryBtn: { backgroundColor: '#53B175', borderRadius: 20, alignItems: 'center', paddingVertical: 12, marginTop: 8 },
  secondaryBtn: { borderColor: '#53B175', borderWidth: 1.5, borderRadius: 20, alignItems: 'center', paddingVertical: 12, marginTop: 8 },
  btnText: { color: 'white', fontWeight: '700' },
  secondaryText: { color: '#53B175', fontWeight: '700' },
  linkBtn: { alignItems: 'center', paddingVertical: 10 },
  linkText: { color: '#53B175', fontWeight: '700' },
});


