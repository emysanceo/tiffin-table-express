import { Link } from "react-router-dom";
import { Home, Menu, Users, ShoppingBag, User } from "lucide-react";
import { motion } from "framer-motion";

interface BottomNavigationProps {
  currentPath: string;
}

const BottomNavigation = ({ currentPath }: BottomNavigationProps) => {
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Menu, label: "Menu", path: "/menu" },
    { icon: Users, label: "Social", path: "/community" },
    { icon: ShoppingBag, label: "Box", path: "/box" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="mobile-nav">
      <div className="flex items-center justify-around h-full max-w-md mx-auto px-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = currentPath === path;
          return (
            <Link
              key={path}
              to={path}
              className="relative flex flex-col items-center justify-center py-2 px-3 min-w-0"
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? "bg-primary/10" : ""
                }`}
              >
                <Icon 
                  size={20} 
                  className={`transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
              </motion.div>
              <span 
                className={`text-[10px] font-medium mt-0.5 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
