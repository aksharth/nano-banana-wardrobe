import { useState, useRef } from "react";
import { Plus, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFitRoom } from "@/context/FitRoomContext";
import { useToast } from "@/hooks/use-toast";
import { convertLocalImageToBase64 } from "@/utils/imageUtils";
// Import all clothing images from assets
import tropicalShirt from "@/assets/tropical-shirt.jpg";
import denimJacket from "@/assets/denim-jacket.jpg";
import cropTop from "@/assets/crop-top.jpg";
import clothing1 from "@/assets/513+ZlE3iFL._AC_UL480_FMwebp_QL65_.webp";
import clothing2 from "@/assets/615Wk3PiBCL._SX679_.jpg";
import clothing3 from "@/assets/61Be2unBSYL._SX679_.jpg";
import blazer from "@/assets/Black-Blazer.png";
const ClothingSelector = () => {
  const { clothingImage, setClothingImage } = useFitRoom();
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingItem, setLoadingItem] = useState<string | null>(null);
  const [showAllItems, setShowAllItems] = useState(false);

  // Create items array using all local assets
  const allClothingItems = [
    {
      id: "item1",
      name: "Tropical Print Shirt",
      type: "top" as const,
      image: tropicalShirt,
      category: "shirt"
    },
    {
      id: "item2",
      name: "Denim Jacket",
      type: "top" as const,
      image: denimJacket,
      category: "jacket"
    },
    {
      id: "item3",
      name: "Blazer",
      type: "top" as const,
      image: blazer,
      category: "shirt"
    },
    {
      id: "item4",
      name: "Compass Print Henley",
      type: "top" as const,
      image: clothing1,
      category: "henley"
    },
    {
      id: "item5",
      name: "Blue Casual Shirt",
      type: "top" as const,
      image: clothing2,
      category: "shirt"
    },
    {
      id: "item6",
      name: "Pattern Shirt",
      type: "top" as const,
      image: clothing3,
      category: "shirt"
    },
    {
      id: "item7",
      name: "Stylish Blazer",
      type: "top" as const,
      image: "https://www.tbhai.com/cdn/shop/files/Savage.jpg?v=1736355038&width=1100",
      category: "blazer"
    },
    {
      id: "item8",
      name: "Fashion Top",
      type: "top" as const,
      image: "https://zayraapparel.com/cdn/shop/files/IMG_3041.jpg?v=1755590566",
      category: "top"
    }
  ];
  
  const recentItems = showAllItems ? allClothingItems : allClothingItems.slice(0, 4);

  const handleItemSelect = async (item: any) => {
    // Set selection state
    setSelectedItem(item.id);
    
    // Show loading state
    setLoadingItem(item.id);
    
    try {
      // Try to convert the local asset image to base64
      const base64 = await convertLocalImageToBase64(item.image);
      setClothingImage(base64);
      setPreviewUrl(item.image);
      
      toast({
        title: "Item selected",
        description: `${item.name || 'Clothing item'} has been selected successfully.`,
      });
    } catch (error) {
      console.error('Failed to convert image:', error);
      
      // Fallback: Create a canvas and draw the image
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = item.image;
        });
        
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const base64 = canvas.toDataURL('image/jpeg', 0.95).split(',')[1];
          setClothingImage(base64);
          setPreviewUrl(item.image);
          
          toast({
            title: "Item selected",
            description: `${item.name || 'Clothing item'} has been selected successfully.`,
          });
        }
      } catch (fallbackError) {
        console.error('Canvas fallback failed:', fallbackError);
        // Show error toast
        toast({
          title: "Selection Error",
          description: "Failed to load the image properly. Please try uploading a file instead.",
          variant: "destructive",
        });
        setPreviewUrl(item.image);
      }
    } finally {
      setLoadingItem(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setClothingImage(base64.split(',')[1]);
        setPreviewUrl(base64);
        
        toast({
          title: "Upload successful",
          description: `${file.name} has been uploaded successfully.`,
        });
        
        // Clear selection when uploading custom image
        setSelectedItem(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with tips */}
      {/* <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Select clothes</h2>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Info className="w-4 h-4 mr-1" />
          Tips
        </Button>
      </div> */}


      {/* Upload area */}
      <div className="w-full">
          <div 
            className="border-2 border-dashed border-upload-border bg-upload-area rounded-lg text-center hover:border-fitroom-teal transition-colors cursor-pointer relative min-h-[120px] flex items-center justify-center touch-manipulation"
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <div className="w-full h-full p-4">
                <img 
                  src={previewUrl} 
                  alt="Uploaded clothing" 
                  className="w-full h-full object-contain max-h-[100px]"
                />
                <p className="text-xs text-muted-foreground mt-2">Click to change</p>
              </div>
            ) : (
              <div className="p-4">
                <Plus className="w-6 h-6 text-fitroom-teal mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">
                  Add clothes
                </p>
                <p className="text-xs text-muted-foreground">Or drag & drop here</p>
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

      {/* Recent items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">
            {showAllItems ? 'All items' : 'Select clothes or upload your own'}
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-fitroom-teal text-sm min-h-[44px] px-4"
            onClick={() => setShowAllItems(!showAllItems)}
          >
            {showAllItems ? 'Show less' : 'See all'}
          </Button>
        </div>
        
        <div className={cn(
          "grid gap-2",
          showAllItems ? "grid-cols-4" : "grid-cols-4"
        )}>
          {recentItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemSelect(item)}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all",
                selectedItem === item.id
                  ? "border-fitroom-teal"
                  : "border-transparent hover:border-fitroom-teal/50"
              )}
            >
              <img
                src={item.image}
                alt={item.name || "Clothing item"}
                className="w-full h-full object-cover"
              />
              {loadingItem === item.id && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-white" />
                </div>
              )}
              {item.name && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="text-white text-xs truncate">{item.name}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClothingSelector;