
import React, { useState, useCallback } from 'react';
import { QuizResults } from '@/types/quiz';
import { useDog } from '@/contexts/DogContext';
import { useNavigate } from 'react-router-dom';
import DogAvatarBlock from './DogAvatarBlock';
import QuizAndGoalsCard from './profile/QuizAndGoalsCard';
import DogProfileDialogs from './profile/DogProfileDialogs';
import { Dog } from '@/types/dog';

interface DogProfileProps {
  onEditDogOpen: (dog: Dog) => void;
}

const DogProfile: React.FC<DogProfileProps> = ({ onEditDogOpen }) => {
  const { currentDog, updateDog } = useDog();
  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleQuizComplete = useCallback((results: QuizResults) => {
    if (currentDog) {
      updateDog({
        ...currentDog,
        quizResults: results
      });
    }
    setShowQuiz(false);
    setShowResults(true);
  }, [currentDog, updateDog]);

  const handleRetakeQuiz = useCallback(() => {
    setShowResults(false);
    setShowQuiz(true);
  }, []);

  const handleCloseResults = useCallback(() => {
    setShowResults(false);
  }, []);

  const handleEditClick = useCallback(() => {
    if (currentDog) {
      onEditDogOpen(currentDog);
    }
  }, [currentDog, onEditDogOpen]);

  const handleAddActivities = useCallback(() => {
    navigate('/activity-library');
  }, [navigate]);

  const handleViewResults = useCallback(() => {
    setShowResults(true);
  }, []);

  const handleCloseQuiz = useCallback(() => {
    setShowQuiz(false);
  }, []);

  if (!currentDog) {
    return null;
  }

  return (
    <>
      {/* Enhanced Dog Avatar Block */}
      <DogAvatarBlock 
        dog={currentDog}
        onEditClick={handleEditClick}
      />

      {/* Quiz and Goals Section */}
      <QuizAndGoalsCard
        currentDog={currentDog}
        onViewResults={handleViewResults}
        onAddActivities={handleAddActivities}
      />

      {/* Dialogs */}
      <DogProfileDialogs
        showQuiz={showQuiz}
        showResults={showResults}
        currentDog={currentDog}
        onQuizComplete={handleQuizComplete}
        onRetakeQuiz={handleRetakeQuiz}
        onCloseQuiz={handleCloseQuiz}
        onCloseResults={handleCloseResults}
        setShowQuiz={setShowQuiz}
        setShowResults={setShowResults}
      />
    </>
  );
};

export default DogProfile;
