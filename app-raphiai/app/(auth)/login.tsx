import { useAuthIssueModal } from '@/components/AuthIssueModal';
import { useInfoModal } from '@/components/InfoModal';
import { signIn } from '@/state/auth';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showErrors, setShowErrors] = React.useState(false);
  const info = useInfoModal();
  const authIssue = useAuthIssueModal();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const isEmailValid = React.useMemo(() => {
    const value = email.trim();
    if (!value) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }, [email]);

  const isPasswordPresent = React.useMemo(() => password.trim().length > 0, [password]);

  const onLogin = async () => {
    try {
      setShowErrors(true);
      if (!isEmailValid || !isPasswordPresent) return;
      setIsSubmitting(true);
      await signIn(email, password);
      router.replace('/');
    } catch (e: any) {
      const isUnauthorized = typeof e?.status === 'number' && e.status === 401;
      if (isUnauthorized) {
        authIssue.show('Revisa tu email y contraseña e intenta nuevamente.', 'No pudimos verificar tus datos');
      } else {
        info.show('No pudimos iniciar sesión. Intenta nuevamente.', 'Problema de conexión', { primaryText: 'OK', onPrimary: () => {} });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.hero}>
        <Image source={require('@/assets/images/raphiai-logo.png')} style={styles.logo} contentFit="contain" />
        <Text style={styles.appName}>RaphiAI</Text>
        <Text style={styles.subtitle}>Bienvenido, inicia sesión para continuar</Text>
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
            style={[styles.input, styles.inputWithToggle, showErrors && !isPasswordPresent ? styles.inputError : undefined]}
            editable={!isSubmitting}
            textContentType="password"
            autoComplete="password"
            importantForAutofill="yes"
            returnKeyType="done"
            onSubmitEditing={onLogin}
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
        {showErrors && !isPasswordPresent && <Text style={styles.errorText}>La contraseña es obligatoria</Text>}

        <TouchableOpacity style={styles.primaryBtn} onPress={onLogin} disabled={isSubmitting}>
          {isSubmitting ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.btnText}>Ingresando...</Text>
            </View>
          ) : (
            <Text style={styles.btnText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/(auth)/register')} disabled={isSubmitting}>
          <Text style={styles.secondaryText}>Crear cuenta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkBtn} onPress={() => router.push('/(auth)/forgot')} disabled={isSubmitting}>
          <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  primaryBtn: { backgroundColor: '#53B175', borderRadius: 20, alignItems: 'center', paddingVertical: 12, marginTop: 8 },
  secondaryBtn: { borderColor: '#53B175', borderWidth: 1.5, borderRadius: 20, alignItems: 'center', paddingVertical: 12, marginTop: 8 },
  btnText: { color: 'white', fontWeight: '700' },
  secondaryText: { color: '#53B175', fontWeight: '700' },
  linkBtn: { alignItems: 'center', paddingVertical: 10 },
  linkText: { color: '#53B175', fontWeight: '700' },
});


