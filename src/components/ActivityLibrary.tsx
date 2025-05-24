
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Zap, Users, TreePine, Target, Clock, Star, Search, Plus, Loader2, Sparkles } from 'lucide-react';
import { searchCombinedActivities } from '@/data/activityLibrary';
import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { useActivity } from '@/contexts/ActivityContext';
import ActivityCard from '@/components/ActivityCard';
import DiscoveryReview from '@/components/DiscoveryReview';

const ActivityLibrary = () => {
  const { getCombinedActivityLibrary, discoveredActivities, discoverNewActivities, isDiscovering } = useActivity();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedActivity, setSelectedActivity] = useState<ActivityLibraryItem | DiscoveredActivity | null>(null);

  const pillars = [
    { id: 'all', name: 'All Pillars', icon: Search, color: 'gray' },
    { id: 'mental', name: 'Mental', icon: Brain, color: 'purple' },
    { id: 'physical', name: 'Physical', icon: Zap, color: 'green' },
    { id: 'social', name: 'Social', icon: Users, color: 'blue' },
    { id: 'environmental', name: 'Environmental', icon: TreePine, color: 'teal' },
    { id: 'instinctual', name: 'Instinctual', icon: Target, color: 'orange' }
  ];

  const difficulties = [
    { value: 'all', label: 'All Difficulties' },
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' }
  ];

  const combinedActivities = getCombinedActivityLibrary();

  const filteredActivities = React.useMemo(() => {
    let activities = searchQuery ? searchCombinedActivities(searchQuery, discoveredActivities) : combinedActivities;
    
    if (selectedPillar !== 'all') {
      activities = activities.filter(activity => activity.pillar === selectedPillar);
    }
    
    if (selectedDifficulty !== 'all') {
      activities = activities.filter(activity => activity.difficulty === selectedDifficulty);
    }
    
    return activities;
  }, [searchQuery, selectedPillar, selectedDifficulty, combinedActivities, discoveredActivities]);

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

  const handleDiscoverMore = async () => {
    await discoverNewActivities();
  };

  return (
    <div className="space-y-6">
      {/* Discovery Review Section */}
      <DiscoveryReview activities={discoveredActivities} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-800">Activity Library</CardTitle>
              <p className="text-gray-600">Discover enriching activities for your dog across all five pillars of wellness</p>
            </div>
            <Button 
              onClick={handleDiscoverMore}
              disabled={isDiscovering}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {isDiscovering ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Discovering...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Discover More
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedPillar} onValueChange={setSelectedPillar}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select pillar" />
              </SelectTrigger>
              <SelectContent>
                {pillars.map((pillar) => (
                  <SelectItem key={pillar.id} value={pillar.id}>
                    <div className="flex items-center space-x-2">
                      <pillar.icon className={`w-4 h-4 text-${pillar.color}-500`} />
                      <span>{pillar.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {filteredActivities.length} activit{filteredActivities.length === 1 ? 'y' : 'ies'} found
            </span>
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Curated ({combinedActivities.filter(a => !isDiscoveredActivity(a)).length})</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Discovered ({combinedActivities.filter(a => isDiscoveredActivity(a)).length})</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => {
          const pillarColor = getPillarColor(activity.pillar);
          const PillarIcon = pillars.find(p => p.id === activity.pillar)?.icon || Brain;
          const isDiscovered = isDiscoveredActivity(activity);
          
          return (
            <Card key={activity.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedActivity(activity)}>
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
                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Discovered
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
                      <span className="text-xs text-purple-600">
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

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <ActivityCard 
          activity={selectedActivity}
          isOpen={!!selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </div>
  );
};

export default ActivityLibrary;
