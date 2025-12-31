import { useLocation } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";
import TopNavigation from "./TopNavigation";
import FloatingActionButton from "./FloatingActionButton";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden max-w-screen">
      <TopNavigation />
      <main className="mobile-safe-bottom overflow-x-hidden">
        {children}
      </main>
      <BottomNavigation currentPath={location.pathname} />
      <FloatingActionButton />
    </div>
  );
};

export default Layout;
