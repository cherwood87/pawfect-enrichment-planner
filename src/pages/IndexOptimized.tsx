
import React, { useState, useCallback, useMemo } from 'react';
import { useDog } from '@/contexts/DogContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';
import FloatingChatButton from '@/components/dashboard/FloatingChatButton';
import DashboardModals from '@/components/dashboard/DashboardModals';
import { Dog } from '@/types/dog';

const IndexOptimized = () => {
  const { currentDog } = useDog();
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isAddDogModalOpen, setIsAddDogModalOpen] = useState(false);
  const [isEditDogModalOpen, setIsEditDogModalOpen] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);

  // Memoize all callback handlers
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

  // Memoize modal props to prevent unnecessary re-renders
  const modalProps = useMemo(() => ({
    isActivityModalOpen,
    isChatModalOpen,
    isAddDogModalOpen,
    isEditDogModalOpen,
    selectedPillar,
    selectedDog,
    onActivityModalClose: handleActivityModalClose,
    onChatModalClose: handleChatModalClose,
    onAddDogModalClose: handleAddDogModalClose,
    onEditDogModalClose: handleEditDogModalClose
  }), [
    isActivityModalOpen,
    isChatModalOpen,
    isAddDogModalOpen,
    isEditDogModalOpen,
    selectedPillar,
    selectedDog,
    handleActivityModalClose,
    handleChatModalClose,
    handleAddDogModalClose,
    handleEditDogModalClose
  ]);

  // Memoize dashboard content props
  const dashboardContentProps = useMemo(() => ({
    onAddDogOpen: handleAddDogModalOpen,
    onEditDogOpen: handleEditDogModalOpen,
    onPillarSelect: handlePillarSelect,
    onChatOpen: handleChatModalOpen
  }), [
    handleAddDogModalOpen,
    handleEditDogModalOpen,
    handlePillarSelect,
    handleChatModalOpen
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 mobile-safe">
      {/* Header */}
      <DashboardHeader 
        onChatOpen={handleChatModalOpen} 
        onAddDogOpen={handleAddDogModalOpen}
      />

      {/* Main Content */}
      <DashboardContent {...dashboardContentProps} />

      {/* Floating Chat Button */}
      {currentDog && <FloatingChatButton onChatOpen={handleChatModalOpen} />}

      {/* Modals */}
      <DashboardModals {...modalProps} />
    </div>
  );
};

export default IndexOptimized;
