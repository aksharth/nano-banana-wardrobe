import { Crown } from "lucide-react";

const FitRoomHeader = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-card border-b">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center">
          <Crown className="w-4 h-4 text-background" />
        </div>
        <span className="text-xl font-bold text-foreground">Virtual Wardrobe</span>
      </div>
      {/* <div className="flex items-center gap-4">
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-fitroom-teal-dark transition-colors">
          <Crown className="w-4 h-4 inline mr-1" />
          Unlock Pro
        </button>
        <div className="flex items-center gap-1">
          <span className="text-primary text-lg">♦</span>
          <span className="text-sm text-muted-foreground">9</span>
        </div>
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
          A
        </div>
      </div> */}
    </header>
  );
};

export default FitRoomHeader;