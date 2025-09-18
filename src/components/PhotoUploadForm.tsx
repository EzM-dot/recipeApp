'use client';

import type { ChangeEvent } from 'react';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, Sparkles, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { analyzeImageAction } from '@/app/actions';
import type { AnalyzeImageOutput } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadFormProps {
  onAnalysisComplete: (analysisResult: AnalyzeImageOutput) => void;
  setLoadingAnalysis: (isLoading: boolean) => void;
}

export default function PhotoUploadForm({ onAnalysisComplete, setLoadingAnalysis }: PhotoUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for Gemini Flash
        setError('Image size should not exceed 4MB.');
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !previewUrl) {
      setError('Please select an image file.');
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    setLoadingAnalysis(true);

    try {
      // The previewUrl is already a data URI (result of FileReader.readAsDataURL)
      const result = await analyzeImageAction({ photoDataUri: previewUrl });
      onAnalysisComplete(result);
      toast({
        title: "Analysis Complete",
        description: `Found ${result.ingredients.length} ingredient(s).`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during analysis.';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: errorMessage,
      });
    } finally {
      setIsAnalyzing(false);
      setLoadingAnalysis(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-center">Upload Ingredient Photo</CardTitle>
        <CardDescription className="text-center">
          Snap a picture of your ingredients, and we&apos;ll suggest recipes!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="photo-upload" className="block text-sm font-medium text-foreground">
            Choose an image
          </label>
          <Input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="file:text-sm file:font-medium file:text-primary-foreground file:bg-primary hover:file:bg-primary/90"
            disabled={isAnalyzing}
          />
        </div>

        {previewUrl && (
          <div className="mt-4 border border-border rounded-md p-2 bg-muted/50">
            <Image
              src={previewUrl}
              alt="Preview"
              width={400}
              height={300}
              className="rounded-md object-contain max-h-[300px] w-full"
            />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!selectedFile || isAnalyzing}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles size={20} className="mr-2" />
              Analyze Ingredients
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
