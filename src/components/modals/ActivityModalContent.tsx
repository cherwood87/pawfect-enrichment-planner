
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, HelpCircle } from 'lucide-react';
import { ScheduledActivity, ActivityLibraryItem, UserActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';

interface ActivityModalContentProps {
  activityDetails: ActivityLibraryItem | UserActivity | DiscoveredActivity;
  mode: 'scheduled' | 'library';
  scheduledActivity?: ScheduledActivity | null;
  isStartActivity?: boolean;
}

const ActivityModalContent: React.FC<ActivityModalContentProps> = ({
  activityDetails,
  mode,
  scheduledActivity,
  isStartActivity = false
}) => {
  const getPillarColor = (pillar: string) => {
    const colors = {
      mental: 'bg-purple-100 text-purple-700',
      physical: 'bg-emerald-100 text-emerald-700',
      social: 'bg-cyan-100 text-cyan-700',
      environmental: 'bg-teal-100 text-teal-700',
      instinctual: 'bg-orange-100 text-orange-700'
    };
    return colors[pillar as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getDifficultyStars = (difficulty: string) => {
    const level = difficulty === 'Easy' ? 1 : difficulty === 'Medium' ? 2 : 3;
    return Array.from({ length: 3 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < level ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));
  };

  // Get basic steps for main view (first 3-4 steps, simplified)
  const getBasicSteps = () => {
    if (!Array.isArray(activityDetails.instructions)) return [];
    return activityDetails.instructions
      .slice(0, 4)
      .map(step => {
        // Extract just the core action, removing detailed timing and safety notes
        const basicStep = step.split(' - ')[0].split(':')[0];
        return basicStep.length > 80 ? basicStep.substring(0, 80) + '...' : basicStep;
      });
  };

  // Get troubleshooting tips (mock data for now)
  const getTroubleshootingTips = () => {
    const pillarTips = {
      mental: [
        'If your dog seems confused, break the task into smaller steps',
        'If your dog loses interest, try using higher-value treats',
        'If your dog gets frustrated, take a break and try again later'
      ],
      physical: [
        'If your dog seems tired, reduce intensity or take breaks',
        'Watch for signs of overheating: excessive panting or drooling',
        'If your dog is reluctant, start with shorter sessions'
      ],
      social: [
        'If your dog shows anxiety, increase distance from trigger',
        'If your dog is overstimulated, find a quieter environment',
        'If your dog is fearful, go at their pace and don\'t force interactions'
      ],
      environmental: [
        'If your dog is overwhelmed, reduce the number of new elements',
        'If your dog isn\'t exploring, use treats to encourage investigation',
        'If your dog seems anxious, start in familiar territory first'
      ],
      instinctual: [
        'If your dog isn\'t engaging, try different scents or textures',
        'If your dog gets too excited, control the intensity',
        'If your dog seems confused about the goal, demonstrate first'
      ]
    };
    return pillarTips[activityDetails.pillar as keyof typeof pillarTips] || [];
  };

  // Show "Start Activity" view with all detailed steps and troubleshooting
  if (isStartActivity && Array.isArray(activityDetails.instructions)) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className={`${getPillarColor(activityDetails.pillar)} rounded-2xl px-4 py-2 font-semibold`}>
            {activityDetails.pillar.charAt(0).toUpperCase() + activityDetails.pillar.slice(1)}
          </Badge>
          <div className="flex items-center space-x-1 text-sm text-purple-700 bg-purple-100 rounded-2xl px-3 py-2">
            <Clock className="w-4 h-4" />
            <span>{activityDetails.duration} minutes</span>
          </div>
          <div className="flex items-center space-x-1 bg-cyan-100 rounded-2xl px-3 py-2">
            <span className="text-sm text-cyan-700 mr-1">Difficulty:</span>
            {getDifficultyStars(activityDetails.difficulty)}
          </div>
        </div>

        {/* Detailed Steps - All shown at once */}
        <div className="bg-white/70 rounded-3xl p-6 border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800 mb-4">Detailed Steps</h3>
          <ol className="list-decimal list-inside space-y-3 text-gray-700 leading-relaxed">
            {activityDetails.instructions.map((step, idx) => (
              <li key={idx} className="pl-2">{step}</li>
            ))}
          </ol>
        </div>

        {/* Troubleshooting Tips */}
        <div className="bg-white/70 rounded-3xl p-6 border border-orange-200">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-purple-800">Troubleshooting Tips</h3>
          </div>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {getTroubleshootingTips().map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>

        {/* Materials */}
        {activityDetails.materials && activityDetails.materials.length > 0 && (
          <div className="bg-white/70 rounded-3xl p-6 border border-emerald-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-3">Materials Needed</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {activityDetails.materials.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Badge className={`${getPillarColor(activityDetails.pillar)} rounded-2xl px-4 py-2 font-semibold`}>
          {activityDetails.pillar.charAt(0).toUpperCase() + activityDetails.pillar.slice(1)}
        </Badge>
        <div className="flex items-center space-x-1 text-sm text-purple-700 bg-purple-100 rounded-2xl px-3 py-2">
          <Clock className="w-4 h-4" />
          <span>{activityDetails.duration} minutes</span>
        </div>
        <div className="flex items-center space-x-1 bg-cyan-100 rounded-2xl px-3 py-2">
          <span className="text-sm text-cyan-700 mr-1">Difficulty:</span>
          {getDifficultyStars(activityDetails.difficulty)}
        </div>
      </div>


      <div className="bg-white/70 rounded-3xl p-6 border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-800 mb-3">Benefits</h3>
        <p className="text-gray-700 leading-relaxed">{activityDetails.benefits}</p>
      </div>

      <div className="bg-white/70 rounded-3xl p-6 border border-cyan-200">
        <h3 className="text-lg font-semibold text-purple-800 mb-3">Quick Steps</h3>
        <div className="text-gray-700 leading-relaxed">
          {Array.isArray(activityDetails.instructions) ? (
            <ol className="list-decimal list-inside space-y-2">
              {getBasicSteps().map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          ) : typeof activityDetails.instructions === 'string' ? (
            <p>{activityDetails.instructions}</p>
          ) : null}
        </div>
      </div>

      {activityDetails.materials && activityDetails.materials.length > 0 && (
        <div className="bg-white/70 rounded-3xl p-6 border border-emerald-200">
          <h3 className="text-lg font-semibold text-purple-800 mb-3">Materials Needed</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {activityDetails.materials.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {mode === 'scheduled' && scheduledActivity?.notes && (
        <div className="bg-white/70 rounded-3xl p-6 border border-cyan-200">
          <h3 className="text-lg font-semibold text-purple-800 mb-3">Notes</h3>
          <p className="text-gray-700 bg-cyan-50 p-4 rounded-2xl border border-cyan-200">
            {scheduledActivity.notes}
          </p>
        </div>
      )}

      {mode === 'scheduled' && scheduledActivity?.completionNotes && scheduledActivity.completed && (
        <div className="bg-white/70 rounded-3xl p-6 border border-emerald-200">
          <h3 className="text-lg font-semibold text-purple-800 mb-3">Completion Notes</h3>
          <p className="text-gray-700 bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
            {scheduledActivity.completionNotes}
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityModalContent;
