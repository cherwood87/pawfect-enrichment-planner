
import React, { useState, useCallback, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, BookOpen, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EducationalContent from '@/components/EducationalContent';
import FloatingChatButton from '@/components/dashboard/FloatingChatButton';
import ChatModal from '@/components/chat/ChatModal';

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
    navigate('/app');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50">
      {/* Enhanced Header */}
      <div className="bg-white/90 backdrop-blur-lg shadow-lg border-b-2 border-purple-200 sticky top-0 z-30">
        <div className="container-primary py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBackClick}
                className="btn-outline interactive-press"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="bg-gradient-to-r from-purple-500 via-cyan-500 to-amber-500 p-3 rounded-2xl shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-purple-800">Activity Library</h1>
                <p className="text-purple-600 text-sm">Discover enriching activities</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 card-glass px-4 py-2 rounded-2xl">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-700">Beyond Busy</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-primary py-8 spacing-section pb-20 sm:pb-8">
        {/* Enhanced Educational Content */}
        <div className="card-secondary padding-section text-center spacing-content animate-fade-in-up">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-6">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <EducationalContent />
        </div>
        
        {/* Activity Library with Suspense for lazy loading */}
        <Suspense 
          fallback={
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          }
        >
          <ActivityLibrary />
        </Suspense>
      </div>

      {/* Floating Chat Button */}
      <FloatingChatButton onChatOpen={handleChatModalOpen} />

      {/* Chat Modal */}
      <ChatModal 
        isOpen={isChatModalOpen}
        onClose={handleChatModalClose}
      />
    </div>
  );
};

export default ActivityLibraryPage;
