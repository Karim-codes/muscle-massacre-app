import assert from 'node:assert/strict';
import test from 'node:test';
import { getAttendancePreview, profileInitials } from '../src/data/membership';

test('attendance uses seven distinct London calendar days across the autumn clock change', () => {
  const preview = getAttendancePreview(new Date('2026-10-25T01:30:00Z'));
  assert.deepEqual(preview.days.map((day) => day.date), ['2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24', '2026-10-25']);
  assert.equal(preview.total, 3);
  assert.equal(preview.visits.length, 3);
});

test('London date can be one day ahead of UTC in summer without omitting a calendar day', () => {
  const preview = getAttendancePreview(new Date('2026-03-29T23:30:00Z'));
  assert.equal(preview.days.at(-1)?.date, '2026-03-30');
  assert.equal(new Set(preview.days.map((day) => day.date)).size, 7);
  assert.equal(preview.days[0].date, '2026-03-24');
});

test('attendance spans the year boundary and only visited days have arrival times', () => {
  const preview = getAttendancePreview(new Date('2027-01-02T12:00:00Z'));
  assert.equal(preview.days[0].date, '2026-12-27');
  assert.equal(preview.days.at(-1)?.date, '2027-01-02');
  assert.equal(preview.days.filter((day) => Boolean(day.arrival)).length, 3);
});

test('profile initials handle empty guests, whitespace and names with accents', () => {
  assert.equal(profileInitials({ kind: 'guest', firstName: '' }), 'MM');
  assert.equal(profileInitials({ kind: 'guest', firstName: '  Élodie   Rose  ' }), 'ÉR');
});
