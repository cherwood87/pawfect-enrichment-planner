
import React, { useState, useCallback } from 'react';
import { useDog } from '@/contexts/DogContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';
import FloatingChatButton from '@/components/dashboard/FloatingChatButton';
import DashboardModals from '@/components/dashboard/DashboardModals';
import EmptyDashboard from '@/components/EmptyDashboard';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { Dog } from '@/types/dog';

const Index = () => {
  const { currentDog, state } = useDog();
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isAddDogModalOpen, setIsAddDogModalOpen] = useState(false);
  const [isEditDogModalOpen, setIsEditDogModalOpen] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);

  const handlePillarSelect = useCallback((pillar: string) => {
    setSelectedPillar(pillar);
    setIsActivityModalOpen(true);
  }, []);

  const handleActivityModalClose = useCallback(() => {
    setIsActivityModalOpen(false);
    setSelectedPillar(null);
  }, []);

  const handleChatModalClose = useCallback(() => {
    setIsChatModalOpen(false);
  }, []);

  const handleChatModalOpen = useCallback(() => {
    setIsChatModalOpen(true);
  }, []);

  const handleAddDogModalOpen = useCallback(() => {
    setIsAddDogModalOpen(true);
  }, []);

  const handleAddDogModalClose = useCallback(() => {
    setIsAddDogModalOpen(false);
  }, []);

  const handleEditDogModalOpen = useCallback((dog: Dog) => {
    setSelectedDog(dog);
    setIsEditDogModalOpen(true);
  }, []);

  const handleEditDogModalClose = useCallback(() => {
    setIsEditDogModalOpen(false);
    setSelectedDog(null);
  }, []);

  // Show loading skeleton while dogs are loading
  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 mobile-safe">
        <LoadingSkeleton type="dashboard" />
      </div>
    );
  }

  // Show empty dashboard if no dogs exist
  if (state.dogs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 mobile-safe">
        <DashboardHeader 
          onChatOpen={handleChatModalOpen} 
          onAddDogOpen={handleAddDogModalOpen}
        />
        
        <EmptyDashboard 
          onAddDogOpen={handleAddDogModalOpen}
          onPillarSelect={handlePillarSelect}
        />

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
      </div>
    );
  }

  // Show full dashboard when dogs exist
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 mobile-safe">
      {/* Header */}
      <DashboardHeader 
        onChatOpen={handleChatModalOpen} 
        onAddDogOpen={handleAddDogModalOpen}
      />

      {/* Main Content */}
      <DashboardContent 
        onAddDogOpen={handleAddDogModalOpen}
        onEditDogOpen={handleEditDogModalOpen}
        onPillarSelect={handlePillarSelect}
        onChatOpen={handleChatModalOpen}
      />

      {/* Floating Chat Button */}
      {currentDog && <FloatingChatButton onChatOpen={handleChatModalOpen} />}

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
    </div>
  );
};

export default Index;
