import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, Easing, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Variant = 'info' | 'verified' | 'updated';

type RecoveryModalOptions = {
  primaryText?: string;
  onPrimary?: () => void;
  autoCloseMs?: number;
  onDismiss?: () => void;
  variant?: Variant;
};

type RecoveryModalContextValue = {
  show: (title: string, message: string, options?: RecoveryModalOptions) => void;
};

const RecoveryModalContext = React.createContext<RecoveryModalContextValue | undefined>(undefined);

export function useRecoveryModal(): RecoveryModalContextValue {
  const ctx = React.useContext(RecoveryModalContext);
  if (!ctx) throw new Error('useRecoveryModal must be used within RecoveryModalProvider');
  return ctx;
}

export function RecoveryModalProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [primaryText, setPrimaryText] = React.useState<string>('Continuar');
  const [variant, setVariant] = React.useState<Variant>('info');
  const [autoClose, setAutoClose] = React.useState<boolean>(false);
  const onPrimaryRef = React.useRef<(() => void) | null>(null);
  const onDismissRef = React.useRef<(() => void) | null>(null);
  const autoCloseRef = React.useRef<NodeJS.Timeout | null>(null);

  const scale = React.useRef(new Animated.Value(0.9)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  const animateIn = React.useCallback(() => {
    scale.setValue(0.9);
    opacity.setValue(0);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, bounciness: 8, speed: 10, useNativeDriver: true }),
    ]).start();
  }, [opacity, scale]);

  const hide = React.useCallback(() => {
    Animated.timing(opacity, { toValue: 0, duration: 160, easing: Easing.in(Easing.ease), useNativeDriver: true }).start(() => {
      setVisible(false);
      setAutoClose(false);
      const cb = onDismissRef.current;
      if (cb) cb();
    });
  }, [opacity]);

  const show = React.useCallback((ttl: string, msg: string, options?: RecoveryModalOptions) => {
    if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
    setTitle(ttl);
    setMessage(msg);
    setPrimaryText(options?.primaryText || 'Continuar');
    setVariant(options?.variant || 'info');
    onPrimaryRef.current = options?.onPrimary || null;
    onDismissRef.current = options?.onDismiss || null;
    setVisible(true);
    requestAnimationFrame(() => animateIn());
    if (options?.autoCloseMs && options.autoCloseMs > 0) {
      setAutoClose(true);
      autoCloseRef.current = setTimeout(() => hide(), options.autoCloseMs);
    }
  }, [animateIn, hide]);

  const onPrimary = React.useCallback(() => {
    const cb = onPrimaryRef.current;
    if (cb) cb();
    hide();
  }, [hide]);

  const value = React.useMemo(() => ({ show }), [show]);

  const renderIcon = () => {
    const iconName = variant === 'updated' ? 'lock-closed' : 'checkmark-circle';
    const iconColor = variant === 'info' ? '#53B175' : '#53B175';
    return (
      <Animated.View style={[styles.animatedIcon, { transform: [{ scale }], opacity }]}> 
        <View style={styles.iconWrap}>
          <Ionicons name={iconName as any} size={36} color={iconColor} />
        </View>
      </Animated.View>
    );
  };

  return (
    <RecoveryModalContext.Provider value={value}>
      {children}
      <Modal transparent visible={visible} animationType="fade" onRequestClose={hide}>
        <View style={styles.overlay}>
          <Animated.View style={[styles.card, { opacity }]}> 
            {renderIcon()}
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            {!autoClose && (
              <TouchableOpacity style={styles.primaryBtn} onPress={onPrimary}>
                <Text style={styles.primaryText}>{primaryText}</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      </Modal>
    </RecoveryModalContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  card: { width: '100%', maxWidth: 440, backgroundColor: 'white', borderRadius: 16, padding: 16, alignItems: 'center' },
  animatedIcon: { marginBottom: 8 },
  iconWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#e8f5e9', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '800', color: '#53B175', marginBottom: 6, textAlign: 'center' },
  message: { color: '#444', textAlign: 'center', marginBottom: 14 },
  primaryBtn: { backgroundColor: '#53B175', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16 },
  primaryText: { color: 'white', fontWeight: '700' },
});


