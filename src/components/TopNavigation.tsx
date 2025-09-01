import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const TopNavigation = () => {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container-padding h-16 flex items-center justify-between">
        <div className="text-xl font-bold text-gradient">
          Tiffin Table
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="hover:bg-muted">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-muted">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;