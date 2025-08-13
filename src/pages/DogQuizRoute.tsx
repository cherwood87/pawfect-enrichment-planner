import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDog } from '@/contexts/DogContext';
import DogProfileQuizPage from '@/pages/DogProfileQuiz';

// Wrapper to set current dog from URL param and then render existing quiz page
const DogQuizRoute: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, setCurrentDog } = useDog();

  useEffect(() => {
    if (!id) return;
    const exists = state.dogs.find(d => d.id === id);
    if (exists) {
      setCurrentDog(id);
    } else if (!state.isLoading) {
      navigate('/settings?tab=dogs', { replace: true });
    }
  }, [id, state.dogs, state.isLoading, setCurrentDog, navigate]);

  return <DogProfileQuizPage />;
};

export default DogQuizRoute;
