
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import ActivityModal from '@/components/ActivityModal';
import ChatModal from '@/components/chat/ChatModal';
import AddDogForm from '@/components/AddDogForm';
import EditDogForm from '@/components/EditDogForm';
import { Dog } from '@/types/dog';

interface DashboardModalsProps {
  isActivityModalOpen: boolean;
  isChatModalOpen: boolean;
  isAddDogModalOpen: boolean;
  isEditDogModalOpen: boolean;
  selectedPillar: string | null;
  selectedDog: Dog | null;
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
  onActivityModalClose,
  onChatModalClose,
  onAddDogModalClose,
  onEditDogModalClose
}) => {
  return (
    <>
      <Dialog open={isActivityModalOpen} onOpenChange={onActivityModalClose}>
        <DialogContent className="p-0 modal-standard">
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
        <DialogContent className="p-0 modal-standard">
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

      <Dialog open={isAddDogModalOpen} onOpenChange={onAddDogModalClose}>
        <DialogContent className="p-0 modal-standard">
          <DialogTitle className="sr-only">Add New Dog</DialogTitle>
          <DialogDescription className="sr-only">
            Add a new dog profile with name, breed, age, and other details.
          </DialogDescription>
          <div className="modal-scroll-container">
            <AddDogForm onClose={onAddDogModalClose} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDogModalOpen} onOpenChange={onEditDogModalClose}>
        <DialogContent className="p-0 modal-standard">
          <DialogTitle className="sr-only">Edit Dog Profile</DialogTitle>
          <DialogDescription className="sr-only">
            Edit your dog's profile information including name, age, breed, and photo.
          </DialogDescription>
          <div className="modal-scroll-container">
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
