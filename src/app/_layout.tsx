import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { BarlowCondensed_700Bold, BarlowCondensed_800ExtraBold, BarlowCondensed_800ExtraBold_Italic } from '@expo-google-fonts/barlow-condensed';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Image, Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useAppState } from '../state/AppState';
import { colors } from '../theme';

export { ErrorBoundary } from 'expo-router';

function AppShell() {
  const { ready, reduceMotion } = useAppState();
  const { width } = useWindowDimensions();
  const [loaded, error] = useFonts({ BarlowCondensed_700Bold, BarlowCondensed_800ExtraBold, BarlowCondensed_800ExtraBold_Italic, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold });
  const desktop = Platform.OS === 'web' && width > 600;
  return <View style={styles.stage}><View style={[styles.shell, desktop && styles.desktop]}>
    <Head><title>Muscle Massacre — Built Different</title><meta name="description" content="Train harder. Explore the Muscle Massacre training app concept." /><meta name="theme-color" content="#09090C" /></Head>
    <StatusBar style="light" />
    {ready && (loaded || error) ? <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: reduceMotion ? 'none' : 'fade', gestureEnabled: true }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
    </Stack> : <View style={styles.loading}><Image source={require('../../assets/brand/logo.png')} style={{ width: 170, height: 116 }} resizeMode="contain" /></View>}
  </View></View>;
}

export default function RootLayout() {
  return <SafeAreaProvider><AppProvider><AppShell /></AppProvider></SafeAreaProvider>;
}

const styles = StyleSheet.create({
  stage: { flex: 1, backgroundColor: '#141019', alignItems: 'center' },
  shell: { flex: 1, width: '100%', backgroundColor: colors.bg },
  desktop: { maxWidth: 480, borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#35233D', boxShadow: '0 0 140px #8D35E810' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
});
