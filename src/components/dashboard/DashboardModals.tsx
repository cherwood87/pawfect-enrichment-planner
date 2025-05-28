
import React from 'react';
import ActivityModal from '@/components/ActivityModal';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ChatModal from '@/components/chat/ChatModal';
import AddDogForm from '@/components/AddDogForm';
import EditDogForm from '@/components/EditDogForm';
import { Dog } from '@/types/dog';
import { ActivityHelpContext } from '@/types/activityContext';

interface DashboardModalsProps {
  isActivityModalOpen: boolean;
  isChatModalOpen: boolean;
  isAddDogModalOpen: boolean;
  isEditDogModalOpen: boolean;
  selectedPillar: string | null;
  selectedDog: Dog | null;
  chatContext?: ActivityHelpContext;
  onActivityModalClose: () => void;
  onChatModalClose: () => void;
  onAddDogModalClose: () => void;
  onEditDogModalClose: () => void;
}

const DashboardModals: React.FC<DashboardModalsProps> = ({
  isActivityModalOpen,
  isChatModalOpen,
  isAddDogModalOpen,
  isEditDogModalOpen,
  selectedPillar,
  selectedDog,
  chatContext,
  onActivityModalClose,
  onChatModalClose,
  onAddDogModalClose,
  onEditDogModalClose,
}) => {
  return (
    <>
      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={onActivityModalClose}
        selectedPillar={selectedPillar}
      />

      <ChatModal
        isOpen={isChatModalOpen}
        onClose={onChatModalClose}
        chatContext={chatContext}
      />

      <Dialog open={isAddDogModalOpen} onOpenChange={onAddDogModalClose}>
        <DialogContent className="max-w-2xl">
          <div className="overflow-y-auto max-h-[80vh] p-4">
            <AddDogForm onClose={onAddDogModalClose} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDogModalOpen} onOpenChange={onEditDogModalClose}>
        <DialogContent className="max-w-2xl">
          <div className="overflow-y-auto max-h-[80vh] p-4">
            {selectedDog && (
              <EditDogForm 
                dog={selectedDog} 
                onClose={onEditDogModalClose} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardModals;
