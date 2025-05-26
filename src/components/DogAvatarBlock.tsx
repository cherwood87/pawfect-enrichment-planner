
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Edit, Camera } from 'lucide-react';
import { Dog } from '@/types/dog';

interface DogAvatarBlockProps {
  dog: Dog;
  onEditClick: () => void;
}

const DogAvatarBlock: React.FC<DogAvatarBlockProps> = ({ dog, onEditClick }) => {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-orange-50 border-blue-100">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Enhanced Dog Avatar */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
              {dog.image ? (
                <img 
                  src={dog.image} 
                  alt={dog.name} 
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-orange-600">
                  <Camera className="w-8 h-8 mb-1" />
                  <span className="text-xs font-medium">Add Photo</span>
                </div>
              )}
            </div>
            
            {/* Heart Status Indicator */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md ring-2 ring-white">
              <Heart className="w-4 h-4 text-white fill-current" />
            </div>
            
            {/* Edit Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onEditClick}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md hover:bg-gray-50"
            >
              <Edit className="w-3 h-3 text-gray-600" />
            </Button>
          </div>
          
          {/* Dog Info */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-1">{dog.name}</h2>
            <p className="text-sm text-gray-600 mb-3">{dog.breed} • {dog.age} years old</p>
            
            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                Active
              </Badge>
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                Social
              </Badge>
              {dog.quizResults && (
                <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                  {dog.quizResults.personality}
                </Badge>
              )}
              {dog.mobilityIssues.length > 0 && !dog.mobilityIssues.includes('None') && (
                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                  Special Needs
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DogAvatarBlock;
