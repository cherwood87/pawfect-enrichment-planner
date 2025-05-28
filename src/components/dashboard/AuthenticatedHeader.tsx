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
  return;
};
export default AuthenticatedHeader;