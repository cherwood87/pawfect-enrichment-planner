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

const DashboardHeader: React.FC<DashboardHeaderProps> = React.memo(
  ({ onChatOpen, onAddDogOpen }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const isMobile = useIsMobile();
    const isSmallMobile = useIsSmallMobile();

    const handleNavigation = React.useCallback((path: string) => {
      navigate(path);
    }, [navigate]);

    const isCurrentPage = (path: string) => pathname === path;

    return (
      <header
        className="
          sticky top-0 z-40
          bg-gradient-to-r from-blue-100/90 via-white/80 to-orange-100/90
          backdrop-blur-lg
          shadow-md
          border-b border-blue-100
          rounded-b-xl
        "
        style={{
          WebkitBackdropFilter: 'blur(12px)',
          backdropFilter: 'blur(12px)',
        }}
        aria-label="Main dashboard header"
      >
        <div className="max-w-screen-lg mx-auto mobile-container py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <button
                className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 border-2 border-white"
                aria-label="Go to Dashboard"
                onClick={() => handleNavigation('/app')}
                tabIndex={0}
                type="button"
              >
                <span className="text-white font-bold text-lg sm:text-xl drop-shadow">
                  🐕
                </span>
              </button>
              {!isSmallMobile && (
                <h1 className="font-extrabold text-gray-800 truncate text-base sm:text-lg md:text-xl tracking-tight drop-shadow" aria-label="App title">
                  {isMobile
                    ? 'Dog Enrichment'
                    : 'Beyond Busy Dog Enrichment Planner'}
                </h1>
              )}
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <DogSelector onAddDogOpen={onAddDogOpen} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size={isMobile ? 'sm' : 'default'}
                    className="
                      touch-target
                      rounded-full
                      bg-white/80
                      shadow
                      border
                      hover:bg-blue-100/80
                      transition
                    "
                    aria-label="Open settings menu"
                  >
                    {isMobile ? (
                      <Menu className="w-5 h-5" />
                    ) : (
                      <Settings className="w-6 h-6" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white/95 border shadow-lg z-50 rounded-xl mt-2"
                >
                  <DropdownMenuItem
                    onClick={() => handleNavigation('/app')}
                    className={`touch-target rounded ${
                      isCurrentPage('/app') ? 'bg-blue-50 text-blue-700' : ''
                    }`}
                    aria-current={isCurrentPage('/app') ? 'page' : undefined}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavigation('/activity-library')}
                    className={`touch-target rounded ${
                      isCurrentPage('/activity-library')
                        ? 'bg-blue-50 text-blue-700'
                        : ''
                    }`}
                    aria-current={
                      isCurrentPage('/activity-library') ? 'page' : undefined
                    }
                  >
                    <Library className="mr-2 h-4 w-4" />
                    <span>Activity Library</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleNavigation('/coach')}
                    className={`touch-target rounded ${
                      isCurrentPage('/coach')
                        ? 'bg-blue-50 text-blue-700'
                        : ''
                    }`}
                    aria-current={isCurrentPage('/coach') ? 'page' : undefined}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <span>Enrichment Coach</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled className="touch-target">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                    <span className="ml-auto text-xs text-gray-400">
                      Coming Soon
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    );
  }
);

export default DashboardHeader;