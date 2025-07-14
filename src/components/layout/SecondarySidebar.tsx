import { Link, useLocation } from "react-router-dom";
import { 
  Plus, 
  FileText, 
  BarChart3, 
  Settings,
  Key,
  TestTube,
  BookOpen,
  Wrench
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const SecondarySidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const sections = [
    {
      title: "Quick Actions",
      items: [
        { 
          icon: Plus, 
          label: "Create Proposal", 
          path: "/proposals/create",
          description: "Start a new proposal",
          badge: "Hot"
        },
        { 
          icon: TestTube, 
          label: "Test API", 
          path: "/test-api",
          description: "Test proposal generation"
        },
      ]
    },
    {
      title: "Proposals",
      items: [
        { 
          icon: FileText, 
          label: "All Proposals", 
          path: "/proposals",
          description: "View and manage proposals"
        },
        { 
          icon: BarChart3, 
          label: "Analytics", 
          path: "/proposals/analytics",
          description: "Performance insights"
        },
      ]
    },
    {
      title: "System",
      items: [
        { 
          icon: Key, 
          label: "API Keys", 
          path: "/settings/api-keys",
          description: "Manage authentication"
        },
        { 
          icon: BookOpen, 
          label: "Documentation", 
          path: "/api-docs",
          description: "API reference"
        },
        { 
          icon: Wrench, 
          label: "Setup Guide", 
          path: "/setup",
          description: "System configuration"
        },
      ]
    }
  ];

  return (
    <div className="glass-sidebar h-full border-r border-white/10">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6">Navigation</h2>
        
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 group",
                          active
                            ? "bg-primary/10 border border-primary/20 glow-soft"
                            : "hover:bg-white/5 border border-transparent"
                        )}
                      >
                        <Icon 
                          className={cn(
                            "w-5 h-5 mt-0.5 transition-all duration-200",
                            active 
                              ? "text-primary" 
                              : "text-muted-foreground group-hover:text-foreground"
                          )} 
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={cn(
                              "text-sm font-medium transition-colors",
                              active ? "text-primary" : "text-foreground"
                            )}>
                              {item.label}
                            </p>
                            {item.badge && (
                              <Badge 
                                variant="secondary" 
                                className="ml-2 text-xs bg-gradient-primary text-white border-0"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecondarySidebar;