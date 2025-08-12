
import React from 'react';
import ActivityModal from '@/components/ActivityModal';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ChatModal from '@/components/chat/ChatModal';
import AddDogForm from '@/components/AddDogForm';
import EditDogForm from '@/components/EditDogForm';
import DogProfileDialogs from '@/components/profile/DogProfileDialogs';
import { PostDogCreationModal } from '@/components/onboarding/PostDogCreationModal';
import { Dog } from '@/types/dog';
import { QuizResults } from '@/types/quiz';
import { ActivityHelpContext } from '@/types/activityContext';

interface DashboardModalsProps {
  isActivityModalOpen: boolean;
  isChatModalOpen: boolean;
  isAddDogModalOpen: boolean;
  isEditDogModalOpen: boolean;
  selectedPillar: string | null;
  selectedDog: Dog | null;
  chatContext?: ActivityHelpContext;
  showQuiz?: boolean;
  showQuizResults?: boolean;
  currentDog?: Dog | null;
  showPostDogCreation?: boolean;
  newlyCreatedDog?: Dog | null;
  onActivityModalClose: () => void;
  onChatModalClose: () => void;
  onAddDogModalClose: () => void;
  onEditDogModalClose: () => void;
  onCloseQuiz?: () => void;
  onCloseQuizResults?: () => void;
  onTakeQuiz?: () => void;
  onQuizComplete?: (results: QuizResults) => void;
  onClosePostDogCreation?: () => void;
  onDogCreated?: (dog: any) => void;
}

const DashboardModals: React.FC<DashboardModalsProps> = ({
  isActivityModalOpen,
  isChatModalOpen,
  isAddDogModalOpen,
  isEditDogModalOpen,
  selectedPillar,
  selectedDog,
  chatContext,
  showQuiz = false,
  showQuizResults = false,
  currentDog,
  showPostDogCreation = false,
  newlyCreatedDog,
  onActivityModalClose,
  onChatModalClose,
  onAddDogModalClose,
  onEditDogModalClose,
  onCloseQuiz,
  onCloseQuizResults,
  onTakeQuiz,
  onQuizComplete,
  onClosePostDogCreation,
  onDogCreated,
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
            <AddDogForm 
              onClose={onAddDogModalClose} 
              onDogCreated={onDogCreated}
            />
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

      {/* Quiz Dialogs */}
      {currentDog && (
        <DogProfileDialogs
          showQuiz={showQuiz}
          showResults={showQuizResults}
          currentDog={currentDog}
          onQuizComplete={onQuizComplete || (() => {})}
          onRetakeQuiz={onTakeQuiz || (() => {})}
          onCloseQuiz={onCloseQuiz || (() => {})}
          onCloseResults={onCloseQuizResults || (() => {})}
          setShowQuiz={() => {}}
          setShowResults={() => {}}
        />
      )}

      {/* Post Dog Creation Modal */}
      {newlyCreatedDog && (
        <PostDogCreationModal
          isOpen={showPostDogCreation}
          onClose={onClosePostDogCreation || (() => {})}
          onTakeQuiz={onTakeQuiz || (() => {})}
          dog={newlyCreatedDog}
        />
      )}
    </>
  );
};

export default DashboardModals;
