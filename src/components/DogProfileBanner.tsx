import React from 'react';
import { Dog } from '@/types/dog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Heart, Camera } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { LazyImage } from '@/components/ui/LazyImage';

interface DogProfileBannerProps {
  dog: Dog;
  onEditClick: () => void;
}

const DogProfileBanner: React.FC<DogProfileBannerProps> = ({ dog, onEditClick }) => {
  const isMobile = useIsMobile();

  return (
    <div className="relative w-full bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl overflow-hidden shadow-lg border border-border/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
      
      {/* Content Container */}
      <div className={`relative p-6 ${isMobile ? 'text-center' : 'flex items-center gap-6'}`}>
        
        {/* Dog Image */}
        <div className="relative flex-shrink-0">
          <div className={`${isMobile ? 'w-32 h-32 mx-auto' : 'w-40 h-40'} relative`}>
            {dog.image ? (
              <LazyImage
                src={dog.image}
                alt={`${dog.name}'s photo`}
                className="w-full h-full rounded-full object-cover shadow-xl ring-4 ring-background"
                loading="eager"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center shadow-xl ring-4 ring-background">
                <div className="flex flex-col items-center text-muted-foreground">
                  <Camera className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} mb-2`} />
                  <span className="text-sm font-medium">Add Photo</span>
                </div>
              </div>
            )}
            
            {/* Status Indicator */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-background">
              <Heart className="w-4 h-4 text-white fill-current" />
            </div>
          </div>
          
          {/* Edit Button - Mobile positioned differently */}
          {isMobile && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onEditClick}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full shadow-md"
            >
              <Edit className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Dog Information */}
        <div className={`flex-1 ${isMobile ? 'mt-4' : ''}`}>
          <div className={`${isMobile ? 'text-center' : 'flex items-start justify-between'}`}>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{dog.name}</h1>
              <div className="text-lg text-muted-foreground mb-4">
                <span className="font-medium">{dog.breed}</span>
                <span className="mx-2">•</span>
                <span>{dog.age} year{dog.age !== 1 ? 's' : ''} old</span>
                {dog.gender !== 'Unknown' && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{dog.gender}</span>
                  </>
                )}
              </div>
            </div>
            
            {/* Edit Button - Desktop */}
            {!isMobile && (
              <Button
                variant="secondary"
                onClick={onEditClick}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            )}
          </div>

          {/* Badges */}
          <div className={`flex flex-wrap gap-2 ${isMobile ? 'justify-center' : ''}`}>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              {dog.activityLevel === 'low' ? 'Calm' : dog.activityLevel === 'high' ? 'Very Active' : 'Active'}
            </Badge>
            
            {dog.breedGroup && dog.breedGroup !== 'Unknown' && (
              <Badge variant="outline">
                {dog.breedGroup}
              </Badge>
            )}
            
            {dog.quizResults && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                {dog.quizResults.personality}
              </Badge>
            )}
            
            {dog.mobilityIssues && dog.mobilityIssues.length > 0 && !dog.mobilityIssues.includes('None') && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                Special Care
              </Badge>
            )}
            
            {dog.specialNeeds && dog.specialNeeds.trim() && (
              <Badge variant="outline">
                Special Needs
              </Badge>
            )}
          </div>

          {/* Notes Preview */}
          {dog.notes && dog.notes.trim() && (
            <div className={`mt-3 text-sm text-muted-foreground italic ${isMobile ? 'text-center' : ''}`}>
              "{dog.notes.slice(0, 100)}{dog.notes.length > 100 ? '...' : ''}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DogProfileBanner;