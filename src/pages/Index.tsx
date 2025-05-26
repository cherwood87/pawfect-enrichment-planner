
import React, { useState } from 'react';
import { useDog } from '@/contexts/DogContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';
import FloatingChatButton from '@/components/dashboard/FloatingChatButton';
import DashboardModals from '@/components/dashboard/DashboardModals';
import EmptyDashboard from '@/components/EmptyDashboard';
import { Dog } from '@/types/dog';

const Index = () => {
  const { currentDog } = useDog();
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isAddDogModalOpen, setIsAddDogModalOpen] = useState(false);
  const [isEditDogModalOpen, setIsEditDogModalOpen] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);

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

  const handleAddDogModalOpen = () => {
    setIsAddDogModalOpen(true);
  };

  const handleAddDogModalClose = () => {
    setIsAddDogModalOpen(false);
  };

  const handleEditDogModalOpen = (dog: Dog) => {
    setSelectedDog(dog);
    setIsEditDogModalOpen(true);
  };

  const handleEditDogModalClose = () => {
    setIsEditDogModalOpen(false);
    setSelectedDog(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 mobile-safe">
      {/* Header */}
      <DashboardHeader 
        onChatOpen={handleChatModalOpen} 
        onAddDogOpen={handleAddDogModalOpen}
      />

      {/* Main Content - Show EmptyDashboard if no current dog, otherwise show regular dashboard */}
      {currentDog ? (
        <>
          {/* Dashboard Content */}
          <DashboardContent 
            onAddDogOpen={handleAddDogModalOpen}
            onEditDogOpen={handleEditDogModalOpen}
            onPillarSelect={handlePillarSelect}
          />

          {/* Floating Chat Button */}
          <FloatingChatButton onChatOpen={handleChatModalOpen} />

          {/* Modals */}
          <DashboardModals
            isActivityModalOpen={isActivityModalOpen}
            isChatModalOpen={isChatModalOpen}
            isAddDogModalOpen={isAddDogModalOpen}
            isEditDogModalOpen={isEditDogModalOpen}
            selectedPillar={selectedPillar}
            selectedDog={selectedDog}
            onActivityModalClose={handleActivityModalClose}
            onChatModalClose={handleChatModalClose}
            onAddDogModalClose={handleAddDogModalClose}
            onEditDogModalClose={handleEditDogModalClose}
          />
        </>
      ) : (
        <>
          {/* Empty State Dashboard */}
          <EmptyDashboard onAddDogOpen={handleAddDogModalOpen} />

          {/* Chat Modal for empty state */}
          <DashboardModals
            isActivityModalOpen={false}
            isChatModalOpen={isChatModalOpen}
            isAddDogModalOpen={isAddDogModalOpen}
            isEditDogModalOpen={false}
            selectedPillar={null}
            selectedDog={null}
            onActivityModalClose={() => {}}
            onChatModalClose={handleChatModalClose}
            onAddDogModalClose={handleAddDogModalClose}
            onEditDogModalClose={() => {}}
          />
        </>
      )}
    </div>
  );
};

export default Index;
