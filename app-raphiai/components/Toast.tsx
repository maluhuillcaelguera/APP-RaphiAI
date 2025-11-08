import React from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastType = 'info' | 'success' | 'error';

type ToastContextValue = {
  show: (message: string, type?: ToastType, durationMs?: number) => void;
};

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = React.useState<string>('');
  const [type, setType] = React.useState<ToastType>('info');
  const [visible, setVisible] = React.useState(false);
  const opacity = React.useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const hide = React.useCallback(() => {
    Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true, easing: Easing.out(Easing.ease) }).start(() => {
      setVisible(false);
    });
  }, [opacity]);

  const show = React.useCallback((msg: string, t: ToastType = 'error', durationMs = 3000) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMessage(msg);
    setType(t);
    setVisible(true);
    opacity.setValue(0);
    Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true, easing: Easing.out(Easing.ease) }).start();
    timeoutRef.current = setTimeout(hide, durationMs);
  }, [hide, opacity]);

  const value = React.useMemo(() => ({ show }), [show]);

  const backgroundColor = type === 'error' ? '#c62828' : type === 'success' ? '#53B175' : '#53B175';

  return (
    <ToastContext.Provider value={value}>
      {children}
      {visible && (
        <View pointerEvents="none" style={[styles.overlay, { paddingBottom: insets.bottom + 12 }]}>
          <Animated.View style={[styles.toast, { backgroundColor, opacity }]}> 
            <Text style={styles.text}>{message}</Text>
          </Animated.View>
        </View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  toast: {
    maxWidth: '92%',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  text: { color: 'white', fontWeight: '600' },
});


