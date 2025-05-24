
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Users, TreePine, Target, Trophy, RefreshCw } from 'lucide-react';

interface QuizResults {
  ranking: Array<{
    pillar: string;
    rank: number;
    reason: string;
    score: number;
  }>;
  personality: string;
  recommendations: string[];
}

interface QuizResultsProps {
  results: QuizResults;
  onRetakeQuiz: () => void;
  onClose: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ results, onRetakeQuiz, onClose }) => {
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

  return (
    <Card className="max-w-md mx-auto">
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
        {/* Pillar Rankings */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Enrichment Pillar Rankings</h4>
          <div className="space-y-2">
            {results.ranking.map((item, index) => {
              const IconComponent = pillarIcons[item.pillar as keyof typeof pillarIcons];
              const color = pillarColors[item.pillar as keyof typeof pillarColors];
              const name = pillarNames[item.pillar as keyof typeof pillarNames];
              
              return (
                <div key={item.pillar} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold">
                      {item.rank}
                    </span>
                    <div className={`w-8 h-8 bg-${color}-100 rounded-full flex items-center justify-center`}>
                      <IconComponent className={`w-4 h-4 text-${color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{name}</div>
                      <div className="text-xs text-gray-600">{item.reason}</div>
                    </div>
                  </div>
                  <div className={`w-12 bg-${color}-200 rounded-full h-2`}>
                    <div 
                      className={`bg-${color}-500 h-2 rounded-full`}
                      style={{width: `${(item.score / 6) * 100}%`}}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Recommended Activities</h4>
          <div className="grid grid-cols-2 gap-2">
            {results.recommendations.map((rec, index) => (
              <Badge key={index} variant="outline" className="text-xs p-2 text-center">
                {rec}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
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
            className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
          >
            Save Results
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizResults;
