import { ReactNode } from "react";
import PrimarySidebar from "./PrimarySidebar";
import SecondarySidebar from "./SecondarySidebar";
import TopHeader from "./TopHeader";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    // Mobile layout - single column with overlay sidebar
    return (
      <div className="min-h-screen bg-background">
        <PrimarySidebar />
        <div className="flex flex-col h-screen">
          <TopHeader />
          <main className="flex-1 overflow-auto pt-16"> {/* Add padding for mobile menu button */}
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Desktop layout - grid with fixed sidebars
  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-[80px_240px_1fr] h-screen">
        {/* Primary Sidebar - Icons only */}
        <PrimarySidebar />
        
        {/* Secondary Sidebar - Detailed navigation */}
        <SecondarySidebar />
        
        {/* Main content area */}
        <div className="flex flex-col">
          <TopHeader />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;