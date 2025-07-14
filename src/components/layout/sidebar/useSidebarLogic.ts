import { useLocation } from "react-router-dom";

export const useSidebarLogic = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return { isActive, currentPath: location.pathname };
};