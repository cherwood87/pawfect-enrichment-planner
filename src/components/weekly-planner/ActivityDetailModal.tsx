
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Clock,
  CheckCircle,
  Circle,
  Award,
  Lightbulb,
  Target,
  HelpCircle
} from 'lucide-react';
import { ScheduledActivity, ActivityLibraryItem, UserActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import ChatModal from '@/components/chat/ChatModal';

interface ActivityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: ScheduledActivity | null;
  activityDetails: ActivityLibraryItem | UserActivity | DiscoveredActivity | null;
  onToggleCompletion: (activityId: string) => void;
}

const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  isOpen,
  onClose,
  activity,
  activityDetails,
  onToggleCompletion
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (!activity || !activityDetails) return null;

  const getPillarColor = (pillar: string) => {
    const colors = {
      mental: { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'text-purple-500' },
      physical: { bg: 'bg-green-100', text: 'text-green-700', icon: 'text-green-500' },
      social: { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'text-blue-500' },
      environmental: { bg: 'bg-teal-100', text: 'text-teal-700', icon: 'text-teal-500' },
      instinctual: { bg: 'bg-orange-100', text: 'text-orange-700', icon: 'text-orange-500' }
    };
    return colors[pillar as keyof typeof colors] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-500' };
  };

  const pillarColor = getPillarColor(activityDetails.pillar);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // ✅ Safe instruction rendering - fixed to return string for React rendering
  const getInstructionsText = (): string => {
    const instructions = (activityDetails as any).instructions;

    if (!instructions) return '';

    if (Array.isArray(instructions) && instructions.every(item => typeof item === 'string')) {
      return instructions.join(' ');
    }

    if (typeof instructions === 'string') {
      return instructions;
    }

    return '';
  };

  const instructionsText = getInstructionsText();

  const handleNeedHelp = () => {
    console.log('Opening chat help for activity:', activityDetails.title);
    setIsChatOpen(true);
  };

  const chatContext = {
    type: 'activity-help' as const,
    activityName: activityDetails.title,
    activityPillar: activityDetails.pillar,
    activityDifficulty: activityDetails.difficulty,
    activityDuration: activityDetails.duration
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800 flex items-center justify-between">
              <span>{activityDetails.title}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleCompletion(activity.id)}
                className="flex items-center space-x-2"
              >
                {activity.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-sm">
                  {activity.completed ? 'Completed' : 'Mark Complete'}
                </span>
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Activity Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className={`${pillarColor.bg} ${pillarColor.text}`}>
                {activityDetails.pillar.charAt(0).toUpperCase() + activityDetails.pillar.slice(1)}
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{activityDetails.duration} min</span>
              </Badge>
              <Badge variant="outline">{activityDetails.difficulty}</Badge>
              <Badge variant="outline">{dayNames[activity.dayOfWeek || 0]}</Badge>
            </div>

            {/* Description */}
            {'description' in activityDetails && activityDetails.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                  <Lightbulb className={`w-4 h-4 ${pillarColor.icon}`} />
                  <span>What You'll Do</span>
                </h3>
                <p className="text-gray-600 leading-relaxed">{activityDetails.description}</p>
              </div>
            )}

            {/* Benefits */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                <Award className={`w-4 h-4 ${pillarColor.icon}`} />
                <span>Benefits</span>
              </h3>
              <p className="text-gray-600 leading-relaxed">{activityDetails.benefits}</p>
            </div>

            {/* Instructions */}
            {instructionsText && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                  <Target className={`w-4 h-4 ${pillarColor.icon}`} />
                  <span>Instructions</span>
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{instructionsText}</p>
                </div>
              </div>
            )}

            {/* Materials */}
            {'materials' in activityDetails &&
              activityDetails.materials &&
              activityDetails.materials.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Materials Needed</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {activityDetails.materials.map((material, index) => (
                      <li key={index} className="text-gray-600">
                        {material}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Notes */}
            {activity.notes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Notes</h3>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-blue-800">{activity.notes}</p>
                </div>
              </div>
            )}

            {/* Completion Notes */}
            {activity.completed && activity.completionNotes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Completion Notes</h3>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-green-800">{activity.completionNotes}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleNeedHelp}
              className="flex items-center space-x-2 text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Need Extra Help?</span>
            </Button>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button
                onClick={() => onToggleCompletion(activity.id)}
                className={
                  activity.completed ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'
                }
              >
                {activity.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} chatContext={chatContext} />
    </>
  );
};

export default ActivityDetailModal;
