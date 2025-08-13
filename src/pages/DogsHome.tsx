import React, { useState, useCallback } from 'react';
import DogsTab from '@/components/settings/DogsTab';
import FloatingChatButton from '@/components/dashboard/FloatingChatButton';
import ChatModal from '@/components/chat/ChatModal';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useNavigate } from 'react-router-dom';

const DogsHome: React.FC = () => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const openChat = useCallback(() => setIsChatOpen(true), []);
  const closeChat = useCallback(() => setIsChatOpen(false), []);
  const handleAddDogOpen = useCallback(() => navigate('/settings?tab=dogs'), [navigate]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 mobile-safe">
      <DashboardHeader onChatOpen={openChat} onAddDogOpen={handleAddDogOpen} />
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Your Dogs</h1>
          <p className="text-muted-foreground">Create or select a dog to get started.</p>
        </div>
        <DogsTab />
      </div>

      <FloatingChatButton onChatOpen={openChat} />
      <ChatModal isOpen={isChatOpen} onClose={closeChat} />
    </div>
  );
};

export default DogsHome;
