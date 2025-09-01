import { Link } from "react-router-dom";
import { Home, Menu, Users, ShoppingBag, User } from "lucide-react";

interface BottomNavigationProps {
  currentPath: string;
}

const BottomNavigation = ({ currentPath }: BottomNavigationProps) => {
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Menu, label: "Menu", path: "/menu" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: ShoppingBag, label: "Box", path: "/box" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="mobile-nav">
      <div className="flex items-center justify-around h-full">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = currentPath === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                isActive
                  ? "text-primary scale-110"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;