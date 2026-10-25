import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, Modal, StyleSheet, Text, View } from 'react-native';
import { BrandHeader, FadeIn, Icon, IconButton, Label, PrimaryButton, Screen, SectionTitle, Tap, type IconName, typeStyles } from '../../components/ui';
import { useAppState } from '../../state/AppState';
import { colors, fonts } from '../../theme';

export default function More() {
  const { focus, saved, storageError } = useAppState();
  const [aboutOpen, setAboutOpen] = useState(false);
  const items: { title: string; subtitle: string; icon: IconName; action: () => void; external?: boolean }[] = [
    { title: 'Saved workouts', subtitle: `${saved.length} saved ${saved.length === 1 ? 'session' : 'sessions'}`, icon: 'bookmark-outline', action: () => router.navigate({ pathname: '/train', params: { section: 'saved' } }) },
    { title: 'Your demo profile', subtitle: 'Name, gym ID & member preview', icon: 'person-outline', action: () => router.push({ pathname: '/onboarding', params: { step: 'identity' } }) },
    { title: 'Replay the introduction', subtitle: 'Your profile & training focus', icon: 'sparkles-outline', action: () => router.push('/onboarding') },
    { title: 'Muscle Massacre website', subtitle: 'The gym. The official details.', icon: 'globe-outline', action: () => { void Linking.openURL('https://musclemassacre.com/'); }, external: true },
    { title: 'Find us on Instagram', subtitle: '@muscle.massacre', icon: 'logo-instagram', action: () => { void Linking.openURL('https://www.instagram.com/muscle.massacre/'); }, external: true },
    { title: 'About this prototype', subtitle: 'A look at what’s possible', icon: 'information-circle-outline', action: () => setAboutOpen(true) },
  ];
  return <Screen><BrandHeader /><FadeIn><Label style={{ color: colors.bright, fontSize: 9, marginTop: 14 }}>THE MUSCLE MASSACRE MINDSET</Label><Text accessibilityRole="header" style={[typeStyles.title, { marginTop: 9 }]}>ALL <Text style={{ color: colors.bright }}>IN.</Text></Text><Text style={[typeStyles.body, { marginTop: 9 }]}>Your gym. Your training. Your way.</Text>
    <View style={styles.focus}><View style={styles.focusIcon}><Icon name="flash" color={colors.bright} size={24} /></View><View style={{ flex: 1 }}><Label style={{ color: '#B497C7', fontSize: 8 }}>YOUR CHOSEN FOCUS</Label><Text style={styles.focusTitle}>{focus.toUpperCase()} DAY</Text></View><Text style={styles.local}>ON THIS DEVICE</Text></View>
    <SectionTitle title="MAKE IT YOURS" /><View style={styles.list}>{items.map((item) => <Tap key={item.title} onPress={item.action} style={styles.row} accessibilityLabel={item.title}><View style={styles.rowIcon}><Icon name={item.icon} color={colors.bright} size={21} /></View><View style={{ flex: 1 }}><Text style={styles.rowTitle}>{item.title}</Text><Text style={styles.rowSubtitle}>{item.subtitle}</Text></View><Icon name={item.external ? 'open-outline' : 'chevron-forward'} size={17} color="#93809F" /></Tap>)}</View>
    {storageError && <Text accessibilityRole="alert" style={styles.storageNote}>Your choices work for this visit. Device storage is currently unavailable, so they may reset when the app closes.</Text>}
    <View style={styles.footer}><View style={styles.rule} /><Label style={{ fontSize: 9, color: '#A68AB9' }}>DISCIPLINE MEETS INTENSITY.</Label><Text style={styles.footerText}>Muscle Massacre · Maidenhead{`\n`}Client concept / Version 1.0</Text></View>
  </FadeIn>
  <Modal visible={aboutOpen} transparent animationType="fade" onRequestClose={() => setAboutOpen(false)}><View style={styles.modal}><View style={styles.dialog}><View style={styles.dialogHeader}><Label style={{ color: colors.bright }}>THE APP CONCEPT</Label><IconButton name="close" label="Close prototype information" onPress={() => setAboutOpen(false)} /></View><Text style={styles.dialogTitle}>BUILT TO{`\n`}MAKE AN IMPACT.</Text><Text style={styles.dialogBody}>A React Native and Expo prototype for Muscle Massacre. Workout programmes, instructions, sets, reps and rest periods are illustrative demo content, not gym-approved training advice.</Text><Text style={styles.dialogBody}>Gym equipment availability is not confirmed. Exercise photos are illustrative or show the gym’s atmosphere. Preferences and saved workouts stay on this device; no account or backend is connected.</Text><PrimaryButton title="BACK TO THE APP" onPress={() => setAboutOpen(false)} style={{ marginTop: 25 }} /></View></View></Modal>
  </Screen>;
}
const styles = StyleSheet.create({
  focus: { padding: 17, borderRadius: 12, borderWidth: 1, borderColor: '#4C305F', backgroundColor: '#1C1225', flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 26 },
  focusIcon: { width: 35, alignItems: 'center' },
  focusTitle: { fontFamily: fonts.display, color: colors.text, fontSize: 27, marginTop: 3 },
  local: { fontFamily: fonts.semi, fontSize: 6, letterSpacing: 1, color: '#8F729E' },
  list: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, overflow: 'hidden' },
  row: { padding: 17, flexDirection: 'row', gap: 12, alignItems: 'center', borderBottomWidth: 1, borderColor: '#28212F', minHeight: 83 },
  rowIcon: { width: 30, alignItems: 'center' },
  rowTitle: { fontFamily: fonts.semi, fontSize: 12, color: colors.text },
  rowSubtitle: { fontFamily: fonts.body, fontSize: 10, color: '#96849F', marginTop: 6 },
  storageNote: { fontFamily: fonts.body, fontSize: 11, lineHeight: 19, color: '#D7B8E7', padding: 15, backgroundColor: '#2A1738', marginTop: 15, borderRadius: 9 },
  footer: { alignItems: 'center', paddingTop: 31 },
  rule: { height: 2, width: 25, backgroundColor: '#8D35E8', marginBottom: 17 },
  footerText: { fontFamily: fonts.body, fontSize: 10, lineHeight: 19, color: '#776480', textAlign: 'center', marginTop: 11 },
  modal: { flex: 1, backgroundColor: '#000000DD', padding: 24, alignItems: 'center', justifyContent: 'center' },
  dialog: { backgroundColor: '#18111F', width: '100%', maxWidth: 430, padding: 23, borderRadius: 18, borderWidth: 1, borderColor: '#58386E' },
  dialogHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dialogTitle: { fontFamily: fonts.heavy, color: colors.text, fontSize: 44, lineHeight: 44, marginTop: 23 },
  dialogBody: { fontFamily: fonts.body, color: '#B6A4C2', fontSize: 11, lineHeight: 20, marginTop: 17 },
});
