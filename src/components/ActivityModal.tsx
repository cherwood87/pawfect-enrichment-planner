import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Calendar, Brain, Zap, Users, TreePine, Target, Search, BookOpen } from 'lucide-react';
import { activityLibrary, getPillarActivities } from '@/data/activityLibrary';
import { useActivity } from '@/contexts/ActivityContext';
import ActivityCard from '@/components/ActivityCard';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPillar?: string | null;
}

const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, selectedPillar }) => {
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const { addScheduledActivity, addUserActivity } = useActivity();
  
  // Custom activity form state
  const [activityName, setActivityName] = useState('');
  const [pillar, setPillar] = useState(selectedPillar || '');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [materials, setMaterials] = useState('');
  const [instructions, setInstructions] = useState('');

  const pillars = [
    { id: 'mental', name: 'Mental', icon: Brain, color: 'purple' },
    { id: 'physical', name: 'Physical', icon: Zap, color: 'green' },
    { id: 'social', name: 'Social', icon: Users, color: 'blue' },
    { id: 'environmental', name: 'Environmental', icon: TreePine, color: 'teal' },
    { id: 'instinctual', name: 'Instinctual', icon: Target, color: 'orange' }
  ];

  const handleCustomSubmit = () => {
    if (!activityName || !pillar || !duration) return;

    // Create custom activity
    const customActivity = {
      title: activityName,
      pillar: pillar as any,
      difficulty: 'Medium' as const,
      duration: parseInt(duration) || 15,
      materials: materials.split(',').map(m => m.trim()).filter(Boolean),
      emotionalGoals: ['Custom activity'],
      instructions: instructions.split('\n').filter(Boolean),
      benefits: description || 'Custom enrichment activity',
      tags: ['custom'],
      ageGroup: 'All Ages' as const,
      energyLevel: 'Medium' as const,
      isCustom: true
    };

    addUserActivity(customActivity);

    // Reset form
    setActivityName('');
    setPillar('');
    setDuration('');
    setDescription('');
    setScheduledTime('');
    setMaterials('');
    setInstructions('');
    onClose();
  };

  const handleLibraryActivitySelect = (activity: any) => {
    const now = new Date();
    const scheduledTime = scheduledTime || `${now.getHours() + 1}:00 ${now.getHours() + 1 >= 12 ? 'PM' : 'AM'}`;
    const scheduledDate = now.toISOString().split('T')[0];

    addScheduledActivity({
      activityId: activity.id,
      scheduledTime,
      scheduledDate,
      completed: false
    });

    onClose();
  };

  const filteredLibraryActivities = selectedPillar 
    ? getPillarActivities(selectedPillar)
    : activityLibrary;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-800">Add Activity</DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browse" className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Browse Library</span>
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>Create Custom</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-600">Choose from our curated collection of enrichment activities</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredLibraryActivities.map((activity) => {
                  const pillarInfo = pillars.find(p => p.id === activity.pillar);
                  const IconComponent = pillarInfo?.icon || Brain;
                  
                  return (
                    <div
                      key={activity.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedActivity(activity)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 bg-${pillarInfo?.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className={`w-4 h-4 text-${pillarInfo?.color}-600`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-800 truncate">{activity.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{activity.benefits}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {activity.duration} min
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {activity.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="create" className="space-y-4">
              {/* Pillar Selection */}
              <div>
                <Label htmlFor="pillar" className="text-sm font-medium text-gray-700">
                  Enrichment Pillar
                </Label>
                <Select value={pillar} onValueChange={setPillar}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select pillar" />
                  </SelectTrigger>
                  <SelectContent>
                    {pillars.map((p) => {
                      const IconComponent = p.icon;
                      return (
                        <SelectItem key={p.id} value={p.id}>
                          <div className="flex items-center space-x-2">
                            <IconComponent className={`w-4 h-4 text-${p.color}-500`} />
                            <span>{p.name}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Activity Name */}
              <div>
                <Label htmlFor="activity-name" className="text-sm font-medium text-gray-700">
                  Activity Name
                </Label>
                <Input
                  id="activity-name"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  placeholder="Enter activity name"
                  className="mt-1"
                />
              </div>

              {/* Duration */}
              <div>
                <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
                  Duration (minutes)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="15"
                  className="mt-1"
                />
              </div>

              {/* Materials Needed */}
              <div>
                <Label htmlFor="materials" className="text-sm font-medium text-gray-700">
                  Materials Needed (comma-separated)
                </Label>
                <Input
                  id="materials"
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  placeholder="Treats, toys, leash..."
                  className="mt-1"
                />
              </div>

              {/* Instructions */}
              <div>
                <Label htmlFor="instructions" className="text-sm font-medium text-gray-700">
                  Instructions (one per line)
                </Label>
                <Textarea
                  id="instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Step 1: Prepare materials..."
                  className="mt-1 min-h-[80px]"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Benefits/Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the benefits of this activity..."
                  className="mt-1 min-h-[60px]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleCustomSubmit} 
                  className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
                  disabled={!activityName || !pillar || !duration}
                >
                  Create Activity
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <ActivityCard 
          activity={selectedActivity}
          isOpen={!!selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </>
  );
};

export default ActivityModal;
