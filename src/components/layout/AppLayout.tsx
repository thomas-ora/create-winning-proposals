import { ReactNode } from "react";
import PrimarySidebar from "./PrimarySidebar";
import SecondarySidebar from "./SecondarySidebar";
import TopHeader from "./TopHeader";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Grid layout with fixed sidebars */}
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