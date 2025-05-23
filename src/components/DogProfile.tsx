
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Edit } from 'lucide-react';

const DogProfile = () => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center">
              <span className="text-2xl">🐕</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Heart className="w-3 h-3 text-white fill-current" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Buddy</h2>
              <Edit className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">Golden Retriever • 3 years</p>
            <div className="flex space-x-2 mt-2">
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">Active</Badge>
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">Social</Badge>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Today's Goal:</span> Complete 3 enrichment activities
          </p>
          <div className="mt-2 flex items-center space-x-2">
            <div className="flex-1 bg-white rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-orange-500 h-2 rounded-full" style={{width: '60%'}}></div>
            </div>
            <span className="text-xs text-gray-600">2/3</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DogProfile;
