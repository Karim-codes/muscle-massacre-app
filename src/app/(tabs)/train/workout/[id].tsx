import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BackBar, DemoNote, EmptyState, FadeIn, Icon, IconButton, Label, PrimaryButton, Screen, SectionTitle, Tap } from '../../../../components/ui';
import { getExercise, getWorkout, workouts } from '../../../../data/training';
import { useAppState } from '../../../../state/AppState';
import { colors, fonts } from '../../../../theme';

export function generateStaticParams() {
  return workouts.map((workout) => ({ id: workout.id }));
}

export default function WorkoutDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const workout = getWorkout(id);
  const { saved, toggleSaved } = useAppState();
  if (!workout) return <Screen><BackBar title="TRAIN" /><EmptyState title="WORKOUT NOT FOUND" description="Return to the training floor to find your next session." action="Explore workouts" onAction={() => router.replace('/train')} /></Screen>;
  const isSaved = saved.includes(workout.id);
  const openExercise = (exerciseId: string) => router.push({ pathname: '/train/exercise/[id]', params: { id: exerciseId, workout: workout.id } });

  return <Screen scroll={false}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
    <View style={styles.hero}><Image source={workout.image} style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]} resizeMode="cover" /><LinearGradient colors={['#09090C50', '#09090C05', '#09090CF5', colors.bg]} locations={[0, 0.3, 0.88, 1]} style={StyleSheet.absoluteFill} />
      <View style={styles.heroNav}><BackBar title="TRAINING" right={<IconButton name={isSaved ? 'bookmark' : 'bookmark-outline'} active={isSaved} label={`${isSaved ? 'Unsave' : 'Save'} ${workout.title}`} onPress={() => toggleSaved(workout.id)} />} /></View>
      <FadeIn style={styles.heroText}><View style={styles.badge}><Icon name="flash" size={11} color={colors.bright} /><Label style={{ color: '#DAC0EF', fontSize: 8 }}>CONCEPT WORKOUT</Label></View><Label style={styles.kicker}>{workout.subtitle}</Label><Text accessibilityRole="header" style={styles.title}>{workout.title.toUpperCase()}</Text><Text style={styles.muscles}>{workout.muscles}</Text></FadeIn>
    </View>
    <View style={styles.body}>
      <View style={styles.stats}><View style={styles.stat}><Icon name="time-outline" color={colors.bright} size={18} /><Text style={styles.statValue}>{workout.duration} <Text style={styles.statUnit}>MIN</Text></Text><Label style={styles.statLabel}>EST. DURATION</Label></View><View style={[styles.stat, styles.statBorder]}><Icon name="barbell-outline" color={colors.bright} size={19} /><Text style={styles.statValue}>{workout.exercises.length}</Text><Label style={styles.statLabel}>EXERCISES</Label></View><View style={styles.stat}><Icon name="cellular-outline" color={colors.bright} size={18} /><Text style={styles.difficulty}>{workout.difficulty}</Text><Label style={styles.statLabel}>DIFFICULTY</Label></View></View>
      <View style={styles.demoStrip}><View style={styles.demoPill}><Label style={{ fontSize: 7, color: colors.bright }}>DEMO</Label></View><Text style={styles.demoText}>Illustrative session, sets & reps.{`\n`}Not gym-approved training advice.</Text></View>
      <SectionTitle title="THE SESSION" aside={`${String(workout.exercises.length).padStart(2, '0')} MOVEMENTS`} />
      <Text style={styles.listDescription}>Tap a movement. Know your next rep.</Text>
      <View style={styles.exerciseList}>{workout.exercises.map((exerciseId, index) => {
        const exercise = getExercise(exerciseId);
        if (!exercise) return null;
        return <Tap key={exercise.id} style={styles.exerciseRow} onPress={() => openExercise(exercise.id)} accessibilityLabel={`${index + 1}. ${exercise.name}, illustrative ${exercise.sets} sets, ${exercise.reps} reps`}>
          <Text style={styles.number}>{String(index + 1).padStart(2, '0')}</Text><Image source={exercise.image} style={styles.thumb} /><View style={styles.exerciseInfo}><Text style={styles.exerciseTitle}>{exercise.name}</Text><Text style={styles.exercisePrescription}><Text style={{ color: colors.bright }}>{exercise.sets} sets</Text><Text style={{ color: '#61556B' }}>  /  </Text>{exercise.reps} reps</Text></View><Icon name="chevron-forward" color="#8C7D96" size={18} />
        </Tap>;
      })}</View>
      <View style={styles.intention}><Icon name="flash-outline" size={20} color={colors.bright} /><View style={{ flex: 1 }}><Text style={styles.intentionTitle}>INTENT OVER EGO.</Text><Text style={styles.intentionText}>Take time to warm up. Choose a load you can control and a range that feels right.</Text></View></View>
      <PrimaryButton title="EXPLORE FIRST EXERCISE" onPress={() => openExercise(workout.exercises[0])} style={{ marginTop: 24 }} />
      <DemoNote />
    </View>
  </ScrollView></Screen>;
}

const styles = StyleSheet.create({
  hero: { height: 365, position: 'relative', backgroundColor: colors.surface },
  heroNav: { paddingHorizontal: 24, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 },
  heroText: { position: 'absolute', left: 24, right: 24, bottom: 15 },
  badge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 4, backgroundColor: '#20102FD9', borderWidth: 1, borderColor: '#754B9255', marginBottom: 27 },
  kicker: { fontSize: 8, color: '#D2B9E3', letterSpacing: 1.7, marginBottom: 7 },
  title: { fontFamily: fonts.italic, fontSize: 67, lineHeight: 71, color: colors.text, letterSpacing: -0.5 },
  muscles: { fontFamily: fonts.body, fontSize: 12, color: '#B6AABF', marginTop: 3 },
  body: { paddingHorizontal: 24 },
  stats: { flexDirection: 'row', backgroundColor: '#17131D', borderWidth: 1, borderColor: '#3C2D47', borderRadius: 12, marginTop: 12, paddingVertical: 17 },
  stat: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 7 },
  statBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#39303F' },
  statValue: { fontFamily: fonts.display, fontSize: 29, lineHeight: 31, color: colors.text },
  statUnit: { fontFamily: fonts.semi, fontSize: 9, color: '#C6B3D2' },
  statLabel: { fontSize: 7, color: '#9C8AA8', letterSpacing: 1 },
  difficulty: { fontFamily: fonts.semi, color: colors.text, fontSize: 11, lineHeight: 31 },
  demoStrip: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 19 },
  demoPill: { borderWidth: 1, borderColor: '#6E418C', backgroundColor: colors.purpleTint, borderRadius: 4, padding: 5 },
  demoText: { fontFamily: fonts.body, fontSize: 10, lineHeight: 17, color: '#A292AD', flex: 1 },
  listDescription: { fontFamily: fonts.body, fontSize: 11, color: colors.muted, marginTop: -7, marginBottom: 17 },
  exerciseList: { gap: 9 },
  exerciseRow: { minHeight: 91, padding: 11, paddingLeft: 10, borderRadius: 11, borderWidth: 1, borderColor: '#2A2530', backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: 10 },
  number: { fontFamily: fonts.display, fontSize: 20, color: '#8A729A', width: 18 },
  thumb: { width: 52, height: 61, borderRadius: 6 },
  exerciseInfo: { flex: 1, gap: 8 },
  exerciseTitle: { fontFamily: fonts.semi, fontSize: 12, lineHeight: 17, color: colors.text },
  exercisePrescription: { fontFamily: fonts.medium, fontSize: 10, color: '#B4A5BF' },
  intention: { marginTop: 25, flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 13, borderLeftWidth: 2, borderColor: colors.purple },
  intentionTitle: { fontFamily: fonts.display, fontSize: 20, color: '#DCC5ED', letterSpacing: 0.7 },
  intentionText: { fontFamily: fonts.body, fontSize: 10, lineHeight: 17, color: colors.muted, marginTop: 4 },
});
