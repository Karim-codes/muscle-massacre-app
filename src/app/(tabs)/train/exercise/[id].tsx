import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BackBar, DemoNote, EmptyState, FadeIn, Icon, IconButton, Label, PrimaryButton, Screen, SectionTitle, Tap } from '../../../../components/ui';
import { exercises, getExercise, getWorkout } from '../../../../data/training';
import { colors, fonts } from '../../../../theme';

export function generateStaticParams() {
  return exercises.map((exercise) => ({ id: exercise.id }));
}

export default function ExerciseDetail() {
  const { id, workout: workoutId } = useLocalSearchParams<{ id: string; workout?: string; from?: string }>();
  const exercise = getExercise(id);
  const workout = workoutId ? getWorkout(workoutId) : undefined;
  const [videoOpen, setVideoOpen] = useState(false);
  if (!exercise) return <Screen><BackBar title="TRAIN" /><EmptyState title="MOVEMENT NOT FOUND" description="Explore the library to find a movement." action="Open exercise library" onAction={() => router.replace({ pathname: '/train', params: { section: 'library' } })} /></Screen>;
  const position = workout?.exercises.indexOf(exercise.id) ?? -1;
  const nextExercise = workout && position >= 0 ? workout.exercises[position + 1] : undefined;
  const backToSession = () => {
    if (router.canGoBack()) router.back();
    else if (workout) router.replace({ pathname: '/train/workout/[id]', params: { id: workout.id } });
    else router.replace({ pathname: '/train', params: { section: 'library' } });
  };

  return <Screen scroll={false}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
    <View style={styles.hero}><Image source={exercise.image} style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]} resizeMode="cover" /><LinearGradient colors={['#09090C55', '#09090C00', '#09090CF5']} locations={[0, 0.4, 1]} style={StyleSheet.absoluteFill} />
      <View style={styles.heroNav}><View style={styles.backRow}><IconButton name="arrow-back" label={workout ? `Back to ${workout.title}` : 'Back to exercise library'} onPress={backToSession} /><Label style={styles.backTitle}>{workout ? workout.title.toUpperCase() : 'EXERCISE LIBRARY'}</Label>{workout && position >= 0 && <View style={styles.counter}><Label style={{ fontSize: 9, color: colors.bright }}>{String(position + 1).padStart(2, '0')} <Text style={{ color: '#8A7B96' }}>/ {String(workout.exercises.length).padStart(2, '0')}</Text></Label></View>}</View></View>
      <View style={styles.photoCaption}><Icon name="image-outline" color="#C2B2CF" size={12} /><Text style={styles.photoCaptionText}>{exercise.imageCaption}</Text></View>
    </View>
    <FadeIn style={styles.body}><View style={styles.group}><View style={styles.dot} /><Label style={{ color: colors.bright, fontSize: 9 }}>{exercise.group.toUpperCase()} / MOVEMENT GUIDE</Label></View>
      <Text accessibilityRole="header" style={styles.title}>{exercise.name.toUpperCase()}</Text><Text style={styles.targets}>{exercise.targets}</Text>
      <View style={styles.equipment}><View style={styles.equipmentIcon}><Icon name="barbell-outline" color={colors.bright} size={22} /></View><View style={{ flex: 1 }}><Label style={{ color: '#8D7D99', fontSize: 8 }}>EQUIPMENT IN THIS EXAMPLE</Label><Text style={styles.equipmentText}>{exercise.equipment}</Text></View></View>
      <View style={styles.prescriptionLabel}><Label style={{ fontSize: 8, color: colors.bright }}>ILLUSTRATIVE SETS & REPS</Label><Text style={styles.demoLabel}>DEMO CONTENT</Text></View>
      <View style={styles.stats}><View style={styles.stat}><Text style={styles.statValue}>{exercise.sets}</Text><Label style={styles.statLabel}>SETS</Label></View><View style={[styles.stat, styles.statBorder]}><Text style={styles.statValue}>{exercise.reps}</Text><Label style={styles.statLabel}>REPS</Label></View><View style={styles.stat}><Text style={styles.statValue}>{exercise.rest}<Text style={{ fontSize: 18 }}>s</Text></Text><Label style={styles.statLabel}>REST</Label></View></View>
      <Text style={styles.prescriptionNote}>Concept examples, not gym-approved training advice.</Text>
      <View style={styles.cue}><View style={styles.quoteMark}><Icon name="flash" color={colors.bright} size={17} /></View><Text style={styles.cueText}>{exercise.cue}</Text></View>
      <SectionTitle title="OWN THE MOVEMENT" aside="STEP BY STEP" />
      <View style={styles.steps}>{exercise.steps.map((instruction, index) => <View key={instruction} style={styles.step}><View style={styles.stepTrack}><View style={styles.stepNumber}><Text style={styles.stepNumberText}>{index + 1}</Text></View>{index < exercise.steps.length - 1 && <View style={styles.stepLine} />}</View><Text style={styles.instruction}>{instruction}</Text></View>)}</View>
      <View style={styles.safety}><View style={styles.safetyHeader}><Icon name="shield-checkmark-outline" color={colors.bright} size={20} /><Label style={{ color: '#D9B6F6', fontSize: 9 }}>TRAIN WITH CONTROL</Label></View>{exercise.safety.map((tip) => <View key={tip} style={styles.tip}><View style={styles.tipDot} /><Text style={styles.tipText}>{tip}</Text></View>)}</View>
      <Tap style={styles.video} onPress={() => setVideoOpen(true)} accessibilityLabel="View technique video placeholder"><View style={styles.play}><Icon name="play" size={19} color={colors.bright} /></View><View style={{ flex: 1 }}><Label style={{ fontSize: 10 }}>TECHNIQUE VIDEO</Label><Text style={styles.videoNote}>Concept placeholder · No video attached</Text></View><Icon name="chevron-forward" color={colors.muted} size={17} /></Tap>
      {nextExercise ? <PrimaryButton title="NEXT MOVEMENT" onPress={() => router.replace({ pathname: '/train/exercise/[id]', params: { id: nextExercise, workout: workout!.id } })} style={{ marginTop: 25 }} /> : <PrimaryButton title={workout ? 'BACK TO THE SESSION' : 'BACK TO THE LIBRARY'} icon="arrow-back" onPress={backToSession} style={{ marginTop: 25 }} />}
      <DemoNote />
    </FadeIn>
  </ScrollView>
  <Modal visible={videoOpen} transparent animationType="fade" onRequestClose={() => setVideoOpen(false)}><View style={styles.modal}><View style={styles.videoDialog}><View style={styles.dialogHeader}><Label style={{ color: colors.bright }}>VIDEO CONCEPT</Label><IconButton name="close" label="Close video placeholder" onPress={() => setVideoOpen(false)} /></View><View style={styles.dialogPlay}><Icon name="play-circle-outline" color={colors.bright} size={64} /></View><Text style={styles.dialogTitle}>THE SPACE FOR{`\n`}A BETTER REP.</Text><Text style={styles.dialogText}>A future technique video could live here. This prototype contains no playable video.</Text><PrimaryButton title="BACK TO THE MOVEMENT" onPress={() => setVideoOpen(false)} style={{ marginTop: 24 }} /></View></View></Modal>
  </Screen>;
}

