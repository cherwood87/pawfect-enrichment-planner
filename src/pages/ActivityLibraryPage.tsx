
import React, { useState, useCallback, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, BookOpen, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EducationalContent from '@/components/EducationalContent';
import FloatingChatButton from '@/components/dashboard/FloatingChatButton';
import ChatModal from '@/components/chat/ChatModal';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { LazyActivityLibrary } from '@/components/lazy/LazyRouteComponents';

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
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b-2 border-purple-200">
        <div className="max-w-screen-lg mx-auto mobile-container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleBackClick}
                className="modern-button-outline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="bg-gradient-to-r from-purple-500 via-cyan-500 to-amber-500 p-2 rounded-xl shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-purple-800">Activity Library</h1>
                <p className="text-purple-600">Discover enriching activities</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 border border-purple-200">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-700">Beyond Busy</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto mobile-container py-8 mobile-space-y pb-20 sm:pb-8">
        {/* Enhanced Educational Content */}
        <div className="modern-card bg-gradient-to-r from-purple-50 via-cyan-50 to-amber-50 border-2 border-purple-200">
          <div className="mobile-card text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <EducationalContent />
          </div>
        </div>
        
        {/* Activity Library with improved Suspense boundary */}
        <Suspense 
          fallback={
            <div className="modern-card">
              <div className="mobile-card flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <LoadingSpinner size="lg" />
                  <p className="text-gray-600">Loading activity library...</p>
                  <div className="text-sm text-gray-500">
                    Optimizing for better performance
                  </div>
                </div>
              </div>
            </div>
          }
        >
          <LazyActivityLibrary />
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
