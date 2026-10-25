import type { ImageSourcePropType } from 'react-native';

export const photos = {
  floor: require('../../assets/photos/floor.jpg'),
  atmosphere: require('../../assets/photos/atmosphere.jpg'),
  gym: require('../../assets/photos/gym.webp'),
  iron: require('../../assets/photos/iron.webp'),
  athlete: require('../../assets/photos/athlete.jpg'),
  press: require('../../assets/photos/press.jpg'),
  squat: require('../../assets/photos/squat.jpg'),
} satisfies Record<string, ImageSourcePropType>;

export const muscleGroups = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs'] as const;
export type MuscleGroup = (typeof muscleGroups)[number];
export type Focus = 'Push' | 'Pull' | 'Legs';

export interface Exercise {
  id: string;
  name: string;
  group: Exclude<MuscleGroup, 'All'>;
  targets: string;
  equipment: string;
  sets: number;
  reps: string;
  rest: number;
  image: ImageSourcePropType;
  imageCaption: string;
  cue: string;
  steps: string[];
  safety: string[];
}

const gymCaption = 'Muscle Massacre atmosphere photography';
const stockCaption = 'Illustrative training photography';

export const exercises: Exercise[] = [
  {
    id: 'incline-chest-press', name: 'Incline Chest Press', group: 'Chest',
    targets: 'Upper chest · Front delts · Triceps', equipment: 'Dumbbells + incline bench',
    sets: 3, reps: '8–12', rest: 90, image: photos.press, imageCaption: stockCaption,
    cue: 'Control the lowering. Own the press.',
    steps: ['Set a bench to a low incline. Sit with the dumbbells supported on your thighs.', 'Lie back with feet planted. Bring the dumbbells beside your upper chest, wrists over elbows.', 'Press upwards smoothly without snapping your elbows straight. Keep your shoulders against the bench.', 'Lower with control to a comfortable depth, keeping your forearms close to vertical.'],
    safety: ['Start with a manageable load and warm-up sets.', 'Use a spotter when needed. Stop if you feel sharp pain.'],
  },
  {
    id: 'machine-chest-press', name: 'Machine Chest Press', group: 'Chest',
    targets: 'Chest · Front delts · Triceps', equipment: 'Chest press machine',
    sets: 3, reps: '10–12', rest: 90, image: photos.gym, imageCaption: gymCaption,
    cue: 'A steady press. A controlled return.',
    steps: ['Adjust the seat so the handles sit around mid-chest height. Select a light starting load.', 'Sit with your back supported and feet flat. Grip the handles with wrists straight.', 'Press the handles forwards smoothly, keeping your shoulders down and back.', 'Return slowly through a comfortable range without letting the weight stack slam.'],
    safety: ['Read the machine instructions before use.', 'Adjust the range and load to your comfort; avoid forcing your shoulders back.'],
  },
  {
    id: 'seated-shoulder-press', name: 'Seated Shoulder Press', group: 'Shoulders',
    targets: 'Front delts · Side delts · Triceps', equipment: 'Dumbbells + supported bench',
    sets: 3, reps: '8–12', rest: 90, image: photos.iron, imageCaption: gymCaption,
    cue: 'Brace first. Press with control.',
    steps: ['Sit on a bench with back support and plant both feet on the floor.', 'Bring the dumbbells to shoulder height with wrists stacked over your elbows.', 'Brace your trunk and press upwards through a comfortable range without arching your lower back.', 'Lower slowly to shoulder height, keeping your elbows slightly in front of your body.'],
    safety: ['Choose a load you can lift without leaning or straining.', 'Avoid any overhead range that causes shoulder pain.'],
  },
  {
    id: 'lateral-raises', name: 'Lateral Raises', group: 'Shoulders',
    targets: 'Side delts', equipment: 'Dumbbells',
    sets: 3, reps: '12–15', rest: 60, image: photos.iron, imageCaption: gymCaption,
    cue: 'Light weights. Deliberate movement.',
    steps: ['Stand tall with light dumbbells at your sides and a slight bend in your elbows.', 'Brace your trunk and raise your arms outwards, slightly in front of your torso.', 'Stop around shoulder height, or earlier if that is your comfortable range.', 'Lower slowly without swinging your torso or shrugging your shoulders.'],
    safety: ['Keep the load light enough to avoid swinging.', 'Keep wrists neutral and stop if you feel pinching in your shoulders.'],
  },
  {
    id: 'pec-deck-fly', name: 'Pec Deck Fly', group: 'Chest',
    targets: 'Chest', equipment: 'Pec deck machine',
    sets: 3, reps: '12–15', rest: 60, image: photos.floor, imageCaption: gymCaption,
    cue: 'Bring the arms together. Keep the chest steady.',
    steps: ['Adjust the seat so the handles or pads align with your chest. Follow the machine setup guide.', 'Sit with your back supported and keep a soft bend in your elbows.', 'Bring your arms together in front of your chest with a smooth, controlled movement.', 'Return slowly, stopping before your shoulders feel overstretched.'],
    safety: ['Avoid letting your arms travel too far behind your body.', 'Keep the movement controlled; do not bounce at the stretched position.'],
  },
  {
    id: 'cable-triceps-pushdown', name: 'Cable Triceps Pushdown', group: 'Arms',
    targets: 'Triceps', equipment: 'Cable station + rope',
    sets: 3, reps: '12–15', rest: 60, image: photos.gym, imageCaption: gymCaption,
    cue: 'Still elbows. Strong extension.',
    steps: ['Attach a rope to a high pulley and select a light starting load.', 'Stand tall, grip the rope and bring your upper arms close to your sides.', 'Extend your elbows to push the rope down without leaning your body over it.', 'Return slowly, keeping your upper arms still throughout.'],
    safety: ['Check the attachment is secured before starting.', 'Use a load that lets you keep your torso steady.'],
  },
  {
    id: 'lat-pulldown', name: 'Lat Pulldown', group: 'Back',
    targets: 'Lats · Upper back · Biceps', equipment: 'Lat pulldown machine',
    sets: 3, reps: '10–12', rest: 90, image: photos.atmosphere, imageCaption: gymCaption,
    cue: 'Lead with your elbows.',
    steps: ['Adjust the thigh pad and grip the bar slightly wider than shoulder width.', 'Sit tall with feet planted and a small, comfortable backward lean.', 'Pull the bar towards your upper chest, guiding your elbows down.', 'Return slowly until your arms are comfortably extended, without losing control.'],
    safety: ['Pull in front of your head, never behind your neck.', 'Avoid swinging backwards to move the weight.'],
  },
  {
    id: 'seated-cable-row', name: 'Seated Cable Row', group: 'Back',
    targets: 'Mid back · Lats · Biceps', equipment: 'Cable row station',
    sets: 3, reps: '10–12', rest: 90, image: photos.gym, imageCaption: gymCaption,
    cue: 'Pull with your back. Stay tall.',
    steps: ['Sit at the row station with feet supported and knees slightly bent.', 'Hold the attachment with arms extended and your spine in a comfortable neutral position.', 'Draw the handle towards your lower ribs, keeping your elbows close.', 'Extend your arms slowly without rounding your lower back.'],
    safety: ['Avoid rocking your torso to create momentum.', 'Check the cable and attachment before use.'],
  },
  {
    id: 'dumbbell-row', name: 'Single-arm Dumbbell Row', group: 'Back',
    targets: 'Lats · Mid back · Rear delts', equipment: 'Dumbbell + bench',
    sets: 3, reps: '10–12 / side', rest: 90, image: photos.iron, imageCaption: gymCaption,
    cue: 'Elbow to hip. Torso still.',
    steps: ['Support one hand and knee on a stable bench. Plant your other foot firmly.', 'Hold a dumbbell in the free hand and keep your back comfortably neutral.', 'Draw your elbow towards your hip without rotating your torso.', 'Lower with control, then repeat the same movement on the other side.'],
    safety: ['Keep the bench stable and avoid twisting through your lower back.', 'Choose a weight you can control on both sides.'],
  },
  {
    id: 'face-pull', name: 'Cable Face Pull', group: 'Shoulders',
    targets: 'Rear delts · Upper back', equipment: 'Cable station + rope',
    sets: 3, reps: '12–15', rest: 60, image: photos.floor, imageCaption: gymCaption,
    cue: 'Smooth pull. Relaxed shoulders.',
    steps: ['Secure a rope attachment around upper-chest height and select a light load.', 'Grip the rope and step back with arms extended and knees soft.', 'Pull the rope towards your face, separating your hands and guiding your elbows out.', 'Return smoothly without leaning backwards.'],
    safety: ['Avoid excessive load or forcing your shoulders into an uncomfortable range.', 'Keep the rope clear of your face.'],
  },
  {
    id: 'ez-bar-curl', name: 'EZ-bar Biceps Curl', group: 'Arms',
    targets: 'Biceps · Forearms', equipment: 'EZ curl bar',
    sets: 3, reps: '10–12', rest: 60, image: photos.athlete, imageCaption: stockCaption,
    cue: 'No swing. Make every rep count.',
    steps: ['Stand with feet stable. Hold an EZ curl bar with an underhand grip on the angled sections.', 'Keep your upper arms close to your torso and curl the bar upwards.', 'Pause briefly without moving your elbows forwards.', 'Lower slowly until your elbows are comfortably extended.'],
    safety: ['Keep your wrists straight and avoid swinging your body.', 'Reduce the weight if you cannot control the lowering phase.'],
  },
  {
    id: 'hammer-curl', name: 'Hammer Curl', group: 'Arms',
    targets: 'Biceps · Brachialis · Forearms', equipment: 'Dumbbells',
    sets: 3, reps: '10–12', rest: 60, image: photos.iron, imageCaption: gymCaption,
    cue: 'Neutral grip. Complete control.',
    steps: ['Stand tall with dumbbells at your sides, palms facing inwards.', 'Keep your upper arms still and bend your elbows to lift the weights.', 'Keep your palms facing each other throughout the movement.', 'Lower slowly and avoid using your torso to assist.'],
    safety: ['Use a controlled load and keep wrists neutral.', 'Stop if you develop wrist or elbow pain.'],
  },
  {
    id: 'barbell-squat', name: 'Barbell Back Squat', group: 'Legs',
    targets: 'Quads · Glutes · Adductors', equipment: 'Barbell + squat rack',
    sets: 3, reps: '8–10', rest: 120, image: photos.squat, imageCaption: stockCaption,
    cue: 'Brace. Descend. Drive.',
    steps: ['Set the rack and safety bars to suit your height. Position the bar across your upper back, not your neck.', 'Unrack with a stable stance. Brace your trunk before descending.', 'Bend your hips and knees together, keeping your feet planted and knees tracking with your toes.', 'Descend only as far as you can control comfortably, then stand smoothly.'],
    safety: ['Learn the movement with a light bar and use correctly positioned safeties.', 'Ask a qualified professional for setup help if unfamiliar with squatting.'],
  },
  {
    id: 'leg-press', name: 'Leg Press', group: 'Legs',
    targets: 'Quads · Glutes', equipment: 'Leg press machine',
    sets: 3, reps: '10–12', rest: 90, image: photos.gym, imageCaption: gymCaption,
    cue: 'Feet planted. Back supported.',
    steps: ['Adjust the seat and backrest. Place your feet firmly on the platform.', 'Release the safety mechanism according to the machine instructions.', 'Lower the platform through a comfortable range, keeping your hips and lower back against the pad.', 'Press away smoothly without locking your knees. Re-engage the safeties before exiting.'],
    safety: ['Do not lower so far that your pelvis lifts from the seat.', 'Familiarise yourself with the safety catches before starting.'],
  },
  {
    id: 'romanian-deadlift', name: 'Dumbbell Romanian Deadlift', group: 'Legs',
    targets: 'Hamstrings · Glutes', equipment: 'Dumbbells',
    sets: 3, reps: '10–12', rest: 90, image: photos.iron, imageCaption: gymCaption,
    cue: 'Hips back. Weights close.',
    steps: ['Stand with feet around hip width, holding dumbbells in front of your thighs.', 'Soften your knees, brace your trunk and move your hips backwards.', 'Lower the weights close to your legs until you feel a comfortable hamstring stretch.', 'Push through your feet and bring your hips forwards to stand, without leaning back.'],
    safety: ['Use a comfortable range; touching the floor is not the goal.', 'Avoid rounding your back or forcing a deep stretch.'],
  },
  {
    id: 'leg-extension', name: 'Leg Extension', group: 'Legs',
    targets: 'Quads', equipment: 'Leg extension machine',
    sets: 3, reps: '12–15', rest: 60, image: photos.floor, imageCaption: gymCaption,
    cue: 'Lift smoothly. Lower slowly.',
    steps: ['Adjust the backrest so your knees align with the machine pivot.', 'Position the shin pad above your ankles and keep your back supported.', 'Straighten your knees through a comfortable range without snapping them locked.', 'Lower the pad slowly and keep the weight stack under control.'],
    safety: ['Follow the machine setup instructions and start light.', 'Avoid a range or load that irritates your knees.'],
  },
  {
    id: 'seated-leg-curl', name: 'Seated Leg Curl', group: 'Legs',
    targets: 'Hamstrings', equipment: 'Seated leg curl machine',
    sets: 3, reps: '12–15', rest: 60, image: photos.atmosphere, imageCaption: gymCaption,
    cue: 'Keep the hips down. Control the curl.',
    steps: ['Adjust the seat so your knees align with the pivot and the lower pad rests above your heels.', 'Secure the thigh pad according to the machine instructions.', 'Bend your knees to bring the lower pad down and back while keeping your hips still.', 'Return slowly through a comfortable range.'],
    safety: ['Keep your hips and back supported throughout.', 'Avoid jerking the weight or forcing your knees straight.'],
  },
  {
    id: 'standing-calf-raise', name: 'Standing Calf Raise', group: 'Legs',
    targets: 'Calves', equipment: 'Dumbbells + stable support',
    sets: 3, reps: '12–15', rest: 60, image: photos.iron, imageCaption: gymCaption,
    cue: 'Rise fully. Lower with intent.',
    steps: ['Stand on a flat surface with feet around hip width. Use stable support for balance.', 'Hold a light dumbbell if comfortable and keep your knees soft.', 'Rise onto the balls of your feet in a smooth movement.', 'Lower your heels slowly back to the floor.'],
    safety: ['Prioritise balance and keep a stable support within reach.', 'Start on the floor before considering a raised surface.'],
  },
];

