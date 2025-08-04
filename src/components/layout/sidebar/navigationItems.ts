import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Layout, 
  Code,
  Settings,
  LogOut,
  LucideIcon
} from "lucide-react";

export interface NavigationItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

export const navigationItems: NavigationItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: FileText, label: "Proposals", path: "/proposals" },
  { icon: BarChart3, label: "Analytics", path: "/proposals/analytics" },
  { icon: Layout, label: "Templates", path: "/templates" },
  { icon: Code, label: "API", path: "/api-docs" },
  { icon: Settings, label: "Settings", path: "/settings/api-keys" },
];

export const bottomNavigationItems: NavigationItem[] = [
  { icon: LogOut, label: "Logout", path: "/logout" },
];

export const publicNavigationItems: NavigationItem[] = [
  { icon: Code, label: "API", path: "/api-docs" },
  { icon: Settings, label: "API Keys", path: "/settings/api-keys" },
];