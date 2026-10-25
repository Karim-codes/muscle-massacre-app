import { Redirect } from 'expo-router';
import { useAppState } from '../state/AppState';

export default function Index() {
  const { onboarded } = useAppState();
  return <Redirect href={onboarded ? '/home' : '/onboarding'} />;
}
