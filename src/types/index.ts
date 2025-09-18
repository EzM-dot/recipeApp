
import { z } from 'genkit';

export interface Recipe {
  name: string;
  description: string;
  imageUrl?: string;
  sourceIngredients?: string[];
  ingredientImages?: { name: string; imageUrl: string | null }[];
}

// Types for analyzeImage flow
export const AnalyzeImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of ingredients, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type AnalyzeImageInput = z.infer<typeof AnalyzeImageInputSchema>;

export const AnalyzeImageOutputSchema = z.object({
  ingredients: z
    .array(z.string())
    .describe('A list of ingredients identified in the photo.'),
});
export type AnalyzeImageOutput = z.infer<typeof AnalyzeImageOutputSchema>;

// Types for generateRecipes flow
export const GenerateRecipesInputSchema = z.object({
  ingredients: z
    .array(z.string())
    .describe('A list of identified ingredients from the photo.'),
});
export type GenerateRecipesInput = z.infer<typeof GenerateRecipesInputSchema>;

export const GenerateRecipesOutputSchema = z.object({
  recipes: z.array(
    z.object({
      name: z.string().describe('The name of the recipe.'),
      description: z.string().describe('A short description of the recipe.'),
    })
  ).describe('A list of possible recipes based on the ingredients.'),
});
export type GenerateRecipesOutput = z.infer<typeof GenerateRecipesOutputSchema>;

// Types for generateIngredientImage flow
export const GenerateIngredientImageInputSchema = z.object({
  ingredientName: z.string().describe('The name of the ingredient to generate an image for.'),
});
export type GenerateIngredientImageInput = z.infer<typeof GenerateIngredientImageInputSchema>;

export const GenerateIngredientImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated ingredient image.'),
});
export type GenerateIngredientImageOutput = z.infer<typeof GenerateIngredientImageOutputSchema>;

// Types for generateIngredientsForRecipe flow
export const GenerateIngredientsForRecipeInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe to find ingredients for.'),
});
export type GenerateIngredientsForRecipeInput = z.infer<typeof GenerateIngredientsForRecipeInputSchema>;

export const GenerateIngredientsForRecipeOutputSchema = z.object({
  ingredients: z.array(
    z.object({
      name: z.string().describe('The name of the ingredient.'),
      comment: z.string().describe('A fun, short, and quirky comment about the ingredient.'),
    })
  ).describe('A list of common ingredients for the specified recipe, each with a fun comment.'),
});
export type GenerateIngredientsForRecipeOutput = z.infer<typeof GenerateIngredientsForRecipeOutputSchema>;

