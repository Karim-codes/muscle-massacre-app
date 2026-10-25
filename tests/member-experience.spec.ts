import { expect, test, type Page } from '@playwright/test';

async function memberHome(page: Page) {
  await page.addInitScript(() => localStorage.setItem('@muscle-massacre/prototype-v1', JSON.stringify({ onboarded: true, focus: 'Push', saved: [], profile: { kind: 'member', firstName: 'Alex', memberId: 'DEMO-1042' } })));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Welcome back, Alex' })).toBeVisible();
}

test('guests can explore without an ID and later switch to the demo member', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'STEP INSIDE' }).click();
  await page.getByRole('radio', { name: 'Explore without membership' }).click();
  await expect(page.getByRole('textbox', { name: 'Gym member ID' })).toHaveCount(0);
  await page.getByRole('textbox', { name: 'First name' }).fill('Taylor');
  await page.getByRole('button', { name: 'EXPLORE THE APP', exact: true }).click();
  await page.getByRole('button', { name: 'THAT’S MY FOCUS' }).click();
  await page.getByRole('button', { name: 'MAKE YOURSELF AT HOME' }).click();
  await expect(page.getByRole('heading', { name: 'Welcome, Taylor' })).toBeVisible();
  await page.getByRole('tab', { name: 'Membership tab' }).click();
  await expect(page.getByRole('button', { name: 'SET UP MEMBER PREVIEW' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'View example visit history' })).toHaveCount(0);
  await page.getByRole('button', { name: 'SET UP MEMBER PREVIEW' }).click();
  await page.getByRole('radio', { name: "I'm a member", exact: true }).click();
  await page.getByRole('button', { name: 'Use demo member Alex' }).click();
  await expect(page.getByRole('textbox', { name: 'First name', exact: true })).toHaveValue('Alex');
  await page.getByRole('button', { name: 'CONTINUE AS A MEMBER' }).click();
  await page.getByRole('button', { name: 'THAT’S MY FOCUS' }).click();
  await page.getByRole('button', { name: 'MAKE YOURSELF AT HOME' }).click();
  await expect(page.getByRole('heading', { name: 'Welcome back, Alex' })).toBeVisible();
});

test('capacity, member status and seven-day visits stay visibly labelled as examples', async ({ page }) => {
  await memberHome(page);
  await page.getByRole('button', { name: 'View gym capacity demo information' }).click();
  await expect(page.getByText(/42% is an illustrative occupancy example/)).toBeVisible();
  await page.getByRole('button', { name: 'Close capacity preview' }).click();
  await page.getByRole('button', { name: 'View your example visits this week' }).click();
  await expect(page.getByText('These are sample check-ins for the prototype. No entry or attendance system is connected.')).toBeVisible();
  await expect(page.getByText('Example gym visit', { exact: true })).toHaveCount(3);
  await page.getByRole('button', { name: 'Close visit history' }).click();
  await expect(page.getByText('DEMO-1042', { exact: true })).toBeVisible();
  await expect(page.getByText('ACTIVE', { exact: true })).toBeVisible();
  await expect(page.getByText('UNVERIFIED', { exact: true })).toBeVisible();
  await expect(page.getByText('Illustrative attendance, not your actual gym visits.')).toBeVisible();
  await page.screenshot({ path: 'artifacts/14-member-dashboard.png' });
  await page.getByRole('button', { name: 'View example visit history' }).click();
  await page.screenshot({ path: 'artifacts/15-visit-history.png' });
  await page.getByRole('button', { name: 'BACK TO MEMBERSHIP' }).click();
  await page.setViewportSize({ width: 320, height: 568 });
  await expect(page.getByRole('tab', { name: 'Membership tab' })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test('existing saved workouts survive migration and profile setup', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('@muscle-massacre/prototype-v1', JSON.stringify({ onboarded: true, focus: 'Pull', saved: ['pull'] })));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Welcome, Lifter' })).toBeVisible();
  await page.getByRole('button', { name: 'Edit your demo profile' }).click();
  await page.getByRole('radio', { name: "I'm a member", exact: true }).click();
  await page.getByRole('textbox', { name: 'First name' }).fill('Jordan');
  await page.getByRole('textbox', { name: 'Gym member ID' }).fill('DEMO-J42');
  await page.getByRole('button', { name: 'CONTINUE AS A MEMBER' }).click();
  await page.getByRole('button', { name: 'THAT’S MY FOCUS' }).click();
  await page.getByRole('button', { name: 'MAKE YOURSELF AT HOME' }).click();
  await expect(page.getByRole('heading', { name: 'Welcome back, Jordan' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Unsave Pull Day', exact: true })).toHaveCount(1);
});

test('onboarding transitions also work with motion enabled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.getByRole('button', { name: 'STEP INSIDE' }).click();
  await page.getByRole('radio', { name: 'Explore without membership' }).click();
  await page.getByRole('button', { name: 'EXPLORE THE APP', exact: true }).click();
  await expect(page.getByRole('radio', { name: 'Feature Push Day' })).toBeVisible();
  await page.getByRole('button', { name: 'Previous introduction screen' }).click();
  await expect(page.getByRole('radio', { name: 'Explore without membership' })).toHaveAttribute('aria-checked', 'true');
});
