
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';

interface ActivityCardContentProps {
  activity: ActivityLibraryItem | DiscoveredActivity;
}

const ActivityCardContent: React.FC<ActivityCardContentProps> = ({ activity }) => {
  return (
    <>
      {/* Benefits */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Benefits</h3>
        <p className="text-gray-600 text-sm">{activity.benefits}</p>
      </div>

      {/* Materials Needed */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Materials Needed</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {activity.materials.map((material, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>{material}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Emotional Goals */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Emotional Goals</h3>
        <div className="flex flex-wrap gap-2">
          {activity.emotionalGoals.map((goal, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-purple-100 text-purple-700">
              {goal}
            </Badge>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Step-by-Step Instructions</h3>
        <ol className="space-y-2">
          {activity.instructions.map((instruction, index) => (
            <li key={index} className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {index + 1}
              </span>
              <span className="text-sm text-gray-600">{instruction}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Tags */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {activity.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
};

export default ActivityCardContent;
