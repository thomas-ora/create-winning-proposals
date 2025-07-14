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

  // Desktop layout - flexible layout with expandable primary sidebar
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen relative">
        {/* Primary Sidebar - Expandable icons sidebar */}
        <PrimarySidebar />
        
        {/* Secondary Sidebar - Fixed detailed navigation */}
        <SecondarySidebar />
        
        {/* Main content area */}
        <div className="flex flex-col flex-1 min-w-0">
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