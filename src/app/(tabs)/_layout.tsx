import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, Tap, type IconName } from '../../components/ui';
import { colors, fonts } from '../../theme';

const icons: Record<string, IconName> = { home: 'home-outline', train: 'barbell-outline', membership: 'card-outline', more: 'grid-outline' };
function BottomBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
    {state.routes.map((route, index) => {
      const selected = state.index === index;
      const label = descriptors[route.key].options.title ?? route.name;
      return <Tap key={route.key} accessibilityRole="tab" accessibilityState={{ selected }} accessibilityLabel={`${label} tab`} style={styles.tab}
        onPress={() => { const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true }); if (!selected && !event.defaultPrevented) navigation.navigate(route.name, route.params); }}>
        <View style={[styles.iconWrap, selected && styles.iconSelected]}><Icon name={icons[route.name]} color={selected ? colors.bright : '#85818E'} size={23} /></View>
        <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
      </Tap>;
    })}
  </View>;
}

export default function TabsLayout() {
  return <Tabs initialRouteName="home" tabBar={(props) => <BottomBar {...props} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}>
    <Tabs.Screen name="home" options={{ title: 'Home' }} />
    <Tabs.Screen name="train" options={{ title: 'Train' }} />
    <Tabs.Screen name="membership" options={{ title: 'Membership' }} />
    <Tabs.Screen name="more" options={{ title: 'More' }} />
  </Tabs>;
}
const styles = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: '#101013', borderTopWidth: 1, borderColor: '#29252F', paddingTop: 8 },
  tab: { flex: 1, alignItems: 'center', gap: 4, paddingTop: 0, minHeight: 55 },
  iconWrap: { width: 54, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  iconSelected: { backgroundColor: '#2C193D' },
  label: { fontFamily: fonts.medium, fontSize: 10, color: '#85818E' },
  labelSelected: { color: colors.bright, fontFamily: fonts.semi },
});
