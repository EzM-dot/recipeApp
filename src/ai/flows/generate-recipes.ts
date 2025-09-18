'use server';

/**
 * @fileOverview Generates a list of possible recipes based on identified ingredients.
 *
 * - generateRecipes - A function that generates recipes based on ingredients.
 */

import {ai} from '@/ai/genkit';
import type { GenerateRecipesInput, GenerateRecipesOutput } from '@/types';
import { GenerateRecipesInputSchema, GenerateRecipesOutputSchema } from '@/types';


export async function generateRecipes(input: GenerateRecipesInput): Promise<GenerateRecipesOutput> {
  return generateRecipesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipesPrompt',
  input: {schema: GenerateRecipesInputSchema},
  output: {schema: GenerateRecipesOutputSchema},
  prompt: `You are a recipe expert. Given a list of ingredients, you will generate a list of possible recipes that can be made using those ingredients.

Ingredients: {{ingredients}}

Recipes:
`, // Updated prompt to be more direct
});

const generateRecipesFlow = ai.defineFlow(
  {
    name: 'generateRecipesFlow',
    inputSchema: GenerateRecipesInputSchema,
    outputSchema: GenerateRecipesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
