import { useLocalSearchParams, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandHeader, DemoNote, EmptyState, FadeIn, Icon, IconButton, Label, Screen, SectionTitle, Tap, typeStyles } from '../../../components/ui';
import { WorkoutCard } from '../../../components/WorkoutCard';
import { muscleGroups, searchExercises, workouts, type MuscleGroup } from '../../../data/training';
import { useAppState } from '../../../state/AppState';
import { colors, fonts } from '../../../theme';

export default function TrainScreen() {
  const params = useLocalSearchParams<{ section?: string }>();
  const [beforeSaved, setBeforeSaved] = useState<'workouts' | 'library'>('workouts');
  const section = params.section === 'library' || (params.section === 'saved' && beforeSaved === 'library') ? 'library' : 'workouts';
  const setSection = (value: 'workouts' | 'library') => router.setParams({ section: value });
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<MuscleGroup>('All');
  const savedOpen = params.section === 'saved';
  const setSavedOpen = (value: boolean) => { if (value) setBeforeSaved(section); router.setParams({ section: value ? 'saved' : beforeSaved }); };
  const { focus, saved } = useAppState();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const headingSize = Math.min(53, (Math.min(width, 480) - 48) / 6.2);
  const filtered = useMemo(() => searchExercises(query, group), [query, group]);
  const featured = workouts.find((workout) => workout.focus === focus) ?? workouts[0];
  const otherWorkouts = workouts.filter((workout) => workout.id !== featured.id);
  const savedWorkouts = workouts.filter((workout) => saved.includes(workout.id));

  return <Screen>
    <BrandHeader action={<IconButton name="bookmark-outline" label="View saved workouts" active={saved.length > 0} onPress={() => setSavedOpen(true)} />} />
    <FadeIn><View style={styles.eyebrow}><View style={styles.line} /><Label style={{ color: colors.bright, fontSize: 9 }}>BUILT BY LIFTERS. FOR LIFTERS.</Label></View>
      <Text accessibilityRole="header" style={[typeStyles.title, styles.title, { fontSize: headingSize, lineHeight: headingSize + 7 }]}>TRAIN <Text style={{ color: colors.bright }}>HARDER</Text></Text>
      <Text style={styles.subtitle}>Find your next workout.</Text>
    </FadeIn>
    <View style={styles.segment} accessibilityRole="tablist">
      {(['workouts', 'library'] as const).map((tab) => <Tap key={tab} accessibilityRole="tab" accessibilityState={{ selected: section === tab }} onPress={() => setSection(tab)} style={[styles.segmentItem, section === tab && styles.segmentSelected]}><Icon name={tab === 'workouts' ? 'barbell-outline' : 'albums-outline'} size={16} color={section === tab ? colors.text : colors.muted} /><Text style={[styles.segmentText, section === tab && { color: colors.text }]}>{tab === 'workouts' ? 'WORKOUTS' : 'EXERCISE LIBRARY'}</Text></Tap>)}
    </View>
    {section === 'workouts' ? <FadeIn key="workouts"><SectionTitle title="YOUR NEXT SESSION" aside="05 CONCEPT WORKOUTS" />
      <WorkoutCard workout={featured} />
      <View style={styles.grid}>{otherWorkouts.map((workout) => <WorkoutCard key={workout.id} workout={workout} compact />)}</View>
      <View style={styles.bottomMessage}><Icon name="flash-outline" size={16} color={colors.bright} /><Text style={styles.bottomMessageText}>Show up. Put the work in. Repeat.</Text></View>
      <DemoNote compact />
    </FadeIn> : <FadeIn key="library">
      <View style={styles.search}><Icon name="search-outline" size={19} color={colors.muted} /><TextInput style={styles.input} value={query} onChangeText={setQuery} placeholder="Find an exercise or equipment" placeholderTextColor="#807A89" accessibilityLabel="Search exercises" autoCorrect={false} autoCapitalize="none" returnKeyType="search" />{query.length > 0 && <Tap style={styles.clearSearch} onPress={() => setQuery('')} accessibilityLabel="Clear search"><Icon name="close-circle" color={colors.muted} size={19} /></Tap>}</View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>{muscleGroups.map((muscle) => <Tap key={muscle} onPress={() => setGroup(muscle)} accessibilityLabel={`Filter ${muscle}`} accessibilityState={{ selected: group === muscle }} style={[styles.filter, group === muscle && styles.filterSelected]}><Text style={[styles.filterText, group === muscle && { color: colors.text }]}>{muscle}</Text></Tap>)}</ScrollView>
      <SectionTitle title={group === 'All' ? 'THE MOVEMENT LIBRARY' : `${group.toUpperCase()} EXERCISES`} aside={`${String(filtered.length).padStart(2, '0')} EXERCISES`} />
      {filtered.length ? <View style={styles.exerciseList}>{filtered.map((exercise) => <Tap key={exercise.id} accessibilityLabel={`Open ${exercise.name}`} onPress={() => router.push({ pathname: '/train/exercise/[id]', params: { id: exercise.id, from: 'library' } })} style={styles.exerciseCard}>
        <Image source={exercise.image} style={styles.exerciseImage} resizeMode="cover" /><View style={styles.exerciseBody}><Label style={styles.exerciseGroup}>{exercise.group}</Label><Text style={styles.exerciseName}>{exercise.name}</Text><Text style={styles.equipment}>{exercise.equipment}</Text></View><Icon name="chevron-forward" size={17} color="#8E849A" />
      </Tap>)}</View> : <EmptyState title="NO MATCHES. KEEP LOOKING." description="Try another exercise, muscle or piece of equipment." action="Reset search & filters" onAction={() => { setQuery(''); setGroup('All'); }} />}
      <DemoNote />
    </FadeIn>}
    <Modal visible={savedOpen} transparent animationType="slide" onRequestClose={() => setSavedOpen(false)}>
      <View style={styles.modalBackdrop}><Tap style={styles.dismissArea} onPress={() => setSavedOpen(false)} accessibilityLabel="Close saved workouts" /><View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <View style={styles.handle} /><View style={styles.sheetHeader}><View><Label style={{ color: colors.bright }}>READY WHEN YOU ARE</Label><Text style={styles.sheetTitle}>SAVED WORKOUTS</Text></View><IconButton name="close" label="Close saved workouts" onPress={() => setSavedOpen(false)} /></View>
        <ScrollView showsVerticalScrollIndicator={false}>{savedWorkouts.length ? savedWorkouts.map((workout) => <Tap key={workout.id} style={styles.savedRow} onPress={() => { setSavedOpen(false); router.push({ pathname: '/train/workout/[id]', params: { id: workout.id } }); }}><Image source={workout.image} style={styles.savedImage} /><View style={{ flex: 1 }}><Text style={styles.savedTitle}>{workout.title}</Text><Text style={styles.equipment}>{workout.duration} min · {workout.exercises.length} exercises</Text></View><Icon name="arrow-forward" size={20} color={colors.bright} /></Tap>) : <EmptyState icon="bookmark-outline" title="YOUR NEXT SESSION, SAVED." description="Tap the bookmark on any workout to keep it here for later." action="Explore workouts" onAction={() => { setSavedOpen(false); setSection('workouts'); }} />}</ScrollView>
      </View></View>
    </Modal>
  </Screen>;
}

