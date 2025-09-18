
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Info, Loader2, ListChecks, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateIngredientsForRecipeAction } from '@/app/actions';
import type { GenerateIngredientsForRecipeOutput } from '@/types';

interface FunIngredient {
  name: string;
  comment: string;
}

export default function SearchRecipes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
  const [generatedIngredients, setGeneratedIngredients] = useState<FunIngredient[]>([]);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        variant: "destructive",
        title: "Empty Search",
        description: "Please enter a recipe name to generate its ingredients.",
      });
      return;
    }

    setIsLoadingIngredients(true);
    setGeneratedIngredients([]); 
    try {
      const result: GenerateIngredientsForRecipeOutput = await generateIngredientsForRecipeAction({ recipeName: searchTerm });
      setGeneratedIngredients(result.ingredients);
      if (result.ingredients.length > 0) {
        toast({
          title: "Ingredients Generated!",
          description: `Found ${result.ingredients.length} ingredient(s) for ${searchTerm} with a fun twist!`,
        });
      } else {
        toast({
          title: "No Ingredients Found",
          description: `Could not find common ingredients for ${searchTerm}. Try a different recipe name.`,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate ingredients.';
      toast({
        variant: "destructive",
        title: "Ingredient Generation Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoadingIngredients(false);
    }
  };

  return (
    <div className="my-8 p-6 bg-card rounded-lg shadow-md max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="font-headline text-2xl text-center mb-4 text-primary">Find Ingredients for a Recipe (with Flair!)</h2>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="e.g., 'pizza', 'apple pie'"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            disabled={isLoadingIngredients}
          />
          <Button onClick={handleSearch} variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoadingIngredients}>
            {isLoadingIngredients ? (
              <Loader2 size={18} className="mr-2 animate-spin" />
            ) : (
              <Sparkles size={18} className="mr-2" />
            )}
            Get Fun Ingredients
          </Button>
        </div>
      </div>

      {isLoadingIngredients && (
        <div className="flex justify-center items-center p-4">
          <Loader2 size={32} className="animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Conjuring up some fun ingredients...</p>
        </div>
      )}

      {!isLoadingIngredients && generatedIngredients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary flex items-center">
              <ListChecks size={22} className="mr-2" />
              Voilà! Ingredients for {searchTerm}:
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 font-body text-foreground">
              {generatedIngredients.map((ingredient, index) => (
                <li key={index} className="p-2 border-b border-border last:border-b-0">
                  <span className="font-semibold">{ingredient.name}:</span>
                  <em className="ml-2 text-sm text-muted-foreground">&quot;{ingredient.comment}&quot;</em>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {!isLoadingIngredients && generatedIngredients.length === 0 && searchTerm && (
         <Alert className="mt-4 border-accent/50 text-accent-foreground bg-accent/10">
          <Info className="h-4 w-4 !text-accent" />
          <AlertTitle className="font-headline !text-accent">Tip</AlertTitle>
          <AlertDescription className="!text-accent/80">
            Enter a recipe name above to see its common ingredients with a fun twist!
          </AlertDescription>
        </Alert>
      )}
       {!isLoadingIngredients && generatedIngredients.length === 0 && !searchTerm && (
         <Alert className="mt-4 border-primary/30 text-primary-foreground bg-primary/10">
          <Sparkles className="h-4 w-4 !text-primary" />
          <AlertTitle className="font-headline !text-primary">Ready for some fun?</AlertTitle>
          <AlertDescription className="!text-primary/80">
            Type in a recipe name (like &quot;cookies&quot; or &quot;spaghetti&quot;) and hit the button to get a list of ingredients with a sprinkle of personality!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

