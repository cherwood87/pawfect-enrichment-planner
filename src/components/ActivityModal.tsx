
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, AlertCircle, Repeat } from 'lucide-react';
import { ActivityLibraryItem, ScheduledActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { useActivity } from '@/contexts/ActivityContext';
import { toast } from '@/hooks/use-toast';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: ActivityLibraryItem | DiscoveredActivity;
}

const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  activity
}) => {
  const { addScheduledActivity } = useActivity();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('12:00');
  const [notes, setNotes] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [isWeeklyPlanning, setIsWeeklyPlanning] = useState(false);
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<number[]>([]);
  const [isScheduling, setIsScheduling] = useState(false);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Get ISO week number
  function getISOWeek(date: Date): number {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  }

  const handleDayToggle = (dayIndex: number) => {
    setSelectedDaysOfWeek(prev => 
      prev.includes(dayIndex) 
        ? prev.filter(d => d !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  const handleSchedule = async () => {
    if (isWeeklyPlanning && selectedDaysOfWeek.length === 0) {
      toast({
        title: "Select Days",
        description: "Please select at least one day for weekly planning.",
        variant: "destructive"
      });
      return;
    }

    setIsScheduling(true);

    try {
      if (isWeeklyPlanning) {
        // Schedule for selected days of the week
        const currentWeek = getISOWeek(new Date());
        
        for (const dayOfWeek of selectedDaysOfWeek) {
          const scheduledActivity: Omit<ScheduledActivity, 'id' | 'dogId'> = {
            activityId: activity.id,
            scheduledTime: selectedTime,
            userSelectedTime: selectedTime,
            scheduledDate: selectedDate, // This will be used as a reference date
            completed: false,
            notes,
            reminderEnabled,
            weekNumber: currentWeek,
            dayOfWeek
          };

          await addScheduledActivity(scheduledActivity);
        }

        toast({
          title: "Weekly Activities Scheduled",
          description: `${activity.title} scheduled for ${selectedDaysOfWeek.length} day(s) this week.`
        });
      } else {
        // Schedule for a specific date (existing functionality)
        const scheduledActivity: Omit<ScheduledActivity, 'id' | 'dogId'> = {
          activityId: activity.id,
          scheduledTime: selectedTime,
          userSelectedTime: selectedTime,
          scheduledDate,
          completed: false,
          notes,
          reminderEnabled
        };

        await addScheduledActivity(scheduledActivity);

        toast({
          title: "Activity Scheduled",
          description: `${activity.title} scheduled for ${selectedDate} at ${selectedTime}.`
        });
      }

      onClose();
      // Reset form
      setSelectedDate(new Date().toISOString().split('T')[0]);
      setSelectedTime('12:00');
      setNotes('');
      setReminderEnabled(false);
      setIsWeeklyPlanning(false);
      setSelectedDaysOfWeek([]);
    } catch (error) {
      console.error('Error scheduling activity:', error);
      toast({
        title: "Error",
        description: "Failed to schedule activity. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScheduling(false);
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

  const pillarColor = getPillarColor(activity.pillar);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>{activity.title}</span>
            <Badge className={`bg-${pillarColor}-100 text-${pillarColor}-700`}>
              {activity.pillar}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Activity Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Duration:</span>
              <span className="ml-2">{activity.duration} minutes</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Difficulty:</span>
              <span className="ml-2">{activity.difficulty}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Energy Level:</span>
              <span className="ml-2">{activity.energyLevel}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Age Group:</span>
              <span className="ml-2">{activity.ageGroup}</span>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Benefits</h4>
            <p className="text-sm text-gray-600">{activity.benefits}</p>
          </div>

          {/* Materials */}
          {activity.materials && activity.materials.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Materials Needed</h4>
              <div className="flex flex-wrap gap-2">
                {activity.materials.map((material, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {material}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {activity.instructions && activity.instructions.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Instructions</h4>
              <ol className="text-sm text-gray-600 space-y-1">
                {activity.instructions.map((instruction, index) => (
                  <li key={index} className="flex">
                    <span className="font-medium text-gray-400 mr-2">{index + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Scheduling Options */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-800 mb-4">Schedule Activity</h4>
            
            {/* Weekly Planning Toggle */}
            <div className="flex items-center space-x-3 mb-4">
              <Switch
                id="weekly-planning"
                checked={isWeeklyPlanning}
                onCheckedChange={setIsWeeklyPlanning}
              />
              <Label htmlFor="weekly-planning" className="flex items-center space-x-2">
                <Repeat className="w-4 h-4" />
                <span>Weekly Planning</span>
              </Label>
            </div>

            {isWeeklyPlanning ? (
              /* Weekly Planning Mode */
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Select Days of Week
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {dayNames.map((dayName, dayIndex) => (
                      <Button
                        key={dayIndex}
                        type="button"
                        variant={selectedDaysOfWeek.includes(dayIndex) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleDayToggle(dayIndex)}
                        className="justify-start"
                      >
                        {dayName}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="weekly-time" className="text-sm font-medium text-gray-700">
                    Time
                  </Label>
                  <div className="mt-1 relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="weekly-time"
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Single Date Planning Mode */
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                    Date
                  </Label>
                  <div className="mt-1 relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="time" className="text-sm font-medium text-gray-700">
                    Time
                  </Label>
                  <div className="mt-1 relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="time"
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="mt-4">
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes or reminders for this activity..."
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Reminder Toggle */}
            <div className="flex items-center space-x-3 mt-4">
              <Switch
                id="reminder"
                checked={reminderEnabled}
                onCheckedChange={setReminderEnabled}
              />
              <Label htmlFor="reminder" className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>Enable Reminders</span>
              </Label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleSchedule}
              disabled={isScheduling}
              className="flex-1"
            >
              {isScheduling ? 'Scheduling...' : `Schedule ${isWeeklyPlanning ? 'Weekly' : 'Activity'}`}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityModal;
