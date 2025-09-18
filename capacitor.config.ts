import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ingredientsnizipi.app',
  appName: 'Ingredients ni zipi',
  bundledWebRuntime: false,
  server: {
    // IMPORTANT: Replace this with the actual URL of your deployed Next.js app
    // before running 'npx cap sync'. This is just an example.
    url: "https://recipesnap-u2g05.web.app",
    cleartext: true
  }
};

export default config;
