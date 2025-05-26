
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDog } from '@/contexts/DogContext';

const EmptyWeeklyPlanner: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { currentDog } = useDog();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="mobile-card bg-gradient-to-r from-green-50 to-blue-50">
        <CardTitle className="font-bold text-gray-800 flex items-center space-x-2">
          <Calendar className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-green-600`} />
          <span>Weekly Plan</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center mobile-card">
        <div className="text-gray-500 mb-4">
          <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-lg font-medium">No weekly activities planned</p>
          <p className="text-sm">Create a weekly routine for {currentDog?.name}!</p>
        </div>
        <Button 
          onClick={() => navigate('/activity-library')}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Plan Weekly Activities
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyWeeklyPlanner;
