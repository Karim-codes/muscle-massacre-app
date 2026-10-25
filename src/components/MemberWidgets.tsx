import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View } from 'react-native';
import { capacityPreview, type AttendanceDay } from '../data/membership';
import { photos } from '../data/training';
import { colors, fonts } from '../theme';
import { Icon, Label, Tap } from './ui';

export function CapacityCard({ onPress }: { onPress: () => void }) {
  return <Tap style={styles.capacity} onPress={onPress} accessibilityLabel="View gym capacity demo information">
    <Image source={photos.atmosphere} style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]} resizeMode="cover" />
    <LinearGradient colors={['#0D08134D', '#0E0B12CC', '#0E0A15FA']} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
    <View style={styles.capacityTop}><View style={styles.capacityHeading}><Icon name="people-outline" size={16} /><Label style={{ fontSize: 9 }}>ON THE GYM FLOOR</Label></View><DemoBadge /></View>
    <View style={styles.capacityValue}><View style={{ flex: 1 }}><Text style={styles.capacityTitle}>{capacityPreview.label.toUpperCase()}</Text><Text style={styles.caption}>{capacityPreview.source}</Text></View><Text style={styles.percent}>{capacityPreview.percent}<Text style={{ fontSize: 22, color: '#CFACEE' }}>%</Text></Text></View>
    <View style={styles.gauge} accessibilityLabel={`Demo occupancy ${capacityPreview.percent} percent`}>{Array.from({ length: 14 }, (_, index) => <View key={index} style={[styles.gaugeSegment, index / 14 < capacityPreview.percent / 100 && styles.gaugeFilled]} />)}</View>
    <View style={styles.gaugeLabels}><Label style={styles.gaugeLabel}>QUIET</Label><View style={styles.capacityLink}><Label style={styles.gaugeLabel}>CAPACITY PREVIEW</Label><Icon name="information-circle-outline" size={12} color="#BAA5CA" /></View><Label style={styles.gaugeLabel}>BUSY</Label></View>
  </Tap>;
}

export function DemoBadge() {
  return <View style={styles.demoBadge}><View style={styles.demoDot} /><Label style={{ color: '#D9B8F3', fontSize: 7, letterSpacing: 1 }}>DEMO DATA</Label></View>;
}

export function AttendanceWeek({ days }: { days: AttendanceDay[] }) {
  return <View style={styles.week}>{days.map((day) => <View key={day.date} style={styles.day} accessibilityLabel={`${day.fullLabel}, ${day.visited ? 'example visit' : 'no example visit'}`}><Text style={styles.dayLabel}>{day.label.slice(0, 1)}</Text><View style={[styles.dayCircle, day.visited && styles.dayVisited]}>{day.visited ? <Icon name="checkmark" size={17} color="#E9D6FC" /> : <Text style={styles.dayNumber}>{day.number}</Text>}</View><View style={[styles.visitDot, day.visited && { backgroundColor: colors.purple }]} /></View>)}</View>;
}

export const memberStyles = StyleSheet.create({
  note: { flexDirection: 'row', gap: 8, marginTop: 18, alignItems: 'flex-start' },
  noteText: { flex: 1, fontFamily: fonts.body, fontSize: 10, lineHeight: 17, color: '#9E8AAB' },
  panel: { backgroundColor: colors.surface, borderWidth: 1, borderColor: '#3B2A45', borderRadius: 13, padding: 18 },
});

const styles = StyleSheet.create({
  capacity: { marginTop: 25, borderRadius: 14, borderWidth: 1, borderColor: '#614076', overflow: 'hidden', padding: 18, minHeight: 217, backgroundColor: '#160F20' },
  capacityTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  capacityHeading: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  demoBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#2A173ACF', paddingHorizontal: 7, paddingVertical: 6, borderWidth: 1, borderColor: '#734695', borderRadius: 4 },
  demoDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.bright },
  capacityValue: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 24 },
  capacityTitle: { fontFamily: fonts.display, fontSize: 27, lineHeight: 31, color: colors.text },
  caption: { fontFamily: fonts.body, color: '#B09CBE', fontSize: 9, lineHeight: 16, marginTop: 5 },
  percent: { fontFamily: fonts.heavy, fontSize: 61, lineHeight: 63, color: colors.text },
  gauge: { flexDirection: 'row', gap: 4, marginTop: 19 },
  gaugeSegment: { flex: 1, height: 8, borderRadius: 2, backgroundColor: '#FFFFFF22' },
  gaugeFilled: { backgroundColor: '#AD62F5' },
  gaugeLabels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 9 },
  gaugeLabel: { color: '#AE94BF', fontSize: 6, letterSpacing: 1 },
  capacityLink: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  week: { flexDirection: 'row', justifyContent: 'space-between', gap: 4, marginTop: 22 },
  day: { flex: 1, alignItems: 'center', gap: 9 },
  dayLabel: { fontFamily: fonts.medium, color: '#AB9AB5', fontSize: 10 },
  dayCircle: { width: '100%', maxWidth: 32, height: 36, borderRadius: 10, borderWidth: 1, borderColor: '#3A3042', alignItems: 'center', justifyContent: 'center', backgroundColor: '#19141E' },
  dayVisited: { borderColor: '#9153BD', backgroundColor: '#4E236C' },
  dayNumber: { fontFamily: fonts.medium, color: '#7F6F89', fontSize: 10 },
  visitDot: { height: 3, width: 3, borderRadius: 2, backgroundColor: 'transparent' },
});
