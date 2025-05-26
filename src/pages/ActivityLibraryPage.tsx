
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ActivityLibrary from '@/components/ActivityLibrary';
import EducationalContent from '@/components/EducationalContent';
import FloatingChatButton from '@/components/dashboard/FloatingChatButton';
import ChatModal from '@/components/chat/ChatModal';

const ActivityLibraryPage = () => {
  const navigate = useNavigate();
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const handleChatModalOpen = () => {
    setIsChatModalOpen(true);
  };

  const handleChatModalClose = () => {
    setIsChatModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-screen-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/app')}
                className="mr-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🐕</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">Activity Library</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-6 pb-20 sm:pb-6">
        {/* Educational Content */}
        <EducationalContent />
        
        {/* Activity Library */}
        <ActivityLibrary />
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
