import RecipeCard from './RecipeCard';
import type { Recipe } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Inbox } from 'lucide-react';

interface RecipeListProps {
  recipes: Recipe[];
  isLoading: boolean;
  onSelectRecipe: (recipe: Recipe) => void;
}

export default function RecipeList({ recipes, isLoading, onSelectRecipe }: RecipeListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[...Array(3)].map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center text-center text-muted-foreground">
        <Inbox size={64} className="mb-4 opacity-50" />
        <h3 className="font-headline text-2xl">No Recipes Found</h3>
        <p className="font-body">Try uploading a photo of your ingredients to discover new recipes.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {recipes.map((recipe, index) => (
        <RecipeCard key={`${recipe.name}-${index}`} recipe={recipe} onViewRecipe={() => onSelectRecipe(recipe)} />
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col space-y-3 p-4 border rounded-lg shadow-sm bg-card">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-full mt-2" />
      </div>
    </div>
  );
}
