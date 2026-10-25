import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import type { Focus } from '../data/training';
import { guestProfile, type MemberProfile } from '../data/membership';

interface Preferences { onboarded: boolean; focus: Focus; saved: string[]; profile: MemberProfile }
interface AppContextValue extends Preferences {
  ready: boolean;
  reduceMotion: boolean;
  storageError: boolean;
  completeOnboarding: (focus: Focus, profile?: MemberProfile) => void;
  toggleSaved: (id: string) => void;
}
const storageKey = '@muscle-massacre/prototype-v1';
const initial: Preferences = { onboarded: false, focus: 'Push', saved: [], profile: guestProfile };
const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: React.PropsWithChildren) {
  const [preferences, setPreferences] = useState<Preferences>(initial);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const writeQueue = useRef(Promise.resolve());

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(storageKey).then((value) => {
      if (!value || !active) return;
      const parsed = JSON.parse(value) as Partial<Preferences>;
      setPreferences({ onboarded: parsed.onboarded === true,
        focus: ['Push', 'Pull', 'Legs'].includes(parsed.focus ?? '') ? parsed.focus as Focus : 'Push',
        saved: Array.isArray(parsed.saved) ? parsed.saved.filter((id): id is string => typeof id === 'string') : [],
        profile: parsed.profile?.kind === 'member' && typeof parsed.profile.memberId === 'string' && parsed.profile.memberId.trim() && typeof parsed.profile.firstName === 'string' && parsed.profile.firstName.trim()
          ? { kind: 'member', firstName: parsed.profile.firstName.trim().slice(0, 32), memberId: parsed.profile.memberId.trim().slice(0, 32) }
          : { kind: 'guest', firstName: typeof parsed.profile?.firstName === 'string' ? parsed.profile.firstName.trim().slice(0, 32) : '' },
      });
    }).catch(() => { if (active) setStorageError(true); }).finally(() => { if (active) setReady(true); });
    AccessibilityInfo.isReduceMotionEnabled().then((value) => { if (active) setReduceMotion(value); }).catch(() => {});
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => { active = false; subscription.remove(); };
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeQueue.current = writeQueue.current.then(() => AsyncStorage.setItem(storageKey, JSON.stringify(preferences)))
      .then(() => setStorageError(false)).catch(() => setStorageError(true));
  }, [preferences, ready]);

  const completeOnboarding = useCallback((focus: Focus, profile?: MemberProfile) => setPreferences((previous) => ({ ...previous, focus, profile: profile ?? previous.profile, onboarded: true })), []);
  const toggleSaved = useCallback((id: string) => setPreferences((previous) => ({ ...previous,
    saved: previous.saved.includes(id) ? previous.saved.filter((item) => item !== id) : [...previous.saved, id],
  })), []);

  return <AppContext.Provider value={{ ...preferences, ready, storageError, reduceMotion, completeOnboarding, toggleSaved }}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppState must be used within AppProvider');
  return context;
}
