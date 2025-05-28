
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AuthenticatedHeader: React.FC = () => {
  const { user, signOut } = useAuth();

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
    <div className="flex items-center justify-between bg-white/80 backdrop-blur-lg px-6 py-4 border-b-2 border-purple-200 shadow-lg">
      <div className="flex items-center space-x-3 flex-1">
        <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-2 rounded-xl">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-purple-800">Welcome back!</p>
          <p className="text-xs text-purple-600">{user?.email}</p>
        </div>
      </div>
      <Button
        onClick={handleSignOut}
        className="modern-button-outline flex items-center space-x-2 shadow-md hover:shadow-lg"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </Button>
    </div>
  );
};

export default AuthenticatedHeader;
