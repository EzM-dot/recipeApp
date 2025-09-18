import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Recipe } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Utensils, Leaf, AlertCircle, ImageOff, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  isLoadingIngredientImages?: boolean;
}

export default function RecipeDetailModal({ recipe, isOpen, onClose, isLoadingIngredientImages }: RecipeDetailModalProps) {
  if (!recipe) return null;

  const aiHint = recipe.name.toLowerCase().split(' ').slice(0, 2).join(' ');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-headline text-3xl text-primary">{recipe.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="aspect-[16/9] relative w-full rounded-lg overflow-hidden border border-border">
              <Image
                src={recipe.imageUrl || `https://placehold.co/800x450.png`}
                alt={recipe.name}
                fill
                className="object-cover"
                data-ai-hint={aiHint || "recipe food"}
                priority={false}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            {recipe.sourceIngredients && recipe.sourceIngredients.length > 0 && (
              <div>
                <h3 className="font-headline text-xl mb-3 flex items-center text-secondary-foreground">
                  <Leaf size={20} className="mr-2 text-primary" /> Key Ingredients
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {(recipe.ingredientImages || recipe.sourceIngredients).map((item, index) => {
                    const ingredientName = typeof item === 'string' ? item : item.name;
                    const imageUrl = typeof item === 'string' ? null : item.imageUrl;
                    const isLoadingThisImage = isLoadingIngredientImages && imageUrl === null && typeof item !== 'string';
                    const hasError = imageUrl && imageUrl.includes("?text=Error");

                    return (
                      <div key={index} className="flex flex-col items-center space-y-1 text-center">
                        <div className="w-24 h-24 relative rounded-md overflow-hidden border border-border bg-muted/30 flex items-center justify-center">
                          {isLoadingThisImage ? (
                            <Loader2 size={32} className="animate-spin text-primary" />
                          ) : imageUrl && !hasError ? (
                            <Image
                              src={imageUrl}
                              alt={ingredientName}
                              fill
                              className="object-cover"
                              data-ai-hint={ingredientName}
                              sizes="100px"
                            />
                          ) : (
                            <ImageOff size={32} className="text-muted-foreground opacity-50" />
                          )}
                        </div>
                        <p className="text-xs font-body text-muted-foreground capitalize">{ingredientName}</p>
                      </div>
                    );
                  })}
                   {isLoadingIngredientImages && (!recipe.ingredientImages || recipe.ingredientImages.length < recipe.sourceIngredients.length) &&
                    [...Array(recipe.sourceIngredients.length - (recipe.ingredientImages?.length || 0))].map((_, i) => (
                      <div key={`skel-${i}`} className="flex flex-col items-center space-y-1">
                        <Skeleton className="w-24 h-24 rounded-md" />
                        <Skeleton className="h-3 w-16 rounded-sm" />
                      </div>
                    ))
                  }
                </div>
              </div>
            )}

            <div>
              <h3 className="font-headline text-xl mb-2 flex items-center text-secondary-foreground">
                <Utensils size={20} className="mr-2 text-primary" /> Instructions
              </h3>
              <DialogDescription className="font-body whitespace-pre-line text-foreground leading-relaxed">
                {recipe.description}
              </DialogDescription>
            </div>

            <div className="p-4 bg-muted/50 rounded-md border border-border">
              <h4 className="font-headline text-md mb-1 flex items-center text-destructive">
                <AlertCircle size={18} className="mr-2" /> Disclaimer
              </h4>
              <p className="text-xs text-muted-foreground font-body">
                This recipe is AI-generated. Please use your discretion and verify cooking times, temperatures, and ingredient safety before preparation. Ingredients ni zipi is not responsible for any outcomes.
              </p>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="p-6 pt-0 border-t border-border sticky bottom-0 bg-background">
          <Button onClick={onClose} variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
