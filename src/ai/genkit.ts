import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This configuration conditionally initializes the Google AI plugin and a default model.
// This prevents the server from crashing on startup if the GOOGLE_API_KEY is not set.
// Instead, a clear error will be shown to the user when an AI feature is used,
// thanks to the checks in `src/app/actions.ts`.

const config: { plugins: any[]; model?: string } = {
  plugins: [],
};

if (process.env.GOOGLE_API_KEY) {
  config.plugins.push(googleAI());
  config.model = 'googleai/gemini-1.5-flash-latest';
}

export const ai = genkit(config);
