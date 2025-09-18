import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Recipe } from '@/types';
import { Utensils } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onViewRecipe: () => void;
}

export default function RecipeCard({ recipe, onViewRecipe }: RecipeCardProps) {
  // Generate a simple data-ai-hint from the recipe name
  const aiHint = recipe.name.toLowerCase().split(' ').slice(0, 2).join(' ');

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <CardHeader className="p-0">
        <div className="aspect-[3/2] relative w-full">
          <Image
            src={recipe.imageUrl || `https://placehold.co/600x400.png`}
            alt={recipe.name}
            fill
            className="object-cover"
            data-ai-hint={aiHint || "food cooking"}
            priority={false}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-xl mb-2 line-clamp-2">{recipe.name}</CardTitle>
        <CardDescription className="text-sm line-clamp-3 font-body">{recipe.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={onViewRecipe} variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
          <Utensils size={18} className="mr-2" />
          View Recipe
        </Button>
      </CardFooter>
    </Card>
  );
}
