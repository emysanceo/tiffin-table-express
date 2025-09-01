import { useLocation } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <main className="mobile-safe-bottom">
        {children}
      </main>
      <BottomNavigation currentPath={location.pathname} />
    </div>
  );
};

export default Layout;