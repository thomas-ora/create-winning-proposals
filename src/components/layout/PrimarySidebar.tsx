import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Layout, 
  Code,
  Settings,
  Zap,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const PrimarySidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: FileText, label: "Proposals", path: "/proposals" },
    { icon: BarChart3, label: "Analytics", path: "/proposals/analytics" },
    { icon: Layout, label: "Templates", path: "/templates" },
    { icon: Code, label: "API", path: "/api-docs" },
    { icon: Settings, label: "Settings", path: "/settings/api-keys" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // Mobile overlay backdrop
  if (isMobile && isMobileOpen) {
    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
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
              onClick={() => setIsMobileOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
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
  }

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-4 left-4 z-50 p-3 bg-surface-1/90 backdrop-blur-md rounded-xl shadow-elegant border border-white/10 hover:bg-surface-2/90 transition-all duration-200 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>
      )}

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "glass-sidebar h-full flex flex-col relative transition-all duration-300 ease-smooth will-change-transform",
          "hidden lg:flex", // Only show on desktop
          isHovered 
            ? "w-60 shadow-2xl z-50" 
            : "w-20"
        )}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        style={{
          transform: isHovered ? 'translateX(0)' : 'translateX(0)',
        }}
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
          {navItems.map((item) => {
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
    </>
  );
};

export default PrimarySidebar;