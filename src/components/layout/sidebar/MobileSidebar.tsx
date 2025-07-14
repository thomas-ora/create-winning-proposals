import { Link } from "react-router-dom";
import { Zap, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationItems } from "./navigationItems";
import { useSidebarLogic } from "./useSidebarLogic";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  const { isActive } = useSidebarLogic();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Mobile Sidebar */}
      <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-surface-1/95 backdrop-blur-md border-r border-white/10 flex flex-col z-50 transform transition-transform duration-300 ease-smooth shadow-2xl">
        {/* Mobile Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center glow-soft">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold gradient-text">
                OraSystems
              </h1>
              <p className="text-xs text-muted-foreground">
                Proposal Platform
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-xl sidebar-item group relative",
                      active
                        ? "bg-primary/20 text-primary glow-soft"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    
                    {active && (
                      <div className="absolute right-0 w-1 h-8 bg-gradient-primary rounded-l-lg" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile Bottom */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg" />
            <div>
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-muted-foreground">System Manager</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;