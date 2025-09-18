'use server';

import { analyzeImage as analyzeImageFlow } from '@/ai/flows/analyze-image';
import { generateRecipes as generateRecipesFlow } from '@/ai/flows/generate-recipes';
import { generateIngredientImage as generateIngredientImageFlow } from '@/ai/flows/generate-ingredient-image-flow';
import { generateIngredientsForRecipe as generateIngredientsForRecipeFlow } from '@/ai/flows/generate-ingredients-for-recipe-flow';
import type {
  AnalyzeImageInput,
  AnalyzeImageOutput,
  GenerateRecipesInput,
  GenerateRecipesOutput,
  GenerateIngredientImageInput,
  GenerateIngredientImageOutput,
  GenerateIngredientsForRecipeInput,
  GenerateIngredientsForRecipeOutput
} from '@/types';

function ensureApiKey() {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('The Google AI API key is not configured. Please set the GOOGLE_API_KEY environment variable in the .env file.');
  }
}

export async function analyzeImageAction(input: AnalyzeImageInput): Promise<AnalyzeImageOutput> {
  ensureApiKey();
  try {
    const result = await analyzeImageFlow(input);
    return result;
  } catch (error) {
    console.error('Error in analyzeImageAction:', error);
    throw new Error('Failed to analyze image. Please try again.');
  }
}

export async function generateRecipesAction(input: GenerateRecipesInput): Promise<GenerateRecipesOutput> {
  ensureApiKey();
  try {
    const result = await generateRecipesFlow(input);
    return result;
  } catch (error) {
    console.error('Error in generateRecipesAction:', error);
    throw new Error('Failed to generate recipes. Please try again.');
  }
}

export async function generateIngredientImageAction(input: GenerateIngredientImageInput): Promise<GenerateIngredientImageOutput> {
  ensureApiKey();
  try {
    const result = await generateIngredientImageFlow(input);
    return result;
  } catch (error) {
    console.error('Error in generateIngredientImageAction:', error);
    // It's important to provide a more specific error message if possible
    const errorMessage = error instanceof Error ? error.message : 'Unknown error generating ingredient image.';
    throw new Error(`Failed to generate image for ${input.ingredientName}: ${errorMessage}`);
  }
}

export async function generateIngredientsForRecipeAction(input: GenerateIngredientsForRecipeInput): Promise<GenerateIngredientsForRecipeOutput> {
  ensureApiKey();
  try {
    const result = await generateIngredientsForRecipeFlow(input);
    return result;
  } catch (error)
 {
    console.error('Error in generateIngredientsForRecipeAction:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error generating ingredients for recipe.';
    throw new Error(`Failed to generate ingredients for ${input.recipeName}: ${errorMessage}`);
  }
}
