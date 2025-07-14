import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Layout, 
  Code,
  Settings,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const PrimarySidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: FileText, label: "Proposals", path: "/proposals" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Layout, label: "Templates", path: "/templates" },
    { icon: Code, label: "API", path: "/api-docs" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className={cn(
        "glass-sidebar h-full transition-all duration-300 ease-smooth flex flex-col relative",
        isHovered 
          ? "w-60 absolute top-0 left-0 z-50 shadow-xl" 
          : "w-20"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
                    "flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group relative",
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
                    <span className="whitespace-nowrap font-medium">
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

export default PrimarySidebar;