import React, { useState } from 'react';
import { Calendar, Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react';

const WeeklyActivityPlanner = () => {
  const [activities, setActivities] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(null);
  const [newActivity, setNewActivity] = useState('');

  // Generate 7 days starting from current date
  const generateWeekDays = (startDate) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push({
        date: date,
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        shortDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        dateKey: date.toDateString()
      });
    }
    return days;
  };

  const weekDays = generateWeekDays(currentDate);

  const addActivity = (dateKey) => {
    if (newActivity.trim()) {
      const newActivityObj = {
        id: Date.now(),
        name: newActivity.trim(),
        completed: false
      };
      
      setActivities(prev => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), newActivityObj]
      }));
      
      setNewActivity('');
      setShowAddForm(null);
    }
  };

  const toggleActivity = (dateKey, activityId) => {
    setActivities(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].map(activity => 
        activity.id === activityId ? { ...activity, completed: !activity.completed } : activity
      )
    }));
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === 'next') {
      newDate.setDate(currentDate.getDate() + 7);
    } else {
      newDate.setDate(currentDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  // Calculate total completion stats
  const getTotalStats = () => {
    let total = 0;
    let completed = 0;
    
    Object.values(activities).forEach(dayActivities => {
      total += dayActivities.length;
      completed += dayActivities.filter(a => a.completed).length;
    });
    
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const { total, completed, percentage } = getTotalStats();

  const getWeekRange = () => {
    const firstDay = weekDays[0];
    const lastDay = weekDays[6];
    return `${firstDay.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${lastDay.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Weekly Activity Planner
          </h1>
          <p className="text-gray-600 text-lg">
            Plan and track your dog's enrichment activities for the week
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-purple-600">Weekly Planner</h2>
                <p className="text-gray-500">{completed}/{total} activities completed</p>
              </div>
            </div>
            
            <div className="bg-purple-100 text-purple-600 px-4 py-2 rounded-lg font-semibold">
              {percentage}%
            </div>
          </div>

          {/* Week Days Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {weekDays.map((day, index) => {
              const dayActivities = activities[day.dateKey] || [];
              const dayCompleted = dayActivities.filter(a => a.completed).length;
              const isToday = day.date.toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={day.dateKey}
                  className={`bg-orange-50 rounded-lg p-4 border-2 ${
                    isToday ? 'border-purple-300 bg-purple-50' : 'border-orange-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-semibold ${isToday ? 'text-purple-700' : 'text-purple-600'}`}>
                      {day.dayName} {isToday && '(Today)'}
                    </h4>
                    <span className="text-xs text-gray-500">{day.shortDate}</span>
                  </div>
                  
                  <p className="text-xs text-gray-500 mb-3">
                    {dayCompleted} of {dayActivities.length} activities completed
                  </p>

                  {/* Activities List */}
                  <div className="space-y-2 mb-3">
                    {dayActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className={`flex items-center space-x-2 p-2 rounded text-sm transition-all ${
                          activity.completed
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-white border border-gray-200 hover:border-purple-200'
                        }`}
                      >
                        <button
                          onClick={() => toggleActivity(day.dateKey, activity.id)}
                          className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                            activity.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 hover:border-purple-400'
                          }`}
                        >
                          {activity.completed && <Check className="w-3 h-3 text-white" />}
                        </button>
                        <span className={`flex-1 ${activity.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                          {activity.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Add Activity Section */}
                  {dayActivities.length === 0 && showAddForm !== day.dateKey && (
                    <div className="text-center py-4">
                      <button
                        onClick={() => setShowAddForm(day.dateKey)}
                        className="inline-flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors text-sm"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Activity</span>
                      </button>
                    </div>
                  )}

                  {dayActivities.length > 0 && showAddForm !== day.dateKey && (
                    <button
                      onClick={() => setShowAddForm(day.dateKey)}
                      className="w-full text-center py-2 text-purple-600 hover:text-purple-700 transition-colors text-sm border border-dashed border-purple-300 rounded hover:border-purple-400"
                    >
                      <Plus className="w-3 h-3 inline mr-1" />
                      Add Activity
                    </button>
                  )}

                  {/* Add Activity Form */}
                  {showAddForm === day.dateKey && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newActivity}
                        onChange={(e) => setNewActivity(e.target.value)}
                        placeholder="Activity name..."
                        className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && addActivity(day.dateKey)}
                        autoFocus
                      />
                      <div className="flex space-x-1">
                        <button
                          onClick={() => addActivity(day.dateKey)}
                          className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setShowAddForm(null);
                            setNewActivity('');
                          }}
                          className="px-3 py-1 text-gray-600 hover:text-gray-700 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyActivityPlanner;