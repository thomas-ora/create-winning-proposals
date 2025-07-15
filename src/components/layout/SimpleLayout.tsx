import { ReactNode } from "react";

interface SimpleLayoutProps {
  children: ReactNode;
}

const SimpleLayout = ({ children }: SimpleLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
};

export default SimpleLayout;