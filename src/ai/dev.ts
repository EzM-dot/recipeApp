import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-image.ts';
import '@/ai/flows/generate-recipes.ts';
import '@/ai/flows/generate-ingredient-image-flow.ts';
import '@/ai/flows/generate-ingredients-for-recipe-flow.ts';
