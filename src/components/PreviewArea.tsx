import { Download, ArrowsUpFromLine, RotateCcw, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFitRoom } from "@/context/FitRoomContext";
import modelMan from "@/assets/model-man.jpg";

const PreviewArea = () => {
  const { generatedImage, loading, error, setGeneratedImage, setError } = useFitRoom();
  return (
    <div className="bg-fitroom-gray rounded-xl p-4 h-full">
      <div className="relative h-full bg-card rounded-lg overflow-hidden">
        {/* Preview image */}
        <div className="h-full flex items-center justify-center">
          {loading && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-fitroom-teal" />
              <p className="text-muted-foreground">Generating your new look...</p>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center gap-4 p-8 max-w-md">
              <div className="rounded-full bg-destructive/10 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
              </div>
              <p className="text-center text-muted-foreground">{error}</p>
              <Button 
                variant="outline" 
                onClick={() => setError(null)}
                className="mt-2"
              >
                Dismiss
              </Button>
            </div>
          )}
          {!loading && !error && generatedImage && (
            <img
              src={generatedImage}
              alt="Generated try-on result"
              className="max-h-full max-w-full object-contain"
            />
          )}
          {!loading && !error && !generatedImage && (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              <p>Your generated image will appear here</p>
            </div>
          )}
        </div>

        {/* Controls overlay - only show when image is generated */}
        {generatedImage && (
          <div className="absolute top-4 right-4 flex gap-2">
            <Button 
              size="sm" 
              variant="secondary" 
              className="bg-background/80 backdrop-blur-sm"
              onClick={() => {
                const link = document.createElement('a');
                link.download = 'generated-outfit.png';
                link.href = generatedImage;
                link.click();
              }}
            >
              <Download className="w-4 h-4" />
            </Button>
            {/* <Button size="sm" variant="secondary" className="bg-background/80 backdrop-blur-sm">
              <ArrowsUpFromLine className="w-4 h-4" />
              Upscale
            </Button>
            <Button size="sm" variant="secondary" className="bg-background/80 backdrop-blur-sm">
              <RotateCcw className="w-4 h-4" />
            </Button> */}
            <Button 
              size="sm" 
              variant="secondary" 
              className="bg-background/80 backdrop-blur-sm text-destructive"
              onClick={() => setGeneratedImage(null)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Bottom controls - only show when image is generated */}
        {/* {generatedImage && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            <Button size="sm" variant="secondary" className="bg-background/80 backdrop-blur-sm">
              <img src={modelMan} alt="Model" className="w-6 h-6 rounded object-cover mr-2" />
            </Button>
            <Button size="sm" variant="secondary" className="bg-background/80 backdrop-blur-sm">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        )} */}

        {/* Virtual Wardrobe watermark */}
        <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-background/60 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"></path>
            <path d="M5 21h14"></path>
          </svg>
          Virtual Wardrobe
        </div>
      </div>
    </div>
  );
};

export default PreviewArea;