import { useState } from "react";
import { Search, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import GlobalSearch from "./GlobalSearch";

const TopNavigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border/30">
        <div className="container-padding h-14 flex items-center justify-between">
          <div 
            className="text-lg font-bold text-gradient cursor-pointer" 
            onClick={() => navigate("/")}
          >
            Tiffin Table
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-9 h-9"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </Button>
            
            {user ? (
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-9 h-9"
                onClick={() => navigate("/profile")}
              >
                <User className="w-5 h-5" />
              </Button>
            ) : (
              <Button 
                variant="default" 
                size="sm"
                className="h-8 text-sm px-3"
                onClick={() => navigate("/auth")}
              >
                <LogIn className="w-4 h-4 mr-1.5" />
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default TopNavigation;
