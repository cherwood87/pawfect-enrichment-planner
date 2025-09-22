import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Settings, User, Sparkles } from 'lucide-react';
import FloatingChatButton from '@/components/dashboard/FloatingChatButton';
import ChatModal from '@/components/chat/ChatModal';
const SimpleNavigation: React.FC = () => {
  const {
    user,
    signOut
  } = useAuth();
  const {
    isActive,
    tier
  } = useSubscription();
  const navigate = useNavigate();
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  const getUserInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };
  return <>
      {/* Simple header navigation */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">Beyond Busy </span>
            </Link>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              {user ? <>
                  {/* Activity Library Link */}
                  <Link to="/activity-library">
                    <Button variant="ghost" size="sm">
                      Activity Library
                    </Button>
                  </Link>

                  {/* Subscription Status */}
                  {isActive && <div className="hidden sm:flex items-center px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                      ✨ Premium
                    </div>}

                  {/* User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getUserInitials(user.email || 'U')}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                          {isActive && <p className="text-xs text-primary">Premium Member</p>}
                        </div>
                      </div>
                      <div className="border-t my-1" />
                      <DropdownMenuItem onClick={() => navigate('/settings')}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      {!isActive && <DropdownMenuItem onClick={() => navigate('/subscribe')}>
                          <Sparkles className="mr-2 h-4 w-4" />
                          <span>Upgrade to Premium</span>
                        </DropdownMenuItem>}
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </> : <>
                  <Link to="/auth">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link to="/subscribe">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </>}
            </div>
          </div>
        </div>
      </header>

      {/* Floating Chat Button for authenticated users */}
      {user && <>
          <FloatingChatButton onChatOpen={() => setIsChatModalOpen(true)} />
          <ChatModal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} />
        </>}
    </>;
};
export default SimpleNavigation;