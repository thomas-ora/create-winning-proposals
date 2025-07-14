import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileSidebar from "./sidebar/MobileSidebar";
import DesktopSidebar from "./sidebar/DesktopSidebar";
import MobileMenuButton from "./sidebar/MobileMenuButton";

const PrimarySidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <MobileMenuButton onClick={() => setIsMobileOpen(true)} />
      )}

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isMobileOpen} 
        onClose={() => setIsMobileOpen(false)} 
      />

      {/* Desktop Sidebar */}
      <DesktopSidebar
        isHovered={isHovered}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      />
    </>
  );
};

export default PrimarySidebar;