import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View, type PressableProps, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';
import { DEMO_NOTICE } from '../data/training';
import { useAppState } from '../state/AppState';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];
export const Icon = ({ name, size = 22, color = colors.text }: { name: IconName; size?: number; color?: string }) => <Ionicons name={name} size={size} color={color} />;

export function Label({ children, style }: React.PropsWithChildren<{ style?: StyleProp<TextStyle> }>) {
  return <Text style={[styles.label, style]}>{children}</Text>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export function Tap({ children, style, onPress, ...props }: Omit<PressableProps, 'style' | 'children'> & { children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const [scale] = useState(() => new Animated.Value(1));
  const { reduceMotion } = useAppState();
  const role = props.accessibilityRole ?? 'button';
  const animate = (value: number) => {
    if (reduceMotion) return;
    Animated.spring(scale, { toValue: value, useNativeDriver: Platform.OS !== 'web', speed: 35, bounciness: 2 }).start();
  };
  return <AnimatedPressable {...props} accessibilityRole={role}
    aria-checked={props.accessibilityState?.checked}
    aria-selected={role === 'tab' ? props.accessibilityState?.selected : undefined}
    aria-pressed={role === 'button' ? props.accessibilityState?.selected : undefined}
    onPressIn={() => animate(0.975)} onPressOut={() => animate(1)}
    onPress={(event) => { if (Platform.OS !== 'web') void Haptics.selectionAsync().catch(() => {}); onPress?.(event); }}
    style={[style, { transform: [{ scale }] }]}>{children}</AnimatedPressable>;
}

export function IconButton({ name, onPress, label, active = false, style }: { name: IconName; onPress: () => void; label: string; active?: boolean; style?: StyleProp<ViewStyle> }) {
  return <Tap onPress={onPress} accessibilityLabel={label} style={[styles.iconButton, active && styles.activeIcon, style]}><Icon name={name} size={21} color={active ? colors.bright : colors.text} /></Tap>;
}

export function PrimaryButton({ title, onPress, icon = 'arrow-forward', style, disabled = false }: { title: string; onPress: () => void; icon?: IconName; style?: StyleProp<ViewStyle>; disabled?: boolean }) {
  return <Tap onPress={onPress} disabled={disabled} accessibilityState={{ disabled }} accessibilityLabel={title} style={[styles.primary, style]}>
    <LinearGradient colors={['#AA5BFA', '#8D35E8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
    <Text style={styles.primaryText}>{title}</Text><View style={styles.buttonArrow}><Icon name={icon} size={22} /></View>
  </Tap>;
}

export function FadeIn({ children, style, delay = 0 }: React.PropsWithChildren<{ style?: StyleProp<ViewStyle>; delay?: number }>) {
  const [value] = useState(() => new Animated.Value(0));
  const { reduceMotion } = useAppState();
  useEffect(() => {
    if (reduceMotion) { value.setValue(1); return; }
    const animation = Animated.timing(value, { toValue: 1, duration: 420, delay, useNativeDriver: Platform.OS !== 'web' });
    animation.start();
    return () => animation.stop();
  }, [delay, reduceMotion, value]);
  return <Animated.View style={[style, { opacity: value, transform: [{ translateY: value.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] }]}>{children}</Animated.View>;
}

export function BrandHeader({ action }: { action?: React.ReactNode }) {
  return <View style={styles.brandHeader}><Image source={require('../../assets/brand/logo.png')} style={styles.logo} resizeMode="contain" accessibilityLabel="Muscle Massacre" />
    {action ?? <View style={styles.location}><View style={styles.dot} /><Label style={{ fontSize: 9 }}>MAIDENHEAD, UK</Label></View>}
  </View>;
}

export function Screen({ children, style, scroll = true }: React.PropsWithChildren<{ style?: StyleProp<ViewStyle>; scroll?: boolean }>) {
  const insets = useSafeAreaInsets();
  return <View style={[styles.screen, { paddingTop: insets.top }, style]}>{scroll
    ? <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">{children}</ScrollView>
    : children}</View>;
}

export function SectionTitle({ title, aside }: { title: string; aside?: string }) {
  return <View style={styles.sectionTitle}><Text style={styles.sectionText}>{title}</Text>{aside && <Label style={{ color: colors.muted, fontSize: 9 }}>{aside}</Label>}</View>;
}

export function DemoNote({ compact = false }: { compact?: boolean }) {
  return <View style={[styles.demoNote, compact && { padding: 0, backgroundColor: 'transparent', borderWidth: 0 }]}>
    <Icon name="information-circle-outline" color={colors.muted} size={17} />
    <View style={{ flex: 1 }}><Label style={{ fontSize: 9, color: colors.muted }}>CONCEPT TRAINING</Label><Text style={styles.demoText}>{compact ? 'Illustrative workouts. Not gym-approved training advice.' : DEMO_NOTICE}</Text></View>
  </View>;
}

export function BackBar({ title, right, fallback = '/train' }: { title: string; right?: React.ReactNode; fallback?: '/train' }) {
  return <View style={styles.backBar}><IconButton name="arrow-back" label={`Back to ${title.toLowerCase()}`} onPress={() => router.canGoBack() ? router.back() : router.replace(fallback)} /><Label style={{ flex: 1, marginLeft: 14 }}>{title}</Label>{right}</View>;
}

export function EmptyState({ title, description, action, onAction, icon = 'search-outline' }: { title: string; description: string; action?: string; onAction?: () => void; icon?: IconName }) {
  return <View style={styles.empty}><View style={styles.emptyIcon}><Icon name={icon} color={colors.bright} size={28} /></View><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.emptyDescription}>{description}</Text>{action && onAction && <Tap onPress={onAction} accessibilityLabel={action} style={styles.emptyAction}><Text style={styles.emptyActionText}>{action}</Text><Icon name="arrow-forward" size={17} color={colors.bright} /></Tap>}</View>;
}

export const typeStyles = StyleSheet.create({
  title: { fontFamily: fonts.heavy, color: colors.text, fontSize: 54, lineHeight: 56, letterSpacing: -0.6 },
  body: { fontFamily: fonts.body, fontSize: 13, lineHeight: 21, color: colors.muted },
  pagePadding: { paddingHorizontal: 24 },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 32 },
  label: { fontFamily: fonts.bold, fontSize: 10, color: colors.text, letterSpacing: 1.5 },
  brandHeader: { height: 91, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { width: 88, height: 64 },
  location: { flexDirection: 'row', gap: 7, alignItems: 'center' },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.purple },
  iconButton: { height: 44, width: 44, borderRadius: 22, backgroundColor: '#1A191FCC', borderWidth: 1, borderColor: '#39343F', alignItems: 'center', justifyContent: 'center' },
  activeIcon: { backgroundColor: colors.purpleTint, borderColor: '#7437A7' },
  primary: { minHeight: 60, borderRadius: 12, overflow: 'hidden', paddingHorizontal: 21, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#BD7AFA' },
  primaryText: { fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1.4, color: '#FFFFFF', flexShrink: 1 },
  buttonArrow: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFFFFF17', alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { marginTop: 26, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  sectionText: { fontFamily: fonts.display, color: colors.text, fontSize: 23, letterSpacing: 0.5 },
  demoNote: { flexDirection: 'row', gap: 9, padding: 14, borderRadius: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginTop: 24 },
  demoText: { fontFamily: fonts.body, fontSize: 10, lineHeight: 17, color: colors.muted, marginTop: 5 },
  backBar: { height: 76, flexDirection: 'row', alignItems: 'center' },
  empty: { alignItems: 'center', paddingVertical: 44, paddingHorizontal: 18 },
  emptyIcon: { padding: 19, borderRadius: 40, backgroundColor: colors.purpleTint, marginBottom: 18 },
  emptyTitle: { fontFamily: fonts.display, fontSize: 28, color: colors.text, textAlign: 'center' },
  emptyDescription: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, lineHeight: 20, textAlign: 'center', maxWidth: 280, marginTop: 8 },
  emptyAction: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44, marginTop: 15 },
  emptyActionText: { fontFamily: fonts.semi, fontSize: 12, color: colors.bright },
});
