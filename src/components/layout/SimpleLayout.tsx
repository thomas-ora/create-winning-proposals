import { ReactNode } from "react";

interface SimpleLayoutProps {
  children: ReactNode;
}

const SimpleLayout = ({ children }: SimpleLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default SimpleLayout;