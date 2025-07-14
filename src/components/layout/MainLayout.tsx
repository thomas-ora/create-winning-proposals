import React, { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Layout, 
  Code,
  Settings,
  Zap,
  Search,
  Bell,
  User,
  Menu,
  Plus,
  Command,
  ChevronRight,
  Key,
  TestTube,
  Cog,
  BookOpen,
  GitCompare,
  FolderOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

interface NavItem {
  icon: any;
  label: string;
  path: string;
  badge?: string;
  children?: NavItem[];
}

interface BreadcrumbItem {
  label: string;
  path?: string;
}

const MainLayout = ({ children, title, description }: MainLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications] = useState(3);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { 
      icon: LayoutDashboard, 
      label: "Dashboard", 
      path: "/" 
    },
    { 
      icon: FileText, 
      label: "Proposals", 
      path: "/proposals",
      children: [
        { icon: Plus, label: "Create New", path: "/proposals/create" },
        { icon: FolderOpen, label: "View All", path: "/proposals" },
        { icon: GitCompare, label: "Compare", path: "/proposals/compare" },
      ]
    },
    { 
      icon: Layout, 
      label: "Templates", 
      path: "/templates" 
    },
    { 
      icon: BarChart3, 
      label: "Analytics", 
      path: "/analytics" 
    },
    { 
      icon: Code, 
      label: "API", 
      path: "/api-docs",
      children: [
        { icon: BookOpen, label: "Documentation", path: "/api-docs" },
        { icon: TestTube, label: "Test API", path: "/test-api" },
        { icon: Key, label: "API Keys", path: "/settings/api-keys" },
      ]
    },
    { 
      icon: Settings, 
      label: "Settings", 
      path: "/setup",
      children: [
        { icon: Cog, label: "System Setup", path: "/setup" },
        { icon: Key, label: "API Keys", path: "/settings/api-keys" },
      ]
    },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const isChildActive = (item: NavItem): boolean => {
    if (isActive(item.path)) return true;
    if (item.children) {
      return item.children.some(child => isActive(child.path));
    }
    return false;
  };

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Dashboard", path: "/" }];

    if (pathSegments.length === 0) return [];

    // Handle specific routes
    if (pathSegments[0] === 'proposals') {
      breadcrumbs.push({ label: "Proposals", path: "/proposals" });
      
      if (pathSegments[1] === 'create') {
        breadcrumbs.push({ label: "Create New" });
      } else if (pathSegments[1] === 'compare') {
        breadcrumbs.push({ label: "Compare" });
      } else if (pathSegments[1] && pathSegments[2] === 'analytics') {
        breadcrumbs.push({ label: "Analytics" });
      }
    } else if (pathSegments[0] === 'templates') {
      breadcrumbs.push({ label: "Templates" });
    } else if (pathSegments[0] === 'api-docs') {
      breadcrumbs.push({ label: "API Documentation" });
    } else if (pathSegments[0] === 'test-api') {
      breadcrumbs.push({ label: "API", path: "/api-docs" });
      breadcrumbs.push({ label: "Test API" });
    } else if (pathSegments[0] === 'settings' && pathSegments[1] === 'api-keys') {
      breadcrumbs.push({ label: "Settings", path: "/setup" });
      breadcrumbs.push({ label: "API Keys" });
    } else if (pathSegments[0] === 'setup') {
      breadcrumbs.push({ label: "System Setup" });
    } else if (pathSegments[0] === 'proposal' || pathSegments[0] === 'p') {
      breadcrumbs.push({ label: "Proposals", path: "/proposals" });
      breadcrumbs.push({ label: "View Proposal" });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const NavContent = () => (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isChildActive(item);
        
        return (
          <div key={item.path}>
            <Link
              to={item.path}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
            
            {/* Sub-navigation */}
            {item.children && active && (
              <div className="ml-4 mt-1 space-y-1">
                {item.children.map((child) => {
                  const ChildIcon = child.icon;
                  const childActive = isActive(child.path);
                  
                  return (
                    <Link
                      key={child.path}
                      to={child.path}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                        childActive
                          ? "bg-primary/5 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ChildIcon className="w-3 h-3" />
                      <span>{child.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Mobile menu + Logo */}
          <div className="flex items-center space-x-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-background/95 backdrop-blur">
                <div className="flex items-center space-x-2 pb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">OraSystems</h2>
                    <p className="text-xs text-muted-foreground">ProposalCraft</p>
                  </div>
                </div>
                <NavContent />
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg">OraSystems</h1>
                <p className="text-xs text-muted-foreground -mt-1">ProposalCraft</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isChildActive(item);
              
              if (item.children) {
                return (
                  <DropdownMenu key={item.path}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={active ? "secondary" : "ghost"}
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur border">
                      <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <DropdownMenuItem key={child.path} asChild>
                            <Link to={child.path} className="flex items-center space-x-2">
                              <ChildIcon className="w-4 h-4" />
                              <span>{child.label}</span>
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return (
                <Button
                  key={item.path}
                  variant={active ? "secondary" : "ghost"}
                  size="sm"
                  asChild
                >
                  <Link to={item.path} className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                </Button>
              );
            })}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="w-64 pl-10 pr-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Badge variant="outline" className="text-xs">
                  <Command className="w-3 h-3 mr-1" />K
                </Badge>
              </div>
            </div>

            {/* Quick Create */}
            <Button size="sm" onClick={() => navigate('/proposals/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              {notifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur border" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings/api-keys">API Keys</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/setup">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {crumb.path ? (
                    <Link 
                      to={crumb.path} 
                      className="hover:text-foreground transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-foreground font-medium">{crumb.label}</span>
                  )}
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      {(title || description) && (
        <div className="border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="space-y-2">
              {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
              {description && <p className="text-muted-foreground">{description}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;