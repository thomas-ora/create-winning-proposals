import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationItems } from "./navigationItems";
import { useSidebarLogic } from "./useSidebarLogic";

interface DesktopSidebarProps {
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const DesktopSidebar = ({ isHovered, onMouseEnter, onMouseLeave }: DesktopSidebarProps) => {
  const { isActive } = useSidebarLogic();

  return (
    <div
      className={cn(
        "sidebar-container transition-all duration-300 ease-smooth will-change-transform",
        "hidden lg:flex flex-col", // Only show on desktop, flex column layout
        "fixed left-0 top-0 h-full z-40", // Fixed positioning for proper expansion
        isHovered 
          ? "sidebar-expanded shadow-2xl" 
          : "sidebar-collapsed"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center glow-soft">
            <Zap className="w-6 h-6 text-white" />
          </div>
          {isHovered && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold gradient-text whitespace-nowrap">
                OraSystems
              </h1>
              <p className="text-xs text-muted-foreground whitespace-nowrap">
                Proposal Platform
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-xl sidebar-item group relative",
                    active
                      ? "bg-primary/20 text-primary glow-soft"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <Icon 
                    className={cn(
                      "w-5 h-5 transition-all duration-200",
                      active ? "scale-110" : "group-hover:scale-110"
                    )} 
                  />
                  {isHovered && (
                    <span className={cn(
                      "whitespace-nowrap font-medium sidebar-text-fade",
                      isHovered && "sidebar-text-fade-show"
                    )}>
                      {item.label}
                    </span>
                  )}
                  
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute right-0 w-1 h-8 bg-gradient-primary rounded-l-lg" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg" />
          {isHovered && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-muted-foreground">System Manager</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;