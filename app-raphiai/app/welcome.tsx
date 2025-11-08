import { getCurrentUser } from '@/state/auth';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Animated, Easing, SafeAreaView, StyleSheet, Text } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const fade = React.useRef(new Animated.Value(0)).current;
  const scale = React.useRef(new Animated.Value(0.9)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 800, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 800, easing: Easing.out(Easing.ease), useNativeDriver: true }),
    ]).start();
    const t = setTimeout(async () => {
      const user = await getCurrentUser();
      if (user) {
        router.replace('/');
      } else {
        router.replace('/(auth)/login');
      }
    }, 1500);
    return () => clearTimeout(t);
  }, [fade, scale, router]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Animated.View style={[styles.center, { opacity: fade, transform: [{ scale }] }] }>
        <Image source={require('@/assets/images/raphiai-logo.png')} style={styles.logo} contentFit="contain" />
        <Text style={styles.appName}>RaphiAI</Text>
        <Text style={styles.tagline}>Cultivo sano, cosecha feliz</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#53B175' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 140, height: 140, marginBottom: 12 },
  appName: { fontSize: 28, color: 'white', fontWeight: '900' },
  tagline: { marginTop: 6, color: 'rgba(255,255,255,0.9)' },
});


