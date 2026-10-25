# Muscle Massacre

A React Native, Expo SDK 57 and TypeScript mobile prototype for the Maidenhead gym. The design uses the gym’s real logo and photography, deep black surfaces, purple lighting, Barlow Condensed display type and Inter body text.

## Demo on a phone

```sh
npm install
npm run start:go
```

Open the QR code in **Expo Go** on iOS or Android. Keep the phone and development computer on the same Wi-Fi. SDK 57 is used for the current physical-device Expo Go release. All app images, fonts and mock training data are packaged locally. Once the app bundle has loaded, the training content needs no API or account.

If local Wi-Fi blocks discovery, run `npx expo start --tunnel` and follow Expo’s prompt to install its tunnel helper.

For the iOS simulator, run `npm run ios`. This explicitly launches **Expo Go** and does not compile Pods.

## Compiling a standalone iOS app

Expo SDK 57 requires **Xcode 26.4 or newer**. This computer currently has Xcode 26.0.1, which cannot compile the Swift code in `ExpoModulesJSI`. The build log shows errors such as `'weak' must be a mutable variable`; Reanimated compilation messages are not the failing target.

Run `npm run ios:check` to check the selected compiler. For an actual native build, install a compatible Xcode release, select it under **Xcode → Settings → Locations → Command Line Tools**, then run:

```sh
npm run ios:build
```

This command checks Xcode before compiling, so an unsupported compiler fails with an explanation instead of a long Pod build ending in code 65. The phone and simulator Expo Go demos do not require compiling the app. See [Expo’s SDK 57 requirements](https://docs.expo.dev/versions/v57.0.0/#support-for-android-and-ios-versions).

## Browser preview

For a browser demonstration without development overlays:

```sh
npm run export:web
npm run preview
```

Open **http://localhost:4173**. The preview command also prints a local network address that a phone on the same Wi-Fi can open. The desktop browser keeps the app in a centred mobile canvas. This is a static preview server; it provides no backend or account integration.

## Suggested client walkthrough

1. Start with the four-step introduction: **Built different → Member or explorer → Training focus → Personal welcome**.
2. Choose **I’m a member**, then tap **Try the demo member** (Alex / DEMO-1042), or enter a sample name and gym ID. IDs are not verified. Guests can select **Explore the app** without an ID. Choose Push, Pull or Legs to set the featured workout.
3. Home greets the profile by name and shows an explicitly labelled capacity snapshot. Member previews also show an example status and past-seven-day visit count.
4. In **Membership**, inspect the preview member card, example active status, seven-day check-in calendar and visit-history sheet. Guest membership screens keep the website link and a route into member setup.
5. Open **Push Day** and browse its six ordered movements.
6. Open **Incline Chest Press**, scroll through the movement guide and open the clearly labelled video placeholder. Use **Next movement** or the back arrow.
7. Switch to **Exercise Library**. Search by exercise, muscle or equipment, and combine the search with muscle filters.
8. Bookmark a workout and open the saved-workout sheet. Choices persist on the device.
9. Open **More → Replay the introduction** to restart the presentation.


The four persistent bottom tabs are **Home | Train | Membership | More**. Home is the default landing screen. Member status, occupancy and visits are explicitly labelled concept fixtures; there is no verified membership, invented membership benefit, price or working access pass.

## Scope and content

Five concept workouts and 18 exercises live in [`src/data/training.ts`](src/data/training.ts). The Push Day sequence matches the brief. All programmes, sets, reps, rest periods and technique text are illustrative concept data, not gym-approved training advice. Equipment types are examples, not a claim of availability. Gym atmosphere and illustrative exercise photography are identified on detail screens.

There are no class or personal training bookings, social feeds, progress charts, body measurements, payments, sign-up screens or backend calls. AsyncStorage stores the selected training focus, onboarding completion, saved workout IDs and the unverified demo profile (member/guest choice, entered first name and member ID) on the current device. No ID lookup or attendance integration exists. Capacity, example membership status and relative visit fixtures are kept separately in `src/data/membership.ts`. Visit dates follow Europe/London calendar days, including clock changes.

## Development and verification

```sh
npm run typecheck
npm run lint
npm run test:unit
npm run test:e2e
npx expo export --platform all
```

The ten Playwright scenarios cover member and guest onboarding, validation, personalised Home, storage migration, profile switching, capacity explanations, example visits, motion-enabled transitions and the original training flows. Four unit checks cover London calendar dates across daylight-saving and year boundaries, visit consistency and profile initials. Screenshots are written to `artifacts/`.

Tests use installed Google Chrome on macOS. Elsewhere, run `npx playwright install chromium` first. The test command starts Expo if no development server is already running on port 8081.

Native JavaScript bundles are checked by exporting iOS and Android alongside web. The updated Home and capacity sheet have been visually verified in Expo Go on the iPhone 17 Pro Max simulator (iOS 26.0). A standalone native build and physical-device UI test have not been completed. Expo Doctor passes the project/dependency checks, but reports that this computer’s Xcode 26.0.1 is older than SDK 57’s native-build minimum of 26.4. Use Expo Go for this demo, or update Xcode before compiling a standalone iOS app.

## Project structure

- `src/app/` — Expo Router onboarding, bottom tabs and nested training screens.
- `src/components/` — cards, buttons, typography, transitions and reusable states.
- `src/state/` — device preferences, bookmarks and reduced-motion support.
- `src/data/` — typed training content, profile types and isolated capacity/membership/attendance fixtures.
- `src/theme/` — colours and typography.
- `assets/` — bundled imagery; see [`SOURCES.md`](assets/SOURCES.md) for attribution and research.
- `tests/` — phone-sized interaction tests.

Press feedback includes native haptics. Safe areas, Android hardware back navigation, iOS stack gestures and the system’s reduced-motion preference are supported.
