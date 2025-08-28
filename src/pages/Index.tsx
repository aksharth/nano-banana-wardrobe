import FitRoomHeader from "@/components/FitRoomHeader";
import ClothingSelector from "@/components/ClothingSelector";
import ModelSelector from "@/components/ModelSelector";
import GenerateControls from "@/components/GenerateControls";
import PreviewArea from "@/components/PreviewArea";
import { FitRoomProvider } from "@/context/FitRoomContext";

const Index = () => {
  return (
    <FitRoomProvider>
      <div className="min-h-screen bg-background">
        <FitRoomHeader />
        
        <div className="flex h-[calc(100vh-80px)]">
          {/* Left Panel - Controls */}
          <div className="w-96 p-6 space-y-6 overflow-y-auto border-r">
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
    </FitRoomProvider>
  );
};

export default Index;
