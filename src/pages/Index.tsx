import { useState, useEffect } from "react";
import { ArrowLeft, Download, RotateCcw } from "lucide-react";
import FitRoomHeader from "@/components/FitRoomHeader";
import ClothingSelector from "@/components/ClothingSelector";
import ModelSelector from "@/components/ModelSelector";
import GenerateControls from "@/components/GenerateControls";
import PreviewArea from "@/components/PreviewArea";
import { FitRoomProvider, useFitRoom } from "@/context/FitRoomContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const MobileLayout = () => {
  const { generatedImage } = useFitRoom();
  const [showResult, setShowResult] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (generatedImage) {
      setShowResult(true);
    }
  }, [generatedImage]);

  const handleBack = () => {
    setShowResult(false);
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'virtual-wardrobe-outfit.png';
      link.click();
    }
  };

  const handleRegenerate = () => {
    // Trigger regeneration logic
    console.log("Regenerating...");
  };

  // Mobile view with result
  if (isMobile && showResult && generatedImage) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        
        </div>
        
        <div className="flex-1 flex items-center justify-center p-4">
          <img
            src={generatedImage}
            alt="Generated outfit"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
        
        <div className="p-4 space-y-3">
          <Button
            onClick={handleDownload}
            className="w-full bg-fitroom-teal hover:bg-fitroom-teal/90"
            size="lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        
        </div>
      </div>
    );
  }

  // Mobile view - main interface
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex flex-col relative">
        <FitRoomHeader />
        
        <div className="flex-1 flex flex-col p-4 space-y-4 pb-24 overflow-y-auto">
          {/* Clothing Selector Section */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Select clothes</h2>
            <Tabs defaultValue="single" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="single">Single clothes</TabsTrigger>
                <TabsTrigger value="top-bottom">Top & bottom</TabsTrigger>
              </TabsList>
              <TabsContent value="single" className="mt-4">
                <ClothingSelector />
              </TabsContent>
              <TabsContent value="top-bottom" className="mt-4">
                <ClothingSelector />
              </TabsContent>
            </Tabs>
          </div>

          {/* Model Selector Section */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Select a model</h2>
            <p className="text-sm text-muted-foreground">
              Select our model or upload your model to try on
            </p>
            <ModelSelector />
          </div>
        </div>

        {/* Fixed Generate Button at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t px-4 pt-4 pb-safe z-50">
          <div className="pb-4">
            <GenerateControls />
          </div>
        </div>
      </div>
    );
  }

  // Desktop view (original layout)
  return (
    <div className="min-h-screen bg-background">
      <FitRoomHeader />
      
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Controls */}
        <div className="w-96 p-4 space-y-4 overflow-y-auto border-r">
          <ClothingSelector />
          <ModelSelector />
          <GenerateControls />
        </div>
        
        {/* Right Panel - Preview */}
        <div className="flex-1 p-6">
          <PreviewArea />
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <FitRoomProvider>
      <MobileLayout />
    </FitRoomProvider>
  );
};

export default Index;