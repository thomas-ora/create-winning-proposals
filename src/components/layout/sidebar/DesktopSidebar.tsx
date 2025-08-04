import React from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationItems, publicNavigationItems, bottomNavigationItems } from "./navigationItems";
import { useSidebarLogic } from "./useSidebarLogic";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface DesktopSidebarProps {
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const DesktopSidebar = ({ isHovered, onMouseEnter, onMouseLeave }: DesktopSidebarProps) => {
  const { isActive } = useSidebarLogic();
  const { user, signOut } = useAuth();
  const { profile, displayName, initials } = useUserProfile();
  const { toast } = useToast();
  
  const items = user ? navigationItems : publicNavigationItems;

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    }
  };

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
          {items.map((item) => {
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
      {user && (
        <div className="p-4 border-t border-white/10 space-y-3">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 border-2 border-white/10">
              <AvatarFallback className="bg-gradient-primary text-white text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            {isHovered && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">
                  {profile?.company_name || 'User'}
                </p>
              </div>
            )}
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center space-x-3 p-3 rounded-xl w-full text-left group",
              "text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
            )}
          >
            {React.createElement(bottomNavigationItems[0].icon, {
              className: "w-5 h-5 transition-all duration-200 group-hover:scale-110"
            })}
            {isHovered && (
              <span className="whitespace-nowrap font-medium">
                {bottomNavigationItems[0].label}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default DesktopSidebar;