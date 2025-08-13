
import React, { useState, useCallback, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, BookOpen, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EducationalContent from '@/components/EducationalContent';
import FloatingChatButton from '@/components/dashboard/FloatingChatButton';
import ChatModal from '@/components/chat/ChatModal';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

// Lazy load the heavy ActivityLibrary component
const ActivityLibrary = lazy(() => import('@/components/ActivityLibrary'));

const ActivityLibraryPage = () => {
  const navigate = useNavigate();
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const handleChatModalOpen = useCallback(() => {
    setIsChatModalOpen(true);
  }, []);

  const handleChatModalClose = useCallback(() => {
    setIsChatModalOpen(false);
  }, []);

  const handleBackClick = useCallback(() => {
    navigate('/activity-library');
  }, [navigate]);

  const handleAddDogOpen = useCallback(() => {
    navigate('/settings?tab=dogs');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onChatOpen={handleChatModalOpen} onAddDogOpen={handleAddDogOpen} />

      <div className="max-w-screen-lg mx-auto mobile-container py-8 mobile-space-y pb-20 sm:pb-8">
        {/* Activity Library with Suspense for lazy loading */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" />
            </div>
          }
        >
          <ActivityLibrary />
        </Suspense>
      </div>

      {/* Floating Chat Button */}
      <FloatingChatButton onChatOpen={handleChatModalOpen} />

      {/* Chat Modal */}
      <ChatModal isOpen={isChatModalOpen} onClose={handleChatModalClose} />
    </div>
  );
};

export default ActivityLibraryPage;
