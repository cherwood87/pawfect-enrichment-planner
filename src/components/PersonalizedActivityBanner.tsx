import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Award, AlertTriangle } from 'lucide-react';
import { Dog } from '@/types/dog';
import { BreedSafetyWarnings } from './BreedSafetyWarnings';
import { getBreedCharacteristics } from '@/data/breedCharacteristics';

interface PersonalizedActivityBannerProps {
  currentDog: Dog;
  isPersonalized: boolean;
}

export const PersonalizedActivityBanner: React.FC<PersonalizedActivityBannerProps> = ({ 
  currentDog, 
  isPersonalized 
}) => {
  if (!currentDog?.quizResults || !isPersonalized) {
    return null;
  }

  const { personality, ranking } = currentDog.quizResults;
  const topPillars = ranking.slice(0, 2);
  const breedCharacteristics = getBreedCharacteristics(currentDog.breed, currentDog.breedGroup);
  const isBreedSpecific = currentDog.breed && currentDog.breed !== 'Unknown';

  return (
    <div className="space-y-3">
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-medium text-primary">Personalized for {currentDog.name}</span>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Award className="h-3 w-3" />
              {personality}
            </Badge>
          </div>
          
          <div className="mt-3 space-y-2">
            <p className="text-sm text-muted-foreground">
              Activities are prioritized based on {currentDog.name}'s quiz results{isBreedSpecific ? ' and breed characteristics' : ''}. 
              Top preferences: <span className="font-medium">{topPillars.map(p => p.pillar).join(' & ')}</span>
            </p>
            
            {isBreedSpecific && (
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-xs text-muted-foreground">
                  Breed-specific recommendations for {currentDog.breed}
                  <Badge variant="outline" className="ml-2 text-xs">
                    {Math.round(breedCharacteristics.confidence * 100)}% confidence
                  </Badge>
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Breed-specific safety warnings */}
      <BreedSafetyWarnings dog={currentDog} />
    </div>
  );
};