import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type AuthIssueModalContextValue = {
  show: (message?: string, title?: string) => void;
};

const AuthIssueModalContext = React.createContext<AuthIssueModalContextValue | undefined>(undefined);

export function useAuthIssueModal(): AuthIssueModalContextValue {
  const ctx = React.useContext(AuthIssueModalContext);
  if (!ctx) throw new Error('useAuthIssueModal must be used within AuthIssueModalProvider');
  return ctx;
}

export function AuthIssueModalProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = React.useState(false);
  const [title, setTitle] = React.useState<string>('No pudimos verificar tus datos');
  const [message, setMessage] = React.useState<string>('Revisa tu email y contraseña e intenta nuevamente.');

  const show = React.useCallback((msg?: string, ttl?: string) => {
    if (ttl) setTitle(ttl);
    if (msg) setMessage(msg);
    setVisible(true);
  }, []);

  return (
    <AuthIssueModalContext.Provider value={{ show }}>
      {children}
      <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <View style={styles.iconWrap}>
              <Ionicons name="key-outline" size={32} color="#c62828" />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => setVisible(false)}>
              <Text style={styles.primaryText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </AuthIssueModalContext.Provider>
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


