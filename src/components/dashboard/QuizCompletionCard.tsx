import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Eye, Brain, Target } from 'lucide-react';
import { Dog } from '@/types/dog';

interface QuizCompletionCardProps {
  currentDog: Dog;
  onViewResults: () => void;
}

export const QuizCompletionCard: React.FC<QuizCompletionCardProps> = ({ 
  currentDog, 
  onViewResults 
}) => {
  if (!currentDog.quizResults) {
    return null;
  }

  const topPillars = currentDog.quizResults.ranking.slice(0, 2);
  const personality = currentDog.quizResults.personality;

  return (
    <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
      <CardHeader>
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-emerald-600" />
          <CardTitle className="text-lg text-emerald-800">
            {currentDog.name}'s Enrichment Profile
          </CardTitle>
          <Badge variant="outline" className="ml-auto border-emerald-300 text-emerald-700">
            Completed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Personality Type */}
          <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
            <Brain className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Personality</p>
              <p className="font-semibold text-blue-800">{personality}</p>
            </div>
          </div>

          {/* Top Focus Areas */}
          <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
            <Target className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Top Focus Areas</p>
              <div className="flex gap-1 flex-wrap">
                {topPillars.map((pillar, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {pillar.pillar}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          ✨ Activities are now personalized based on {currentDog.name}'s breed ({currentDog.breed}) 
          and quiz results for maximum engagement and safety.
        </p>

        <Button onClick={onViewResults} variant="outline" className="w-full">
          <Eye className="mr-2 h-4 w-4" />
          View Full Results
        </Button>
      </CardContent>
    </Card>
  );
};