const styles = StyleSheet.create({
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 13 },
  line: { width: 17, height: 2, backgroundColor: colors.purple },
  title: { fontSize: 53, lineHeight: 60, marginTop: 5, letterSpacing: -0.6 },
  subtitle: { fontFamily: fonts.body, color: colors.muted, fontSize: 13, marginTop: 4 },
  segment: { marginTop: 27, padding: 4, backgroundColor: '#16141B', borderWidth: 1, borderColor: colors.border, borderRadius: 10, flexDirection: 'row' },
  segmentItem: { flex: 1, minHeight: 43, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, borderRadius: 7 },
  segmentSelected: { backgroundColor: '#382149', borderWidth: 1, borderColor: '#674083' },
  segmentText: { fontFamily: fonts.bold, color: colors.muted, fontSize: 9, letterSpacing: 0.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14, marginTop: 14 },
  bottomMessage: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', marginTop: 28, paddingTop: 8 },
  bottomMessageText: { fontFamily: fonts.medium, color: '#CBC2D1', fontSize: 11 },
  search: { marginTop: 22, paddingLeft: 14, paddingRight: 8, minHeight: 50, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 9 },
  input: { flex: 1, color: colors.text, fontFamily: fonts.body, fontSize: 11, height: 50, paddingVertical: 10, outlineWidth: 0 },
  clearSearch: { width: 36, height: 42, justifyContent: 'center', alignItems: 'center' },
  filters: { flexDirection: 'row', gap: 8, paddingTop: 14, paddingBottom: 2 },
  filter: { paddingHorizontal: 16, minHeight: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 7, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  filterSelected: { backgroundColor: '#6F2AA7', borderColor: '#A855F7' },
  filterText: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
  exerciseList: { gap: 10 },
  exerciseCard: { flexDirection: 'row', padding: 9, paddingRight: 14, gap: 13, alignItems: 'center', borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: '#28242D' },
  exerciseImage: { width: 76, height: 80, borderRadius: 7, backgroundColor: colors.raised },
  exerciseBody: { flex: 1, gap: 5 },
  exerciseGroup: { color: colors.bright, fontSize: 8, letterSpacing: 1.2, textTransform: 'uppercase' },
  exerciseName: { fontFamily: fonts.semi, fontSize: 12, color: colors.text, lineHeight: 18 },
  equipment: { fontFamily: fonts.body, fontSize: 10, color: colors.muted, lineHeight: 16 },
  modalBackdrop: { flex: 1, backgroundColor: '#000000BB', justifyContent: 'flex-end', alignItems: 'center' },
  dismissArea: { flex: 1, width: '100%' },
  sheet: { backgroundColor: '#111014', width: '100%', maxWidth: 480, maxHeight: '78%', paddingHorizontal: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderColor: '#403249' },
  handle: { width: 35, height: 4, borderRadius: 4, backgroundColor: '#514759', alignSelf: 'center', marginTop: 10, marginBottom: 25 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  sheetTitle: { fontFamily: fonts.heavy, color: colors.text, fontSize: 32, marginTop: 6 },
  savedRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13, borderTopWidth: 1, borderColor: colors.border },
  savedImage: { width: 62, height: 66, borderRadius: 8 },
  savedTitle: { color: colors.text, fontFamily: fonts.display, fontSize: 26, marginBottom: 5 },
});
