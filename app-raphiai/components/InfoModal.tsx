import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type InfoModalOptions = {
  primaryText?: string;
  onPrimary?: () => void;
};

type InfoModalContextValue = {
  show: (message: string, title?: string, options?: InfoModalOptions) => void;
};

const InfoModalContext = React.createContext<InfoModalContextValue | undefined>(undefined);

export function useInfoModal(): InfoModalContextValue {
  const ctx = React.useContext(InfoModalContext);
  if (!ctx) throw new Error('useInfoModal must be used within InfoModalProvider');
  return ctx;
}

export function InfoModalProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = React.useState(false);
  const [title, setTitle] = React.useState<string>('Algo salió mal');
  const [message, setMessage] = React.useState<string>('Ocurrió un problema. Intenta nuevamente.');
  const [primaryText, setPrimaryText] = React.useState<string>('Ir al inicio');
  const primaryCallbackRef = React.useRef<(() => void) | null>(null);

  const routerDefault = useRouter();

  const defaultPrimary = React.useCallback(() => {
    setVisible(false);
    routerDefault.replace('/');
  }, [routerDefault]);

  const show = React.useCallback((msg: string, ttl?: string, options?: InfoModalOptions) => {
    setTitle(ttl || 'Algo salió mal');
    setMessage(msg);
    setPrimaryText(options?.primaryText || 'Ir al inicio');
    primaryCallbackRef.current = options?.onPrimary || defaultPrimary;
    setVisible(true);
  }, [defaultPrimary]);

  const onPrimary = React.useCallback(() => {
    setVisible(false);
    const cb = primaryCallbackRef.current;
    if (cb) cb(); else defaultPrimary();
  }, [defaultPrimary]);

  const value = React.useMemo(() => ({ show }), [show]);

  return (
    <InfoModalContext.Provider value={value}>
      {children}
      <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <View style={styles.iconWrap}>
              <Ionicons name="alert-circle" size={32} color="#c62828" />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={onPrimary}>
              <Text style={styles.primaryText}>{primaryText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </InfoModalContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  card: { width: '100%', maxWidth: 440, backgroundColor: 'white', borderRadius: 16, padding: 16, alignItems: 'center' },
  iconWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#ffebee', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  title: { fontSize: 16, fontWeight: '800', color: '#53B175', marginBottom: 6, textAlign: 'center' },
  message: { color: '#444', textAlign: 'center', marginBottom: 14 },
  primaryBtn: { backgroundColor: '#53B175', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16 },
  primaryText: { color: 'white', fontWeight: '700' },
});


