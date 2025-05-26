
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Heart } from 'lucide-react';

interface EmptyDashboardProps {
  onAddDogOpen?: () => void;
  onPillarSelect?: (pillar: string, mode?: 'daily' | 'weekly') => void;
}

const EmptyDashboard: React.FC<EmptyDashboardProps> = ({ onAddDogOpen, onPillarSelect }) => {
  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <Heart className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome to Your Dog's Enrichment Journey!
            </h2>
            <p className="text-gray-600">
              Let's start by adding your furry friend's profile to create a personalized enrichment plan.
            </p>
          </div>
          
          <Button 
            onClick={onAddDogOpen}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Your Dog
          </Button>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>Once you add your dog, you'll be able to:</p>
            <ul className="mt-2 space-y-1">
              <li>• Create personalized daily and weekly plans</li>
              <li>• Track enrichment activities across 5 key pillars</li>
              <li>• Monitor your dog's progress and streaks</li>
              <li>• Access our curated activity library</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyDashboard;
