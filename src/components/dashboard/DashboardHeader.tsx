import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Library, Menu, User, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDog } from '@/contexts/DogContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface DashboardHeaderProps {
  onChatOpen: () => void;
  onAddDogOpen: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = React.memo(({ onAddDogOpen }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { currentDog, state, setCurrentDog } = useDog();
  const { signOut } = useAuth();
  const isMobile = useIsMobile();

  const handleNavigation = React.useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({ title: 'Signed out', description: 'You have been successfully signed out.' });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({ title: 'Error', description: 'Failed to sign out', variant: 'destructive' });
    }
  };

  const isCurrentPage = (path: string) => pathname === path;

  return (
    <header
      className="sticky top-0 z-40 bg-gradient-to-r from-blue-100/90 via-white/80 to-orange-100/90 backdrop-blur-lg shadow-md border-b border-blue-100 rounded-b-xl"
      style={{ WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)' }}
      aria-label="Main dashboard header"
    >
      <div className="max-w-screen-lg mx-auto mobile-container sm:py-3 px-[70px] py-px">
        <div className="grid grid-cols-3 items-center">
          {/* Left: Brand/Home link */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => handleNavigation('/activity-library')}
              aria-label="Go to Activity Library"
              className="font-extrabold tracking-tight text-gray-800 text-sm sm:text-base hover:opacity-90 transition"
            >
              Beyond Busy
            </button>
          </div>

          {/* Center: Dog identity dropdown (single source of truth) */}
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label={currentDog ? `Switch dog from ${currentDog.name}` : 'Select a dog'}
                  className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-white/70 transition focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-white shadow">
                    <AvatarImage
                      src={currentDog?.photo || currentDog?.image}
                      alt={currentDog ? `${currentDog.name}'s photo` : 'Dog avatar'}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-muted font-bold">🐶</AvatarFallback>
                  </Avatar>
                  <span className="max-w-[140px] sm:max-w-[200px] truncate font-semibold text-gray-800">
                    {currentDog ? currentDog.name : 'Select a dog'}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="z-50 w-64 bg-background border shadow-lg rounded-xl p-1">
                {state.dogs.length > 0 ? (
                  <>
                    {state.dogs.map((dog) => (
                      <DropdownMenuItem
                        key={dog.id}
                        className="rounded flex items-center gap-2"
                        onClick={() => setCurrentDog(dog.id)}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={dog.photo || dog.image} alt={`${dog.name} avatar`} />
                          <AvatarFallback className="bg-muted">
                            {dog.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate">{dog.name}</span>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="rounded" onClick={onAddDogOpen}>
                      + Add Dog
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem className="rounded" onClick={onAddDogOpen}>
                      + Add Dog
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right: Hamburger menu */}
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size={isMobile ? 'sm' : 'default'}
                  className="touch-target rounded-full bg-white/80 shadow border hover:bg-blue-100/80 transition"
                  aria-label="Open menu"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background border shadow-lg z-50 rounded-xl mt-2">
                <DropdownMenuItem
                  onClick={() => handleNavigation('/settings')}
                  className={`touch-target rounded ${isCurrentPage('/settings') ? 'bg-blue-50 text-blue-700' : ''}`}
                  aria-current={isCurrentPage('/settings') ? 'page' : undefined}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleNavigation('/activity-library')}
                  className={`touch-target rounded ${isCurrentPage('/activity-library') ? 'bg-blue-50 text-blue-700' : ''}`}
                  aria-current={isCurrentPage('/activity-library') ? 'page' : undefined}
                >
                  <Library className="mr-2 h-4 w-4" />
                  <span>Activity Library</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="touch-target rounded text-red-600 hover:text-red-700 hover:bg-red-50">
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
});

export default DashboardHeader;
