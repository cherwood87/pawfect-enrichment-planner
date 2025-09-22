
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Dog, Shield } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ChatModal from '@/components/chat/ChatModal';
import AccountTab from '@/components/settings/AccountTab';
import DogsTab from '@/components/settings/DogsTab';
import ProfileTab from '@/components/settings/ProfileTab';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';

const AccountSettings = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    // Default to 'dogs' tab if no tab specified or if coming from dogs route
    return searchParams.get('tab') || 'dogs';
  });

  // Update tab when URL changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['dogs', 'account', 'profile'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleChatOpen = useCallback(() => setIsChatOpen(true), []);
  const handleChatClose = useCallback(() => setIsChatOpen(false), []);
  const handleAddDogOpen = useCallback(() => {
    // Already on the dogs tab, just ensure it's active
    setActiveTab('dogs');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50">
      <DashboardHeader onChatOpen={handleChatOpen} onAddDogOpen={handleAddDogOpen} />
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        
        <Breadcrumbs />

        {/* Main Content */}
        <Card className="border-2 border-purple-200 rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-cyan-100 rounded-t-3xl">
            <CardTitle className="text-2xl font-bold text-purple-800 flex items-center space-x-2">
              <Shield className="w-6 h-6" />
              <span>Profile & Settings</span>
            </CardTitle>
            <CardDescription className="text-purple-600">
              Manage your dogs, account, and preferences
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-purple-100 rounded-2xl p-1">
                <TabsTrigger 
                  value="dogs"
                  className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
                >
                  <Dog className="w-4 h-4" />
                  <span className="hidden sm:inline">My Dogs</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="account" 
                  className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Account</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="profile"
                  className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="dogs" className="space-y-6">
                  <DogsTab />
                </TabsContent>

                <TabsContent value="account" className="space-y-6">
                  <AccountTab />
                </TabsContent>

                <TabsContent value="profile" className="space-y-6">
                  <ProfileTab />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <ChatModal isOpen={isChatOpen} onClose={handleChatClose} />
    </div>
  );
};

export default AccountSettings;
