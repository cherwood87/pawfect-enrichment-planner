import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDog } from '@/contexts/DogContext';
import DogPersonalityQuiz from '@/components/DogPersonalityQuiz';
import QuizResultsComponent from '@/components/QuizResults';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { QuizResults } from '@/types/quiz';

const DogProfileQuizPage: React.FC = () => {
  const { currentDog, updateDog } = useDog();
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const [showQuiz, setShowQuiz] = useState(true);

  if (!currentDog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50 flex items-center justify-center p-6">
        <div className="max-w-md mx-auto">
          <Card className="modern-card overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-100 via-cyan-100 to-amber-100 border-b-2 border-purple-200">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-cyan-500 rounded-full flex items-center justify-center mb-4 shadow-lg border-4 border-white">
                <PlusCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-purple-800 text-center">
                No Dog Profile Found
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center bg-gradient-to-br from-white/90 to-purple-50/90">
              <p className="text-gray-600 mb-6 text-lg">
                Please add a dog profile first before taking the personality quiz.
              </p>
              <div className="space-y-4">
                <Button onClick={() => window.location.href = '/app'}>
                  Add Dog Profile
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </div>
              <div className="mt-6 pt-6 border-t border-purple-200">
                <p className="text-sm text-purple-600">
                  💡 The personality quiz helps us understand your dog's preferences for better enrichment recommendations
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleQuizComplete = (results: QuizResults) => {
    updateDog({
      ...currentDog,
      quizResults: results,
    });
    setQuizResults(results);
    setQuizCompleted(true);
    setShowQuiz(false);
  };

  const handleQuizClose = () => {
    setShowQuiz(false);
  };

  const handleResultsClose = () => {
    setQuizCompleted(false);
    setQuizResults(null);
    // ✅ Redirect to Account Settings - Dogs tab
    window.location.href = '/settings?tab=dogs';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50 flex items-center justify-center p-6">
      {showQuiz && (
        <DogPersonalityQuiz
          dogName={currentDog.name}
          dog={currentDog}
          onComplete={handleQuizComplete}
          onClose={handleQuizClose}
        />
      )}

      {quizCompleted && quizResults && (
        <QuizResultsComponent
          results={quizResults}
          onRetakeQuiz={() => {
            setShowQuiz(true);
            setQuizCompleted(false);
          }}
          onClose={handleResultsClose}
        />
      )}
    </div>
  );
};

export default DogProfileQuizPage;
