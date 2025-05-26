
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { QuizResults } from '@/types/quiz';
import DogProfileQuiz from '../DogProfileQuiz';
import QuizResultsComponent from '../QuizResults';

interface DogProfileDialogsProps {
  showQuiz: boolean;
  showResults: boolean;
  currentDog: { name: string; quizResults?: QuizResults };
  onQuizComplete: (results: QuizResults) => void;
  onRetakeQuiz: () => void;
  onCloseQuiz: () => void;
  onCloseResults: () => void;
  setShowQuiz: (show: boolean) => void;
  setShowResults: (show: boolean) => void;
}

const DogProfileDialogs: React.FC<DogProfileDialogsProps> = ({
  showQuiz,
  showResults,
  currentDog,
  onQuizComplete,
  onRetakeQuiz,
  onCloseQuiz,
  onCloseResults,
  setShowQuiz,
  setShowResults
}) => {
  return (
    <>
      {/* Quiz Dialog */}
      <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
        <DialogContent className="p-0 modal-standard">
          <DialogTitle className="sr-only">Dog Personality Quiz</DialogTitle>
          <DialogDescription className="sr-only">
            Take a quiz to discover your dog's personality and get personalized enrichment recommendations.
          </DialogDescription>
          <div className="modal-scroll-container">
            <DogProfileQuiz 
              dogName={currentDog.name}
              onComplete={onQuizComplete}
              onClose={onCloseQuiz}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="p-0 modal-standard">
          <DialogTitle className="sr-only">Quiz Results</DialogTitle>
          <DialogDescription className="sr-only">
            View your dog's personality quiz results and enrichment recommendations.
          </DialogDescription>
          <div className="modal-scroll-container">
            {currentDog.quizResults && (
              <QuizResultsComponent 
                results={currentDog.quizResults}
                onRetakeQuiz={onRetakeQuiz}
                onClose={onCloseResults}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DogProfileDialogs;
