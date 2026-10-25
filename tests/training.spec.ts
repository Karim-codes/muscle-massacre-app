import { expect, test, type Page } from '@playwright/test';

async function enterTraining(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Skip introduction' }).click();
  await expect(page.getByRole('heading', { name: 'Welcome, Lifter' })).toBeVisible();
  await page.getByRole('tab', { name: 'Train tab' }).click();
  await expect(page.getByRole('heading', { name: 'TRAIN HARDER' })).toBeVisible();
}
async function capture(page: Page, name: string) {
  await page.screenshot({ path: `artifacts/${name}.png`, animations: 'disabled' });
}

test('member onboarding validates details, personalises Home, and persists a featured focus', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'STEP INSIDE' }).click();
  await page.getByRole('radio', { name: "I'm a member", exact: true }).click();
  await page.getByRole('button', { name: 'CONTINUE AS A MEMBER' }).click();
  await expect(page.getByText('Enter a first name for your demo profile.')).toBeVisible();
  await expect(page.getByText('Enter an ID, or use the demo member below.')).toBeVisible();
  await page.getByRole('textbox', { name: 'First name', exact: true }).fill('Mia');
  await page.getByRole('textbox', { name: 'Gym member ID', exact: true }).fill('DEMO-2048');
  await page.getByRole('button', { name: 'CONTINUE AS A MEMBER' }).click();
  await page.getByRole('radio', { name: 'Feature Leg Day' }).click();
  await expect(page.getByRole('radio', { name: 'Feature Leg Day' })).toHaveAttribute('aria-checked', 'true');
  await page.getByRole('button', { name: 'THAT’S MY FOCUS' }).click();
  await expect(page.getByRole('heading', { name: 'All set, Mia' })).toBeVisible();
  await page.getByRole('button', { name: 'MAKE YOURSELF AT HOME' }).click();
  await expect(page.getByRole('heading', { name: 'Welcome back, Mia' })).toBeVisible();
  await capture(page, '13-personal-home');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Welcome back, Mia' })).toBeVisible();
  await page.getByRole('tab', { name: 'Train tab' }).click();
  const cards = page.getByRole('button', { name: /^Open (Push Day|Pull Day|Leg Day|Upper Body|Full Body),/ });
  await expect(cards.first()).toHaveAccessibleName(/^Open Leg Day,/);
  await page.getByRole('tab', { name: 'More tab' }).click();
  await page.getByRole('button', { name: 'Replay the introduction' }).click();
  await expect(page.getByRole('button', { name: 'STEP INSIDE' })).toBeVisible();
  await page.getByRole('button', { name: 'Back to app' }).click();
  await expect(page.getByRole('heading', { name: 'Welcome back, Mia' })).toBeVisible();
});

test('all five workouts open, Push Day has the six requested movements', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await enterTraining(page);
  await capture(page, '04-training-home');
  const sessions = [
    { name: 'Push Day', count: 6 }, { name: 'Pull Day', count: 6 },
    { name: 'Leg Day', count: 6 }, { name: 'Upper Body', count: 6 }, { name: 'Full Body', count: 5 },
  ];
  for (const session of sessions) {
    await page.getByRole('button', { name: new RegExp(`^Open ${session.name},`) }).click();
    await expect(page.getByRole('heading', { name: session.name.toUpperCase() })).toBeVisible();
    await expect(page.getByRole('button', { name: /^\d\. / })).toHaveCount(session.count);
    if (session.name === 'Push Day') {
      await capture(page, '05-push-day');
      for (const [index, name] of ['Incline Chest Press', 'Machine Chest Press', 'Seated Shoulder Press', 'Lateral Raises', 'Pec Deck Fly', 'Cable Triceps Pushdown'].entries()) {
        await expect(page.getByRole('button', { name: new RegExp(`^${index + 1}\\. ${name},`) })).toHaveCount(1);
      }
    }
    await page.getByRole('button', { name: 'Back to training' }).click();
  }
  expect(errors).toEqual([]);
});

