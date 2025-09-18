'use server';
/**
 * @fileOverview Generates an image for a given ingredient.
 *
 * - generateIngredientImage - A function that generates an image for a single ingredient.
 * - GenerateIngredientImageInput - The input type for the generateIngredientImage function.
 * - GenerateIngredientImageOutput - The return type for the generateIngredientImage function.
 */

import {ai} from '@/ai/genkit';
import type { GenerateIngredientImageInput, GenerateIngredientImageOutput } from '@/types';
import { GenerateIngredientImageInputSchema, GenerateIngredientImageOutputSchema } from '@/types';

export async function generateIngredientImage(input: GenerateIngredientImageInput): Promise<GenerateIngredientImageOutput> {
  return generateIngredientImageFlow(input);
}

const generateIngredientImageFlow = ai.defineFlow(
  {
    name: 'generateIngredientImageFlow',
    inputSchema: GenerateIngredientImageInputSchema,
    outputSchema: GenerateIngredientImageOutputSchema,
  },
  async (input) => {
    const promptString = `Generate a photorealistic image of a single ripe ${input.ingredientName} on a clean, plain white background. The ingredient should be clearly visible and well-lit. Focus solely on the ingredient itself.`;
    
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: promptString,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (media && media.url) {
      return { imageUrl: media.url };
    }
    throw new Error('Image generation failed or no image URL returned.');
  }
);
