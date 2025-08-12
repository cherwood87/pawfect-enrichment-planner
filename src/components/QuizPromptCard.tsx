import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, ArrowRight } from 'lucide-react';
import { Dog } from '@/types/dog';

interface QuizPromptCardProps {
  currentDog: Dog;
  onTakeQuiz: () => void;
}

export const QuizPromptCard: React.FC<QuizPromptCardProps> = ({ 
  currentDog, 
  onTakeQuiz 
}) => {
  if (currentDog.quizResults) {
    return null; // Don't show if quiz is already completed
  }

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-primary" />
          <CardTitle className="text-lg">Unlock Personalized Enrichment</CardTitle>
          <Badge variant="outline" className="ml-auto">2 mins</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Take our quick personality quiz for {currentDog.name} to get personalized activity recommendations 
          based on their unique enrichment preferences and behavioral traits.
        </p>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span>✨ Smart activity filtering</span>
          <span>🎯 Safety-first recommendations</span>
          <span>🧠 AI coach with personality context</span>
        </div>
        <Button onClick={onTakeQuiz} className="w-full" size="lg">
          Take Personality Quiz
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};