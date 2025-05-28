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
    <Card className="overflow-hidden rounded-2xl shadow-md">
      <CardHeader className="bg-gradient-to-r from-green-100 to-blue-100 py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-green-600" />
            <CardTitle className="text-lg font-bold text-gray-800">
              Weekly Enrichment Plan
            </CardTitle>
          </div>

          <button
            onClick={() => navigate('/activity-library')}
            aria-label="Add activity"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all border-2 border-white shadow-lg"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center text-center py-10 px-6">
        <Calendar className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No Activities Planned This Week
        </h3>
        <p className="text-gray-500 max-w-xs">
          Let's build your dog's perfect week with fun enrichment!
        </p>

        <div className="mt-6 w-full max-w-md space-y-3">
          <Button 
            onClick={() => navigate('/activity-library')} 
            className="w-full text-sm font-medium"
          >
            Browse Activity Library
          </Button>

          {onPillarSelect && (
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onPillarSelect('mental')}
              >
                Mental
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onPillarSelect('physical')}
              >
                Physical
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyWeeklyPlanner;