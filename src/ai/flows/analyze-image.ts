'use server';

/**
 * @fileOverview An image analysis AI agent that identifies ingredients in a photo.
 *
 * - analyzeImage - A function that handles the image analysis process.
 */

import {ai} from '@/ai/genkit';
import type { AnalyzeImageInput, AnalyzeImageOutput } from '@/types';
import { AnalyzeImageInputSchema, AnalyzeImageOutputSchema } from '@/types';


export async function analyzeImage(input: AnalyzeImageInput): Promise<AnalyzeImageOutput> {
  return analyzeImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeImagePrompt',
  input: {schema: AnalyzeImageInputSchema},
  output: {schema: AnalyzeImageOutputSchema},
  prompt: `You are an expert chef and botanist.

You will use this information to identify the ingredients in the photo.

Identify the ingredients from the photo.

Photo: {{media url=photoDataUri}}

Return the ingredients as a list of strings.
`,
});

const analyzeImageFlow = ai.defineFlow(
  {
    name: 'analyzeImageFlow',
    inputSchema: AnalyzeImageInputSchema,
    outputSchema: AnalyzeImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
