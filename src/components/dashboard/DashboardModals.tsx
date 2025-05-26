
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import ActivityModal from '@/components/ActivityModal';
import ChatModal from '@/components/chat/ChatModal';

interface DashboardModalsProps {
  isActivityModalOpen: boolean;
  isChatModalOpen: boolean;
  selectedPillar: string | null;
  onActivityModalClose: () => void;
  onChatModalClose: () => void;
}

const DashboardModals: React.FC<DashboardModalsProps> = ({
  isActivityModalOpen,
  isChatModalOpen,
  selectedPillar,
  onActivityModalClose,
  onChatModalClose
}) => {
  const isMobile = useIsMobile();

  return (
    <>
      <Dialog open={isActivityModalOpen} onOpenChange={onActivityModalClose}>
        <DialogContent className={`p-0 mobile-modal ${isMobile ? 'h-[90vh]' : 'max-w-4xl max-h-[90vh]'}`}>
          <DialogTitle className="sr-only">Add Activity</DialogTitle>
          <DialogDescription className="sr-only">
            Browse and add enrichment activities for your dog.
          </DialogDescription>
          <ActivityModal 
            isOpen={isActivityModalOpen}
            onClose={onActivityModalClose}
            selectedPillar={selectedPillar}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isChatModalOpen} onOpenChange={onChatModalClose}>
        <DialogContent className={`p-0 mobile-modal ${isMobile ? 'h-[90vh]' : 'max-w-4xl max-h-[90vh]'}`}>
          <DialogTitle className="sr-only">Enrichment Coach</DialogTitle>
          <DialogDescription className="sr-only">
            Chat with your AI enrichment coach for personalized advice and recommendations.
          </DialogDescription>
          <ChatModal 
            isOpen={isChatModalOpen}
            onClose={onChatModalClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardModals;
