
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScheduledActivity, ActivityLibraryItem, UserActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { ActivityHelpContext } from '@/types/activityContext';
import { useActivityModalState } from '@/hooks/useActivityModalState';
import ActivityModalHeader from '@/components/modals/ActivityModalHeader';
import ActivityModalContent from '@/components/modals/ActivityModalContent';
import ActivityModalActions from '@/components/modals/ActivityModalActions';
import ChatModal from '@/components/chat/ChatModal';

interface ConsolidatedActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityDetails: ActivityLibraryItem | UserActivity | DiscoveredActivity | null;
  scheduledActivity?: ScheduledActivity | null;
  onToggleCompletion?: (activityId: string, completionNotes?: string) => void;
  mode?: 'scheduled' | 'library';
}

const ConsolidatedActivityModal: React.FC<ConsolidatedActivityModalProps> = ({
  isOpen,
  onClose,
  activityDetails,
  scheduledActivity = null,
  onToggleCompletion,
  mode = 'library'
}) => {
  const [isStartActivity, setIsStartActivity] = useState(false);
  
  const {
    isFavouriting,
    isChatOpen,
    setIsChatOpen,
    handleNeedHelp,
    handleAddToFavourites
  } = useActivityModalState(activityDetails, onClose);

  // Check if activity has detailed instructions for Start Activity mode
  const hasDetailedInstructions = activityDetails && Array.isArray(activityDetails.instructions) && activityDetails.instructions.length > 1;
  
  const handleToggleStartActivity = useCallback(() => {
    if (!hasDetailedInstructions) return;
    setIsStartActivity(!isStartActivity);
  }, [isStartActivity, hasDetailedInstructions]);

  const handleClose = useCallback(() => {
    setIsStartActivity(false);
    onClose();
  }, [onClose]);

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
            onToggleCompletion={onToggleCompletion}
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

export default ConsolidatedActivityModal;
