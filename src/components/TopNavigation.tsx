import { Search, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const TopNavigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container-padding h-14 flex items-center justify-between">
        <div className="text-lg font-bold text-gradient" onClick={() => navigate("/")}>
          Tiffin Table
        </div>
        
        <div className="flex items-center space-x-2">
          {user ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-muted w-9 h-9"
              onClick={() => navigate("/profile")}
            >
              <User className="w-5 h-5" />
            </Button>
          ) : (
            <Button 
              variant="default" 
              size="sm"
              className="h-8 text-sm"
              onClick={() => navigate("/auth")}
            >
              <LogIn className="w-4 h-4 mr-1.5" />
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
