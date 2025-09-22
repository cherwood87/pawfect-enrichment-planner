import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDog } from '@/contexts/DogContext';
import DogProfile from '@/components/DogProfile';
import FloatingChatButton from '@/components/dashboard/FloatingChatButton';
import ChatModal from '@/components/chat/ChatModal';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';

const DogDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, setCurrentDog } = useDog();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const openChat = useCallback(() => setIsChatOpen(true), []);
  const closeChat = useCallback(() => setIsChatOpen(false), []);
  const handleAddDogOpen = useCallback(() => navigate('/settings?tab=dogs'), [navigate]);

  useEffect(() => {
    if (!id) return;
    const exists = state.dogs.find(d => d.id === id);
    if (exists) {
      setCurrentDog(id);
      // Redirect to unified settings page instead
      navigate('/settings?tab=dogs', { replace: true });
    } else if (!state.isLoading) {
      // If dog not found, go back to dogs list
      navigate('/settings?tab=dogs', { replace: true });
    }
  }, [id, state.dogs, state.isLoading, setCurrentDog, navigate]);

  const currentDog = state.dogs.find(d => d.id === state.currentDogId);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 mobile-safe">
      <DashboardHeader onChatOpen={openChat} onAddDogOpen={handleAddDogOpen} />
      <div className="container mx-auto py-6 px-4">
        <Breadcrumbs dogName={currentDog?.name} />
        <DogProfile onEditDogOpen={() => { /* uses internal dialogs */ }} />
      </div>
      <FloatingChatButton onChatOpen={openChat} />
      <ChatModal isOpen={isChatOpen} onClose={closeChat} />
    </div>
  );
};

export default DogDetails;
