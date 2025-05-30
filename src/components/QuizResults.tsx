import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Users, TreePine, Target, Trophy, RefreshCw } from 'lucide-react';
import { QuizResults } from '@/types/quiz';

interface QuizResultsProps {
  results: QuizResults;
  onRetakeQuiz: () => void;
  onClose: () => void;
}

const QuizResultsComponent: React.FC<QuizResultsProps> = ({ results, onRetakeQuiz, onClose }) => {
  const pillarIcons = {
    mental: Brain,
    physical: Zap,
    social: Users,
    environmental: TreePine,
    instinctual: Target
  };

  const pillarColors = {
    mental: 'purple',
    physical: 'green',
    social: 'blue',
    environmental: 'teal',
    instinctual: 'orange'
  };

  const pillarNames = {
    mental: 'Mental',
    physical: 'Physical',
    social: 'Social',
    environmental: 'Environmental',
    instinctual: 'Instinctual'
  };

  const getScorePercentage = (score: number) => {
    const maxScore = 12; // Adjust based on the number of questions per pillar * max weight
    return (score / maxScore) * 100;
  };

  return (
    <Card className="max-w-md mx-auto border border-gray-200 shadow-xl rounded-3xl">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-800">Quiz Results</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>

        <div className="mt-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Your Dog's Personality</h3>
          <Badge variant="secondary" className="text-lg px-4 py-2 bg-gradient-to-r from-blue-100 to-orange-100 text-gray-800">
            {results.personality}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Enrichment Pillar Rankings</h4>
          <div className="space-y-3">
            {results.ranking.map((item) => {
              const IconComponent = pillarIcons[item.pillar as keyof typeof pillarIcons];
              const color = pillarColors[item.pillar as keyof typeof pillarColors];
              const name = pillarNames[item.pillar as keyof typeof pillarNames];
              const percentage = getScorePercentage(item.score);

              return (
                <div key={item.pillar} className="flex items-start space-x-4 p-3 rounded-lg bg-white shadow-sm border border-gray-100">
                  <div className={`w-10 h-10 bg-${color}-100 rounded-full flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 text-${color}-600`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold text-gray-800">{name}</span>
                      <span className="text-sm text-gray-600">{item.rank} / 5</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1 italic">{item.reason}</div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className={`bg-${color}-500 h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button 
            variant="outline" 
            onClick={onRetakeQuiz}
            className="flex-1 flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retake Quiz</span>
          </Button>
          <Button 
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white"
          >
            Save Results
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizResultsComponent;
