
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Dog, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AccountTab from '@/components/settings/AccountTab';
import DogsTab from '@/components/settings/DogsTab';
import ProfileTab from '@/components/settings/ProfileTab';

const AccountSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');

  const handleBack = () => {
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center space-x-2 hover:bg-purple-100 rounded-2xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>
        </div>

        {/* Main Content */}
        <Card className="border-2 border-purple-200 rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-cyan-100 rounded-t-3xl">
            <CardTitle className="text-2xl font-bold text-purple-800 flex items-center space-x-2">
              <Shield className="w-6 h-6" />
              <span>Account Settings</span>
            </CardTitle>
            <CardDescription className="text-purple-600">
              Manage your account, dog profiles, and preferences
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-purple-100 rounded-2xl p-1">
                <TabsTrigger 
                  value="account" 
                  className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Account</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="dogs"
                  className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
                >
                  <Dog className="w-4 h-4" />
                  <span className="hidden sm:inline">Dogs</span>
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
                <TabsContent value="account" className="space-y-6">
                  <AccountTab />
                </TabsContent>

                <TabsContent value="dogs" className="space-y-6">
                  <DogsTab />
                </TabsContent>

                <TabsContent value="profile" className="space-y-6">
                  <ProfileTab />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountSettings;
