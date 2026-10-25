import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const require = createRequire(import.meta.url);
const project = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const minimum = project.config.iosMinimumXcode;
const sdk = require('expo/package.json').version.split('.')[0];

if (process.platform !== 'darwin') {
  console.error('Local iOS builds require macOS and Xcode. Use npm run start:go for the phone demo.');
  process.exit(1);
}

const result = spawnSync('xcodebuild', ['-version'], { encoding: 'utf8' });
const installed = result.stdout?.match(/^Xcode\s+(\d+(?:\.\d+){0,2})/m)?.[1];
if (result.error || result.status !== 0 || !installed) {
  console.error('Unable to read the selected Xcode version.');
  console.error(result.stderr?.trim() || result.error?.message || 'Select a full Xcode installation in Xcode → Settings → Locations → Command Line Tools.');
  console.error('\nFor the prototype demo without compiling native code: npm run ios');
  process.exit(1);
}

const actual = installed.split('.').map(Number);
const required = minimum.split('.').map(Number);
let compatible = true;
for (let index = 0; index < 3; index++) {
  const difference = (actual[index] ?? 0) - (required[index] ?? 0);
  if (difference !== 0) { compatible = difference > 0; break; }
}

if (!compatible) {
  console.error(`\nXcode ${installed} cannot compile this Expo SDK ${sdk} project.`);
  console.error(`Required: Xcode ${minimum} or newer.`);
  console.error('Older Swift compilers fail in ExpoModulesJSI (including errors about "weak let").');
  console.error('\nTo demo immediately in the iOS simulator: npm run ios');
  console.error('For a physical phone: npm run start:go, then scan the QR code in Expo Go.');
  console.error('\nTo compile a standalone native app:');
  console.error('1. Install a compatible Xcode release.');
  console.error('2. Select it in Xcode → Settings → Locations → Command Line Tools.');
  console.error('3. Run npm run ios:build again.');
  console.error('\nExpo requirements: https://docs.expo.dev/versions/v57.0.0/#support-for-android-and-ios-versions\n');
  process.exit(1);
}

console.log(`Xcode ${installed} meets Expo SDK ${sdk}'s minimum (${minimum}).`);
