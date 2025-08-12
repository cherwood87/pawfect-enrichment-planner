import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Award } from 'lucide-react';
import { Dog } from '@/types/dog';

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

  return (
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
        <p className="text-sm text-muted-foreground mt-2">
          Activities are prioritized based on {currentDog.name}'s quiz results. 
          Top preferences: <span className="font-medium">{topPillars.map(p => p.pillar).join(' & ')}</span>
        </p>
      </CardContent>
    </Card>
  );
};