
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, Home, Library, MessageCircle, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile, useIsSmallMobile } from '@/hooks/use-mobile';
import DogSelector from '@/components/DogSelector';

interface DashboardHeaderProps {
  onChatOpen: () => void;
  onAddDogOpen: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onChatOpen, onAddDogOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const isSmallMobile = useIsSmallMobile();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isCurrentPage = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-40">
      <div className="max-w-screen-lg mx-auto mobile-container py-2 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs sm:text-sm">🐕</span>
            </div>
            {!isSmallMobile && (
              <h1 className="font-bold text-gray-800 truncate">
                {isMobile ? 'Dog Enrichment' : 'Beyond Busy Dog Enrichment Planner'}
              </h1>
            )}
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <DogSelector onAddDogOpen={onAddDogOpen} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size={isMobile ? "sm" : "default"} className="touch-target">
                  {isMobile ? <Menu className="w-4 h-4" /> : <Settings className="w-5 h-5" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border shadow-lg z-50">
                <DropdownMenuItem 
                  onClick={() => handleNavigation('/app')}
                  className={`touch-target ${isCurrentPage('/app') ? 'bg-blue-50 text-blue-700' : ''}`}
                >
                  <Home className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleNavigation('/activity-library')}
                  className={`touch-target ${isCurrentPage('/activity-library') ? 'bg-blue-50 text-blue-700' : ''}`}
                >
                  <Library className="mr-2 h-4 w-4" />
                  <span>Activity Library</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => handleNavigation('/coach')}
                  className={`touch-target ${isCurrentPage('/coach') ? 'bg-blue-50 text-blue-700' : ''}`}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  <span>Enrichment Coach</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled className="touch-target">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                  <span className="ml-auto text-xs text-gray-400">Coming Soon</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