const styles = StyleSheet.create({
  hero: { height: 300, backgroundColor: colors.surface },
  heroNav: { paddingHorizontal: 24, position: 'absolute', top: 0, left: 0, right: 0 },
  backRow: { height: 76, flexDirection: 'row', alignItems: 'center' },
  backTitle: { flex: 1, marginLeft: 13, fontSize: 9 },
  counter: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 5, backgroundColor: '#1C1125CC', borderWidth: 1, borderColor: '#604374' },
  photoCaption: { position: 'absolute', bottom: 17, left: 24, right: 24, flexDirection: 'row', alignItems: 'center', gap: 6 },
  photoCaptionText: { fontFamily: fonts.body, fontSize: 8, color: '#C2B2CF' },
  body: { paddingHorizontal: 24, paddingTop: 13 },
  group: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 12 },
  dot: { height: 5, width: 5, borderRadius: 3, backgroundColor: colors.purple },
  title: { fontFamily: fonts.heavy, fontSize: 46, lineHeight: 47, color: colors.text, letterSpacing: -0.3 },
  targets: { fontFamily: fonts.body, fontSize: 12, lineHeight: 20, color: '#B0A1BC', marginTop: 10 },
  equipment: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 20, borderBottomWidth: 1, borderColor: colors.border },
  equipmentIcon: { width: 42, height: 42, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.purpleTint, borderWidth: 1, borderColor: '#493154' },
  equipmentText: { fontFamily: fonts.medium, color: colors.text, fontSize: 12, marginTop: 6 },
  prescriptionLabel: { marginTop: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  demoLabel: { fontFamily: fonts.semi, fontSize: 7, letterSpacing: 1, color: '#83718F' },
  stats: { flexDirection: 'row', borderRadius: 12, borderWidth: 1, borderColor: '#43304F', backgroundColor: '#1A1322', paddingVertical: 17, marginTop: 12 },
  stat: { flex: 1, alignItems: 'center', gap: 7 },
  statBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#46314F' },
  statValue: { fontFamily: fonts.display, color: colors.text, fontSize: 32, lineHeight: 36 },
  statLabel: { color: '#B59BC6', fontSize: 8, letterSpacing: 1.6 },
  prescriptionNote: { fontFamily: fonts.body, fontSize: 9, lineHeight: 16, color: '#8F7E9B', marginTop: 9 },
  cue: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 26 },
  quoteMark: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center', borderRadius: 16, backgroundColor: colors.purpleTint },
  cueText: { flex: 1, fontFamily: fonts.medium, color: '#D7C1E7', fontSize: 12, lineHeight: 19 },
  steps: { paddingTop: 3 },
  step: { flexDirection: 'row', gap: 15 },
  stepTrack: { alignItems: 'center', width: 28 },
  stepNumber: { width: 27, height: 27, borderRadius: 14, borderWidth: 1, borderColor: '#6C3D8B', backgroundColor: '#261533', alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { fontFamily: fonts.semi, fontSize: 10, color: colors.bright },
  stepLine: { width: 1, flex: 1, backgroundColor: '#3D294A', marginVertical: 5 },
  instruction: { flex: 1, fontFamily: fonts.body, fontSize: 12, lineHeight: 21, color: '#BAB0C2', paddingBottom: 24, paddingTop: 2 },
  safety: { backgroundColor: '#19131F', borderWidth: 1, borderColor: '#44314E', borderRadius: 12, padding: 17, marginTop: 2 },
  safetyHeader: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 14 },
  tip: { flexDirection: 'row', gap: 9, marginBottom: 9 },
  tipDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#A777C6', marginTop: 7 },
  tipText: { flex: 1, fontFamily: fonts.body, fontSize: 11, lineHeight: 19, color: '#B3A4BE' },
  video: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 15, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: '#4C3B59', marginTop: 23, backgroundColor: '#131017' },
  play: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2B1939' },
  videoNote: { fontFamily: fonts.body, fontSize: 9, lineHeight: 16, color: '#9D8BA9', marginTop: 5 },
  modal: { flex: 1, backgroundColor: '#000000DD', alignItems: 'center', justifyContent: 'center', padding: 24 },
  videoDialog: { width: '100%', maxWidth: 430, backgroundColor: '#18111E', padding: 23, borderWidth: 1, borderColor: '#58386E', borderRadius: 18 },
  dialogHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dialogPlay: { alignItems: 'center', paddingVertical: 28 },
  dialogTitle: { fontFamily: fonts.heavy, fontSize: 41, lineHeight: 41, color: colors.text },
  dialogText: { fontFamily: fonts.body, fontSize: 12, lineHeight: 21, color: colors.muted, marginTop: 15 },
});
