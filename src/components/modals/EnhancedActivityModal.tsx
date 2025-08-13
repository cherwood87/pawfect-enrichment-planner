import React, { useState, useCallback, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScheduledActivity, ActivityLibraryItem, UserActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { ActivityHelpContext } from '@/types/activityContext';
import { useActivityModalState } from '@/hooks/useActivityModalState';
import { useActivityModalPersistence } from '@/hooks/useActivityModalPersistence';
import ActivityModalHeader from '@/components/modals/ActivityModalHeader';
import ActivityModalContent from '@/components/modals/ActivityModalContent';
import ActivityModalActions from '@/components/modals/ActivityModalActions';
import ChatModal from '@/components/chat/ChatModal';

interface EnhancedActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityDetails: ActivityLibraryItem | UserActivity | DiscoveredActivity | null;
  scheduledActivity?: ScheduledActivity | null;
  onToggleCompletion?: (activityId: string, completionNotes?: string) => void;
  mode?: 'scheduled' | 'library';
}

/**
 * Enhanced activity modal with state persistence and better UX
 * Maintains state across navigation and provides seamless user experience
 */
const EnhancedActivityModal: React.FC<EnhancedActivityModalProps> = ({
  isOpen,
  onClose,
  activityDetails,
  scheduledActivity = null,
  onToggleCompletion,
  mode = 'library'
}) => {
  const [isStartActivity, setIsStartActivity] = useState(false);
  const { modalState, updateModalState } = useActivityModalPersistence();
  
  const {
    isFavouriting,
    isChatOpen,
    setIsChatOpen,
    handleNeedHelp,
    handleAddToFavourites
  } = useActivityModalState(activityDetails, onClose);

  // Restore modal state when opening
  useEffect(() => {
    if (isOpen && modalState.selectedPillar) {
      // Could restore additional state here if needed
    }
  }, [isOpen, modalState]);

  // Check if activity has detailed instructions for Start Activity mode
  const hasDetailedInstructions = activityDetails && Array.isArray(activityDetails.instructions) && activityDetails.instructions.length > 1;
  
  const handleToggleStartActivity = useCallback(() => {
    if (!hasDetailedInstructions) return;
    setIsStartActivity(!isStartActivity);
  }, [isStartActivity, hasDetailedInstructions]);

  const handleClose = useCallback(() => {
    setIsStartActivity(false);
    // Clear modal state persistence when explicitly closing
    updateModalState({ isOpen: false });
    onClose();
  }, [onClose, updateModalState]);

  const handleModalToggleCompletion = useCallback(async (activityId: string, notes?: string) => {
    if (onToggleCompletion) {
      await onToggleCompletion(activityId, notes);
      // Don't close modal immediately - let user see the success state
      setTimeout(() => {
        handleClose();
      }, 1500);
    }
  }, [onToggleCompletion, handleClose]);

  if (!activityDetails) return null;

  const chatContext: ActivityHelpContext = {
    type: 'activity-help',
    activityName: activityDetails.title,
    activityPillar: activityDetails.pillar,
    activityDifficulty: activityDetails.difficulty,
    activityDuration: activityDetails.duration
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-purple-50 to-cyan-50 border-2 border-purple-200 rounded-3xl">
          <ActivityModalHeader
            activityDetails={activityDetails}
            mode={mode}
            scheduledActivity={scheduledActivity}
            onToggleCompletion={handleModalToggleCompletion}
            onNeedHelp={handleNeedHelp}
          />

          <ActivityModalContent
            activityDetails={activityDetails}
            mode={mode}
            scheduledActivity={scheduledActivity}
            isStartActivity={isStartActivity}
          />

          <ActivityModalActions
            mode={mode}
            isFavouriting={isFavouriting}
            onAddToFavourites={handleAddToFavourites}
            onClose={handleClose}
            isStartActivity={isStartActivity}
            onToggleStartActivity={hasDetailedInstructions ? handleToggleStartActivity : undefined}
            canStartActivity={hasDetailedInstructions}
          />
        </DialogContent>
      </Dialog>

      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        chatContext={chatContext}
      />
    </>
  );
};

export default EnhancedActivityModal;