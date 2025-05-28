
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Clock, Star, Target } from 'lucide-react';
import { ScheduledActivity, ActivityLibraryItem, UserActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';

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
  if (!activity || !activityDetails) return null;

  const getPillarColor = (pillar: string) => {
    const colors = {
      mental: 'bg-purple-100 text-purple-700',
      physical: 'bg-green-100 text-green-700',
      social: 'bg-blue-100 text-blue-700',
      environmental: 'bg-teal-100 text-teal-700',
      instinctual: 'bg-orange-100 text-orange-700'
    };
    return colors[pillar as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getDifficultyStars = (difficulty: string) => {
    const level = difficulty === 'Easy' ? 1 : difficulty === 'Medium' ? 2 : 3;
    return Array.from({ length: 3 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < level ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span>{activityDetails.title}</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleCompletion(activity.id)}
              className="flex items-center space-x-2"
            >
              {activity.completed ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-600">Completed</span>
                </>
              ) : (
                <>
                  <Circle className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Mark Complete</span>
                </>
              )}
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Activity Meta Information */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge className={getPillarColor(activityDetails.pillar)}>
              {activityDetails.pillar.charAt(0).toUpperCase() + activityDetails.pillar.slice(1)}
            </Badge>
            
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{activityDetails.duration} minutes</span>
            </div>

            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-600 mr-1">Difficulty:</span>
              {getDifficultyStars(activityDetails.difficulty)}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Benefits</h3>
            <p className="text-gray-600 leading-relaxed">{activityDetails.benefits}</p>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Instructions</h3>
            <div className="text-gray-600 leading-relaxed">
              {typeof activityDetails.instructions === 'string' ? (
                <p>{activityDetails.instructions}</p>
              ) : (
                <div>{activityDetails.instructions}</div>
              )}
            </div>
          </div>

          {/* Equipment */}
          {activityDetails.equipment && activityDetails.equipment.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Equipment Needed</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {activityDetails.equipment.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Scheduled Notes */}
          {activity.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Notes</h3>
              <p className="text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                {activity.notes}
              </p>
            </div>
          )}

          {/* Completion Notes */}
          {activity.completionNotes && activity.completed && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Completion Notes</h3>
              <p className="text-gray-600 bg-green-50 p-3 rounded-lg border border-green-200">
                {activity.completionNotes}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityDetailModal;
