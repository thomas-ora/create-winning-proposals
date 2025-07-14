import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Bell, 
  Settings,
  Plus,
  Command
} from "lucide-react";
import { cn } from "@/lib/utils";

const TopHeader = () => {
  const [notifications] = useState(3);

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
        <div className="flex items-center space-x-4">
          {/* Quick Create */}
          <Button size="sm" className="bg-gradient-primary hover:shadow-glow transition-all duration-200">
            <Plus className="w-4 h-4 mr-2" />
            Create
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-white/10 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
              >
                {notifications}
              </Badge>
            )}
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-white/10 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Button>

          {/* User Avatar */}
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-medium">A</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;