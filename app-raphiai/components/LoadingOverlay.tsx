import { Image } from 'expo-image';
import React from 'react';
import { ActivityIndicator, Animated, Easing, Modal, StyleSheet, Text, View } from 'react-native';

type Props = {
  visible: boolean;
  primaryText?: string;
  secondaryText?: string;
};

export default function LoadingOverlay({ visible, primaryText = 'Cargando...', secondaryText }: Props) {
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    let loop: Animated.CompositeAnimation | undefined;
    if (visible) {
      loop = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      loop.start();
    } else {
      spinValue.stopAnimation();
      spinValue.setValue(0);
    }
    return () => {
      if (loop) loop.stop();
    };
  }, [visible, spinValue]);

  const spin = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Modal visible={visible} transparent statusBarTranslucent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Image source={require('@/assets/images/raphiai-logo.png')} style={styles.logo} contentFit="contain" />
          </Animated.View>
          <ActivityIndicator color="#ffffff" size="small" style={{ marginTop: 12 }} />
          <Text style={styles.text}>{primaryText}</Text>
          {!!secondaryText && <Text style={styles.sub}>{secondaryText}</Text>}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#53B175', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  box: { alignItems: 'center' },
  logo: { width: 110, height: 110 },
  text: { marginTop: 10, color: 'white', fontSize: 16, fontWeight: '600' },
  sub: { marginTop: 4, color: 'rgba(255,255,255,0.85)', fontSize: 12 },
});


