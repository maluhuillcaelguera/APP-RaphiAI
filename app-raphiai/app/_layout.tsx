import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

import { AuthIssueModalProvider } from '@/components/AuthIssueModal';
import { InfoModalProvider } from '@/components/InfoModal';
import { ToastProvider } from '@/components/Toast';
import { getCurrentUser } from '@/state/auth';
import React from 'react';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [bootstrapped, setBootstrapped] = React.useState(false);
  const [isAuthed, setIsAuthed] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      setIsAuthed(!!user);
      setBootstrapped(true);
    })();
  }, []);

  if (!loaded || !bootstrapped) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthIssueModalProvider>
        <InfoModalProvider>
          <ToastProvider>
          {isAuthed ? (
            <Stack>
              <Stack.Screen name="welcome" options={{ headerShown: false }} />
              <Stack.Screen name="index" />
              <Stack.Screen name="+not-found" />
            </Stack>
          ) : (
            <Stack>
              <Stack.Screen name="welcome" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)/login" />
              <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)/forgot" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)/verify" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)/reset" options={{ headerShown: false }} />
            </Stack>
          )}
          <StatusBar style="auto" />
          </ToastProvider>
        </InfoModalProvider>
      </AuthIssueModalProvider>
    </ThemeProvider>
  );
}
