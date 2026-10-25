import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { type Workout } from '../data/training';
import { useAppState } from '../state/AppState';
import { colors, fonts } from '../theme';
import { Icon, Label, Tap } from './ui';

export function WorkoutCard({ workout, compact = false }: { workout: Workout; compact?: boolean }) {
  const { saved, toggleSaved } = useAppState();
  const { width } = useWindowDimensions();
  const isSaved = saved.includes(workout.id);
  return <View style={[styles.card, compact && styles.compact, compact && width < 360 && { width: '100%' }]}>
    <Tap accessibilityLabel={`Open ${workout.title}, ${workout.duration} minutes, ${workout.exercises.length} exercises, ${workout.difficulty}`} onPress={() => router.push({ pathname: '/train/workout/[id]', params: { id: workout.id } })} style={{ flex: 1 }}>
    <Image source={workout.image} style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]} resizeMode="cover" />
    <LinearGradient colors={['#09090C14', '#09090C30', '#09090CEE', '#09090C']} locations={[0, 0.25, 0.78, 1]} style={StyleSheet.absoluteFill} />
    <View style={styles.top}><View style={styles.badge}><Icon name={compact ? 'cellular-outline' : 'flash'} size={10} color={colors.bright} /><Label style={styles.badgeText}>{compact ? workout.difficulty.toUpperCase() : 'IN FOCUS'}</Label></View></View>
    <View style={styles.bottom}>{!compact && <Label style={styles.kicker}>{workout.subtitle}</Label>}<Text style={[styles.title, compact && styles.compactTitle]}>{workout.title.toUpperCase()}</Text>
      <Text style={[styles.muscles, compact && styles.compactMuscles]}>{workout.muscles}</Text>
      <View style={[styles.meta, compact && styles.compactMeta]}><View style={styles.metaItem}><Icon name="time-outline" size={13} color={colors.muted} /><Text style={styles.metaText}>{workout.duration} min</Text></View>
        <View style={styles.metaItem}><Icon name="barbell-outline" size={14} color={colors.muted} /><Text style={styles.metaText}>{workout.exercises.length} exercises</Text></View>
        {!compact && <View style={styles.arrow}><Icon name="arrow-forward" size={22} /></View>}
      </View>
      {!compact && <Text style={styles.difficulty}>{workout.difficulty} <Text style={{ color: '#62596B' }}> / </Text> Demo workout</Text>}
    </View>
    <View style={styles.purpleEdge} />
    </Tap>
    <Tap style={styles.save} accessibilityLabel={`${isSaved ? 'Unsave' : 'Save'} ${workout.title}`} accessibilityState={{ selected: isSaved }} onPress={() => toggleSaved(workout.id)}><Icon name={isSaved ? 'bookmark' : 'bookmark-outline'} size={18} color={isSaved ? colors.bright : colors.text} /></Tap>
  </View>;
}
const styles = StyleSheet.create({
  card: { height: 290, borderRadius: 15, overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 1, borderColor: '#49335A' },
  compact: { height: 242, width: '48.3%', borderColor: colors.border },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, gap: 2 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#190F23D9', paddingHorizontal: 7, paddingVertical: 6, borderRadius: 4, borderWidth: 1, borderColor: '#673A8C55' },
  badgeText: { fontSize: 7, letterSpacing: 0.8, color: '#D0B0ED' },
  save: { position: 'absolute', top: 10, right: 10, width: 36, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: '#11101488', borderRadius: 20 },
  bottom: { position: 'absolute', bottom: 17, left: 18, right: 18 },
  kicker: { fontSize: 8, color: '#D6C1E6', letterSpacing: 1.7, marginBottom: 5 },
  title: { fontFamily: fonts.italic, color: colors.text, fontSize: 53, lineHeight: 56, letterSpacing: -0.5 },
  compactTitle: { fontSize: 32, lineHeight: 35, letterSpacing: -0.2 },
  muscles: { color: '#D0C9D6', fontFamily: fonts.body, fontSize: 11, lineHeight: 17, marginTop: 1 },
  compactMuscles: { fontSize: 9, lineHeight: 14, minHeight: 28 },
  meta: { flexDirection: 'row', gap: 17, alignItems: 'center', marginTop: 15, borderTopWidth: 1, borderColor: '#FFFFFF24', paddingTop: 11, paddingRight: 36 },
  compactMeta: { gap: 8, paddingRight: 0, marginTop: 8, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: '#D4CDD9', fontFamily: fonts.medium, fontSize: 9 },
  arrow: { position: 'absolute', right: 0, top: 7, width: 36, height: 36, borderRadius: 18, backgroundColor: colors.deep, justifyContent: 'center', alignItems: 'center', transform: [{ rotate: '-45deg' }] },
  difficulty: { fontFamily: fonts.body, color: colors.muted, fontSize: 9, marginTop: 8 },
  purpleEdge: { height: 2, width: 36, backgroundColor: colors.purple, position: 'absolute', left: 18, bottom: 0 },
});
