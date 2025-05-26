
import React, { useState } from 'react';
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

  if (!currentDog) {
    return null;
  }

  const handleQuizComplete = (results: QuizResults) => {
    updateDog({
      ...currentDog,
      quizResults: results
    });
    setShowQuiz(false);
    setShowResults(true);
  };

  const handleRetakeQuiz = () => {
    setShowResults(false);
    setShowQuiz(true);
  };

  const handleCloseResults = () => {
    setShowResults(false);
  };

  const handleEditClick = () => {
    onEditDogOpen(currentDog);
  };

  const handleAddActivities = () => {
    navigate('/activity-library');
  };

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
        onViewResults={() => setShowResults(true)}
        onAddActivities={handleAddActivities}
      />

      {/* Dialogs */}
      <DogProfileDialogs
        showQuiz={showQuiz}
        showResults={showResults}
        currentDog={currentDog}
        onQuizComplete={handleQuizComplete}
        onRetakeQuiz={handleRetakeQuiz}
        onCloseQuiz={() => setShowQuiz(false)}
        onCloseResults={handleCloseResults}
        setShowQuiz={setShowQuiz}
        setShowResults={setShowResults}
      />
    </>
  );
};

export default DogProfile;
