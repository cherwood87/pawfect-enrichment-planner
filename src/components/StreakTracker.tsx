
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Trophy, Calendar } from 'lucide-react';

const StreakTracker = () => {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const streakData = [
    { day: 'Mon', completed: true, activities: 5 },
    { day: 'Tue', completed: true, activities: 4 },
    { day: 'Wed', completed: true, activities: 6 },
    { day: 'Thu', completed: true, activities: 3 },
    { day: 'Fri', completed: true, activities: 5 },
    { day: 'Sat', completed: true, activities: 4 },
    { day: 'Sun', completed: false, activities: 2 }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-800">Weekly Progress</CardTitle>
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-orange-600">12 days</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Week Calendar */}
        <div className="grid grid-cols-7 gap-2">
          {streakData.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-600 mb-1">{day.day}</div>
              <div 
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                  day.completed 
                    ? 'bg-gradient-to-br from-green-400 to-green-500 border-green-500 text-white' 
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}
              >
                {day.activities}
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
          <div className="text-center">
            <div className="flex justify-center mb-1">
              <Calendar className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-lg font-bold text-gray-800">6/7</div>
            <div className="text-xs text-gray-600">Days This Week</div>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-1">
              <Trophy className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-lg font-bold text-gray-800">85%</div>
            <div className="text-xs text-gray-600">Success Rate</div>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-1">
              <Flame className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-lg font-bold text-gray-800">12</div>
            <div className="text-xs text-gray-600">Best Streak</div>
          </div>
        </div>

        {/* Achievement Badge */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-3 text-center">
          <Trophy className="w-6 h-6 text-orange-500 mx-auto mb-1" />
          <p className="text-sm font-medium text-orange-800">Weekly Champion!</p>
          <p className="text-xs text-orange-600">You're crushing your enrichment goals</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakTracker;
