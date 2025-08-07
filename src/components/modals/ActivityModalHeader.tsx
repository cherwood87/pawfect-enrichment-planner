import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Target, MessageSquare } from 'lucide-react';
import { ScheduledActivity, ActivityLibraryItem, UserActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
interface ActivityModalHeaderProps {
  activityDetails: ActivityLibraryItem | UserActivity | DiscoveredActivity;
  mode: 'scheduled' | 'library';
  scheduledActivity?: ScheduledActivity | null;
  onToggleCompletion?: (activityId: string, completionNotes?: string) => void;
  onNeedHelp: () => void;
}
const ActivityModalHeader: React.FC<ActivityModalHeaderProps> = ({
  activityDetails,
  mode,
  scheduledActivity,
  onToggleCompletion,
  onNeedHelp
}) => {
  return <DialogHeader>
      <DialogTitle className="flex items-center justify-between">
        <span className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-2 rounded-2xl">
            <Target className="w-5 h-5 text-white" />
          </div>
          <span className="text-purple-800">{activityDetails.title}</span>
        </span>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onNeedHelp} className="flex items-center space-x-2 rounded-xl bg-amber-200 hover:bg-amber-100">
            <MessageSquare className="w-4 h-4 text-purple-600" />
            <span className="text-purple-600">Get Help</span>
          </Button>
          {mode === 'scheduled' && scheduledActivity && onToggleCompletion && <Button variant="ghost" size="sm" onClick={() => onToggleCompletion(scheduledActivity.id)} className="flex items-center space-x-2 hover:bg-purple-100 rounded-xl">
              {scheduledActivity.completed ? <>
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-emerald-600">Completed</span>
                </> : <>
                  <Circle className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Mark Complete</span>
                </>}
            </Button>}
        </div>
      </DialogTitle>
    </DialogHeader>;
};
export default ActivityModalHeader;