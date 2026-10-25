export interface MemberProfile {
  kind: 'member' | 'guest';
  firstName: string;
  memberId?: string;
}

export const guestProfile: MemberProfile = { kind: 'guest', firstName: '' };
export const demoMember: MemberProfile = { kind: 'member', firstName: 'Alex', memberId: 'DEMO-1042' };

// Concept fixtures, deliberately separate from a member's unverified profile.
// Replace these with authorised gym-system responses when an integration exists.
export const capacityPreview = { percent: 42, label: 'Room to move', source: 'Illustrative occupancy · not live' };
export const membershipPreview = { status: 'Active', source: 'Example status · ID not verified' };

export interface AttendanceDay {
  date: string;
  label: string;
  fullLabel: string;
  number: string;
  visited: boolean;
  arrival?: string;
}

export function getAttendancePreview(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const today = Date.UTC(value('year'), value('month') - 1, value('day'));
  const arrivals: Record<number, string> = { 0: '07:12', 3: '18:05', 5: '09:18' };
  const days: AttendanceDay[] = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today + (index - 6) * 86_400_000);
    const fullLabel = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(date);
    return { date: date.toISOString().slice(0, 10), label: new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'UTC' }).format(date),
      fullLabel, number: String(date.getUTCDate()), visited: index in arrivals, arrival: arrivals[index] };
  });
  const rangeFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
  return { days, visits: days.filter((day) => day.visited), total: days.filter((day) => day.visited).length,
    range: `${rangeFormat.format(new Date(today - 6 * 86_400_000))} – ${rangeFormat.format(new Date(today))}` };
}

export function profileInitials(profile: MemberProfile) {
  return profile.firstName.trim().split(/\s+/).map((part) => Array.from(part)[0] ?? '').slice(0, 2).join('').toUpperCase() || 'MM';
}