export interface Workout {
  id: string;
  title: string;
  subtitle: string;
  muscles: string;
  duration: number;
  difficulty: 'Foundation' | 'Intermediate';
  image: ImageSourcePropType;
  exercises: string[];
  focus?: Focus;
}

export const workouts: Workout[] = [
  { id: 'push', title: 'Push Day', subtitle: 'POWER IN EVERY PRESS.', muscles: 'Chest · Shoulders · Triceps', duration: 55, difficulty: 'Intermediate', image: photos.press, focus: 'Push', exercises: ['incline-chest-press', 'machine-chest-press', 'seated-shoulder-press', 'lateral-raises', 'pec-deck-fly', 'cable-triceps-pushdown'] },
  { id: 'pull', title: 'Pull Day', subtitle: 'BUILD A STRONGER BACK.', muscles: 'Back · Rear delts · Biceps', duration: 50, difficulty: 'Intermediate', image: photos.athlete, focus: 'Pull', exercises: ['lat-pulldown', 'seated-cable-row', 'dumbbell-row', 'face-pull', 'ez-bar-curl', 'hammer-curl'] },
  { id: 'legs', title: 'Leg Day', subtitle: 'BUILD FROM THE GROUND UP.', muscles: 'Quads · Hamstrings · Glutes', duration: 60, difficulty: 'Intermediate', image: photos.squat, focus: 'Legs', exercises: ['barbell-squat', 'leg-press', 'romanian-deadlift', 'leg-extension', 'seated-leg-curl', 'standing-calf-raise'] },
  { id: 'upper', title: 'Upper Body', subtitle: 'ALL-ROUND UPPER STRENGTH.', muscles: 'Chest · Back · Shoulders · Arms', duration: 50, difficulty: 'Intermediate', image: photos.floor, exercises: ['incline-chest-press', 'lat-pulldown', 'seated-cable-row', 'seated-shoulder-press', 'lateral-raises', 'ez-bar-curl'] },
  { id: 'full', title: 'Full Body', subtitle: 'ONE SESSION. EVERY ANGLE.', muscles: 'Chest · Back · Legs · Shoulders', duration: 45, difficulty: 'Foundation', image: photos.atmosphere, exercises: ['leg-press', 'machine-chest-press', 'lat-pulldown', 'seated-leg-curl', 'seated-shoulder-press'] },
];

export const getExercise = (id: string) => exercises.find((exercise) => exercise.id === id);
export const getWorkout = (id: string) => workouts.find((workout) => workout.id === id);

export function searchExercises(query: string, group: MuscleGroup) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return exercises.filter((exercise) => (group === 'All' || exercise.group === group)
    && words.every((word) => `${exercise.name} ${exercise.targets} ${exercise.equipment}`.toLowerCase().includes(word)));
}

export const DEMO_NOTICE = 'Illustrative demo content. Workouts, sets, reps and rest periods are concept examples, not gym-approved training advice. Equipment shown or listed does not confirm availability.';
