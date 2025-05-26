
import React, { useState } from 'react';
import { useDog } from '@/contexts/DogContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';
import FloatingChatButton from '@/components/dashboard/FloatingChatButton';
import DashboardModals from '@/components/dashboard/DashboardModals';

const Index = () => {
  const { currentDog } = useDog();
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);

  const handlePillarSelect = (pillar: string) => {
    setSelectedPillar(pillar);
    setIsActivityModalOpen(true);
  };

  const handleActivityModalClose = () => {
    setIsActivityModalOpen(false);
    setSelectedPillar(null);
  };

  const handleChatModalClose = () => {
    setIsChatModalOpen(false);
  };

  const handleChatModalOpen = () => {
    setIsChatModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 mobile-safe">
      {/* Header */}
      <DashboardHeader onChatOpen={handleChatModalOpen} />

      {/* Show dashboard content only if there's a current dog */}
      {currentDog && (
        <>
          {/* Main Content */}
          <DashboardContent onPillarSelect={handlePillarSelect} />

          {/* Floating Chat Button */}
          <FloatingChatButton onChatOpen={handleChatModalOpen} />

          {/* Modals */}
          <DashboardModals
            isActivityModalOpen={isActivityModalOpen}
            isChatModalOpen={isChatModalOpen}
            selectedPillar={selectedPillar}
            onActivityModalClose={handleActivityModalClose}
            onChatModalClose={handleChatModalClose}
          />
        </>
      )}
    </div>
  );
};

export default Index;
