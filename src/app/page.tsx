'use client';

import { useState, useEffect } from 'react';
import PhotoUploadForm from '@/components/PhotoUploadForm';
import RecipeList from '@/components/RecipeList';
import RecipeDetailModal from '@/components/RecipeDetailModal';
import SearchRecipes from '@/components/SearchRecipes';
import type { Recipe, AnalyzeImageOutput } from '@/types';
import { generateRecipesAction, generateIngredientImageAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [analyzedIngredients, setAnalyzedIngredients] = useState<string[]>([]);
  const [isGeneratingRecipeImages, setIsGeneratingRecipeImages] = useState<string | null>(null); // Tracks loading for specific recipe images
  const { toast } = useToast();

  const handleAnalysisComplete = (analysisResult: AnalyzeImageOutput) => {
    setAnalyzedIngredients(analysisResult.ingredients);
    setRecipes([]);
  };

  useEffect(() => {
    if (analyzedIngredients.length > 0) {
      const fetchRecipes = async () => {
        setIsLoadingRecipes(true);
        try {
          const recipeData = await generateRecipesAction({ ingredients: analyzedIngredients });
          const recipesWithDetails = recipeData.recipes.map(r => ({
            ...r,
            sourceIngredients: analyzedIngredients,
            imageUrl: `https://placehold.co/600x400.png`
          }));
          setRecipes(recipesWithDetails);
          if (recipesWithDetails.length === 0) {
            toast({
              title: "No Recipes Found",
              description: "We couldn't find any recipes with the identified ingredients. Try another photo!",
            });
          } else {
             toast({
              title: "Recipes Generated!",
              description: `Found ${recipesWithDetails.length} recipe(s) for you.`,
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to generate recipes.';
          toast({
            variant: "destructive",
            title: "Recipe Generation Failed",
            description: errorMessage,
          });
          setRecipes([]);
        } finally {
          setIsLoadingRecipes(false);
        }
      };
      fetchRecipes();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analyzedIngredients]);

  const handleSelectRecipe = async (recipe: Recipe) => {
    if (!recipe.sourceIngredients || recipe.sourceIngredients.length === 0) {
      setSelectedRecipe(recipe);
      return;
    }

    // If images are already fetched or being fetched for this recipe, or no source ingredients
    if (recipe.ingredientImages || isGeneratingRecipeImages === recipe.name) {
      setSelectedRecipe(recipe);
      return;
    }

    // Show modal immediately with placeholders for ingredient images
    const recipeWithPlaceholders = {
      ...recipe,
      ingredientImages: recipe.sourceIngredients.map(name => ({ name, imageUrl: null })),
    };
    setSelectedRecipe(recipeWithPlaceholders);
    setIsGeneratingRecipeImages(recipe.name);
    toast({
      title: "Fetching Ingredient Images",
      description: `Generating images for ${recipe.name}'s ingredients. This may take a moment...`,
    });

    try {
      const imagePromises = recipe.sourceIngredients.map(async (ingredientName) => {
        try {
          const result = await generateIngredientImageAction({ ingredientName });
          return { name: ingredientName, imageUrl: result.imageUrl };
        } catch (e) {
          console.error(`Failed to generate image for ${ingredientName}:`, e);
          toast({
            variant: "destructive",
            title: `Image Gen Failed for ${ingredientName}`,
            description: e instanceof Error ? e.message : "Could not generate image.",
          });
          // Use a distinct placeholder for error
          return { name: ingredientName, imageUrl: `https://placehold.co/100x100.png?text=Error` };
        }
      });
      const fetchedIngredientImages = await Promise.all(imagePromises);

      setRecipes(prevRecipes =>
        prevRecipes.map(r =>
          r.name === recipe.name
            ? { ...r, ingredientImages: fetchedIngredientImages }
            : r
        )
      );
      // Update selected recipe with fetched images if it's still the selected one
      setSelectedRecipe(prevSelected =>
        prevSelected && prevSelected.name === recipe.name
          ? { ...prevSelected, ingredientImages: fetchedIngredientImages }
          : prevSelected
      );
      toast({
        title: "Ingredient Images Ready",
        description: `Images for ${recipe.name} are loaded.`,
      });
    } catch (error) {
        // This catch is for Promise.all itself failing, which is unlikely
        // given individual errors are caught within the map.
        toast({
            variant: "destructive",
            title: "Ingredient Image Generation Failed",
            description: "An unexpected error occurred while loading ingredient images.",
        });
    } finally {
      setIsGeneratingRecipeImages(null);
    }
  };


  return (
    <div className="space-y-12">
      <PhotoUploadForm
        onAnalysisComplete={handleAnalysisComplete}
        setLoadingAnalysis={setIsLoadingAnalysis}
      />

      <Separator className="my-8" />

      <SearchRecipes />

      {(isLoadingAnalysis || isLoadingRecipes || recipes.length > 0) && (
        <section>
          <h2 className="font-headline text-3xl text-center mb-6 text-primary">
            {isLoadingAnalysis ? "Analyzing Ingredients..." : isLoadingRecipes ? "Generating Recipes..." : "Suggested Recipes"}
          </h2>
          <RecipeList
            recipes={recipes}
            isLoading={isLoadingAnalysis || isLoadingRecipes}
            onSelectRecipe={handleSelectRecipe}
          />
        </section>
      )}

      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        isLoadingIngredientImages={selectedRecipe ? isGeneratingRecipeImages === selectedRecipe.name : false}
      />
    </div>
  );
}
