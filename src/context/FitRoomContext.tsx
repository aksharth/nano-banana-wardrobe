import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface FitRoomContextType {
  personImage: string | null;
  clothingImage: string | null;
  generatedImage: string | null;
  loading: boolean;
  error: string | null;
  highQualityMode: boolean;
  setPersonImage: (image: string | null) => void;
  setClothingImage: (image: string | null) => void;
  setGeneratedImage: (image: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  generateImage: () => Promise<void>;
}

const FitRoomContext = createContext<FitRoomContextType | undefined>(undefined);

export const useFitRoom = () => {
  const context = useContext(FitRoomContext);
  if (!context) {
    throw new Error('useFitRoom must be used within a FitRoomProvider');
  }
  return context;
};

interface FitRoomProviderProps {
  children: ReactNode;
}

export const FitRoomProvider: React.FC<FitRoomProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const highQualityMode = true; // Always enabled

  const generateImage = async () => {
    if (!personImage || !clothingImage) {
      const message = "Please upload both a person's photo and a clothing item.";
      setError(message);
      toast({
        title: "Missing Images",
        description: message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      const errorMsg = 'API key is missing. Please check your environment configuration.';
      setError(errorMsg);
      toast({
        title: "Configuration Error",
        description: errorMsg,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{
        parts: [
          { text: "Create an image of the person from the first image wearing the clothing item shown in the second image. Extract only the clothing/garment from the second image, ignore the person wearing it. Focus on replicating the exact style, pattern, color, and design of the clothing item onto the person in the first image. Make sure the image is in high quality." },
          { inlineData: { mimeType: 'image/jpeg', data: personImage } },
          { inlineData: { mimeType: 'image/jpeg', data: clothingImage } },
        ],
      }],
      generationConfig: {
        responseModalities: ['IMAGE'],
      },
    };

    let response;
    for (let i = 0; i < 3; i++) {
      try {
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          break;
        } else if (response.status === 429) {
          const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `API error: ${response.status}`);
        }
      } catch (err) {
        if (i === 2) {
          setError(`Failed to generate image after multiple retries. Error: ${(err as Error).message}`);
          setLoading(false);
          return;
        }
      }
    }

    try {
      if (response) {
        const result = await response.json();
        const base64Data = result?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)?.inlineData?.data;

        if (base64Data) {
          setGeneratedImage(`data:image/png;base64,${base64Data}`);
          toast({
            title: "Success!",
            description: "Your new look has been generated successfully.",
          });
        } else {
          const errorMsg = 'Failed to generate image. Please try a different combination of images.';
          setError(errorMsg);
          toast({
            title: "Generation Failed",
            description: errorMsg,
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      const errorMsg = 'An error occurred while parsing the response. Please try again.';
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FitRoomContext.Provider
      value={{
        personImage,
        clothingImage,
        generatedImage,
        loading,
        error,
        highQualityMode,
        setPersonImage,
        setClothingImage,
        setGeneratedImage,
        setLoading,
        setError,
        generateImage,
      }}
    >
      {children}
    </FitRoomContext.Provider>
  );
};