test('search and muscle filters combine, empty state resets, every library detail opens', async ({ page }) => {
  await enterTraining(page);
  await page.getByRole('tab', { name: 'EXERCISE LIBRARY' }).click();
  await expect(page.getByRole('button', { name: /^Open / })).toHaveCount(18);
  await capture(page, '06-exercise-library');
  await page.getByRole('button', { name: 'Filter Chest', exact: true }).click();
  await expect(page.getByRole('button', { name: /^Open / })).toHaveCount(3);
  await page.getByRole('textbox', { name: 'Search exercises' }).fill('machine');
  await expect(page.getByRole('button', { name: /^Open / })).toHaveCount(2);
  await page.getByRole('button', { name: 'Filter Arms', exact: true }).click();
  await expect(page.getByText('NO MATCHES. KEEP LOOKING.')).toBeVisible();
  await page.getByRole('button', { name: 'Reset search & filters' }).click();
  await expect(page.getByRole('button', { name: /^Open / })).toHaveCount(18);
  await page.getByRole('textbox', { name: 'Search exercises' }).fill('CABLE triceps');
  await expect(page.getByRole('button', { name: /^Open / })).toHaveCount(1);
  await page.getByRole('button', { name: 'Clear search' }).click();
  const names = await page.getByRole('button', { name: /^Open / }).allTextContents();
  expect(names.length).toBe(18);
  const labels = await page.getByRole('button', { name: /^Open / }).evaluateAll((elements) => elements.map((element) => element.getAttribute('aria-label')!));
  for (const label of labels) {
    await page.getByRole('button', { name: label, exact: true }).click();
    await expect(page.getByRole('heading', { name: label.replace(/^Open /, '').toUpperCase() })).toBeVisible();
    await expect(page.getByText('OWN THE MOVEMENT')).toHaveCount(1);
    await page.getByRole('button', { name: 'Back to exercise library' }).click();
  }
});

test('exercise technique, video placeholder, next movement and workout back navigation', async ({ page }) => {
  await enterTraining(page);
  await page.getByRole('button', { name: /^Open Push Day,/ }).click();
  await page.getByRole('button', { name: /^1\. Incline Chest Press,/ }).click();
  await expect(page.getByRole('heading', { name: 'INCLINE CHEST PRESS' })).toBeVisible();
  await expect(page.getByText('Dumbbells + incline bench', { exact: true })).toBeVisible();
  await capture(page, '07-exercise-detail');
  await page.getByRole('button', { name: 'View technique video placeholder' }).click();
  await expect(page.getByText('A future technique video could live here. This prototype contains no playable video.')).toBeVisible();
  await page.getByRole('button', { name: 'Close video placeholder' }).click();
  await page.getByRole('button', { name: 'NEXT MOVEMENT' }).click();
  await expect(page.getByRole('heading', { name: 'MACHINE CHEST PRESS' })).toBeVisible();
  await page.getByRole('button', { name: 'Back to Push Day' }).click();
  await expect(page.getByRole('heading', { name: 'PUSH DAY' })).toBeVisible();
});

test('saved workouts persist and all four bottom tabs work', async ({ page }) => {
  await enterTraining(page);
  await page.getByRole('button', { name: 'View saved workouts' }).click();
  await expect(page.getByText('YOUR NEXT SESSION, SAVED.')).toBeVisible();
  await page.getByRole('button', { name: 'Explore workouts', exact: true }).click();
  await page.getByRole('button', { name: 'Save Push Day', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'TRAIN HARDER' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Unsave Push Day', exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Home tab' }).click();
  await expect(page.getByRole('heading', { name: 'Welcome, Lifter' })).toBeVisible();
  await capture(page, '08-home');
  await page.getByRole('tab', { name: 'Membership tab' }).click();
  await expect(page.getByRole('button', { name: 'Visit the gym website' })).toBeVisible();
  await capture(page, '09-membership');
  await page.getByRole('tab', { name: 'More tab' }).click();
  await page.getByRole('button', { name: 'Saved workouts', exact: true }).click();
  await expect(page.getByText('SAVED WORKOUTS', { exact: true })).toBeVisible();
  await capture(page, '10-saved-workouts');
  await page.getByRole('button', { name: 'Close saved workouts', exact: true }).last().click();
  await page.getByRole('button', { name: 'Unsave Push Day', exact: true }).click();
  await page.getByRole('button', { name: 'View saved workouts' }).click();
  await expect(page.getByText('YOUR NEXT SESSION, SAVED.')).toBeVisible();
});

test('small phone scrolling, bottom navigation visibility, and missing detail routes', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await enterTraining(page);
  await expect(page.getByRole('tab', { name: 'Train tab', exact: true })).toBeInViewport();
  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(horizontalOverflow).toBe(false);
  await page.getByRole('button', { name: /^Open Full Body,/ }).click();
  await expect(page.getByRole('heading', { name: 'FULL BODY' })).toBeVisible();
  await page.getByRole('button', { name: 'EXPLORE FIRST EXERCISE' }).click();
  await expect(page.getByRole('heading', { name: 'LEG PRESS' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Train tab' })).toBeInViewport();
  await page.goto('/train/workout/not-a-workout');
  await page.getByRole('button', { name: 'Explore workouts', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'TRAIN HARDER' })).toBeVisible();
  await page.goto('/train/exercise/not-an-exercise');
  await page.getByRole('button', { name: 'Open exercise library', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Search exercises' })).toBeVisible();
});
