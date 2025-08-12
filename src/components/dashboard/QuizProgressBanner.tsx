import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Brain } from 'lucide-react';
import { Dog } from '@/types/dog';

interface QuizProgressBannerProps {
  dogs: Dog[];
}

export const QuizProgressBanner: React.FC<QuizProgressBannerProps> = ({ dogs }) => {
  const totalDogs = dogs.length;
  const dogsWithQuiz = dogs.filter(dog => dog.quizResults).length;
  const progress = totalDogs > 0 ? (dogsWithQuiz / totalDogs) * 100 : 0;
  
  if (totalDogs === 0 || progress === 100) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-medium text-amber-800">Quiz Completion Progress</p>
              <p className="text-sm text-amber-600">
                {dogsWithQuiz} of {totalDogs} dog{totalDogs !== 1 ? 's' : ''} have completed the enrichment quiz
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-amber-100 text-amber-700">
            {Math.round(progress)}%
          </Badge>
        </div>
        
        <div className="mt-3">
          <Progress value={progress} className="h-2" />
        </div>
        
        {progress < 100 && (
          <p className="text-xs text-amber-600 mt-2">
            Complete all quiz assessments to unlock fully personalized enrichment recommendations
          </p>
        )}
      </CardContent>
    </Card>
  );
};