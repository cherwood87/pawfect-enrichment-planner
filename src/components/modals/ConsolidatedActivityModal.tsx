
import React from 'react';
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
  const {
    selectedDayOfWeek,
    setSelectedDayOfWeek,
    isScheduling,
    isFavouriting,
    isChatOpen,
    setIsChatOpen,
    handleNeedHelp,
    handleScheduleActivity,
    handleAddToFavourites
  } = useActivityModalState(activityDetails, onClose);

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
      <Dialog open={isOpen} onOpenChange={onClose}>
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
            selectedDayOfWeek={selectedDayOfWeek}
            onDaySelect={setSelectedDayOfWeek}
          />

          <ActivityModalActions
            mode={mode}
            isScheduling={isScheduling}
            isFavouriting={isFavouriting}
            onSchedule={handleScheduleActivity}
            onAddToFavourites={handleAddToFavourites}
            onClose={onClose}
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
