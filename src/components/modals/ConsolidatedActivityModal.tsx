
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScheduledActivity, ActivityLibraryItem, UserActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { ActivityHelpContext } from '@/types/activityContext';
import { useActivityModalState } from '@/hooks/useActivityModalState';
import { useActivityStepTracker } from '@/hooks/useActivityStepTracker';
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
  const [isStepMode, setIsStepMode] = useState(false);
  
  const {
    isFavouriting,
    isChatOpen,
    setIsChatOpen,
    handleNeedHelp,
    handleAddToFavourites
  } = useActivityModalState(activityDetails, onClose);

  // Initialize step tracker for activities with array instructions
  const hasStepInstructions = activityDetails && Array.isArray(activityDetails.instructions) && activityDetails.instructions.length > 1;
  
  const stepTracker = useActivityStepTracker({
    instructions: hasStepInstructions ? activityDetails.instructions : [],
    onFinish: useCallback(() => {
      // Optionally auto-complete scheduled activities
      if (mode === 'scheduled' && scheduledActivity && onToggleCompletion) {
        onToggleCompletion(scheduledActivity.id, 'Completed using step-by-step guide');
      }
      setIsStepMode(false);
    }, [mode, scheduledActivity, onToggleCompletion])
  });

  const handleToggleStepMode = useCallback(() => {
    if (!hasStepInstructions) return;
    
    if (!isStepMode) {
      stepTracker.resetProgress();
    }
    setIsStepMode(!isStepMode);
  }, [isStepMode, hasStepInstructions, stepTracker]);

  const handleClose = useCallback(() => {
    setIsStepMode(false);
    stepTracker.resetProgress();
    onClose();
  }, [onClose, stepTracker]);

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
            isStepMode={isStepMode}
            stepState={isStepMode ? {
              currentStep: stepTracker.currentStep,
              completedSteps: stepTracker.completedSteps,
              onStepComplete: stepTracker.onStepComplete,
              onPreviousStep: stepTracker.onPreviousStep,
              onNextStep: stepTracker.onNextStep,
              onFinishActivity: stepTracker.onFinishActivity
            } : undefined}
          />

          <ActivityModalActions
            mode={mode}
            isFavouriting={isFavouriting}
            onAddToFavourites={handleAddToFavourites}
            onClose={handleClose}
            isStepMode={isStepMode}
            onToggleStepMode={hasStepInstructions ? handleToggleStepMode : undefined}
            canStartActivity={hasStepInstructions}
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
