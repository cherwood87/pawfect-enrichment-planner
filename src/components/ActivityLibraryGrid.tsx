
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Star, CheckCircle, Sparkles, Brain, Zap, Users, TreePine, Target } from 'lucide-react';
import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';

interface ActivityLibraryGridProps {
  activities: (ActivityLibraryItem | DiscoveredActivity)[];
  onActivitySelect: (activity: ActivityLibraryItem | DiscoveredActivity) => void;
}

const ActivityLibraryGrid: React.FC<ActivityLibraryGridProps> = ({
  activities,
  onActivitySelect
}) => {
  const pillars = [
    { id: 'mental', name: 'Mental', icon: Brain, color: 'purple' },
    { id: 'physical', name: 'Physical', icon: Zap, color: 'green' },
    { id: 'social', name: 'Social', icon: Users, color: 'blue' },
    { id: 'environmental', name: 'Environmental', icon: TreePine, color: 'teal' },
    { id: 'instinctual', name: 'Instinctual', icon: Target, color: 'orange' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPillarColor = (pillar: string) => {
    const colors = {
      mental: 'purple',
      physical: 'green',
      social: 'blue',
      environmental: 'teal',
      instinctual: 'orange'
    };
    return colors[pillar as keyof typeof colors] || 'gray';
  };

  const isDiscoveredActivity = (activity: ActivityLibraryItem | DiscoveredActivity): activity is DiscoveredActivity => {
    return 'source' in activity && activity.source === 'discovered';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activities.map((activity) => {
        const pillarColor = getPillarColor(activity.pillar);
        const PillarIcon = pillars.find(p => p.id === activity.pillar)?.icon || Brain;
        const isDiscovered = isDiscoveredActivity(activity);
        
        return (
          <Card key={activity.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onActivitySelect(activity)}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 bg-${pillarColor}-100 rounded-full flex items-center justify-center`}>
                    <PillarIcon className={`w-4 h-4 text-${pillarColor}-600`} />
                  </div>
                  <Badge variant="secondary" className={`text-xs ${getDifficultyColor(activity.difficulty)}`}>
                    {activity.difficulty}
                  </Badge>
                  {isDiscovered && (
                    <Badge variant="secondary" className={`text-xs ${activity.approved ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                      {activity.approved ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Auto-Added
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 mr-1" />
                          Discovered
                        </>
                      )}
                    </Badge>
                  )}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {activity.ageGroup}
                </Badge>
              </div>
              <CardTitle className="text-lg font-semibold text-gray-800">{activity.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{activity.duration} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>{activity.energyLevel}</span>
                </div>
                {isDiscovered && activity.qualityScore && (
                  <div className="flex items-center space-x-1">
                    <span className={`text-xs ${activity.approved ? 'text-green-600' : 'text-purple-600'}`}>
                      {Math.round(activity.qualityScore * 100)}% quality
                    </span>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-2">{activity.benefits}</p>
              
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Materials needed:</p>
                  <p className="text-xs text-gray-600">{activity.materials.slice(0, 2).join(', ')}{activity.materials.length > 2 ? '...' : ''}</p>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Emotional goals:</p>
                  <p className="text-xs text-gray-600">{activity.emotionalGoals.slice(0, 2).join(', ')}{activity.emotionalGoals.length > 2 ? '...' : ''}</p>
                </div>
              </div>
              
              <Button className="w-full mt-3" size="sm">
                View Details
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ActivityLibraryGrid;
