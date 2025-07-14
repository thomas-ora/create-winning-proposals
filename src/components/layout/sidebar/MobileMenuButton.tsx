import { Menu } from "lucide-react";

interface MobileMenuButtonProps {
  onClick: () => void;
}

const MobileMenuButton = ({ onClick }: MobileMenuButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 left-4 z-50 p-3 bg-surface-1/90 backdrop-blur-md rounded-xl shadow-elegant border border-white/10 hover:bg-surface-2/90 transition-all duration-200 lg:hidden"
      aria-label="Open navigation menu"
    >
      <Menu className="w-6 h-6 text-foreground" />
    </button>
  );
};

export default MobileMenuButton;