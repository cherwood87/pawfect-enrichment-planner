import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Star, Calendar, CheckCircle, Target, ExternalLink, Sparkles, Heart } from 'lucide-react';
import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { useActivity } from '@/contexts/ActivityContext';

interface ActivityCardProps {
  activity: ActivityLibraryItem | DiscoveredActivity;
  isOpen: boolean;
  onClose: () => void;
}

const daysOfWeek = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
];

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, isOpen, onClose }) => {
  const { addScheduledActivity } = useActivity();
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number>(1); // Default to Monday

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const isDiscoveredActivity = (activity: ActivityLibraryItem | DiscoveredActivity): activity is DiscoveredActivity => {
    return 'source' in activity && activity.source === 'discovered';
  };

  const getISOWeek = (date: Date): number => {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  };

  // Calculate the date for the selected day in the current week
  const getDateForDayOfWeek = (dayOfWeek: number) => {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = dayOfWeek - currentDay;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    return targetDate;
  };

  const handleScheduleActivity = () => {
    const targetDate = getDateForDayOfWeek(selectedDayOfWeek);
    const weekNumber = getISOWeek(targetDate);
    const scheduledDate = targetDate.toISOString().split('T')[0];

    addScheduledActivity({
      activityId: activity.id,
      scheduledDate,
      weekNumber,
      dayOfWeek: selectedDayOfWeek,
      completed: false,
      notes: '',
      completionNotes: '',
      reminderEnabled: false,
    });

    onClose();
  };

  // ---- Add to Favourites handler ----
  const handleAddToFavourites = () => {
    const favourites = JSON.parse(localStorage.getItem('favouriteActivities') || '[]');
    // Avoid duplicates by ID or title
    if (!favourites.find((a: any) => a.id === activity.id || a.title === activity.title)) {
      // Save a minimal object (customize as needed)
      favourites.push({
        id: activity.id,
        title: activity.title,
        pillar: activity.pillar,
        difficulty: activity.difficulty,
        duration: activity.duration,
        // Add any other fields you want to show in Favourites!
      });
      localStorage.setItem('favouriteActivities', JSON.stringify(favourites));
      alert(`Added "${activity.title}" to Favourites!`);
    } else {
      alert(`"${activity.title}" is already in your Favourites.`);
    }
  };

  const isDiscovered = isDiscoveredActivity(activity);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold text-gray-800 mb-2">
                {activity.title}
              </DialogTitle>
              <div className="flex items-center space-x-2 mb-3">
                <Badge variant="secondary" className={`text-xs ${getDifficultyColor(activity.difficulty)}`}>
                  {activity.difficulty}
                </Badge>
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                  {activity.pillar}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {activity.ageGroup}
                </Badge>
                {isDiscovered && (
                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Discovered
                  </Badge>
                )}
              </div>
              {isDiscovered && activity.sourceUrl && (
                <div className="mb-3">
                  <a 
                    href={activity.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View original source</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4 pb-3 text-center">
                <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <p className="text-sm font-medium">{activity.duration} min</p>
                <p className="text-xs text-gray-600">Duration</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3 text-center">
                <Star className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                <p className="text-sm font-medium">{activity.energyLevel}</p>
                <p className="text-xs text-gray-600">Energy</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3 text-center">
                <Target className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <p className="text-sm font-medium">{activity.difficulty}</p>
                <p className="text-xs text-gray-600">Difficulty</p>
                {isDiscovered && activity.qualityScore && (
                  <p className="text-xs text-purple-600 mt-1">
                    {Math.round(activity.qualityScore * 100)}% quality
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

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

          {/* Discovery Info */}
          {isDiscovered && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Auto-Discovered Activity
              </h3>
              <p className="text-sm text-purple-600">
                This activity was automatically discovered from trusted dog training sources and verified for quality.
                Discovered on {new Date(activity.discoveredAt).toLocaleDateString()}.
              </p>
            </div>
          )}

          {/* Day of Week Picker - placed just above the action buttons */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Choose a day:</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={selectedDayOfWeek}
              onChange={e => setSelectedDayOfWeek(Number(e.target.value))}
            >
              {daysOfWeek.map(day => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row md:space-x-3 space-y-2 md:space-y-0 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button
              onClick={handleScheduleActivity}
              className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Add to Weekly Plan
            </Button>
            <Button
              onClick={handleAddToFavourites}
              className="flex-1 bg-yellow-400 text-white hover:bg-yellow-500"
              type="button"
            >
              <Heart className="w-4 h-4 mr-2" />
              Add to Favourites
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityCard;