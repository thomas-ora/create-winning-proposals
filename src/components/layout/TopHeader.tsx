import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus,
  Command
} from "lucide-react";
import { UserNav } from "./UserNav";
import { NotificationDropdown } from "./NotificationDropdown";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const TopHeader = () => {
  const { user } = useAuth();

  return (
    <header className="glass-card border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search proposals, templates..."
              className="pl-10 glass-card border-white/20 focus:border-primary/50 focus:ring-primary/20"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Badge variant="outline" className="text-xs border-white/20">
                <Command className="w-3 h-3 mr-1" />K
              </Badge>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              {/* Quick Create */}
              <Button size="sm" className="bg-gradient-primary hover:shadow-glow transition-all duration-200" asChild>
                <Link to="/proposals/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create
                </Link>
              </Button>

              {/* Notifications */}
              <NotificationDropdown />

              {/* User Navigation */}
              <UserNav />
            </>
          ) : (
            <>
              {/* Sign In Button for non-authenticated users */}
              <Button size="sm" variant="outline" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopHeader;