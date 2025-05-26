
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyWeeklyPlannerProps {
  onPillarSelect?: (pillar: string) => void;
}

const EmptyWeeklyPlanner: React.FC<EmptyWeeklyPlannerProps> = ({ onPillarSelect }) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <CardTitle className="font-bold text-gray-800">Weekly Plan</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/activity-library')}
            className="text-green-600 hover:text-green-700"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="text-center py-8">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Activities Planned This Week</h3>
          <p className="text-gray-500 mb-6">Start building your weekly enrichment plan!</p>
          
          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/activity-library')}
              className="w-full"
            >
              Browse Activity Library
            </Button>
            {onPillarSelect && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onPillarSelect('mental')}
                >
                  Mental Activities
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onPillarSelect('physical')}
                >
                  Physical Activities
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyWeeklyPlanner;
