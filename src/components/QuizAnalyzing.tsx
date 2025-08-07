
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const QuizAnalyzing: React.FC = () => {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl">🧠</span>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Analyzing Your Dog's Profile...</h3>
          <p className="text-sm text-gray-600">We're processing the quiz results to create personalized enrichment recommendations.</p>
        </div>
        <Progress value={100} className="mb-4" />
      </CardContent>
    </Card>
  );
};

export default QuizAnalyzing;
