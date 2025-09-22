import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDog } from '@/contexts/DogContext';
import DogProfileQuizPage from '@/pages/DogProfileQuiz';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';

// Wrapper to set current dog from URL param and then render existing quiz page
const DogQuizRoute: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, setCurrentDog } = useDog();

  const currentDog = state.dogs.find(d => d.id === state.currentDogId);

  useEffect(() => {
    if (!id) return;
    const exists = state.dogs.find(d => d.id === id);
    if (exists) {
      setCurrentDog(id);
    } else if (!state.isLoading) {
      navigate('/settings?tab=dogs', { replace: true });
    }
  }, [id, state.dogs, state.isLoading, setCurrentDog, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="container mx-auto py-6 px-4">
        <Breadcrumbs dogName={currentDog?.name} />
        <DogProfileQuizPage />
      </div>
    </div>
  );
};

export default DogQuizRoute;
