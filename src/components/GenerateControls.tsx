import { Button } from "@/components/ui/button";
import { useFitRoom } from "@/context/FitRoomContext";
import { Loader2 } from "lucide-react";

const GenerateControls = () => {
  const { 
    personImage, 
    clothingImage, 
    loading, 
    generateImage 
  } = useFitRoom();

  return (
    <div className="space-y-4">
      {/* Generate button */}
      <Button
        size="lg"
        onClick={generateImage}
        disabled={loading || !personImage || !clothingImage}
        className="w-full bg-fitroom-teal hover:bg-fitroom-teal-dark text-primary-foreground font-medium py-4 text-base rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <span className="mr-2">Generate HD</span>
            <span className="text-sm opacity-90">High Quality - 1 credit</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default GenerateControls;