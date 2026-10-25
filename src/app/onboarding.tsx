import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, Easing, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, IconButton, Label, PrimaryButton, Tap } from '../components/ui';
import { demoMember, type MemberProfile } from '../data/membership';
import { photos, workouts, type Focus } from '../data/training';
import { useAppState } from '../state/AppState';
import { colors, fonts } from '../theme';

export default function Onboarding() {
  const params = useLocalSearchParams<{ step?: string }>();
  const { focus: savedFocus, profile, onboarded, reduceMotion, completeOnboarding } = useAppState();
  const [step, setStep] = useState(params.step === 'identity' ? 1 : 0);
  const [focus, setFocus] = useState<Focus>(savedFocus);
  const [kind, setKind] = useState<'member' | 'guest' | null>(profile.kind === 'member' ? 'member' : profile.firstName ? 'guest' : null);
  const [firstName, setFirstName] = useState(profile.firstName);
  const [memberId, setMemberId] = useState(profile.memberId ?? '');
  const [errors, setErrors] = useState<{ choice?: string; name?: string; id?: string }>({});
  const [transition] = useState(() => new Animated.Value(1));
  const [transitioning, setTransitioning] = useState(false);
  const moving = useRef(false);
  const scroll = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const heroSize = Math.min(90, (Math.min(width, 480) - 52) / 4.5);
  const chosen = workouts.find((workout) => workout.focus === focus) ?? workouts[0];

  const goTo = useCallback((next: number) => {
    if (moving.current) return;
    Keyboard.dismiss();
    const update = () => { setStep(next); scroll.current?.scrollTo({ y: 0, animated: false }); };
    if (reduceMotion) { update(); return; }
    moving.current = true;
    setTransitioning(true);
    Animated.timing(transition, { toValue: 0, duration: 110, easing: Easing.out(Easing.quad), useNativeDriver: Platform.OS !== 'web' }).start(({ finished }) => {
      if (!finished) { moving.current = false; setTransitioning(false); return; }
      update();
      Animated.timing(transition, { toValue: 1, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web' }).start(() => { moving.current = false; setTransitioning(false); });
    });
  }, [reduceMotion, transition]);

  const finish = (selectedProfile: MemberProfile) => {
    Keyboard.dismiss();
    completeOnboarding(focus, selectedProfile);
    router.replace('/home');
  };
  const continueFlow = () => {
    if (step === 1) {
      const nextErrors: typeof errors = {};
      if (!kind) nextErrors.choice = 'Choose a member or explorer experience.';
      if (kind === 'member' && !firstName.trim()) nextErrors.name = 'Enter a first name for your demo profile.';
      if (kind === 'member' && !memberId.trim()) nextErrors.id = 'Enter an ID, or use the demo member below.';
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length) return;
    }
    if (step < 3) goTo(step + 1);
    else finish(kind === 'member' ? { kind, firstName: firstName.trim(), memberId: memberId.trim() } : { kind: 'guest', firstName: firstName.trim() });
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step > 0) { goTo(step - 1); return true; }
      return false;
    });
    return () => subscription.remove();
  }, [step, goTo]);

  const primaryTitle = step === 0 ? 'STEP INSIDE' : step === 1 ? kind === 'member' ? 'CONTINUE AS A MEMBER' : 'EXPLORE THE APP' : step === 2 ? 'THAT’S MY FOCUS' : 'MAKE YOURSELF AT HOME';
  return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
    {(step === 0 || step === 3) && <Animated.View pointerEvents="none" style={[styles.photoContainer, { height: Math.max(height * 0.79, 480), opacity: transition }]}>
      <Image source={step === 0 ? photos.floor : photos.atmosphere} style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]} resizeMode="cover" />
      <LinearGradient colors={['#09090C50', '#13051E20', '#150B2040', '#09090CF5', colors.bg]} locations={[0, 0.25, 0.55, 0.89, 1]} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['#7620B633', 'transparent']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
    </Animated.View>}
    {(step === 1 || step === 2) && <LinearGradient colors={['#21102D', colors.bg]} style={[StyleSheet.absoluteFill, { height: 400 }]} />}
    <ScrollView ref={scroll} style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 12 }]}>
      <View style={styles.header}><Image source={require('../../assets/brand/logo.png')} style={styles.logo} resizeMode="contain" accessibilityLabel="Muscle Massacre" /><Tap accessibilityLabel={onboarded ? 'Back to app' : 'Skip introduction'} onPress={() => finish(profile)} style={styles.skip}><Text style={styles.skipText}>{onboarded ? 'Back to app' : 'Skip intro'}</Text><Icon name="arrow-forward" size={14} color="#DBD3E2" /></Tap></View>
      <View style={styles.progress}>{[0, 1, 2, 3].map((index) => <View key={index} style={[styles.progressTrack, index <= step && styles.progressActive]} />)}<Label style={styles.stepCount}>0{step + 1} / 04</Label></View>
      <Animated.View style={[styles.stage, { opacity: transition, transform: [{ translateY: transition.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }]}>
        {step === 0 && <View style={styles.story}>
          <View style={styles.location}><Icon name="location-outline" size={13} /><Label style={{ fontSize: 9 }}>MAIDENHEAD, UK</Label></View><View style={styles.spacer} />
          <View style={styles.intro}><Eyebrow>WELCOME TO YOUR TRAINING GROUND</Eyebrow><Text accessibilityRole="header" style={[styles.heroTitle, { fontSize: heroSize, lineHeight: heroSize * 0.96 }]}>BUILT{`\n`}<Text style={{ color: colors.bright }}>DIFFERENT.</Text></Text><Text style={styles.description}>For the ones who show up.{`\n`}The ones who put the work in.</Text></View>
        </View>}

        {step === 1 && <View style={styles.setup}>
          <StepHeader title="YOUR GYM. YOUR WAY." onBack={() => goTo(0)} />
          <Text accessibilityRole="header" style={styles.setupTitle}>MAKE IT{`\n`}<Text style={{ color: colors.bright }}>PERSONAL.</Text></Text><Text style={[styles.description, { marginTop: 12 }]}>Already part of the Massacre?</Text>
          <View style={styles.choices}>
            <IdentityChoice title="I’m a member" detail="Your membership. Your training." icon="card-outline" selected={kind === 'member'} label="I'm a member" onPress={() => { setKind('member'); setErrors({}); }} />
            <IdentityChoice title="Explore the app" detail="Take a look around. No gym ID needed." icon="compass-outline" selected={kind === 'guest'} label="Explore without membership" onPress={() => { setKind('guest'); setErrors({}); }} />
          </View>
          {errors.choice && <Text accessibilityRole="alert" style={styles.error}>{errors.choice}</Text>}
          {kind && <View style={styles.form}>
            <Label style={styles.fieldLabel}>{kind === 'member' ? 'FIRST NAME' : 'FIRST NAME (OPTIONAL)'}</Label>
            <View style={[styles.field, errors.name && styles.fieldError]}><Icon name="person-outline" color={colors.bright} size={18} /><TextInput accessibilityLabel="First name" value={firstName} onChangeText={(value) => { setFirstName(value); setErrors((previous) => ({ ...previous, name: undefined })); }} maxLength={32} placeholder="What should we call you?" placeholderTextColor="#85768F" autoComplete="given-name" autoCapitalize="words" style={styles.input} returnKeyType="done" /></View>
            {errors.name && <Text accessibilityRole="alert" style={styles.error}>{errors.name}</Text>}
            {kind === 'member' && <><Label style={[styles.fieldLabel, { marginTop: 19 }]}>GYM MEMBER ID</Label><View style={[styles.field, errors.id && styles.fieldError]}><Icon name="id-card-outline" color={colors.bright} size={19} /><TextInput accessibilityLabel="Gym member ID" value={memberId} onChangeText={(value) => { setMemberId(value); setErrors((previous) => ({ ...previous, id: undefined })); }} maxLength={32} placeholder="e.g. DEMO-1042" placeholderTextColor="#85768F" autoCapitalize="characters" autoCorrect={false} style={styles.input} returnKeyType="done" /></View>{errors.id && <Text accessibilityRole="alert" style={styles.error}>{errors.id}</Text>}
              <Tap accessibilityLabel="Use demo member Alex" onPress={() => { setFirstName(demoMember.firstName); setMemberId(demoMember.memberId!); setErrors({}); }} style={styles.demoMember}><Icon name="sparkles-outline" color={colors.bright} size={15} /><Text style={styles.demoMemberText}>TRY THE DEMO MEMBER</Text><Icon name="arrow-forward" color={colors.bright} size={14} /></Tap>
              <View style={styles.demoNote}><Icon name="information-circle-outline" color="#AC8FBF" size={16} /><Text style={styles.hintText}>Demo profile only. IDs are not verified and no gym account is connected. Use example details to explore.</Text></View>
            </>}
          </View>}
        </View>}

        {step === 2 && <View style={styles.setup}>
          <StepHeader title="MAKE IT YOURS" onBack={() => goTo(1)} />
          <Text accessibilityRole="header" style={styles.setupTitle}>WHAT’S YOUR{`\n`}<Text style={{ color: colors.bright }}>FOCUS?</Text></Text><Text style={[styles.description, { marginTop: 12 }]}>Pick the session you want to explore first.</Text>
          <View style={styles.options}>{workouts.filter((workout) => workout.focus).map((workout, index) => {
            const selected = focus === workout.focus;
            return <Tap key={workout.id} accessibilityRole="radio" accessibilityState={{ checked: selected }} accessibilityLabel={`Feature ${workout.title}`} onPress={() => setFocus(workout.focus!)} style={[styles.option, selected && styles.optionSelected]}>
              <Image source={workout.image} style={styles.optionImage} /><LinearGradient colors={['transparent', '#15121AEF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.optionFade} /><View style={styles.optionText}><Label style={{ color: selected ? colors.bright : colors.muted, fontSize: 8 }}>0{index + 1} / {workout.focus?.toUpperCase()}</Label><Text style={styles.optionTitle}>{workout.title.toUpperCase()}</Text><Text style={styles.optionMuscles}>{workout.muscles}</Text></View><View style={[styles.radio, selected && styles.radioSelected]}>{selected && <Icon name="checkmark" size={14} />}</View>
            </Tap>;
          })}</View><View style={styles.demoNote}><Icon name="sparkles-outline" color={colors.bright} size={15} /><Text style={styles.hintText}>Your pick sets the featured demo workout.{`\n`}Every session is still yours to explore.</Text></View>
        </View>}

        {step === 3 && <View style={styles.story}>
          <View style={styles.readyNav}><IconButton name="arrow-back" label="Back to training focus" onPress={() => goTo(2)} /><View style={styles.readyBadge}><Icon name="flash" color={colors.bright} size={15} /><Label style={{ color: '#E4D0F3', fontSize: 9 }}>YOUR APP IS READY</Label></View></View><View style={styles.spacer} />
          <View style={styles.intro}><Eyebrow>{kind === 'member' ? 'YOUR MEMBER EXPERIENCE / DEMO' : 'YOUR NEXT CHAPTER'}</Eyebrow>
            {firstName.trim() ? <View accessibilityRole="header" accessibilityLabel={`All set, ${firstName.trim()}`}><Text style={[styles.heroTitle, { fontSize: heroSize, lineHeight: heroSize }]}>ALL SET,</Text><Text numberOfLines={1} adjustsFontSizeToFit style={[styles.heroTitle, { fontSize: heroSize, lineHeight: heroSize, color: colors.bright }]}>{firstName.trim().toUpperCase()}.</Text></View> : <Text accessibilityRole="header" style={[styles.heroTitle, { fontSize: heroSize, lineHeight: heroSize * 0.98 }]}>LESS TALK.{`\n`}<Text style={{ color: colors.bright }}>MORE IRON.</Text></Text>}
            <Text style={styles.description}>Your gym. Your next session.{`\n`}Make yourself at home.</Text><View style={styles.readyCard}><Image source={chosen.image} style={styles.readyImage} /><View style={{ flex: 1 }}><Label style={{ fontSize: 8, color: colors.bright }}>YOUR FIRST LOOK</Label><Text style={styles.readyWorkout}>{chosen.title.toUpperCase()}</Text><Text style={styles.optionMuscles}>{chosen.duration} min · {chosen.exercises.length} exercises · Demo</Text></View><Icon name="checkmark-circle" size={22} color={colors.bright} /></View>
          </View>
        </View>}
      </Animated.View>
    </ScrollView>
    <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 18) }]}><PrimaryButton title={primaryTitle} onPress={continueFlow} disabled={transitioning} /><Text style={styles.footerText}>{step === 0 ? 'DISCIPLINE. INTENSITY. MUSCLE MASSACRE.' : step === 1 ? 'YOUR DETAILS STAY ON THIS DEVICE.' : step === 2 ? 'YOUR TRAINING. YOUR CALL.' : 'WELCOME TO YOUR TRAINING GROUND.'}</Text><Text style={styles.concept}>A Muscle Massacre app concept</Text></View>
  </KeyboardAvoidingView>;
}

function Eyebrow({ children }: { children: string }) {
  return <View style={styles.eyebrow}><View style={styles.littleLine} /><Label style={{ color: '#E0C7F4', fontSize: 9 }}>{children}</Label></View>;
}
function StepHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return <View style={styles.stepHeader}><IconButton name="arrow-back" label="Previous introduction screen" onPress={onBack} /><Label style={{ color: colors.bright, fontSize: 9 }}>{title}</Label></View>;
}
function IdentityChoice({ title, detail, icon, selected, label, onPress }: { title: string; detail: string; icon: 'card-outline' | 'compass-outline'; selected: boolean; label: string; onPress: () => void }) {
  return <Tap onPress={onPress} accessibilityRole="radio" accessibilityLabel={label} accessibilityState={{ checked: selected }} style={[styles.identityChoice, selected && styles.optionSelected]}><View style={styles.identityIcon}><Icon name={icon} color={colors.bright} size={24} /></View><View style={{ flex: 1 }}><Text style={styles.identityTitle}>{title}</Text><Text style={styles.identityDetail}>{detail}</Text></View><View style={[styles.radio, selected && styles.radioSelected]}>{selected && <Icon name="checkmark" size={14} />}</View></Tap>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg }, photoContainer: { position: 'absolute', top: 0, left: 0, right: 0, overflow: 'hidden' },
  scroll: { paddingHorizontal: 26, flexGrow: 1 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 86 }, logo: { width: 110, height: 75 },
  skip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 15, paddingLeft: 15 }, skipText: { fontFamily: fonts.medium, fontSize: 10, color: '#DBD3E2' },
  progress: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 17 }, progressTrack: { height: 2, flex: 1, backgroundColor: '#FFFFFF35' }, progressActive: { backgroundColor: colors.bright }, stepCount: { fontSize: 8, color: '#D0C5D9', marginLeft: 10, letterSpacing: 1 },
  stage: { flex: 1 }, story: { flex: 1, paddingTop: 32 }, location: { flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1, borderColor: '#FFFFFF40', backgroundColor: '#15101955', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 5 },
  spacer: { flex: 1, minHeight: 100 }, intro: { paddingTop: 18 }, eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 14 }, littleLine: { width: 17, height: 2, backgroundColor: colors.bright },
  heroTitle: { fontFamily: fonts.italic, color: colors.text, letterSpacing: -1.8, marginLeft: -2 }, description: { color: '#B5ADBFEF', fontFamily: fonts.body, fontSize: 13, lineHeight: 22, marginTop: 17 },
  footer: { paddingTop: 20, paddingHorizontal: 26, backgroundColor: colors.bg }, footerText: { fontFamily: fonts.semi, fontSize: 8, letterSpacing: 1.1, color: '#C0B2C9', textAlign: 'center', marginTop: 18 }, concept: { color: '#6F6578', fontFamily: fonts.body, fontSize: 9, textAlign: 'center', marginTop: 12 },
  setup: { flex: 1, paddingTop: 24, paddingBottom: 8 }, stepHeader: { flexDirection: 'row', alignItems: 'center', gap: 13, marginBottom: 20 }, setupTitle: { fontFamily: fonts.heavy, fontSize: 60, lineHeight: 58, color: colors.text, letterSpacing: -0.5 },
  choices: { marginTop: 23, gap: 10 }, identityChoice: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15, minHeight: 88, borderWidth: 1, borderColor: '#3F3148', backgroundColor: '#16111D', borderRadius: 12 },
  identityIcon: { width: 33, alignItems: 'center' }, identityTitle: { fontFamily: fonts.semi, fontSize: 14, color: colors.text }, identityDetail: { fontFamily: fonts.body, fontSize: 10, lineHeight: 17, color: '#A795B3', marginTop: 6 },
  form: { marginTop: 25 }, fieldLabel: { fontSize: 8, color: '#B69BC7', marginBottom: 9 }, field: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, minHeight: 53, borderRadius: 9, borderWidth: 1, borderColor: '#4E365E', backgroundColor: '#19121F' }, input: { flex: 1, minHeight: 51, fontFamily: fonts.medium, fontSize: 13, color: colors.text, outlineWidth: 0 }, fieldError: { borderColor: '#D28BA5' }, error: { fontFamily: fonts.body, fontSize: 11, color: '#EEAAC0', marginTop: 8, lineHeight: 17 },
  demoMember: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44, marginTop: 8 }, demoMemberText: { fontFamily: fonts.bold, color: colors.bright, fontSize: 9, letterSpacing: 1 }, demoNote: { flexDirection: 'row', gap: 9, alignItems: 'flex-start', marginTop: 18 }, hintText: { flex: 1, fontFamily: fonts.body, fontSize: 10, lineHeight: 17, color: '#AA96B8' },
  options: { gap: 10, marginTop: 23 }, option: { minHeight: 94, flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#39313F', backgroundColor: '#15121A', overflow: 'hidden', paddingRight: 15 }, optionSelected: { borderColor: colors.purple, backgroundColor: '#22142D' }, optionImage: { width: 95, height: '100%', position: 'absolute', left: 0 }, optionFade: { position: 'absolute', width: 110, top: 0, bottom: 0 }, optionText: { flex: 1, marginLeft: 103, paddingVertical: 13 }, optionTitle: { fontFamily: fonts.display, fontSize: 29, color: colors.text, marginTop: 3 }, optionMuscles: { fontFamily: fonts.body, fontSize: 9, lineHeight: 15, color: '#A99CB5', marginTop: 2 }, radio: { width: 23, height: 23, borderRadius: 13, borderWidth: 1, borderColor: '#6B5F74', alignItems: 'center', justifyContent: 'center' }, radioSelected: { backgroundColor: '#8D35E8', borderColor: colors.purple },
  readyNav: { flexDirection: 'row', alignItems: 'center', gap: 12 }, readyBadge: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#2A1538DD', borderWidth: 1, borderColor: '#8D49B6', borderRadius: 5, paddingHorizontal: 11, paddingVertical: 9 }, readyCard: { padding: 10, paddingRight: 15, marginTop: 21, backgroundColor: '#19111FEF', borderWidth: 1, borderColor: '#583C6B', borderRadius: 11, flexDirection: 'row', gap: 13, alignItems: 'center' }, readyImage: { width: 60, height: 62, borderRadius: 6 }, readyWorkout: { fontFamily: fonts.display, fontSize: 27, color: colors.text, marginTop: 3 },
});
