
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AuthenticatedHeader: React.FC = () => {
  const {
    user,
    signOut
  } = useAuth();

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

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-2">
        <User className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-700">
          {user?.email || 'User'}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </Button>
    </div>
  );
};

export default AuthenticatedHeader;
