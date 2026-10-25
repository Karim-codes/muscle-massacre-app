import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { CapacityCard, DemoBadge } from '../../components/MemberWidgets';
import { BrandHeader, DemoNote, FadeIn, Icon, IconButton, Label, PrimaryButton, Screen, SectionTitle, Tap } from '../../components/ui';
import { WorkoutCard } from '../../components/WorkoutCard';
import { capacityPreview, getAttendancePreview, membershipPreview, profileInitials } from '../../data/membership';
import { workouts } from '../../data/training';
import { useAppState } from '../../state/AppState';
import { colors, fonts } from '../../theme';

export default function Home() {
  const { focus, profile } = useAppState();
  const [capacityOpen, setCapacityOpen] = useState(false);
  const { width } = useWindowDimensions();
  const workout = workouts.find((item) => item.focus === focus) ?? workouts[0];
  const attendance = getAttendancePreview();
  const member = profile.kind === 'member';
  const name = profile.firstName || 'Lifter';
  const headingSize = Math.min(48, (Math.min(width, 480) - 48) / 6.2);
  return <Screen><BrandHeader action={<Tap accessibilityLabel="Edit your demo profile" onPress={() => router.push({ pathname: '/onboarding', params: { step: 'identity' } })} style={styles.avatar}><Text style={styles.initials}>{profileInitials(profile)}</Text><View style={styles.avatarDot} /></Tap>} />
    <FadeIn><View style={styles.eyebrow}><View style={styles.littleLine} /><Label style={{ color: colors.bright, fontSize: 8 }}>YOUR TRAINING GROUND</Label></View>
      <Text accessibilityRole="header" accessibilityLabel={`Welcome${member ? ' back' : ''}, ${name}`} style={[styles.greeting, { fontSize: headingSize, lineHeight: headingSize + 1 }]}>WELCOME{member ? ' BACK' : ''},{`\n`}<Text style={{ color: colors.bright }}>{name.toUpperCase()}.</Text></Text>
      <Text style={styles.subheading}>A little focus. A lot of intent. Let’s get to work.</Text>
      <CapacityCard onPress={() => setCapacityOpen(true)} />
      <View style={styles.summaryRow}>
        <Tap accessibilityLabel={member ? 'View your demo membership' : 'Set up a member preview'} style={styles.summary} onPress={() => member ? router.navigate('/membership') : router.push({ pathname: '/onboarding', params: { step: 'identity' } })}>
          <View style={styles.summaryTop}><Icon name={member ? 'card-outline' : 'compass-outline'} color={colors.bright} size={20} /><Label style={styles.summaryDemo}>{member ? 'DEMO' : 'YOUR APP'}</Label></View><Label style={styles.summaryLabel}>{member ? 'MEMBERSHIP' : 'YOUR EXPERIENCE'}</Label><Text style={[styles.summaryValue, member && { color: '#C2EDA9' }]}>{member ? membershipPreview.status : 'Explorer'}</Text><View style={styles.summaryBottom}><Text style={styles.summaryCaption}>{member ? 'Example status' : 'Already a member?'}</Text><Icon name="arrow-forward" size={14} color="#A48BB4" /></View>
        </Tap>
        <Tap accessibilityLabel={member ? 'View your example visits this week' : 'Explore the exercise library'} style={styles.summary} onPress={() => member ? router.navigate({ pathname: '/membership', params: { view: 'visits' } }) : router.navigate({ pathname: '/train', params: { section: 'library' } })}>
          <View style={styles.summaryTop}><Icon name={member ? 'calendar-outline' : 'barbell-outline'} color={colors.bright} size={20} /><Label style={styles.summaryDemo}>{member ? 'DEMO' : 'CONCEPT'}</Label></View><Label style={styles.summaryLabel}>{member ? 'THIS WEEK' : 'MOVEMENT LIBRARY'}</Label><Text style={styles.summaryValue}>{member ? attendance.total : 18}<Text style={styles.summaryUnit}>{member ? ' visits' : ' exercises'}</Text></Text><View style={styles.summaryBottom}><Text style={styles.summaryCaption}>{member ? 'Past 7 days · example' : 'Find your next rep'}</Text><Icon name="arrow-forward" size={14} color="#A48BB4" /></View>
        </Tap>
      </View>
      <SectionTitle title="YOUR NEXT SESSION" aside={`${focus.toUpperCase()} FOCUS`} /><WorkoutCard workout={workout} />
      <Tap style={styles.library} onPress={() => router.navigate({ pathname: '/train', params: { section: 'library' } })} accessibilityLabel="Explore all movement guides"><View style={styles.libraryIcon}><Icon name="albums-outline" color={colors.bright} size={25} /></View><View style={{ flex: 1 }}><Text style={styles.libraryTitle}>KNOW YOUR NEXT REP.</Text><Text style={styles.libraryDescription}>18 movements. The details that matter.</Text></View><Icon name="arrow-forward" color={colors.bright} size={21} /></Tap>
      <View style={styles.homeFooter}><Icon name="location-outline" color="#9683A4" size={15} /><Text style={styles.addressText}>Muscle Massacre · Maidenhead</Text></View><DemoNote compact />
    </FadeIn>
    <Modal visible={capacityOpen} transparent animationType="fade" onRequestClose={() => setCapacityOpen(false)}><View style={styles.modal}><View style={styles.dialog}><View style={styles.dialogHeader}><DemoBadge /><IconButton name="close" label="Close capacity preview" onPress={() => setCapacityOpen(false)} /></View><Icon name="people-outline" color={colors.bright} size={39} /><Text style={styles.dialogTitle}>A FEEL FOR{`\n`}THE FLOOR.</Text><Text style={styles.dialogText}>{capacityPreview.percent}% is an illustrative occupancy example. It is not live, does not show the gym’s actual occupancy and does not define an official maximum capacity.</Text><Text style={styles.dialogText}>A connected gym system could supply a real capacity indicator in a future app.</Text><PrimaryButton title="BACK TO HOME" onPress={() => setCapacityOpen(false)} style={{ marginTop: 24 }} /></View></View></Modal>
  </Screen>;
}
const styles = StyleSheet.create({
  avatar: { height: 44, width: 44, borderRadius: 22, backgroundColor: '#2B183D', borderWidth: 1, borderColor: '#714197', alignItems: 'center', justifyContent: 'center' }, initials: { fontFamily: fonts.bold, fontSize: 12, color: '#D8B9F2' }, avatarDot: { position: 'absolute', bottom: 1, right: 1, width: 8, height: 8, borderRadius: 5, backgroundColor: '#A65BF0', borderWidth: 2, borderColor: colors.bg },
  eyebrow: { flexDirection: 'row', gap: 7, alignItems: 'center', marginTop: 13 }, littleLine: { height: 2, width: 18, backgroundColor: colors.purple }, greeting: { fontFamily: fonts.heavy, color: colors.text, letterSpacing: -0.5, marginTop: 11 }, subheading: { fontFamily: fonts.body, fontSize: 11, color: '#A398AD', lineHeight: 19, marginTop: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 }, summary: { width: '48.2%', borderRadius: 12, padding: 15, backgroundColor: '#17121D', borderWidth: 1, borderColor: '#3B2B46' }, summaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, summaryDemo: { fontSize: 6, color: '#A87EC3', letterSpacing: 1 }, summaryLabel: { fontSize: 7, letterSpacing: 1, color: '#AE97BE', marginTop: 18 }, summaryValue: { fontFamily: fonts.display, color: colors.text, fontSize: 33, lineHeight: 39, marginTop: 5 }, summaryUnit: { fontFamily: fonts.medium, fontSize: 11, color: '#C3AACF' }, summaryBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4, marginTop: 8 }, summaryCaption: { fontFamily: fonts.body, fontSize: 8, lineHeight: 14, color: '#9E88AD', flexShrink: 1 },
  library: { flexDirection: 'row', gap: 12, alignItems: 'center', padding: 17, borderRadius: 12, backgroundColor: '#1D1425', borderWidth: 1, borderColor: '#493055', marginTop: 20 }, libraryIcon: { width: 35, height: 45, alignItems: 'center', justifyContent: 'center' }, libraryTitle: { fontFamily: fonts.display, fontSize: 22, color: colors.text }, libraryDescription: { fontFamily: fonts.body, fontSize: 9, color: '#B69BC8', marginTop: 5, lineHeight: 16 },
  homeFooter: { flexDirection: 'row', gap: 8, marginTop: 26, alignItems: 'center' }, addressText: { fontFamily: fonts.body, fontSize: 10, lineHeight: 18, color: '#94839F' },
  modal: { flex: 1, backgroundColor: '#000000DD', alignItems: 'center', justifyContent: 'center', padding: 24 }, dialog: { backgroundColor: '#18111F', padding: 23, borderRadius: 18, borderWidth: 1, borderColor: '#58386E', width: '100%', maxWidth: 430 }, dialogHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 23 }, dialogTitle: { fontFamily: fonts.heavy, fontSize: 44, lineHeight: 44, color: colors.text, marginTop: 18 }, dialogText: { fontFamily: fonts.body, fontSize: 12, lineHeight: 21, color: '#BCA5CA', marginTop: 16 },
});
