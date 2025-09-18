
'use server';
/**
 * @fileOverview Generates a list of common ingredients for a given recipe name, adding a fun comment to each.
 *
 * - generateIngredientsForRecipe - A function that generates ingredients based on a recipe name.
 * - GenerateIngredientsForRecipeInput - The input type for the generateIngredientsForRecipe function.
 * - GenerateIngredientsForRecipeOutput - The return type for the generateIngredientsForRecipe function.
 */

import {ai} from '@/ai/genkit';
import type { GenerateIngredientsForRecipeInput, GenerateIngredientsForRecipeOutput } from '@/types';
import { GenerateIngredientsForRecipeInputSchema, GenerateIngredientsForRecipeOutputSchema } from '@/types';

export async function generateIngredientsForRecipe(input: GenerateIngredientsForRecipeInput): Promise<GenerateIngredientsForRecipeOutput> {
  return generateIngredientsForRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateIngredientsForRecipePrompt',
  input: {schema: GenerateIngredientsForRecipeInputSchema},
  output: {schema: GenerateIngredientsForRecipeOutputSchema},
  prompt: `You are an expert chef with a playful personality. Given the name of a recipe, list the common ingredients needed to make it.
For each ingredient, provide its name and a very short, fun, and quirky comment about it.

Recipe Name: {{recipeName}}

Return the ingredients as a list of objects, where each object has a "name" field (string) for the ingredient and a "comment" field (string) for your fun remark.
Example for "Pancakes":
[
  { "name": "Flour", "comment": "The fluffy foundation!" },
  { "name": "Eggs", "comment": "Don't be chicken to use 'em!" },
  { "name": "Milk", "comment": "Got milk? You'll need it!" }
]
`,
});

const generateIngredientsForRecipeFlow = ai.defineFlow(
  {
    name: 'generateIngredientsForRecipeFlow',
    inputSchema: GenerateIngredientsForRecipeInputSchema,
    outputSchema: GenerateIngredientsForRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

