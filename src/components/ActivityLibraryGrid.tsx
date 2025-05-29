
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
    { id: 'mental', name: 'Mental', icon: Brain, color: 'purple', gradient: 'from-purple-100 to-purple-50' },
    { id: 'physical', name: 'Physical', icon: Zap, color: 'green', gradient: 'from-emerald-100 to-emerald-50' },
    { id: 'social', name: 'Social', icon: Users, color: 'blue', gradient: 'from-cyan-100 to-cyan-50' },
    { id: 'environmental', name: 'Environmental', icon: TreePine, color: 'teal', gradient: 'from-teal-100 to-teal-50' },
    { id: 'instinctual', name: 'Instinctual', icon: Target, color: 'orange', gradient: 'from-amber-100 to-amber-50' }
  ];

  const getDifficultyBadgeVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'destructive';
      default: return 'default';
    }
  };

  const getPillarData = (pillar: string) => {
    return pillars.find(p => p.id === pillar) || pillars[0];
  };

  const isDiscoveredActivity = (activity: ActivityLibraryItem | DiscoveredActivity): activity is DiscoveredActivity => {
    return 'source' in activity && activity.source === 'discovered';
  };

  return (
    <div className="grid-activities">
      {activities.map((activity) => {
        const pillarData = getPillarData(activity.pillar);
        const PillarIcon = pillarData.icon;
        const isDiscovered = isDiscoveredActivity(activity);
        
        return (
          <Card 
            key={activity.id} 
            className="card-elevated interactive-hover interactive-press cursor-pointer group animate-scale-in" 
            onClick={() => onActivitySelect(activity)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${pillarData.gradient} rounded-2xl flex items-center justify-center border-2 border-${pillarData.color}-200 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <PillarIcon className={`w-6 h-6 text-${pillarData.color}-600`} />
                  </div>
                  <Badge variant={getDifficultyBadgeVariant(activity.difficulty)} className="text-xs font-semibold">
                    {activity.difficulty}
                  </Badge>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {activity.ageGroup}
                </Badge>
              </div>

              {/* Discovery badges */}
              {isDiscovered && (
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant={activity.approved ? "success" : "default"} className="text-xs font-semibold">
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
                  {activity.qualityScore && (
                    <Badge variant="outline" className="text-xs">
                      {Math.round(activity.qualityScore * 100)}% quality
                    </Badge>
                  )}
                </div>
              )}

              <CardTitle className="text-lg font-bold text-purple-800 group-hover:text-purple-900 transition-colors leading-tight">
                {activity.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="spacing-compact">
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">{activity.duration} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="font-medium">{activity.energyLevel}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4">{activity.benefits}</p>
              
              <div className="spacing-compact">
                <div className="card-surface padding-compact rounded-xl border border-purple-200">
                  <p className="text-xs font-semibold text-purple-700 mb-1">Materials needed:</p>
                  <p className="text-xs text-purple-600">
                    {activity.materials.slice(0, 2).join(', ')}
                    {activity.materials.length > 2 ? '...' : ''}
                  </p>
                </div>
                
                <div className="card-surface padding-compact rounded-xl border border-cyan-200">
                  <p className="text-xs font-semibold text-cyan-700 mb-1">Emotional goals:</p>
                  <p className="text-xs text-cyan-600">
                    {activity.emotionalGoals.slice(0, 2).join(', ')}
                    {activity.emotionalGoals.length > 2 ? '...' : ''}
                  </p>
                </div>
              </div>
              
              <Button className="w-full mt-4 btn-primary group-hover:shadow-lg transition-all duration-300" size="sm">
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
