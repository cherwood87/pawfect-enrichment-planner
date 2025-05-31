
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, Library, MessageCircle, Menu, User, LogOut, CalendarDays } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile, useIsSmallMobile } from '@/hooks/use-mobile';
import { useDog } from '@/contexts/DogContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import DogSelector from '@/components/DogSelector';

interface DashboardHeaderProps {
  onChatOpen: () => void;
  onAddDogOpen: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = React.memo(
  ({ onChatOpen, onAddDogOpen }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { currentDog } = useDog();
    const { user, signOut } = useAuth();
    const isMobile = useIsMobile();
    const isSmallMobile = useIsSmallMobile();

    const handleNavigation = React.useCallback((path: string) => {
      navigate(path);
    }, [navigate]);

    const handleSignOut = async () => {
      console.log('🔐 Sign out button clicked');
      try {
        await signOut();
        toast({
          title: "Signed out",
          description: "You have been successfully signed out."
        });
      } catch (error) {
        console.error('❌ Sign out error:', error);
        toast({
          title: "Error",
          description: "Failed to sign out",
          variant: "destructive"
        });
      }
    };

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
            {/* Dog Avatar or Default Button */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {currentDog ? (
                <button
                  className="flex-shrink-0 transition-transform hover:scale-105 active:scale-95"
                  aria-label={`${currentDog.name}'s profile`}
                  onClick={() => handleNavigation('/app')}
                  tabIndex={0}
                  type="button"
                >
                  <Avatar className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-white shadow-lg">
                    <AvatarImage 
                      src={currentDog.photo || currentDog.image} 
                      alt={`${currentDog.name}'s photo`}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-orange-500 text-white font-bold text-lg sm:text-xl">
                      {currentDog.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              ) : (
                <button
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 border-2 border-white transition-transform hover:scale-105 active:scale-95"
                  aria-label="Go to Dashboard"
                  onClick={() => handleNavigation('/app')}
                  tabIndex={0}
                  type="button"
                >
                  <span className="text-white font-bold text-lg sm:text-xl drop-shadow">
                    🐕
                  </span>
                </button>
              )}

              {/* Title or Dog Name */}
              {!isSmallMobile && (
                <div className="min-w-0 flex-1">
                  {currentDog ? (
                    <div>
                      <h1 className="font-extrabold text-gray-800 truncate text-base sm:text-lg md:text-xl tracking-tight drop-shadow">
                        {currentDog.name}
                      </h1>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        {currentDog.breed}
                      </p>
                    </div>
                  ) : (
                    <h1 className="font-extrabold text-gray-800 truncate text-base sm:text-lg md:text-xl tracking-tight drop-shadow">
                      {isMobile
                        ? 'Dog Enrichment'
                        : 'Beyond Busy Dog Enrichment Planner'}
                    </h1>
                  )}
                </div>
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
                  <DropdownMenuItem
                    onClick={() => handleNavigation('/dog-profile-dashboard/weekly-plan')}
                    className={`touch-target rounded ${
                      isCurrentPage('/dog-profile-dashboard/weekly-plan')
                        ? 'bg-blue-50 text-blue-700'
                        : ''
                    }`}
                    aria-current={
                      isCurrentPage('/dog-profile-dashboard/weekly-plan') ? 'page' : undefined
                    }
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    <span>Weekly Planner</span>
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
                  <DropdownMenuItem
                    onClick={() => handleNavigation('/settings')}
                    className={`touch-target rounded ${
                      isCurrentPage('/settings')
                        ? 'bg-blue-50 text-blue-700'
                        : ''
                    }`}
                    aria-current={isCurrentPage('/settings') ? 'page' : undefined}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="touch-target rounded text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
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
