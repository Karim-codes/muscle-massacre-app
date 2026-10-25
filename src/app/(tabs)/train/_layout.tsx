import { Stack } from 'expo-router';
import { useAppState } from '../../../state/AppState';
import { colors } from '../../../theme';

export const unstable_settings = { initialRouteName: 'index' };
export default function TrainLayout() {
  const { reduceMotion } = useAppState();
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: reduceMotion ? 'none' : 'slide_from_right', gestureEnabled: true }} />;
}
