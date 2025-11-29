import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Fontisto } from '@expo/vector-icons';
import { useEffect } from 'react';

export default function SplashScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/home');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <Fontisto name="tinder" size={70} color="#ff5864" />
      <Text style={styles.logo}>tinder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 40,
    fontWeight: '800',
    color: '#ff5864',
    letterSpacing: 0.4,
  },
});
