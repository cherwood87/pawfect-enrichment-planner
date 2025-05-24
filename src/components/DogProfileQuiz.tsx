
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { QuizResults } from '@/types/quiz';
import { quizQuestions } from '@/data/quizQuestions';
import { analyzeQuizResults } from '@/utils/quizAnalysis';
import QuizAnalyzing from './QuizAnalyzing';

interface DogProfileQuizProps {
  dogName: string;
  onComplete: (results: QuizResults) => void;
  onClose: () => void;
}

const DogProfileQuiz: React.FC<DogProfileQuizProps> = ({ dogName, onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnswerChange = (value: string) => {
    setAnswers({ ...answers, [quizQuestions[currentQuestion].id]: value });
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleAnalyzeResults = async () => {
    setIsAnalyzing(true);
    
    const results = analyzeQuizResults(quizQuestions, answers);

    setTimeout(() => {
      setIsAnalyzing(false);
      onComplete(results);
    }, 2000);
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const currentQ = quizQuestions[currentQuestion];
  const currentAnswer = answers[currentQ.id];

  if (isAnalyzing) {
    return <QuizAnalyzing />;
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-800">{dogName}'s Personality Quiz</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h3 className="text-base font-medium text-gray-800 mb-4">{currentQ.question}</h3>
          
          <RadioGroup value={currentAnswer || ''} onValueChange={handleAnswerChange}>
            {currentQ.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          {currentQuestion === quizQuestions.length - 1 ? (
            <Button 
              onClick={handleAnalyzeResults}
              disabled={!currentAnswer}
              className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
            >
              Analyze Results
            </Button>
          ) : (
            <Button 
              onClick={nextQuestion}
              disabled={!currentAnswer}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DogProfileQuiz;
