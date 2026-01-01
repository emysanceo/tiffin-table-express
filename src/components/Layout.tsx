import { useLocation } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";
import TopNavigation from "./TopNavigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden max-w-screen">
      <TopNavigation />
      <main className="mobile-safe-bottom overflow-x-hidden">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;
