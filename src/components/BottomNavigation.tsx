import { Link, useLocation } from "react-router-dom";
import { Home, UtensilsCrossed, Users, ShoppingBag, User } from "lucide-react";
import { motion } from "framer-motion";

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: UtensilsCrossed, label: "Menu", path: "/menu" },
    { icon: Users, label: "Social", path: "/community" },
    { icon: ShoppingBag, label: "Box", path: "/box" },
    { icon: User, label: "Me", path: "/profile" },
  ];

  return (
    <nav className="mobile-nav">
      <div className="flex items-center justify-around h-full max-w-md mx-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = currentPath === path;
          return (
            <Link
              key={path}
              to={path}
              className="relative flex flex-col items-center justify-center py-1.5 px-4"
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`p-2 rounded-2xl transition-colors duration-200 ${
                  isActive ? "bg-primary/15" : ""
                }`}
              >
                <Icon 
                  size={22} 
                  className={`transition-colors duration-200 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </motion.div>
              <span 
                className={`text-[10px] font-medium mt-0.5 transition-colors duration-200 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-0.5 w-8 h-0.5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
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
