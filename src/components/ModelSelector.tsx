import { useState, useRef, useEffect } from "react";
import { Plus, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFitRoom } from "@/context/FitRoomContext";
import { useToast } from "@/hooks/use-toast";
import { convertLocalImageToBase64 } from "@/utils/imageUtils";
import modelWoman from "@/assets/model-woman.jpg";
import modelMan from "@/assets/model-man.jpg";
import modelMan1 from "@/assets/model-male-1.webp";
import modelMan2 from "@/assets/model-male-2.webp";
import modelWoman2 from "@/assets/model-female-2.webp";
import modelWoman3 from "@/assets/model-female-3.webp";


const ModelSelector = () => {
  const { personImage, setPersonImage } = useFitRoom();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"our" | "your">("our");
  const [selectedModel, setSelectedModel] = useState<string | null>("1");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingModel, setLoadingModel] = useState<string | null>(null);

  const ourModels = [
    { id: "1", image: modelWoman, name: "Female Model 1" },
    { id: "2", image: modelMan, name: "Male Model 1" },
    { id: "3", image: modelMan1, name: "Male Model 2" },
    { id: "4", image: modelMan2, name: "Male Model 3" },
    { id: "5", image: modelWoman2, name: "Female Model 2" },
    { id: "6", image: modelWoman3, name: "Female Model 3" },
  ];

  // Initialize the first model on component mount
  useEffect(() => {
    if (activeTab === "our" && selectedModel && !personImage) {
      const model = ourModels.find(m => m.id === selectedModel);
      if (model) {
        handleModelSelect(model);
      }
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPersonImage(base64.split(',')[1]);
        setPreviewUrl(base64);
        
        toast({
          title: "Upload successful",
          description: `${file.name} has been uploaded successfully.`,
        });
        
        // Clear selection when uploading custom model
        setSelectedModel(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModelSelect = async (model: any) => {
    setSelectedModel(model.id);
    setLoadingModel(model.id);
    
    try {
      // Convert the actual model image to base64
      const base64 = await convertLocalImageToBase64(model.image);
      setPersonImage(base64);
      setPreviewUrl(model.image);
      
      toast({
        title: "Model selected",
        description: `${model.name} has been selected successfully.`,
      });
    } catch (error) {
      console.error('Failed to convert model image:', error);
      
      // Fallback: Try canvas-based conversion
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = model.image;
        });
        
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const base64 = canvas.toDataURL('image/jpeg', 0.95).split(',')[1];
          setPersonImage(base64);
          setPreviewUrl(model.image);
          
          toast({
            title: "Model selected",
            description: `${model.name} has been selected successfully.`,
          });
        }
      } catch (fallbackError) {
        console.error('Canvas fallback failed:', fallbackError);
        toast({
          title: "Selection Error",
          description: "Failed to load the model image properly. Please try uploading a custom image.",
          variant: "destructive",
        });
        setPreviewUrl(model.image);
      }
    } finally {
      setLoadingModel(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with tips */}
      {/* <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Select a model</h2>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Info className="w-4 h-4 mr-1" />
          Tips
        </Button>
      </div> */}

      {/* <p className="text-sm text-muted-foreground">
        Select our model or upload your model to try on
      </p> */}

      {/* Tabs */}
      <div className="flex bg-fitroom-gray rounded-lg p-1">
        <button
          onClick={() => setActiveTab("our")}
          className={cn(
            "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
            activeTab === "our"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Our models
        </button>
        <button
          onClick={() => setActiveTab("your")}
          className={cn(
            "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
            activeTab === "your"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Your models
        </button>
        <Button variant="ghost" size="sm" className="ml-2 text-muted-foreground">
          All
        </Button>
      </div>

      {/* Models grid */}
      <div className="grid grid-cols-4 gap-2">
        {activeTab === "our" ? (
          <>
            <div 
              className="border-2 border-dashed border-upload-border bg-upload-area rounded-lg aspect-[3/4] flex flex-col items-center justify-center hover:border-fitroom-teal transition-colors cursor-pointer relative overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl && activeTab === "our" && !selectedModel ? (
                <img 
                  src={previewUrl} 
                  alt="Uploaded model" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <>
                  <Plus className="w-6 h-6 text-fitroom-teal mb-1" />
                  <p className="text-xs text-muted-foreground text-center">Upload</p>
                </>
              )}
            </div>
            {ourModels.map((model) => (
              <div
                key={model.id}
                onClick={() => handleModelSelect(model)}
                className={cn(
                  "relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer border-2 transition-all",
                  selectedModel === model.id
                    ? "border-fitroom-teal"
                    : "border-transparent hover:border-fitroom-teal/50"
                )}
              >
                <img
                  src={model.image}
                  alt={model.name}
                  className="w-full h-full object-cover"
                />
                {loadingModel === model.id && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="text-white text-xs">{model.name}</p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="col-span-4 text-center py-8">
            <div 
              className="border-2 border-dashed border-upload-border bg-upload-area rounded-lg p-8 cursor-pointer hover:border-fitroom-teal transition-colors mx-auto max-w-md"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Uploaded model" 
                  className="w-full h-48 object-contain"
                />
              ) : (
                <div className="text-muted-foreground">
                  <Plus className="w-8 h-8 mx-auto mb-2" />
                  <p>Upload your first model to get started</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default ModelSelector;